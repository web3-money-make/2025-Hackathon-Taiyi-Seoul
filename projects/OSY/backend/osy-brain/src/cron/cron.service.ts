import axios from 'axios';
import { ethers } from 'ethers';
import { ContractService } from 'src/contract';
import * as vaultAbi from 'src/contract/abi/vault.abi.json';
import { defineCollection } from 'src/db';

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor() {
        process.on('uncaughtException', (err) => {
            this.logger.error('❗ [Uncaught Exception] ', err);
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error('❗ [Unhandled Rejection] ', reason);
        });
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async retry<T>(fn: () => Promise<T>, retries = 5, delayMs = 1000): Promise<T> {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (err) {
                if (i === retries - 1) throw err;
                await this.delay(delayMs);
            }
        }
    }


    @Cron('*/10 * * * *') // 매 10분마다 실행
    async handleCron() {
        try {
            const response = await axios.get('https://yields.llama.fi/pools');
            const pools = response.data.data;

            const filteredEtherPools = pools.filter((pool: any) =>
                pool.chain === 'Ethereum' &&
                ['aave-v3'].includes(pool.project) &&
                pool.symbol.includes('USDC') &&
                pool.tvlUsd > 100000000
            );

            const filteredBasePools = pools.filter((pool: any) =>
                pool.chain === 'Base' &&
                ['compound-v3'].includes(pool.project) &&
                pool.symbol.includes('USDC') &&
                pool.tvlUsd > 1000000
            );

            const db = await defineCollection();
            for(const pool of filteredEtherPools) {
                const poolData = await db.collection.pool.findOne({ project: pool.project, symbol: pool.symbol, chainId: 11155111 });
                if(!poolData) {
                    return;
                }

                await poolData.updateOne({apy: pool.apy});
                await db.collection.apyHistory.insertOne({ protocolId: poolData.protocolId, chainId: 11155111, apy: pool.apy, timestamp: Date.now() });
            }

            for(const pool of filteredBasePools) {
                const poolData = await db.collection.pool.findOne({ project: pool.project, symbol: pool.symbol, chainId: 133 });
                if(!poolData) {
                    return;
                }
                await poolData.updateOne({apy: pool.apy});

                await db.collection.apyHistory.insertOne({ protocolId: poolData.protocolId, chainId: 133, apy: pool.apy, timestamp: Date.now() });
            }

            this.logger.log('APY History Inserted');
        } catch (error) {
            this.logger.error('API 호출 중 오류 발생:');
        }
    }

    @Cron('0 */5 * * * *') // 매 5분마다 (정각 기준, 0초에 실행)
    async handleApplyInterest() {
        try {
            const db = await defineCollection();
            const contractService = new ContractService();
            const vaults = await db.collection.vault.find({});
            const chainSupply = {};
            for(const vault of vaults) {
                if(vault.isMain) {
                    continue;
                }

                const currentChainSupply = await this.retry(() => contractService.currentChainSupply(vault.chainId));
                if(currentChainSupply === 0) {
                    continue;
                }
                chainSupply[String(vault.chainId)] = currentChainSupply;
            }


            for(const key of Object.keys(chainSupply)) {
                this.logger.log(`Updating Total Supply: ${key} ${chainSupply[key]}`);
                await this.retry(() => contractService.updateTotalSupply(parseInt(key), chainSupply[parseInt(key)]));
            }
            this.logger.log('Total Supply Updated');
            await this.retry(() => contractService.applyInterest());
            this.logger.log('Interest Applied');
        } catch (error) {
            this.logger.error(`Interest Apply Failed: ${error}`);
        }
    }

    @Cron('0 20 * * * *') // 매 시간 20분 0초에 실행 (예: 1:20:00, 2:20:00...)
    async rebalance() {
        const db = await defineCollection();
        const contractService = new ContractService();
        const pools = await db.collection.pool.find({}, { _id: 0, __v: 0 }).sort({ apy: -1 }).limit(1);
        const bestPool = pools[0];

        const vaults = await db.collection.vault.find({});
        const vaultBalances = {};

        for(const vault of vaults) {
            if(vault.chainId === bestPool.chainId) {
                continue;
            }

            const currentChainSupply = await this.retry(() => contractService.currentChainSupply(vault.chainId));
            const maxAmount = 10 * 10 ** 6;
            const rebalanceAmount = Math.min(Number(currentChainSupply), maxAmount);
            vaultBalances[vault.chainId] = rebalanceAmount;
        }

        const keys = Object.keys(vaultBalances);
        for(const key of keys) {
            const vault = await db.collection.vault.findOne({ chainId: parseInt(key) });
            if(!vault) {
                continue;
            }

            const balance = vaultBalances[key];

            if(balance > 0) {
                let srcProtocolId = 1;
                if(vault.chainId === 11155111) {
                    srcProtocolId = 0;
                }

                let txHash = await this.retry(() => contractService.withdrawAndBridgeAndDeposit(vault.chainId, bestPool.chainId, balance, srcProtocolId));
                if(txHash === '') {
                    this.logger.error(`Rebalance Failed: ${vault.chainId} ${balance}`);
                }

                const vaultApy = await db.collection.apyHistory.findOne({ chainId: vault.chainId }, { _id: 0, __v: 0 }).sort({ timestamp: -1 }).limit(1);
                await db.collection.rebalanceHistory.insertOne({
                    txHash: txHash,
                    srcChainId: vault.chainId,
                    dstChainId: bestPool.chainId,
                    srcProtocolId: srcProtocolId,
                    dstProtocolId: bestPool.protocolId,
                    amount: balance,
                    improvementApy: bestPool.apy - vaultApy.apy,
                    timestamp: Date.now()
                });
            } else {
                this.logger.log(`Not Rebalance Condition: ${vault.chainId} ${balance}`);
            }
        }
    }

    @Cron('30 * * * * *') // 매 분의 20초마다 실행
    async relay() {
        const db = await defineCollection();
        const contractService = new ContractService();
        const vaults = await db.collection.vault.find({});

        for(const vault of vaults) {
            const network = await db.collection.network.findOne({ chainId: vault.chainId });
            if(!network) {
                continue;
            }

            const sync = await db.collection.sync.findOne({ chainId: vault.chainId });
            if(!sync) {
                continue;
            }
            const provider = new ethers.JsonRpcProvider(network.rpc);
            const contract = new ethers.Contract(vault.address, vaultAbi, provider);
            const lastBlock = await provider.getBlockNumber();

            try {
                const crossChainDepositEvents = await contract.queryFilter('CrosschainDeposit', sync.blockNumber + 1, lastBlock);
                for (const rawEvent of crossChainDepositEvents) {
                    const event = rawEvent as ethers.EventLog; // 타입 단언
                    const args = String(event.args[0]).split(',');
                    const result = await this.retry(() => contractService.crossChainDeposit(
                        parseInt(args[0]), // actionChainId
                        parseInt(args[1]), // protocolId
                        parseInt(args[2]), // amount
                        args[3]  // recipient
                    ));
                    if (!result) {
                        this.logger.error('Cross Chain Deposit Failed');
                    }
                }

                const crossChainWithdrawEvents = await contract.queryFilter('CrosschainWithdraw', sync.blockNumber, lastBlock);
                for (const rawEvent of crossChainWithdrawEvents) {
                    const event = rawEvent as ethers.EventLog; // 타입 단언
                    const args = String(event.args[0]).split(',');
                    const result = await this.retry(() => contractService.crossChainWithdraw(
                        parseInt(args[0]), // actionChainId
                        parseInt(args[1]), // protocolId
                        parseInt(args[2]), // amount
                        args[3]  // recipient
                    ));
                    if (!result) {
                        this.logger.error('Cross Chain Withdraw Failed');
                    }
                }
                await db.collection.sync.updateOne({ chainId: vault.chainId }, { $set: { blockNumber: lastBlock } });
            } catch (error) {
                this.logger.error(`Event Sync Failed ${error}`);
                await db.collection.sync.updateOne({ chainId: vault.chainId }, { $set: { blockNumber: lastBlock } });
            }
        }
    }
}
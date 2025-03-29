import {expect} from './chai-setup';
import {ethers} from 'hardhat';
import {
    EntryPoint,
    SimpleAccountFactory
} from '../typechain';
import * as fs from "fs";
import Web3 from "web3"
import { ContractFactory, ContractTransaction } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import {
    getMultichainMessageHash,
    getMultichainPackedUserOps
} from './utils/multichainSigner';
import axios from 'axios';

let SimpleAccountFactory:ContractFactory;

async function setup() {
  const EntryPoint: ContractFactory = await ethers.getContractFactory("EntryPoint");
  SimpleAccountFactory = await ethers.getContractFactory("SimpleAccountFactory");

  // contract list
  const contracts = {
    EntryPoint: <EntryPoint> await EntryPoint.attach("0xcfB2F03F531d381e2f2f45D8DBB6474c1843Bd38"),
    SimpleAccountFactory: <SimpleAccountFactory> await SimpleAccountFactory.attach("0x4Bcb18B7eF23d0A1dc0931476E497D29fd467007"),
  };

  return {
    contracts
  };
}


// Naming By index of handler Name (interestModel, handlerDS, proxy, siDS)
describe('[Entrypoint and simpleAccountFactory deploy and testing]', async function () {
  let entryPoint: EntryPoint;
  let simpleAccountFactory: SimpleAccountFactory;
  let SimpleAccount: ContractFactory;
  let users: any;

  beforeEach(async function () {
    let {contracts} = await setup();
    users = await ethers.getSigners();

    // Get the contract factory for SimpleAccount with the linked library
    SimpleAccount = await ethers.getContractFactory("SimpleAccount");

    entryPoint = contracts.EntryPoint;
    simpleAccountFactory = contracts.SimpleAccountFactory;
  });


  it("[Single Create Wallet HandleOps by entrypoint]", async function() {

    const userOp = {
      "sender": "0x76d949E566182e38142b579765b4bd845669809E",
      "nonce": "0",
      "initCode": "0x4Bcb18B7eF23d0A1dc0931476E497D29fd4670075fbfb9cf000000000000000000000000a555da8ecbc2e0de5db7924a5703989f14683cc1000000000000000000000000000000000000000000000000000000000000000d",
      "callData": "0x18dfb3c7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001d5c9205b5019c877540e615243cf1e8ba43eeed00000000000000000000000014d314ee090ad27aa98e95a582b513965f4b61050000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000014d314ee090ad27aa98e95a582b513965f4b610500000000000000000000000000000000000000000000000000000000009896800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c441d7edcf0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000098968000000000000000000000000076d949e566182e38142b579765b4bd845669809e00000000000000000000000000000000000000000000000000000000",
      "callGasLimit": "500000",
      "verificationGasLimit": "600000",
      "preVerificationGas": "21000",
      "maxFeePerGas": "0",
      "maxPriorityFeePerGas": "1000000000",
      "paymasterAndData": "0x",
      "signature": "0x1063b6b89d4e33b27b76bf7dcfb10b9189b0a586bf9bce2a86c44c5c824cbde73f33da47ba31fc48051fe7b5298908c50915c0593a854e22e39d54bc94598a601c"
  }
  
    let tx = await entryPoint.handleOps([userOp], users[0].address);
    await tx.wait();
    console.log(tx);

    
  });



});
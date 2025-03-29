'use client';

import Card from '@/components/Card';
import Table from '@/components/Table';
import History from '@/types/History';
import { address2shorted, formatCommas, formatUnit } from '@/utils/format';
import axios from 'axios';
import { API_HOST_API } from '@/configs/apiHost';
import { useCallback, useEffect, useState } from 'react';

export default function RebalanceHistory() {
  // state
  const [histories, setHistories] = useState<History[]>([]);

  // callback
  const sync = useCallback(async () => {
    const { data: rebalanceHistories } = await axios.get<
      {
        amount: number;
        dstChainId: number;
        dstProtocolId: number;
        improvementApy: number;
        srcChainId: number;
        srcProtocolId: number;
        timestamp: number;
        txHash: string;
      }[]
    >(`${API_HOST_API}/rebalance-history`);
    setHistories(
      rebalanceHistories.map(
        ({
          txHash,
          srcChainId,
          srcProtocolId,
          dstChainId,
          dstProtocolId,
          amount,
          timestamp,
        }) => ({
          txHash,
          from: { chain: srcChainId, dex: srcProtocolId },
          to: { chain: dstChainId, dex: dstProtocolId },
          amount: formatUnit(amount, 6).toFixed(6),
          time: timestamp,
        })
      )
    );
  }, []);
  // const handleCopyClick = useCallback(
  //   (value?: string) => () => {
  //     if (!value) {
  //       return;
  //     }

  //     clipboardCopy(value);
  //   },
  //   []
  // );

  // effect
  useEffect(() => {
    sync();

    const intervalId = setInterval(async () => {
      sync();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [sync]);

  return (
    <>
      <h2 className="text-xl pb-4">Rebalance History</h2>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>TX Hash</th>
              <th>From To</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {histories.map(({ txHash, from, to, amount, time }, index) => (
              <tr key={index}>
                <td>
                  <a
                    className="transition-opacity cursor-pointer hover:opacity-50"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`${from.chain === 133 ? 'https://hashkeychain-testnet-explorer.alt.technology/tx/' : 'https://sepolia.etherscan.io/tx/'}${txHash}`}
                  >
                    {address2shorted(txHash)}
                  </a>
                </td>
                <td className="font-medium">
                  {from.dex === 0 ? 'Aave' : 'Compound'}
                  <span className="text-xs font-light">
                    ({from.chain === 133 ? 'Hash Key' : 'Ethereum'})
                  </span>{' '}
                  → {to.dex === 0 ? 'Aave' : 'Compound'}
                  <span className="text-xs font-light">
                    ({to.chain === 133 ? 'Hash Key' : 'Ethereum'})
                  </span>
                </td>
                <td>{formatCommas(amount)}</td>
                <td>{new Date(time).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}

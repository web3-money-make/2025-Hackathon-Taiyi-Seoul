'use client';

import Card from '@/components/Card';
import Table from '@/components/Table';
import { API_HOST_API } from '@/configs/apiHost';
import { formatCommas } from '@/utils/format';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function CurrentStatus() {
  // state
  const [histories, setHistories] = useState<
    {
      protocolId: number;
      chainId: number;
      apy: number;
      timestamp: number;
    }[]
  >([]);

  // memo
  const amountHashkeyAave = useMemo(
    () =>
      histories?.find(
        ({ protocolId, chainId }) => protocolId === 0 && chainId === 133
      )?.apy ?? 0,
    [histories]
  );
  const amountEthereamAave = useMemo(
    () =>
      histories?.find(
        ({ protocolId, chainId }) => protocolId === 0 && chainId !== 133
      )?.apy ?? 0,
    [histories]
  );
  const amountHashkeyCompound = useMemo(
    () =>
      histories?.find(
        ({ protocolId, chainId }) => protocolId !== 0 && chainId === 133
      )?.apy ?? 0,
    [histories]
  );
  const amountEthereamCompound = useMemo(
    () =>
      histories?.find(
        ({ protocolId, chainId }) => protocolId !== 0 && chainId !== 133
      )?.apy ?? 0,
    [histories]
  );

  // callback
  const sync = useCallback(async () => {
    const { data: apyHistories } = await axios.get<
      {
        protocolId: number;
        chainId: number;
        apy: number;
        timestamp: number;
      }[]
    >(`${API_HOST_API}/apy-history`);
    setHistories(apyHistories);
  }, []);

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
      <h2 className="text-xl pb-4">Current Status</h2>

      <Card>
        <Table>
          <thead>
            <tr>
              <th />
              <th>Hash Key</th>
              <th>Etheream</th>
              <th>BSC</th>
              <th>Base</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Aave</th>
              <td>{formatCommas(amountHashkeyAave)}%</td>
              <td>{formatCommas(amountEthereamAave)}%</td>
              <td className="text-sm text-center" rowSpan={2}>
                Coming <br />
                soon
              </td>
              <td className="text-sm text-center" rowSpan={2}>
                Coming <br />
                soon
              </td>
            </tr>
            <tr>
              <th>Compound</th>
              <td>{formatCommas(amountHashkeyCompound)}%</td>
              <td>{formatCommas(amountEthereamCompound)}%</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </>
  );
}

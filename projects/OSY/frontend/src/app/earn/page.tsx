'use client';

import Image from 'next/image';
import ImageUsdc from '@/assets/images/usdc.svg';
import SectionQr from './SectionQr';
import SectionStatus from './SectionStatus';
import { useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAddressHashkey,
  getBalanceHashkeyOsy,
  getBalanceHashkeyUsdc,
  getBalanceEthereumUsdc,
} from '@/libs/aa';

export default function Earn() {
  // privy
  const { wallets } = useWallets();

  // state
  const [aaAddress, setAaAddress] = useState('');
  const [balanceHashkeyOsy, setBalanceHashkeyOsy] = useState('0');
  const [balanceHashkeyUsdc, setBalanceHashkeyUsdc] = useState('0');
  const [balanceEthereumUsdc, setBalanceEthereumUsdc] = useState('0');

  // memo
  const wallet = useMemo(() => wallets[0], [wallets]);
  const eoaAddress = useMemo(() => wallet?.address, [wallet]);

  // callback
  const syncBalance = useCallback(async () => {
    if (!aaAddress) {
      setBalanceHashkeyOsy('0');
      setBalanceHashkeyUsdc('0');
      setBalanceEthereumUsdc('0');
      return;
    }

    const promises = [
      (async () => {
        try {
          const value = await getBalanceHashkeyOsy(aaAddress);
          setBalanceHashkeyOsy(value);
        } catch (error) {
          console.log('getBalanceHashkeyOsy.error', error);
          setBalanceHashkeyOsy('0');
        }
      })(),
      (async () => {
        try {
          const value = await getBalanceHashkeyUsdc(aaAddress);
          setBalanceHashkeyUsdc(value);
        } catch (error) {
          console.log('getBalanceHashkeyUsdc.error', error);
          setBalanceHashkeyUsdc('0');
        }
      })(),
      (async () => {
        try {
          const value = await getBalanceEthereumUsdc(aaAddress);
          setBalanceEthereumUsdc(value);
        } catch (error) {
          console.log('getBalanceEthereumUsdc.error', error);
          setBalanceEthereumUsdc('0');
        }
      })(),
    ];

    Promise.all(promises);
  }, [aaAddress]);

  // effect
  useEffect(() => {
    if (!wallet) {
      setAaAddress('');
      return;
    }

    (async () => {
      const aaAddress = await getAddressHashkey(eoaAddress);
      setAaAddress(aaAddress);
    })();
  }, [eoaAddress, wallet]);
  useEffect(() => {
    syncBalance();

    const intervalId = setInterval(async () => {
      syncBalance();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [syncBalance]);

  return (
    <section className="flex flex-col gap-[128px] row-start-2 items-center justify-center">
      <h1 className="text-xl font-light">
        Stake your{' '}
        <span className="inline-flex items-center justify-center gap-2 text-4xl font-normal">
          USDC
          <Image width={28} alt="" src={ImageUsdc} />
        </span>
      </h1>

      <div className="flex justify-center w-[900px]">
        <SectionQr
          wallet={wallet}
          eoaAddress={eoaAddress}
          aaAddress={aaAddress}
        />

        <SectionStatus
          wallet={wallet}
          eoaAddress={eoaAddress}
          aaAddress={aaAddress}
          balanceHashkeyOsy={balanceHashkeyOsy}
          balanceHashkeyUsdc={balanceHashkeyUsdc}
          balanceEthereumUsdc={balanceEthereumUsdc}
        />
      </div>
    </section>
  );
}

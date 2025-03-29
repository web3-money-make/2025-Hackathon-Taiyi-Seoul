'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import DialogStake from '@/components/dialogs/DialogStake';
import DialogWithdraw from '@/components/dialogs/DialogWithdraw';
import { formatCommas } from '@/utils/format';
import { ConnectedWallet } from '@privy-io/react-auth';
import BN from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

export interface Props {
  wallet?: ConnectedWallet;
  eoaAddress?: string;
  aaAddress?: string;
  balanceHashkeyOsy?: string;
  balanceHashkeyUsdc?: string;
  balanceEthereumUsdc?: string;
}

export default function SectionStatus({
  wallet,
  eoaAddress,
  aaAddress,
  balanceHashkeyOsy,
  balanceHashkeyUsdc,
  balanceEthereumUsdc,
}: Props) {
  // state
  const [isShowDialogStake, setIsShowDialogStake] = useState(false);
  const [isShowDialogWithdraw, setIsShowDialogWithdraw] = useState(false);

  // memo
  const balanceHashkeyUsdcAmount = useMemo(
    () => formatCommas(balanceHashkeyUsdc ?? '0'),
    [balanceHashkeyUsdc]
  );
  const balanceEthereumUsdcAmount = useMemo(
    () => formatCommas(balanceEthereumUsdc ?? '0'),
    [balanceEthereumUsdc]
  );
  const balanceHashkeyOsyAmount = useMemo(
    () =>
      formatCommas(new BN(balanceHashkeyOsy ?? '0').toFixed(1, BN.ROUND_CEIL)),
    [balanceHashkeyOsy]
  );

  // callback
  const handleStakeClick = useCallback(() => {
    setIsShowDialogStake(true);
  }, []);
  const handleStakeClose = useCallback(() => {
    setIsShowDialogStake(false);
  }, []);
  const handleWithdrawClick = useCallback(() => {
    setIsShowDialogWithdraw(true);
  }, []);
  const handleWithdrawClose = useCallback(() => {
    setIsShowDialogWithdraw(false);
  }, []);

  return (
    <div className="flex flex-col gap-[24px] items-end min-w-[450px]">
      <Card className="w-[100%]">
        <div className="flex flex-col gap-[24px] justify-center">
          <div>
            USDC <span className="text-xs font-light">on HashKey</span>:{' '}
            <span className="font-bold">{balanceHashkeyUsdcAmount} USDC</span>
          </div>
          <div>
            USDC <span className="text-xs font-light">on Ethereum</span>:{' '}
            <span className="font-bold">
              {balanceEthereumUsdcAmount} USDC
            </span>{' '}
          </div>
          <div>
            Staked:{' '}
            <span className="font-bold">
              {balanceHashkeyOsyAmount} osyUSD
            </span>{' '}
          </div>
        </div>
      </Card>

      <div className="flex gap-[24px] items-center justify-center">
        <Button onClick={handleStakeClick}>Stake</Button>
        <Button onClick={handleWithdrawClick}>Withdraw</Button>
      </div>

      <DialogStake
        isShow={isShowDialogStake}
        wallet={wallet}
        eoaAddress={eoaAddress}
        aaAddress={aaAddress}
        balanceHashkeyUsdc={balanceHashkeyUsdc}
        onDimClick={handleStakeClose}
      />
      <DialogWithdraw
        isShow={isShowDialogWithdraw}
        wallet={wallet}
        eoaAddress={eoaAddress}
        aaAddress={aaAddress}
        onDimClick={handleWithdrawClose}
      />
    </div>
  );
}

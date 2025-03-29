import React, { useCallback } from 'react';
import Dialog, { Props as DialogProps } from '@/components/Dialog';
import Button from '../Button';
import { IconWallet } from '../icons';
import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';

export interface Props extends DialogProps {
  isShow?: boolean;
  onDimClick?: () => void;
}

export default function DialogConnectWallet({
  isShow,
  onDimClick: handleDimClick,
  ...props
}: Props) {
  // privy
  const { connectWallet } = useConnectWallet();
  const { login } = usePrivy();
  const { wallets } = useWallets();

  // callback
  const handleInpageClick = useCallback(async () => {
    try {
      await connectWallet();

      wallets[0].loginOrLink();
    } catch (err) {
      console.error(err);
    }

    handleDimClick?.();
  }, [connectWallet, handleDimClick, wallets]);
  const handleSnsClick = useCallback(async () => {
    try {
      await login({ loginMethods: ['google', 'discord', 'twitter', 'github'] });
    } catch (err) {
      console.error(err);
    }

    handleDimClick?.();
  }, [handleDimClick, login]);

  return (
    <Dialog isShow={isShow} onDimClick={handleDimClick} {...props}>
      <div className="flex flex-col gap-4 w-[240px]">
        <div className="flex gap-2 items-center justify-center text-center">
          <IconWallet size="24px" color="#fff" /> Connect Wallet
        </div>
        <Button className="w-[100%]" onClick={handleInpageClick}>
          Connect browser wallet
        </Button>
        <Button className="w-[100%]" onClick={handleSnsClick}>
          Login with SNS
        </Button>
      </div>
    </Dialog>
  );
}

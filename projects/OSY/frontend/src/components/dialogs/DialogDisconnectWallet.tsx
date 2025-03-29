import React, { useCallback } from 'react';
import Dialog, { Props as DialogProps } from '@/components/Dialog';
import Button from '../Button';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { address2shorted } from '@/utils/format';
import clipboardCopy from '@/utils/clipboardCopy';

export interface Props extends DialogProps {
  isShow?: boolean;
  onDimClick?: () => void;
}

export default function DialogDisconnectWallet({
  isShow,
  onDimClick: handleDimClick,
  ...props
}: Props) {
  // privy
  const { wallets } = useWallets();
  const { logout } = usePrivy();

  // callback
  const handleAddressClick = useCallback(async () => {
    clipboardCopy(wallets[0].address);
  }, [wallets]);
  const handleClick = useCallback(async () => {
    wallets.forEach(async (wallet) => {
      await wallet.disconnect();
    });

    await logout();

    handleDimClick?.();
  }, [handleDimClick, logout, wallets]);

  return (
    <Dialog isShow={isShow} onDimClick={handleDimClick} {...props}>
      <div className="flex flex-col gap-4 w-[240px]">
        <div
          className="flex gap-2 items-center justify-center text-center cursor-pointer transition-opacity hover:opacity-50"
          onClick={handleAddressClick}
        >
          {address2shorted(wallets[0]?.address ?? '')}
        </div>
        <Button className="w-[100%]" onClick={handleClick}>
          Disconnect
        </Button>
      </div>
    </Dialog>
  );
}

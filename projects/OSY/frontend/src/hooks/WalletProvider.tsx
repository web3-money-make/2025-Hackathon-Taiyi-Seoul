'use client';

import React from 'react';
import WalletContext from './WalletContext';
import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, PRIVY_CLIENT_ID } from '@/configs/privy';

const WalletProvider = ({
  children,
}: {
  children: React.ReactNode;
  props?: object;
}) => {
  return (
    <WalletContext.Provider value={{}}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        clientId={PRIVY_CLIENT_ID}
        config={{
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
          appearance: {
            theme: 'dark',
            logo: '/icon-osy.png',
            walletChainType: 'ethereum-only',
            walletList: [
              'metamask',
              'rabby_wallet',
              'phantom',
              'zerion',
              'okx_wallet',
              'wallet_connect',
              'rainbow',
            ],
          },
        }}
      >
        {children}
      </PrivyProvider>
    </WalletContext.Provider>
  );
};

export default WalletProvider;

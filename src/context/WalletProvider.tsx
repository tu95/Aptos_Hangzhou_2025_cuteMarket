import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { PropsWithChildren } from 'react';

export function WalletProvider({ children }: PropsWithChildren) {
  const wallets = [new MartianWallet(), new PontemWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.error('Wallet error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}


import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';

export function WalletButton() {
  const { account, connected } = useWallet();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {connected && account ? (
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium">
            {formatAddress(account.address)}
          </div>
          <WalletSelector />
        </div>
      ) : (
        <WalletSelector />
      )}
    </div>
  );
}


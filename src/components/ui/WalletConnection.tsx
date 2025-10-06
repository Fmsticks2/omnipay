import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, Copy, ExternalLink, LogOut, AlertCircle } from 'lucide-react';
import { Button } from './button'
import { Card } from './card'
import { formatAddress } from '../../lib/utils';
import { getNetworkConfig } from '../../lib/wagmi';

interface WalletConnectionProps {
  showBalance?: boolean;
  showNetwork?: boolean;
  compact?: boolean;
}

export function WalletConnection({ 
  showBalance = true, 
  showNetwork = true, 
  compact = false 
}: WalletConnectionProps) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });

  const networkConfig = chain ? getNetworkConfig(chain.id) : null;

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // toast.success('Address copied to clipboard');
    }
  };

  const handleViewOnExplorer = () => {
    if (address && networkConfig) {
      window.open(`${networkConfig.blockExplorer}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal, connectModalOpen }) => (
          <Button
            onClick={openConnectModal}
            disabled={connectModalOpen}
            className="relative overflow-hidden"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </motion.div>
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }

  if (compact) {
    return (
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <Button
            variant="outline"
            onClick={openAccountModal}
            className="flex items-center gap-2"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: networkConfig?.color || '#666' }}
            />
            {formatAddress(address!)}
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: networkConfig?.color || '#666' }}
          />
          <div>
            <p className="font-medium">{formatAddress(address!)}</p>
            {showNetwork && networkConfig && (
              <p className="text-sm text-muted-foreground">{networkConfig.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAddress}
            className="h-8 w-8 p-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewOnExplorer}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnect()}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showBalance && balance && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-medium">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        </div>
      )}

      {chain && 'unsupported' in chain && (chain as any).unsupported && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Unsupported network</span>
        </motion.div>
      )}
    </Card>
  );
}

// Simplified wallet status indicator
export function WalletStatus() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm">Not connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm">{formatAddress(address!)}</span>
    </div>
  );
}

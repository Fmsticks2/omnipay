import { Link } from '@tanstack/react-router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Icon, { ChainIcon } from '../ui/Icon';
import { UI_ICONS } from '../ui/iconConstants';
import { getChainMetadata } from '../../config/chains';

export default function Header() {
  const { chain } = useAccount();
  const chainMetadata = chain ? getChainMetadata(chain.id) : null;

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{ backgroundColor: '#060011', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Icon icon={UI_ICONS.logo} size={18} color="#00D4FF" />
            </div>
            <span className="text-lg font-bold text-white">OmniPay</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/subscriptions" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Icon icon={UI_ICONS.subscription} size={16} />
              <span>Subscriptions</span>
            </Link>
            <Link 
              to="/bridge" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Icon icon={UI_ICONS.bridge} size={16} />
              <span>Bridge</span>
            </Link>
            <Link 
              to="/payments" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Icon icon={UI_ICONS.send} size={16} />
              <span>Payments</span>
            </Link>
            <Link 
              to="/faucet" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Icon icon="mdi:water-pump" size={16} />
              <span>Faucet</span>
            </Link>
            <Link 
              to="/settlement" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Icon icon={UI_ICONS.settlement} size={16} />
              <span>Settlement</span>
            </Link>
          </nav>

          {/* Network Display & Connect Button */}
          <div className="flex items-center space-x-3">
            {/* Network Display */}
            {chain && chainMetadata && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <ChainIcon 
                  chain={chain.id === 42101 ? 'push' : 'ethereum'} 
                  size={16} 
                />
                <span className="text-xs text-gray-300">
                  {chain.testnet ? 'Testnet' : chainMetadata.shortName}
                </span>
              </div>
            )}
            
            {/* Connect Button */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
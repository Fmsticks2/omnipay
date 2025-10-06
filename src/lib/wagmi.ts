import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'OmniPay',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
  ],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Network configurations
export const networkConfig = {
  [mainnet.id]: {
    name: 'Ethereum',
    color: '#627EEA',
    blockExplorer: 'https://etherscan.io',
  },
  [polygon.id]: {
    name: 'Polygon',
    color: '#8247E5',
    blockExplorer: 'https://polygonscan.com',
  },
  [optimism.id]: {
    name: 'Optimism',
    color: '#FF0420',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    color: '#28A0F0',
    blockExplorer: 'https://arbiscan.io',
  },
  [base.id]: {
    name: 'Base',
    color: '#0052FF',
    blockExplorer: 'https://basescan.org',
  },
  [sepolia.id]: {
    name: 'Sepolia',
    color: '#627EEA',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};

export const getNetworkConfig = (chainId: number) => {
  return networkConfig[chainId as keyof typeof networkConfig] || {
    name: 'Unknown Network',
    color: '#666666',
    blockExplorer: '#',
  };
};

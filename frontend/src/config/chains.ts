import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { NETWORK_CONFIG } from './contracts';

// Define the Push testnet network
export const pushTestnet = {
  id: NETWORK_CONFIG.chainId,
  name: 'Push Testnet Donut',
  nativeCurrency: {
    decimals: 18,
    name: 'Push Coin',
    symbol: 'PC',
  },
  rpcUrls: {
    default: {
      http: ['https://evm.rpc-testnet-donut-node1.push.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Push Explorer',
      url: 'https://testnet-explorer.push.org',
    },
  },
  testnet: true,
} as const;

// All supported chains for OmniPay
export const supportedChains = [
  pushTestnet,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
] as const;

// Chain metadata for UI display
export const chainMetadata = {
  [mainnet.id]: {
    name: 'Ethereum',
    shortName: 'ETH',
    color: '#627EEA',
    logo: '🔷',
  },
  [polygon.id]: {
    name: 'Polygon',
    shortName: 'MATIC',
    color: '#8247E5',
    logo: '🟣',
  },
  [optimism.id]: {
    name: 'Optimism',
    shortName: 'OP',
    color: '#FF0420',
    logo: '🔴',
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    shortName: 'ARB',
    color: '#28A0F0',
    logo: '🔵',
  },
  [base.id]: {
    name: 'Base',
    shortName: 'BASE',
    color: '#0052FF',
    logo: '🔵',
  },
  [pushTestnet.id]: {
    name: 'Push Testnet',
    shortName: 'PUSH',
    color: '#E91E63',
    logo: '🚀',
  },
} as const;

// Get chain by ID
export const getChainById = (chainId: number) => {
  return supportedChains.find(chain => chain.id === chainId);
};

// Get chain metadata by ID
export const getChainMetadata = (chainId: number) => {
  return chainMetadata[chainId as keyof typeof chainMetadata];
};
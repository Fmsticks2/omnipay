import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { PUSH_CHAIN_CONFIG } from './contracts';

// Define the Push Chain as a custom chain
export const pushChain = {
  ...PUSH_CHAIN_CONFIG,
} as const;

// All supported chains for OmniPay
export const supportedChains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  pushChain,
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
  [pushChain.id]: {
    name: 'Push Chain',
    shortName: 'PC',
    color: '#DD44C7',
    logo: '🟣',
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
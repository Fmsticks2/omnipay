import { mainnet, polygon, optimism, arbitrum, base, hardhat } from 'wagmi/chains';
import { NETWORK_CONFIG } from './contracts';

// Define the local Hardhat network
export const localHardhat = {
  ...hardhat,
  id: NETWORK_CONFIG.chainId,
  name: 'Local Hardhat',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
} as const;

// All supported chains for OmniPay
export const supportedChains = [
  localHardhat,
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
  [localHardhat.id]: {
    name: 'Local Hardhat',
    shortName: 'LOCAL',
    color: '#F7DF1E',
    logo: '⚡',
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
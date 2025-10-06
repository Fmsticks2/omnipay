import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// Define the Push testnet network with correct chain ID
export const pushTestnet = {
  id: 42101, // Push Protocol Testnet Donut chain ID
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

// All supported chains for OmniPay with correct chain IDs
export const supportedChains = [
  pushTestnet,    // Chain ID: 42101
  mainnet,        // Chain ID: 1 (Ethereum Mainnet)
  polygon,        // Chain ID: 137 (Polygon Mainnet)
  optimism,       // Chain ID: 10 (Optimism Mainnet)
  arbitrum,       // Chain ID: 42161 (Arbitrum One)
  base,           // Chain ID: 8453 (Base Mainnet)
] as const;

// Chain metadata for UI display with correct chain IDs
export const chainMetadata = {
  1: { // Ethereum Mainnet
    name: 'Ethereum',
    shortName: 'ETH',
    color: '#627EEA',
    logo: '🔷',
  },
  137: { // Polygon Mainnet
    name: 'Polygon',
    shortName: 'MATIC',
    color: '#8247E5',
    logo: '🟣',
  },
  10: { // Optimism Mainnet
    name: 'Optimism',
    shortName: 'OP',
    color: '#FF0420',
    logo: '🔴',
  },
  42161: { // Arbitrum One
    name: 'Arbitrum',
    shortName: 'ARB',
    color: '#28A0F0',
    logo: '🔵',
  },
  8453: { // Base Mainnet
    name: 'Base',
    shortName: 'BASE',
    color: '#0052FF',
    logo: '🔵',
  },
  42101: { // Push Protocol Testnet Donut
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
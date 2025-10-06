// OmniPay Smart Contract Addresses and Configuration
export const OMNIPAY_CONTRACTS = {
  NOTIFIER: import.meta.env.VITE_OMNIPAY_NOTIFIER as `0x${string}`,
  CORE: import.meta.env.VITE_OMNIPAY_CORE as `0x${string}`,
  SUBSCRIPTION: import.meta.env.VITE_OMNIPAY_SUBSCRIPTION as `0x${string}`,
  BRIDGE: import.meta.env.VITE_OMNIPAY_BRIDGE as `0x${string}`,
  SETTLEMENT: import.meta.env.VITE_OMNIPAY_SETTLEMENT as `0x${string}`,
} as const;

// Push Chain Configuration
export const PUSH_CHAIN_CONFIG = {
  id: Number(import.meta.env.VITE_PUSHCHAIN_CHAIN_ID),
  name: import.meta.env.VITE_PUSHCHAIN_NAME,
  nativeCurrency: {
    name: 'Push Coin',
    symbol: import.meta.env.VITE_PUSHCHAIN_SYMBOL,
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_PUSHCHAIN_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Push Explorer',
      url: import.meta.env.VITE_PUSHCHAIN_EXPLORER_URL,
    },
  },
  testnet: true,
} as const;

// Supported Token Addresses (example addresses - update with actual deployed tokens)
export const SUPPORTED_TOKENS = {
  USDC: '0xA0b86a33E6441b8435b662303c0f479c6c8c3c1d' as `0x${string}`,
  USDT: '0x3813e82e6f7098b9583FC0F33a962D02018B6803' as `0x${string}`,
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' as `0x${string}`,
} as const;

// Contract ABIs (simplified - you'll need to import full ABIs)
export const OMNIPAY_CORE_ABI = [
  {
    name: 'sendPayment',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'reference', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'PaymentSent',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'reference', type: 'string' },
    ],
  },
] as const;

export const OMNIPAY_SUBSCRIPTION_ABI = [
  {
    name: 'createSubscription',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'merchant', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'interval', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'SubscriptionCreated',
    type: 'event',
    inputs: [
      { name: 'subscriber', type: 'address', indexed: true },
      { name: 'merchant', type: 'address', indexed: true },
      { name: 'subscriptionId', type: 'uint256', indexed: true },
    ],
  },
] as const;
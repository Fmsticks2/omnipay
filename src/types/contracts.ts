// Smart Contract Types for OmniPay
export interface Transaction {
  payer: string;
  payee: string;
  token: string; // address(0) for ETH
  amount: bigint;
  timestamp: bigint;
  paymentRef: string;
}

export interface Subscription {
  id: bigint;
  subscriber: string;
  merchant: string;
  token: string; // address(0) for ETH
  amount: bigint;
  interval: bigint; // seconds
  nextPaymentDue: bigint;
  active: boolean;
}

export interface Settlement {
  payer: string;
  payee: string;
  token: string;
  amount: bigint;
  timestamp: bigint;
  paymentRef: string;
  executed: boolean;
}

export interface CrossChainPayment {
  payer: string;
  payee: string;
  token: string;
  amount: bigint;
  sourceChainId: bigint;
  targetChainId: bigint;
  paymentRef: string;
  timestamp: bigint;
  completed: boolean;
  refunded: boolean;
}

// Contract Event Types
export interface PaymentInitiatedEvent {
  payer: string;
  payee: string;
  token: string;
  amount: bigint;
  paymentRef: string;
}

export interface PaymentCompletedEvent {
  txId: bigint;
  payer: string;
  payee: string;
  token: string;
  amount: bigint;
  paymentRef: string;
}

// Contract Addresses (to be updated with deployed addresses)
export const CONTRACT_ADDRESSES = {
  OMNIPAY_CORE: '0x0000000000000000000000000000000000000000',
  OMNIPAY_SUBSCRIPTION: '0x0000000000000000000000000000000000000000',
  OMNIPAY_SETTLEMENT: '0x0000000000000000000000000000000000000000',
  OMNIPAY_BRIDGE: '0x0000000000000000000000000000000000000000',
  OMNIPAY_NOTIFIER: '0x0000000000000000000000000000000000000000',
} as const;

// Supported Networks
export const SUPPORTED_NETWORKS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
} as const;

export type SupportedNetwork = typeof SUPPORTED_NETWORKS[keyof typeof SUPPORTED_NETWORKS];

// Error Types
export class ContractError extends Error {
  constructor(
    message: string,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ContractError';
  }
}

export class InvalidAddressError extends Error {
  constructor(address: string) {
    super(`Invalid address: ${address}`);
    this.name = 'InvalidAddressError';
  }
}

// Function Parameter Types
export interface SendPaymentParams {
  payee: string;
  token: string;
  amount: bigint;
  paymentRef: string;
}

export interface CreateSubscriptionParams {
  merchant: string;
  token: string;
  amount: bigint;
  interval: bigint;
}

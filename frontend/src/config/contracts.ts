// OmniPay Smart Contract Addresses and Configuration
import contractsData from './contracts.json';

// Import ABIs
import OmniPayCoreABI from './abis/OmniPayCore.json';
import OmniPayBridgeABI from './abis/OmniPayBridge.json';
import OmniPayBridgeStubABI from './abis/OmniPayBridgeStub.json';
import OmniPaySettlementABI from './abis/OmniPaySettlement.json';
import OmniPaySubscriptionABI from './abis/OmniPaySubscription.json';
import OmniPayNotifierABI from './abis/OmniPayNotifier.json';

export const OMNIPAY_CONTRACTS = {
  NOTIFIER: contractsData.contracts.OmniPayNotifier as `0x${string}`,
  CORE: contractsData.contracts.OmniPayCore as `0x${string}`,
  SUBSCRIPTION: contractsData.contracts.OmniPaySubscription as `0x${string}`,
  BRIDGE: contractsData.contracts.OmniPayBridge as `0x${string}`,
  SETTLEMENT: contractsData.contracts.OmniPaySettlement as `0x${string}`,
  BRIDGE_STUB: contractsData.contracts.OmniPayBridgeStub as `0x${string}`,
} as const;

// Contract ABIs
export const CONTRACT_ABIS = {
  CORE: OmniPayCoreABI.abi,
  BRIDGE: OmniPayBridgeABI.abi,
  BRIDGE_STUB: OmniPayBridgeStubABI.abi,
  SETTLEMENT: OmniPaySettlementABI.abi,
  SUBSCRIPTION: OmniPaySubscriptionABI.abi,
  NOTIFIER: OmniPayNotifierABI.abi,
} as const;

// Supported Token Addresses (example addresses - update with actual deployed tokens)
export const SUPPORTED_TOKENS = {
  USDC: '0xA0b86a33E6441b8435b662303c0f479c6c8c3c1d' as `0x${string}`,
  USDT: '0x3813e82e6f7098b9583FC0F33a962D02018B6803' as `0x${string}`,
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' as `0x${string}`,
} as const;

// Network Configuration
export const NETWORK_CONFIG = {
  chainId: parseInt(contractsData.chainId),
  name: contractsData.network,
  deployer: contractsData.deployer,
  deployedAt: contractsData.deployedAt,
} as const;
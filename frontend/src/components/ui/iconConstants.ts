// Token icon mappings - Using iconify icons for better compatibility
export const TOKEN_ICONS = {
  eth: 'cryptocurrency:eth',
  usdc: 'cryptocurrency:usdc',
  usdt: 'cryptocurrency:usdt',
  dai: 'cryptocurrency:dai',
  wbtc: 'cryptocurrency:wbtc',
  matic: 'cryptocurrency:matic',
  bnb: 'cryptocurrency:bnb',
  avax: 'cryptocurrency:avax',
  ftm: 'cryptocurrency:ftm',
  arb: 'cryptocurrency:arb',
  op: 'cryptocurrency:op',
  // Push Protocol Donut token
  push: 'cryptocurrency:push',
  // Legacy uppercase keys for backward compatibility
  ETH: 'cryptocurrency:eth',
  USDC: 'cryptocurrency:usdc',
  USDT: 'cryptocurrency:usdt',
  DAI: 'cryptocurrency:dai',
  WBTC: 'cryptocurrency:wbtc',
  MATIC: 'cryptocurrency:matic',
  BNB: 'cryptocurrency:bnb',
  AVAX: 'cryptocurrency:avax',
  FTM: 'cryptocurrency:ftm',
  ARB: 'cryptocurrency:arb',
  OP: 'cryptocurrency:op',
  PUSH: 'cryptocurrency:push',
} as const;

// Chain icon mappings - Using iconify icons for better compatibility
export const CHAIN_ICONS = {
  ethereum: 'cryptocurrency:eth',
  polygon: 'cryptocurrency:matic',
  bsc: 'cryptocurrency:bnb',
  avalanche: 'cryptocurrency:avax',
  fantom: 'cryptocurrency:ftm',
  arbitrum: 'cryptocurrency:arb',
  optimism: 'cryptocurrency:op',
  base: 'cryptocurrency:base',
  // Push Protocol testnet
  push: 'cryptocurrency:push',
  // Sepolia testnet (using ETH icon)
  sepolia: 'cryptocurrency:eth',
} as const;

// Common UI icons
export const UI_ICONS = {
  // Navigation
  home: 'mdi:home',
  dashboard: 'mdi:view-dashboard',
  payments: 'mdi:credit-card',
  subscriptions: 'mdi:calendar-sync',
  settlement: 'mdi:gavel',
  settings: 'mdi:cog',
  
  // Actions
  send: 'mdi:send',
  receive: 'mdi:download',
  swap: 'mdi:swap-horizontal',
  bridge: 'mdi:bridge',
  connect: 'mdi:link',
  disconnect: 'mdi:link-off',
  add: 'mdi:plus',
  edit: 'mdi:pencil',
  delete: 'mdi:delete',
  save: 'mdi:content-save',
  cancel: 'mdi:cancel',
  
  // Data
  chart: 'mdi:chart-line',
  table: 'mdi:table',
  list: 'mdi:format-list-bulleted',
  grid: 'mdi:view-grid',
  
  // Time
  clock: 'mdi:clock',
  calendar: 'mdi:calendar',
  history: 'mdi:history',
  
  // Files
  download: 'mdi:download',
  upload: 'mdi:upload',
  file: 'mdi:file',
  folder: 'mdi:folder',
  document: 'mdi:file-document',
  speed: 'mdi:speedometer',
  payment: 'mdi:credit-card-outline',
  subscription: 'mdi:calendar-sync-outline',
  
  // Status
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  warning: 'mdi:alert',
  info: 'mdi:information',
  pending: 'mdi:clock',
  security: 'mdi:shield-check',
  
  // UI Elements
  close: 'mdi:close',
  menu: 'mdi:menu',
  search: 'mdi:magnify',
  filter: 'mdi:filter',
  sort: 'mdi:sort',
  refresh: 'mdi:refresh',
  copy: 'mdi:content-copy',
  external: 'mdi:open-in-new',
  
  // Wallet
  wallet: 'mdi:wallet',
  account: 'mdi:account',
  key: 'mdi:key',
  
  // Notifications
  notification: 'mdi:bell',
  notificationOff: 'mdi:bell-off',
  
  // Cross-chain
  crossChain: 'mdi:swap-horizontal-circle',
  network: 'mdi:network',
  
  // Payment specific
  recurring: 'mdi:repeat',
  oneTime: 'mdi:numeric-1-circle',
  dispute: 'mdi:gavel',
  escrow: 'mdi:shield-lock',
} as const;
// Token icon mappings - Using professional SVG icons
export const TOKEN_ICONS = {
  ETH: '/src/assets/icons/ethereum.svg',
  USDC: '/src/assets/icons/usdc.svg',
  USDT: '/src/assets/icons/usdt.svg',
  DAI: 'cryptocurrency:dai',
  WBTC: 'cryptocurrency:wbtc',
  MATIC: '/src/assets/icons/polygon.svg',
  BNB: '/src/assets/icons/bsc.svg',
  AVAX: 'cryptocurrency:avax',
  FTM: 'cryptocurrency:ftm',
  ARB: '/src/assets/icons/arbitrum.svg',
  OP: '/src/assets/icons/optimism.svg',
  // Add more tokens as needed
} as const;

// Chain icon mappings - Using professional SVG icons
export const CHAIN_ICONS = {
  ethereum: '/src/assets/icons/ethereum.svg',
  polygon: '/src/assets/icons/polygon.svg',
  bsc: '/src/assets/icons/bsc.svg',
  avalanche: 'cryptocurrency:avax',
  fantom: 'cryptocurrency:ftm',
  arbitrum: '/src/assets/icons/arbitrum.svg',
  optimism: '/src/assets/icons/optimism.svg',
  base: '/src/assets/icons/base.svg',
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
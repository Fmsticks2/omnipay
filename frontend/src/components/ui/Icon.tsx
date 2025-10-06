import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface IconProps {
  icon: string;
  className?: string;
  size?: number | string;
  color?: string;
  onClick?: () => void;
}

export default function Icon({ 
  icon, 
  className, 
  size = 24, 
  color, 
  onClick 
}: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      className={cn(
        'inline-block',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      width={size}
      height={size}
      style={{ color }}
      onClick={onClick}
    />
  );
}

// Token icon mappings
export const TOKEN_ICONS = {
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
  // Add more tokens as needed
} as const;

// Chain icon mappings
export const CHAIN_ICONS = {
  ethereum: 'cryptocurrency:eth',
  polygon: 'cryptocurrency:matic',
  bsc: 'cryptocurrency:bnb',
  avalanche: 'cryptocurrency:avax',
  fantom: 'cryptocurrency:ftm',
  arbitrum: 'cryptocurrency:arb',
  optimism: 'cryptocurrency:op',
  base: 'cryptocurrency:base',
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

// Helper component for token icons
interface TokenIconProps {
  token: keyof typeof TOKEN_ICONS;
  size?: number | string;
  className?: string;
}

export function TokenIcon({ token, size = 24, className }: TokenIconProps) {
  return (
    <Icon
      icon={TOKEN_ICONS[token]}
      size={size}
      className={className}
    />
  );
}

// Helper component for chain icons
interface ChainIconProps {
  chain: keyof typeof CHAIN_ICONS;
  size?: number | string;
  className?: string;
}

export function ChainIcon({ chain, size = 24, className }: ChainIconProps) {
  return (
    <Icon
      icon={CHAIN_ICONS[chain]}
      size={size}
      className={className}
    />
  );
}
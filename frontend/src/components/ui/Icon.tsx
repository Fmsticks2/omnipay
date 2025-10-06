import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { TOKEN_ICONS, CHAIN_ICONS } from './iconConstants';

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
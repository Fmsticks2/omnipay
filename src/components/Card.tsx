import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'solid' | 'gradient' | 'premium' | 'minimal';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = 'md',
  variant = 'default',
  borderRadius = 'xl',
  shadow = 'md',
  onClick,
  interactive = false
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const radiusClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-[2rem]'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-xl',
    lg: 'shadow-2xl',
    xl: 'shadow-2xl shadow-black/20'
  };

  const variantClasses = {
    default: `
      bg-slate-900/40 backdrop-blur-xl border border-slate-700/50
      hover:bg-slate-800/60 hover:border-slate-600/60
    `,
    glass: `
      bg-white/5 backdrop-blur-2xl border border-white/10
      hover:bg-white/10 hover:border-white/20
      shadow-inner shadow-white/5
    `,
    solid: `
      bg-slate-800/95 border border-slate-700/80
      hover:bg-slate-700/95 hover:border-slate-600/80
    `,
    gradient: `
      bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-800/80
      border border-slate-600/50 hover:border-slate-500/60
      shadow-inner shadow-white/5
    `,
    premium: `
      bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-blue-900/20
      backdrop-blur-2xl border border-gradient-to-r from-indigo-500/30 to-purple-500/30
      hover:from-indigo-900/30 hover:via-purple-900/20 hover:to-blue-900/30
      shadow-2xl shadow-purple-500/10
    `,
    minimal: `
      bg-transparent border border-slate-700/30
      hover:bg-slate-800/20 hover:border-slate-600/50
    `
  };

  const baseClasses = cn(
    'relative overflow-hidden transition-all duration-300 group',
    radiusClasses[borderRadius],
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    glow && 'shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30',
    (interactive || onClick) && 'cursor-pointer',
    className
  );

  const hoverAnimation = hover ? {
    scale: 1.02,
    y: -2,
    transition: { 
      type: "spring" as const, 
      stiffness: 400, 
      damping: 17 
    }
  } : {};

  const tapAnimation = (interactive || onClick) ? {
    scale: 0.98,
    transition: { duration: 0.1 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
    >
      {/* Shimmer effect for premium variant */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-700" />
      )}
      
      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300 -z-10" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border gradient overlay for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  );
};

export default Card;
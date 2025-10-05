import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '../lib/utils';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode;
  'data-testid'?: string;
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  glow = false,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 
      hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 
      text-white shadow-2xl hover:shadow-indigo-500/25 
      focus:ring-purple-500/50 border border-white/10
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
    `,
    secondary: `
      bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 
      hover:bg-slate-700/80 hover:border-slate-600/50 
      text-slate-200 hover:text-white shadow-xl hover:shadow-slate-500/20
      focus:ring-slate-400/50
    `,
    outline: `
      border-2 border-gradient-to-r from-purple-500 to-blue-500 
      bg-transparent text-purple-400 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10
      hover:text-white focus:ring-purple-500/50 shadow-lg hover:shadow-purple-500/20
    `,
    ghost: `
      text-slate-300 hover:bg-white/5 hover:text-white 
      focus:ring-white/30 rounded-xl
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-rose-600 
      hover:from-red-700 hover:to-rose-700 
      text-white shadow-2xl hover:shadow-red-500/25 
      focus:ring-red-500/50 border border-white/10
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-green-600 
      hover:from-emerald-700 hover:to-green-700 
      text-white shadow-2xl hover:shadow-emerald-500/25 
      focus:ring-emerald-500/50 border border-white/10
    `,
    gradient: `
      bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 
      hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 
      text-white shadow-2xl hover:shadow-fuchsia-500/25 
      focus:ring-fuchsia-500/50 border border-white/10
      animate-gradient-x bg-[length:200%_200%]
    `
  };

  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs gap-1.5 min-h-[28px]',
    sm: 'px-4 py-2 text-sm gap-2 min-h-[36px]',
    md: 'px-6 py-3 text-base gap-2.5 min-h-[44px]',
    lg: 'px-8 py-4 text-lg gap-3 min-h-[52px]',
    xl: 'px-10 py-5 text-xl gap-3.5 min-h-[60px]'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const glowClasses = glow ? 'shadow-2xl hover:shadow-purple-500/50 animate-pulse-slow' : '';

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    glowClasses,
    className
  );

  return (
    <motion.button
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -1
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.98,
        y: disabled || loading ? 0 : 0
      }}
      transition={{ 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 17 
      }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500" />
      
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner 
            size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'} 
            color={variant === 'ghost' || variant === 'outline' ? 'primary' : 'white'} 
          />
          <span className="font-medium">Processing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 relative z-10">
          {Icon && iconPosition === 'left' && (
            <Icon className={cn(iconSizeClasses[size], "transition-transform group-hover:scale-110")} />
          )}
          <span className="font-semibold tracking-wide">{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={cn(iconSizeClasses[size], "transition-transform group-hover:scale-110")} />
          )}
        </div>
      )}
    </motion.button>
  );
};

export default Button;
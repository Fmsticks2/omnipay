import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
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
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500/50',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white focus:ring-white/50',
    outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white focus:ring-purple-500/50',
    ghost: 'text-gray-300 hover:bg-white/10 hover:text-white focus:ring-white/50',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500/50'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  );

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      type={props.type}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      style={props.style}
      id={props.id}
      name={props.name}
      value={props.value}
      tabIndex={props.tabIndex}
      role={props.role}
      aria-label={props['aria-label']}
      aria-describedby={props['aria-describedby']}
      data-testid={props['data-testid']}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={iconSizeClasses[size]} />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={iconSizeClasses[size]} />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;
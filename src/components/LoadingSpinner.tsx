import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'success' | 'danger';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  text,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-purple-500',
    white: 'border-white',
    gray: 'border-gray-400',
    success: 'border-emerald-500',
    danger: 'border-red-500'
  };

  const dotColorClasses = {
    primary: 'bg-purple-500',
    white: 'bg-white',
    gray: 'bg-gray-400',
    success: 'bg-emerald-500',
    danger: 'bg-red-500'
  };

  if (variant === 'dots') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${dotColorClasses[color]} rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center gap-3"
      >
        <motion.div
          className={`${sizeClasses[size]} ${dotColorClasses[color]} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <motion.p 
            className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-400'} font-medium`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-3"
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-t-current ${colorClasses[color]} rounded-full animate-spin`}
        />
        
        {/* Inner ring */}
        <div
          className={`absolute inset-1 border-2 border-transparent border-b-current ${colorClasses[color]} rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}
        />
        
        {/* Center dot */}
        <div
          className={`absolute inset-0 m-auto ${size === 'xs' ? 'w-0.5 h-0.5' : 'w-1 h-1'} ${dotColorClasses[color]} rounded-full animate-pulse`}
        />
      </div>
      
      {text && (
        <motion.p 
          className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-400'} font-medium`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
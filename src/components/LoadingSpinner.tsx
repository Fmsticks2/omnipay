import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-purple-500',
    white: 'border-white',
    gray: 'border-gray-400'
  };

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
          className={`absolute inset-0 m-auto w-1 h-1 ${color === 'primary' ? 'bg-purple-500' : color === 'white' ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`}
        />
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-sm font-medium ${
            color === 'primary' ? 'text-purple-400' : 
            color === 'white' ? 'text-white' : 
            'text-gray-400'
          }`}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'solid';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  padding = 'md',
  variant = 'default'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'bg-white/5 backdrop-blur-sm border border-white/10',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    solid: 'bg-slate-800/90 border border-slate-700'
  };

  const baseClasses = `
    rounded-2xl
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    transition-all duration-300
    ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-2xl' : ''}
    ${glow ? 'shadow-lg shadow-purple-500/10' : ''}
    ${className}
  `.trim();

  const hoverAnimation = hover ? {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      whileHover={hoverAnimation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
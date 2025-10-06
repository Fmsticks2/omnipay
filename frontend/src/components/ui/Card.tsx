import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { FunctionComponent } from '../../common/types';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card = ({ children, className = '', hover = true, gradient = false }: CardProps): FunctionComponent => {
  const baseClasses = `
    p-6 rounded-2xl border transition-all duration-300
    ${gradient 
      ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20' 
      : 'bg-white/5 backdrop-blur-sm border-white/10'
    }
    ${hover ? 'hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;
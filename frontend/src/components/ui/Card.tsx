import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { FunctionComponent } from '../../common/types';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = '', hover = true }: CardProps): FunctionComponent => {
  if (hover) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          p-6 rounded-2xl border backdrop-blur-sm
          ${className}
        `}
        style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div 
      className={`
        p-6 rounded-2xl border backdrop-blur-sm
        ${className}
      `}
      style={{ backgroundColor: 'rgba(6, 0, 17, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      {children}
    </div>
  );
};

export default Card;
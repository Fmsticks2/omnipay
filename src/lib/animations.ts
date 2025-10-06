import { Variants, Transition } from 'framer-motion';

// Standard transitions
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17
};

export const easeTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

// Container variants for staggered animations
export const containerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Item variants for individual elements
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

// Fade variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: easeTransition
  }
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition
  }
};

// Slide variants
export const slideVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  }
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

// Header variants
export const headerVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

// Mobile menu variants
export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

// Icon variants
export const iconVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: {
    scale: 1,
    rotate: 0,
    transition: springTransition
  }
};

// Layout variants
export const layoutVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// Card hover animations
export const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -5,
    transition: springTransition
  }
};

// Button hover animations
export const buttonHoverVariants = {
  hover: {
    scale: 1.02,
    transition: springTransition
  },
  tap: {
    scale: 0.98,
    transition: springTransition
  }
};
declare module 'framer-motion' {
  import { ComponentType, ReactNode } from 'react';

  export interface MotionProps {
    className?: string;
    onClick?: () => void;
    type?: string;
    disabled?: boolean;
    children?: ReactNode;
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
  }

  export const motion: {
    nav: ComponentType<MotionProps>;
    div: ComponentType<MotionProps>;
    button: ComponentType<MotionProps>;
    aside: ComponentType<MotionProps>;
    li: ComponentType<MotionProps>;
  };

  export const AnimatePresence: ComponentType<{ children: ReactNode; mode?: string }>;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
} 
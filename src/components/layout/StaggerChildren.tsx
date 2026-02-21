'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function StaggerChildren({ children, className = '', staggerDelay }: StaggerChildrenProps) {
  const variants = staggerDelay
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: staggerDelay } },
      }
    : container;

  return (
    <motion.div variants={variants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

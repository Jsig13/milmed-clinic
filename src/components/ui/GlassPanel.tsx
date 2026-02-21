'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: string;
}

export default function GlassPanel({ children, className = '', hover = false, onClick, padding = 'p-6' }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.01, backgroundColor: 'rgba(255,255,255,0.06)' } : undefined}
      onClick={onClick}
      className={`
        rounded-2xl border border-white/[0.06]
        bg-white/[0.04] backdrop-blur-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${padding}
        ${hover ? 'cursor-pointer transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'custom';
  className?: string;
  pulse?: boolean;
}

const variantClasses = {
  default: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  custom: '',
};

export default function GlassBadge({ children, variant = 'default', className = '', pulse = false }: GlassBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border
        ${variant !== 'custom' ? variantClasses[variant] : ''}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </motion.span>
  );
}

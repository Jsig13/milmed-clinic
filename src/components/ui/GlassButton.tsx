'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variants = {
  default: 'bg-white/[0.06] border-white/[0.08] text-slate-200 hover:bg-white/[0.1]',
  primary: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30',
  success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30',
  danger: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function GlassButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl border backdrop-blur-xl
        font-medium transition-colors duration-200
        flex items-center gap-2 justify-center
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

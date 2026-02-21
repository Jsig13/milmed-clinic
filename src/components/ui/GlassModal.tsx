'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function GlassModal({ isOpen, onClose, title, children, size = 'lg' }: GlassModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`
              relative w-full ${sizeClasses[size]}
              rounded-2xl border border-white/[0.08]
              bg-slate-900/95 backdrop-blur-2xl
              shadow-[0_16px_64px_rgba(0,0,0,0.5)]
              max-h-[85vh] overflow-y-auto
            `}
          >
            <div className="sticky top-0 flex items-center justify-between p-6 pb-4 border-b border-white/[0.06] bg-slate-900/95 backdrop-blur-2xl rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

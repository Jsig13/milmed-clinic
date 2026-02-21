'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

interface AlertBannerProps {
  severity: 'red' | 'amber' | 'green' | 'blue';
  message: string;
  onDismiss?: () => void;
}

const config = {
  red: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', Icon: AlertCircle },
  amber: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', Icon: AlertTriangle },
  green: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', Icon: Info },
  blue: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', Icon: Info },
};

export default function AlertBanner({ severity, message, onDismiss }: AlertBannerProps) {
  const { bg, text, Icon } = config[severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg}`}
    >
      <Icon size={16} className={text} />
      <span className={`text-sm flex-1 ${text}`}>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'red';
  pulse?: boolean;
}

const colorClasses = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-500' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-500' },
};

export default function StatCard({ label, value, icon, color, pulse = false }: StatCardProps) {
  const c = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        rounded-2xl border ${c.border} ${c.bg}
        backdrop-blur-2xl p-5 relative overflow-hidden
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
            {pulse && (
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.icon} opacity-75`} style={{ backgroundColor: 'currentColor' }} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${c.icon}`} style={{ backgroundColor: 'currentColor' }} />
              </span>
            )}
          </div>
        </div>
        <div className={`${c.icon} opacity-60`}>{icon}</div>
      </div>
    </motion.div>
  );
}

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import OutputViewer from './OutputViewer';

interface DocumentEditorProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  form: ReactNode;
  output: string;
}

export default function DocumentEditor({ title, subtitle, icon, form, output }: DocumentEditorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link href="/dashboard/documents">
          <button className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Input</h3>
          {form}
        </div>
        <OutputViewer content={output} title={title} />
      </div>
    </motion.div>
  );
}

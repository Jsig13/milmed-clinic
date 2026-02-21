'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Stethoscope,
  Anchor,
  Plane,
  ClipboardList,
  Pill,
} from 'lucide-react';
import { DOCUMENT_TYPES } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Stethoscope,
  Anchor,
  Plane,
  ClipboardList,
  Pill,
};

export default function TemplateSelector() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {DOCUMENT_TYPES.map((doc, index) => {
        const Icon = iconMap[doc.icon] || FileText;
        return (
          <Link key={doc.id} href={`/dashboard/documents/${doc.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="
                rounded-2xl border border-white/[0.06] bg-white/[0.03]
                backdrop-blur-xl p-6 cursor-pointer transition-colors
                flex flex-col items-center text-center gap-3
              "
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <Icon size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{doc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{doc.subtitle}</p>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

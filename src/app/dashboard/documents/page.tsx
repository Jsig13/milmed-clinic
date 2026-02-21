'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { FileText, Eye, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassButton from '@/components/ui/GlassButton';
import TemplateSelector from '@/components/documents/TemplateSelector';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_DOCUMENTS } from '@/lib/mock-data';
import { DocumentRecord } from '@/lib/types';

export default function DocumentsPage() {
  const [documents] = useLocalStorage<DocumentRecord[]>('milmed-documents', MOCK_DOCUMENTS);

  const sorted = useMemo(
    () => [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [documents]
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Document Generator</h1>
          <p className="text-sm text-slate-500 mt-1">Generate military medical documents</p>
        </div>

        <TemplateSelector />

        <GlassPanel>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Recent Documents</h2>
          <div className="space-y-2">
            {sorted.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <FileText size={16} className="text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.subject}</p>
                </div>
                <span className="text-xs text-slate-600 shrink-0">{doc.type.toUpperCase()}</span>
                <span className="text-xs text-slate-600 shrink-0">
                  {format(new Date(doc.createdAt), 'dd MMM yyyy')}
                </span>
                <span className="text-xs text-slate-600 shrink-0">{doc.createdBy}</span>
                <div className="flex gap-1 shrink-0">
                  <GlassButton size="sm"><Eye size={12} /></GlassButton>
                  <GlassButton size="sm"><Copy size={12} /></GlassButton>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </PageTransition>
  );
}

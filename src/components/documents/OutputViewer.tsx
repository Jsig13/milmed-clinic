'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Printer, Download, Check } from 'lucide-react';
import GlassButton from '@/components/ui/GlassButton';

interface OutputViewerProps {
  content: string;
  title: string;
}

export default function OutputViewer({ content, title }: OutputViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 1in; font-size: 12pt; line-height: 1.5; color: #000; }
            pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
          </style>
          </head>
          <body><pre>${content}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <h3 className="text-sm font-medium text-slate-300">Output Preview</h3>
        <div className="flex items-center gap-2">
          <GlassButton size="sm" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </GlassButton>
          <GlassButton size="sm" onClick={handlePrint}>
            <Printer size={14} /> Print
          </GlassButton>
          <GlassButton size="sm">
            <Download size={14} /> PDF
          </GlassButton>
        </div>
      </div>
      <div className="p-6">
        {content ? (
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{content}</pre>
        ) : (
          <div className="text-center py-12 text-slate-600 text-sm">
            Fill out the form and generate to see output here
          </div>
        )}
      </div>
    </motion.div>
  );
}

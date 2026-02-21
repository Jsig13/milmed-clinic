'use client';

import { motion } from 'framer-motion';
import { MessageSquare, ArrowRightLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ProfileNote } from '@/lib/types';

interface ProfileTimelineProps {
  notes: ProfileNote[];
}

const typeConfig = {
  note: { Icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/20' },
  status_change: { Icon: ArrowRightLeft, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/20' },
  document: { Icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
};

export default function ProfileTimeline({ notes }: ProfileTimelineProps) {
  const sorted = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      {sorted.map((note, index) => {
        const { Icon, color, bg } = typeConfig[note.type];
        return (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-lg border ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={color} />
              </div>
              {index < sorted.length - 1 && <div className="w-px flex-1 bg-white/[0.06] mt-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-300">{note.author}</span>
                <span className="text-[10px] text-slate-600">
                  {format(new Date(note.date), 'dd MMM yyyy')}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{note.content}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface GlassTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  keyExtractor: (item: T) => string;
}

export default function GlassTable<T>({
  columns,
  data,
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  keyExtractor,
}: GlassTableProps<T>) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`
                    px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer hover:text-slate-200 transition-colors' : ''}
                    ${col.className || ''}
                  `}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-white/[0.03] last:border-0
                  ${onRowClick ? 'cursor-pointer hover:bg-white/[0.04] transition-colors' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-slate-300 ${col.className || ''}`}>
                    {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="px-4 py-12 text-center text-slate-500 text-sm">
          No data found
        </div>
      )}
    </div>
  );
}

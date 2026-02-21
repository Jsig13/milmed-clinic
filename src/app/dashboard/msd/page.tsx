'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassInput from '@/components/ui/GlassInput';
import GlassSelect from '@/components/ui/GlassSelect';
import GlassBadge from '@/components/ui/GlassBadge';
import EmptyState from '@/components/ui/EmptyState';
import {
  searchStandards,
  BODY_SYSTEMS,
  STANDARD_TYPES,
  CHAPTERS,
  type MSDSearchResult,
} from '@/lib/msd-search';

const BODY_SYSTEM_COLORS: Record<string, 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'default'> = {
  Cardiovascular: 'red',
  'Mental Health': 'purple',
  Musculoskeletal: 'amber',
  Neurological: 'purple',
  'Eyes/Vision': 'blue',
  'Ears/Hearing': 'blue',
  Respiratory: 'emerald',
  Gastrointestinal: 'amber',
  Oncologic: 'red',
  Aircrew: 'blue',
};

const STANDARD_TYPE_COLORS: Record<string, 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'default'> = {
  general: 'default',
  accession: 'blue',
  retention: 'amber',
  aircrew: 'emerald',
  special: 'purple',
  army_spec: 'purple',
  other: 'default',
};

const STANDARD_TYPE_LABELS: Record<string, string> = {
  general: 'General',
  accession: 'Accession',
  retention: 'Retention',
  aircrew: 'Aircrew',
  special: 'Special Duty',
  army_spec: 'Army Special',
  other: 'Other',
};

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;

  // Build a regex that matches any term
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (terms.some(t => part.toLowerCase() === t)) {
      return (
        <mark key={i} className="bg-blue-500/30 text-blue-200 rounded px-0.5">
          {part}
        </mark>
      );
    }
    return part;
  });
}

function ResultCard({
  result,
  query,
  isExpanded,
  onToggle,
}: {
  result: MSDSearchResult;
  query: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Truncated content preview (first 200 chars)
  const preview = result.content.length > 200
    ? result.content.slice(0, 200) + '...'
    : result.content;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="mt-0.5 text-slate-500 shrink-0">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-slate-500">{result.section}</span>
            <span className="text-sm font-medium text-slate-200">
              {highlightText(result.title, query)}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <GlassBadge variant={BODY_SYSTEM_COLORS[result.body_system] || 'default'}>
              {result.body_system}
            </GlassBadge>
            <GlassBadge variant={STANDARD_TYPE_COLORS[result.standard_type] || 'default'}>
              {STANDARD_TYPE_LABELS[result.standard_type] || result.standard_type}
            </GlassBadge>
            <span className="text-[10px] text-slate-600">Ch {result.chapter}</span>
          </div>
          {!isExpanded && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
              {highlightText(preview, query)}
            </p>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-11">
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {highlightText(result.content, query)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MSDPage() {
  const [query, setQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [bodySystemFilter, setBodySystemFilter] = useState('');
  const [standardTypeFilter, setStandardTypeFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const filters = {
      chapter: chapterFilter ? Number(chapterFilter) : undefined,
      bodySystem: bodySystemFilter || undefined,
      standardType: standardTypeFilter || undefined,
    };

    return searchStandards(query, filters);
  }, [query, chapterFilter, bodySystemFilter, standardTypeFilter]);

  // Limit displayed results for performance
  const [displayCount, setDisplayCount] = useState(50);
  const displayedResults = useMemo(() => results.slice(0, displayCount), [results, displayCount]);
  const hasMore = results.length > displayCount;

  const toggleExpand = useCallback((sectionId: string) => {
    setExpandedId(prev => (prev === sectionId ? null : sectionId));
  }, []);

  const clearFilters = () => {
    setChapterFilter('');
    setBodySystemFilter('');
    setStandardTypeFilter('');
  };

  const hasActiveFilters = chapterFilter || bodySystemFilter || standardTypeFilter;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AR 40-501 Medical Standards</h1>
          <p className="text-sm text-slate-500 mt-1">
            Standards of Medical Fitness — 242 sections searchable
          </p>
        </div>

        {/* Search + Filters */}
        <GlassPanel>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setDisplayCount(50); }}
                  placeholder="Search section titles and content... (e.g., 'lumbar spine', 'hearing loss', 'diabetes')"
                  className="
                    w-full rounded-xl border border-white/[0.08]
                    bg-white/[0.04] backdrop-blur-xl
                    pl-10 pr-4 py-2.5 text-sm text-slate-200
                    placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30
                    transition-all duration-200
                  "
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all
                  ${hasActiveFilters
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    : 'border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <Filter size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <GlassSelect
                      label="Chapter"
                      value={chapterFilter}
                      onChange={(v) => { setChapterFilter(v); setDisplayCount(50); }}
                      placeholder="All Chapters"
                      options={CHAPTERS.map(c => ({
                        value: String(c),
                        label: `Chapter ${c}`,
                      }))}
                    />
                    <GlassSelect
                      label="Body System"
                      value={bodySystemFilter}
                      onChange={(v) => { setBodySystemFilter(v); setDisplayCount(50); }}
                      placeholder="All Body Systems"
                      options={BODY_SYSTEMS.map(bs => ({
                        value: bs,
                        label: bs,
                      }))}
                    />
                    <GlassSelect
                      label="Standard Type"
                      value={standardTypeFilter}
                      onChange={(v) => { setStandardTypeFilter(v); setDisplayCount(50); }}
                      placeholder="All Types"
                      options={STANDARD_TYPES.map(st => ({
                        value: st.value,
                        label: st.label,
                      }))}
                    />
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassPanel>

        {/* Results count */}
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-500">
            {results.length} {results.length === 1 ? 'section' : 'sections'} found
            {query && ` for "${query}"`}
          </p>
          {query && results.length > 0 && (
            <GlassBadge variant="blue">
              Ranked by relevance
            </GlassBadge>
          )}
        </div>

        {/* Results */}
        {displayedResults.length > 0 ? (
          <div className="space-y-2">
            {displayedResults.map((result) => (
              <ResultCard
                key={result.section}
                result={result}
                query={query}
                isExpanded={expandedId === result.section}
                onToggle={() => toggleExpand(result.section)}
              />
            ))}
            {hasMore && (
              <button
                onClick={() => setDisplayCount(prev => prev + 50)}
                className="w-full py-3 text-sm text-blue-400 hover:text-blue-300 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                Show more ({results.length - displayCount} remaining)
              </button>
            )}
          </div>
        ) : (
          <GlassPanel>
            <EmptyState
              icon={<BookOpen size={32} />}
              title="No Results"
              description={
                query
                  ? `No sections match "${query}". Try different search terms or adjust filters.`
                  : 'Use the search bar above to find medical standards.'
              }
            />
          </GlassPanel>
        )}
      </div>
    </PageTransition>
  );
}

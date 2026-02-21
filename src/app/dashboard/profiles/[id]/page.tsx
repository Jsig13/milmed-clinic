'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Clock, Calendar, Stethoscope, Plus, CheckCircle, Archive, Send, Edit3, BookOpen, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import GlassModal from '@/components/ui/GlassModal';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassInput from '@/components/ui/GlassInput';
import GlassSelect from '@/components/ui/GlassSelect';
import StatusBadge from '@/components/profiles/StatusBadge';
import ProfileTimeline from '@/components/profiles/ProfileTimeline';
import ProfileForm from '@/components/profiles/ProfileForm';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES, MOCK_DOCUMENTS } from '@/lib/mock-data';
import { Profile, DocumentRecord } from '@/lib/types';
import { getDaysActive, getDurationBgColor, generateId } from '@/lib/profile-utils';
import { PROFILE_STATUSES } from '@/lib/constants';
import { getRetentionStandards, getAircrewStandards, searchStandards, type MSDSearchResult } from '@/lib/msd-search';

const STANDARD_TYPE_LABELS: Record<string, string> = {
  general: 'General', accession: 'Accession', retention: 'Retention',
  aircrew: 'Aircrew', special: 'Special Duty', army_spec: 'Army Special', other: 'Other',
};

function MSDResultItem({
  result,
  isExpanded,
  onToggle,
}: {
  result: MSDSearchResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="mt-0.5 text-slate-500 shrink-0">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500">{result.section}</span>
            <span className="text-sm font-medium text-slate-200">{result.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <GlassBadge variant="default">{result.body_system}</GlassBadge>
            <GlassBadge variant="amber">
              {STANDARD_TYPE_LABELS[result.standard_type] || result.standard_type}
            </GlassBadge>
          </div>
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
            <div className="px-3 pb-3 pl-9">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {result.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);
  const [documents] = useLocalStorage<DocumentRecord[]>('milmed-documents', MOCK_DOCUMENTS);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [msdQuery, setMsdQuery] = useState('');
  const [expandedMsdSection, setExpandedMsdSection] = useState<string | null>(null);

  const profile = useMemo(() => profiles.find((p) => p.id === id), [profiles, id]);
  const profileDocs = useMemo(
    () => documents.filter((d) => d.profileId === id),
    [documents, id]
  );

  // Auto-search retention standards based on primary condition
  const autoRetentionResults = useMemo(() => {
    if (!profile) return [];
    return getRetentionStandards(profile.primaryCondition).slice(0, 5);
  }, [profile]);

  // Auto-search aircrew standards if the member has a flying AFSC
  const autoAircrewResults = useMemo(() => {
    if (!profile) return [];
    const afscCode = profile.afsc.split(' - ')[0];
    const flyingAfscs = ['11X', '12X', '13B', '1A0X1', '1A1X1', '1A2X1', '1A3X1'];
    if (!flyingAfscs.some(fa => afscCode.startsWith(fa.replace('X', '')) || afscCode === fa)) return [];
    return getAircrewStandards(profile.primaryCondition).slice(0, 5);
  }, [profile]);

  // Manual MSD search results
  const msdSearchResults = useMemo(() => {
    if (!msdQuery.trim()) return [];
    return searchStandards(msdQuery).slice(0, 20);
  }, [msdQuery]);

  if (!profile) {
    return (
      <PageTransition>
        <div className="text-center py-20">
          <p className="text-slate-500">Profile not found</p>
          <Link href="/dashboard/profiles">
            <GlassButton variant="primary" className="mt-4">Back to Profiles</GlassButton>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const days = getDaysActive(profile.startDate);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const updatedProfiles = profiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        notes: [...p.notes, {
          id: generateId(),
          profileId: id,
          date: new Date().toISOString(),
          author: 'Maj Josh Reissig',
          type: 'note' as const,
          content: noteText,
        }],
        updatedAt: new Date().toISOString(),
      };
    });
    setProfiles(updatedProfiles);
    setNoteText('');
    setShowNoteModal(false);
  };

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    const updatedProfiles = profiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: newStatus,
        notes: [...p.notes, {
          id: generateId(),
          profileId: id,
          date: new Date().toISOString(),
          author: 'Maj Josh Reissig',
          type: 'status_change' as const,
          content: `Status changed to: ${newStatus}`,
        }],
        updatedAt: new Date().toISOString(),
      };
    });
    setProfiles(updatedProfiles);
    setNewStatus('');
    setShowStatusModal(false);
  };

  const handleEditProfile = (updated: Profile) => {
    setProfiles(profiles.map((p) => p.id === id ? updated : p));
    setShowEditModal(false);
  };

  const handleResolve = () => {
    const updatedProfiles = profiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: 'Resolved',
        notes: [...p.notes, {
          id: generateId(),
          profileId: id,
          date: new Date().toISOString(),
          author: 'Maj Josh Reissig',
          type: 'status_change' as const,
          content: 'Profile resolved',
        }],
        updatedAt: new Date().toISOString(),
      };
    });
    setProfiles(updatedProfiles);
  };

  const handleArchive = () => {
    const updatedProfiles = profiles.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: 'Archived',
        updatedAt: new Date().toISOString(),
      };
    });
    setProfiles(updatedProfiles);
  };

  const msdVariant = profile.msdStatus === 'Meets Standards' ? 'emerald'
    : profile.msdStatus === 'Does Not Meet' ? 'red'
    : 'amber';

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">{profile.rank} {profile.name}</h1>
              <StatusBadge status={profile.status} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{profile.afsc} | {profile.unit}</p>
          </div>
          <GlassButton onClick={() => setShowEditModal(true)}>
            <Edit3 size={14} /> Edit
          </GlassButton>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassPanel padding="p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Profile Type</p>
            <GlassBadge variant="blue">{profile.profileType}</GlassBadge>
          </GlassPanel>
          <GlassPanel padding="p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Days on Profile</p>
            <span className={`text-2xl font-bold ${getDurationBgColor(days).includes('red') ? 'text-red-400' : getDurationBgColor(days).includes('amber') ? 'text-amber-400' : 'text-emerald-400'}`}>
              {days}
            </span>
          </GlassPanel>
          <GlassPanel padding="p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Duration</p>
            <p className="text-sm text-slate-300">
              {format(new Date(profile.startDate), 'dd MMM yyyy')}
              {profile.expectedResolutionDate && (
                <> → {format(new Date(profile.expectedResolutionDate), 'dd MMM yyyy')}</>
              )}
            </p>
          </GlassPanel>
          <GlassPanel padding="p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Provider</p>
            <p className="text-sm text-slate-300">{profile.assignedProvider}</p>
          </GlassPanel>
        </div>

        {/* Primary Condition + MSD Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Primary Condition</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{profile.primaryCondition}</p>
          </GlassPanel>
          <GlassPanel>
            <h2 className="text-sm font-semibold text-slate-300 mb-3">MSD Compliance</h2>
            <div className="flex items-center gap-3">
              <GlassBadge variant={msdVariant}>
                {profile.msdStatus || 'Pending Review'}
              </GlassBadge>
              <Link href="/dashboard/msd">
                <GlassButton size="sm">
                  <BookOpen size={14} /> Full MSD Reference
                </GlassButton>
              </Link>
            </div>
          </GlassPanel>
        </div>

        {/* Relevant Standards (auto-search) */}
        {autoRetentionResults.length > 0 && (
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope size={16} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-300">
                Relevant Retention Standards (AR 40-501, Ch 3)
              </h2>
              <GlassBadge variant="amber">{autoRetentionResults.length} found</GlassBadge>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Auto-matched based on condition: &quot;{profile.primaryCondition}&quot;
            </p>
            <div className="space-y-2">
              {autoRetentionResults.map((result) => (
                <MSDResultItem
                  key={result.section}
                  result={result}
                  isExpanded={expandedMsdSection === `auto-${result.section}`}
                  onToggle={() => setExpandedMsdSection(
                    expandedMsdSection === `auto-${result.section}` ? null : `auto-${result.section}`
                  )}
                />
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Aircrew Standards (if applicable) */}
        {autoAircrewResults.length > 0 && (
          <GlassPanel>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-300">
                Relevant Aircrew Standards (AR 40-501, Ch 4-6)
              </h2>
              <GlassBadge variant="emerald">{autoAircrewResults.length} found</GlassBadge>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Aircrew-specific standards for {profile.afsc}
            </p>
            <div className="space-y-2">
              {autoAircrewResults.map((result) => (
                <MSDResultItem
                  key={result.section}
                  result={result}
                  isExpanded={expandedMsdSection === `aircrew-${result.section}`}
                  onToggle={() => setExpandedMsdSection(
                    expandedMsdSection === `aircrew-${result.section}` ? null : `aircrew-${result.section}`
                  )}
                />
              ))}
            </div>
          </GlassPanel>
        )}

        {/* MSD Search */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-300">MSD Check — Search AR 40-501</h2>
          </div>
          <GlassInput
            label="Search medical standards"
            value={msdQuery}
            onChange={setMsdQuery}
            placeholder="Search by condition, body system, or keyword..."
          />
          {msdSearchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-500">{msdSearchResults.length} results</p>
              {msdSearchResults.map((result) => (
                <MSDResultItem
                  key={result.section}
                  result={result}
                  isExpanded={expandedMsdSection === `search-${result.section}`}
                  onToggle={() => setExpandedMsdSection(
                    expandedMsdSection === `search-${result.section}` ? null : `search-${result.section}`
                  )}
                />
              ))}
            </div>
          )}
          {msdQuery.trim() && msdSearchResults.length === 0 && (
            <p className="text-xs text-slate-600 mt-3">No matching standards found for &quot;{msdQuery}&quot;</p>
          )}
        </GlassPanel>

        {/* Timeline */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Timeline</h2>
            <GlassButton size="sm" variant="primary" onClick={() => setShowNoteModal(true)}>
              <Plus size={14} /> Add Note
            </GlassButton>
          </div>
          <ProfileTimeline notes={profile.notes} />
        </GlassPanel>

        {/* Documents */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">Documents</h2>
            <Link href="/dashboard/documents">
              <GlassButton size="sm" variant="primary">
                <Plus size={14} /> Generate Document
              </GlassButton>
            </Link>
          </div>
          {profileDocs.length > 0 ? (
            <div className="space-y-2">
              {profileDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.subject}</p>
                  </div>
                  <span className="text-[10px] text-slate-600">{format(new Date(doc.createdAt), 'dd MMM yyyy')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 text-center py-6">No documents generated yet</p>
          )}
        </GlassPanel>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <GlassButton variant="warning" onClick={() => setShowStatusModal(true)}>
            <Clock size={14} /> Update Status
          </GlassButton>
          <GlassButton>
            <Send size={14} /> Send to PEBLO
          </GlassButton>
          <GlassButton variant="success" onClick={handleResolve}>
            <CheckCircle size={14} /> Resolve Profile
          </GlassButton>
          <GlassButton variant="danger" onClick={handleArchive}>
            <Archive size={14} /> Archive
          </GlassButton>
        </div>

        {/* Add Note Modal */}
        <GlassModal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Add Note" size="md">
          <div className="space-y-4">
            <GlassTextarea label="Note" value={noteText} onChange={setNoteText} placeholder="Enter your note..." rows={4} />
            <div className="flex justify-end gap-3">
              <GlassButton onClick={() => setShowNoteModal(false)}>Cancel</GlassButton>
              <GlassButton variant="primary" onClick={handleAddNote}>Save Note</GlassButton>
            </div>
          </div>
        </GlassModal>

        {/* Update Status Modal */}
        <GlassModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Status" size="sm">
          <div className="space-y-4">
            <GlassSelect
              label="New Status"
              value={newStatus}
              onChange={setNewStatus}
              placeholder="Select status"
              options={PROFILE_STATUSES.map((s) => ({ value: s, label: s }))}
            />
            <div className="flex justify-end gap-3">
              <GlassButton onClick={() => setShowStatusModal(false)}>Cancel</GlassButton>
              <GlassButton variant="primary" onClick={handleStatusUpdate}>Update</GlassButton>
            </div>
          </div>
        </GlassModal>

        {/* Edit Profile Modal */}
        <GlassModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile" size="xl">
          <ProfileForm profile={profile} onSubmit={handleEditProfile} onCancel={() => setShowEditModal(false)} />
        </GlassModal>
      </div>
    </PageTransition>
  );
}

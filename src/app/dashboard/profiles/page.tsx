'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import GlassButton from '@/components/ui/GlassButton';
import GlassModal from '@/components/ui/GlassModal';
import GlassTable from '@/components/ui/GlassTable';
import ProfileFilters from '@/components/profiles/ProfileFilters';
import ProfileForm from '@/components/profiles/ProfileForm';
import StatusBadge from '@/components/profiles/StatusBadge';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Profile } from '@/lib/types';
import { getDaysActive, getDurationBgColor } from '@/lib/profile-utils';

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = [...profiles];

    if (typeFilter) result = result.filter((p) => p.profileType === typeFilter);
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    if (durationFilter) {
      const days = parseInt(durationFilter);
      result = result.filter((p) => getDaysActive(p.startDate) > days);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';
        if (sortKey === 'daysActive') {
          aVal = getDaysActive(a.startDate);
          bVal = getDaysActive(b.startDate);
        } else {
          aVal = String((a as unknown as Record<string, unknown>)[sortKey] ?? '');
          bVal = String((b as unknown as Record<string, unknown>)[sortKey] ?? '');
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [profiles, typeFilter, statusFilter, durationFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleAddProfile = (profile: Profile) => {
    setProfiles((prev) => [profile, ...prev]);
    setShowAddModal(false);
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (p: Profile) => (
      <span className="font-medium text-slate-200">{p.rank} {p.name}</span>
    )},
    { key: 'afsc', label: 'AFSC', sortable: true, render: (p: Profile) => (
      <span className="text-xs">{p.afsc.split(' - ')[0]}</span>
    )},
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'profileType', label: 'Type', sortable: true, render: (p: Profile) => (
      <span className="text-xs">{p.profileType}</span>
    )},
    { key: 'startDate', label: 'Start', sortable: true, render: (p: Profile) => (
      <span className="text-xs text-slate-400">{p.startDate}</span>
    )},
    { key: 'daysActive', label: 'Days', sortable: true, className: 'text-center', render: (p: Profile) => {
      const days = getDaysActive(p.startDate);
      return (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getDurationBgColor(days)}`}>
          {days}
        </span>
      );
    }},
    { key: 'status', label: 'Status', sortable: true, render: (p: Profile) => (
      <StatusBadge status={p.status} />
    )},
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Profile Tracker</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} profiles found</p>
          </div>
          <GlassButton variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Profile
          </GlassButton>
        </div>

        <ProfileFilters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          durationFilter={durationFilter}
          searchQuery={searchQuery}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onDurationChange={setDurationFilter}
          onSearchChange={setSearchQuery}
        />

        <GlassTable
          columns={columns}
          data={filtered}
          onRowClick={(p) => router.push(`/dashboard/profiles/${p.id}`)}
          sortKey={sortKey}
          sortDirection={sortDir}
          onSort={handleSort}
          keyExtractor={(p) => p.id}
        />

        <GlassModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Profile" size="xl">
          <ProfileForm onSubmit={handleAddProfile} onCancel={() => setShowAddModal(false)} />
        </GlassModal>
      </div>
    </PageTransition>
  );
}

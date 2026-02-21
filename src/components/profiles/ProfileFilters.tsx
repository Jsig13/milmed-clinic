'use client';

import GlassSelect from '@/components/ui/GlassSelect';
import GlassInput from '@/components/ui/GlassInput';
import { PROFILE_TYPES, PROFILE_STATUSES } from '@/lib/constants';

interface ProfileFiltersProps {
  typeFilter: string;
  statusFilter: string;
  durationFilter: string;
  searchQuery: string;
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onDurationChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export default function ProfileFilters({
  typeFilter,
  statusFilter,
  durationFilter,
  searchQuery,
  onTypeChange,
  onStatusChange,
  onDurationChange,
  onSearchChange,
}: ProfileFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <GlassSelect
        label="Profile Type"
        value={typeFilter}
        onChange={onTypeChange}
        placeholder="All Types"
        options={PROFILE_TYPES.map((t) => ({ value: t, label: t }))}
        className="w-44"
      />
      <GlassSelect
        label="Status"
        value={statusFilter}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={PROFILE_STATUSES.map((s) => ({ value: s, label: s }))}
        className="w-44"
      />
      <GlassSelect
        label="Duration"
        value={durationFilter}
        onChange={onDurationChange}
        placeholder="All"
        options={[
          { value: '30', label: '> 30 Days' },
          { value: '60', label: '> 60 Days' },
          { value: '90', label: '> 90 Days' },
        ]}
        className="w-36"
      />
      <GlassInput
        label="Search"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Name or rank..."
        className="w-48"
      />
    </div>
  );
}

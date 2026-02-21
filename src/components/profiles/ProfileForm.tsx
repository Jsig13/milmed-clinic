'use client';

import { useState } from 'react';
import GlassInput from '@/components/ui/GlassInput';
import GlassSelect from '@/components/ui/GlassSelect';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassButton from '@/components/ui/GlassButton';
import { ALL_RANKS, COMMON_AFSCS, PROFILE_TYPES, PROFILE_STATUSES } from '@/lib/constants';
import { TEAM_MEMBERS } from '@/lib/mock-data';
import { Profile } from '@/lib/types';
import { generateId } from '@/lib/profile-utils';

interface ProfileFormProps {
  profile?: Profile;
  onSubmit: (profile: Profile) => void;
  onCancel: () => void;
}

export default function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || '');
  const [rank, setRank] = useState(profile?.rank || '');
  const [afsc, setAfsc] = useState(profile?.afsc || '');
  const [unit, setUnit] = useState(profile?.unit || '');
  const [profileType, setProfileType] = useState(profile?.profileType || '');
  const [startDate, setStartDate] = useState(profile?.startDate || '');
  const [expectedResolutionDate, setExpectedResolutionDate] = useState(profile?.expectedResolutionDate || '');
  const [primaryCondition, setPrimaryCondition] = useState(profile?.primaryCondition || '');
  const [assignedProvider, setAssignedProvider] = useState(profile?.assignedProvider || '');
  const [status, setStatus] = useState(profile?.status || 'Active');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newProfile: Profile = {
      id: profile?.id || generateId(),
      name,
      rank,
      afsc,
      unit,
      profileType,
      startDate,
      expectedResolutionDate: expectedResolutionDate || undefined,
      primaryCondition,
      assignedProvider,
      status,
      notes: profile?.notes || (notes ? [{
        id: generateId(),
        profileId: profile?.id || '',
        date: now,
        author: 'Maj Josh Reissig',
        type: 'note' as const,
        content: notes,
      }] : []),
      documents: profile?.documents || [],
      createdAt: profile?.createdAt || now,
      updatedAt: now,
    };
    onSubmit(newProfile);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <GlassInput label="Name (Last, First)" value={name} onChange={setName} placeholder="Smith, John" required />
        <GlassSelect
          label="Rank"
          value={rank}
          onChange={setRank}
          placeholder="Select rank"
          options={ALL_RANKS.map((r) => ({ value: r, label: r }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GlassSelect
          label="AFSC"
          value={afsc}
          onChange={setAfsc}
          placeholder="Select AFSC"
          options={COMMON_AFSCS.map((a) => ({ value: a, label: a }))}
          required
        />
        <GlassInput label="Unit" value={unit} onChange={setUnit} placeholder="62nd Airlift Wing" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GlassSelect
          label="Profile Type"
          value={profileType}
          onChange={setProfileType}
          placeholder="Select type"
          options={PROFILE_TYPES.map((t) => ({ value: t, label: t }))}
          required
        />
        <GlassSelect
          label="Status"
          value={status}
          onChange={setStatus}
          placeholder="Select status"
          options={PROFILE_STATUSES.map((s) => ({ value: s, label: s }))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GlassInput label="Start Date" value={startDate} onChange={setStartDate} type="date" required />
        <GlassInput label="Expected Resolution Date" value={expectedResolutionDate} onChange={setExpectedResolutionDate} type="date" />
      </div>
      <GlassInput label="Primary Diagnosis / Condition" value={primaryCondition} onChange={setPrimaryCondition} placeholder="Description of condition" required />
      <GlassSelect
        label="Assigned Provider"
        value={assignedProvider}
        onChange={setAssignedProvider}
        placeholder="Select provider"
        options={TEAM_MEMBERS.filter((m) => m.role !== 'Staff').map((m) => ({ value: m.name, label: m.name }))}
        required
      />
      {!profile && (
        <GlassTextarea label="Initial Notes" value={notes} onChange={setNotes} placeholder="Initial evaluation notes..." rows={3} />
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
        <GlassButton onClick={onCancel}>Cancel</GlassButton>
        <GlassButton variant="primary" onClick={handleSubmit}>
          {profile ? 'Update Profile' : 'Add Profile'}
        </GlassButton>
      </div>
    </div>
  );
}

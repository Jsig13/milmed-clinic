'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Search, Upload, UserCheck } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import GlassSelect from '@/components/ui/GlassSelect';
import EmptyState from '@/components/ui/EmptyState';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { COMMON_AFSCS } from '@/lib/constants';
import { Profile } from '@/lib/types';

const MSD_STANDARDS = [
  { afsc: '11X', condition: 'Visual Acuity', standard: '20/20 correctable to 20/20', category: 'Vision' },
  { afsc: '11X', condition: 'Color Vision', standard: 'Normal color vision required', category: 'Vision' },
  { afsc: '11X', condition: 'Hearing', standard: 'H1 profile minimum', category: 'Hearing' },
  { afsc: '11X', condition: 'Cardiovascular', standard: 'No history of coronary artery disease', category: 'Cardiac' },
  { afsc: '12X', condition: 'Visual Acuity', standard: '20/200 correctable to 20/20', category: 'Vision' },
  { afsc: '12X', condition: 'Hearing', standard: 'H2 profile minimum', category: 'Hearing' },
  { afsc: '1A2X1', condition: 'Lifting', standard: 'Must be able to lift 70lbs', category: 'Physical' },
  { afsc: '1A2X1', condition: 'Visual Acuity', standard: '20/200 correctable to 20/20', category: 'Vision' },
  { afsc: '1T0X1', condition: 'Physical Fitness', standard: 'Must pass tier 2 fitness test', category: 'Physical' },
  { afsc: '3E7X1', condition: 'Respiratory', standard: 'No chronic respiratory conditions', category: 'Pulmonary' },
  { afsc: '4N0X1', condition: 'Lifting', standard: 'Must be able to lift 40lbs', category: 'Physical' },
];

export default function MSDPage() {
  const [profiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);
  const [searchAfsc, setSearchAfsc] = useState('');
  const [searchCondition, setSearchCondition] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');

  const filteredStandards = useMemo(() => {
    let results = MSD_STANDARDS;
    if (searchAfsc) {
      results = results.filter((s) => s.afsc.toLowerCase().includes(searchAfsc.toLowerCase()));
    }
    if (searchCondition) {
      results = results.filter((s) =>
        s.condition.toLowerCase().includes(searchCondition.toLowerCase()) ||
        s.category.toLowerCase().includes(searchCondition.toLowerCase())
      );
    }
    return results;
  }, [searchAfsc, searchCondition]);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === selectedProfileId),
    [profiles, selectedProfileId]
  );

  const profileStandards = useMemo(() => {
    if (!selectedProfile) return [];
    const afscCode = selectedProfile.afsc.split(' - ')[0];
    return MSD_STANDARDS.filter((s) => afscCode.includes(s.afsc));
  }, [selectedProfile]);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">MSD Reference</h1>
          <p className="text-sm text-slate-500 mt-1">Medical Standards Directory — search by AFSC or condition</p>
        </div>

        {/* Upload section */}
        <GlassPanel>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Upload size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-200">Upload MSD Document</h3>
              <p className="text-xs text-slate-500">Upload the latest MSD for enhanced reference checking</p>
            </div>
            <GlassButton>Upload MSD</GlassButton>
          </div>
        </GlassPanel>

        {/* Search */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Search Standards</h2>
            <div className="space-y-3">
              <GlassInput
                label="Search by AFSC"
                value={searchAfsc}
                onChange={setSearchAfsc}
                placeholder="e.g., 11X, 1A2X1"
              />
              <GlassInput
                label="Search by Condition"
                value={searchCondition}
                onChange={setSearchCondition}
                placeholder="e.g., Vision, Hearing"
              />
            </div>
            <div className="mt-4 space-y-2">
              {filteredStandards.map((std, index) => (
                <motion.div
                  key={`${std.afsc}-${std.condition}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <GlassBadge variant="blue">{std.afsc}</GlassBadge>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{std.condition}</p>
                    <p className="text-xs text-slate-500">{std.standard}</p>
                  </div>
                  <GlassBadge variant="default">{std.category}</GlassBadge>
                </motion.div>
              ))}
              {filteredStandards.length === 0 && (
                <p className="text-sm text-slate-600 text-center py-4">No matching standards found</p>
              )}
            </div>
          </GlassPanel>

          {/* Check Member */}
          <GlassPanel>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Check Member</h2>
            <GlassSelect
              label="Select Profile"
              value={selectedProfileId}
              onChange={setSelectedProfileId}
              placeholder="Choose a member to check"
              options={profiles
                .filter((p) => p.status !== 'Resolved' && p.status !== 'Archived')
                .map((p) => ({ value: p.id, label: `${p.rank} ${p.name}` }))}
            />
            {selectedProfile ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <UserCheck size={16} className="text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{selectedProfile.rank} {selectedProfile.name}</p>
                    <p className="text-xs text-slate-500">{selectedProfile.afsc}</p>
                  </div>
                  <GlassBadge variant={
                    selectedProfile.msdStatus === 'Meets Standards' ? 'emerald' :
                    selectedProfile.msdStatus === 'Does Not Meet' ? 'red' : 'amber'
                  }>
                    {selectedProfile.msdStatus || 'Pending Review'}
                  </GlassBadge>
                </div>
                <p className="text-xs text-slate-400">
                  Condition: {selectedProfile.primaryCondition}
                </p>
                {profileStandards.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Applicable Standards</p>
                    {profileStandards.map((std) => (
                      <div key={`${std.afsc}-${std.condition}`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02]">
                        <span className="text-xs text-slate-300">{std.condition}</span>
                        <span className="text-xs text-slate-500 flex-1">{std.standard}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">No specific MSD standards found for this AFSC</p>
                )}
              </div>
            ) : (
              <EmptyState
                icon={<Search size={32} />}
                title="Select a Member"
                description="Choose a tracked profile to check against MSD standards"
              />
            )}
          </GlassPanel>
        </div>
      </div>
    </PageTransition>
  );
}

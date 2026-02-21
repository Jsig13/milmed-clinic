'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Users, AlertTriangle, Clock, FileText, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import PageTransition from '@/components/layout/PageTransition';
import StatCard from '@/components/ui/StatCard';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES, MOCK_DOCUMENTS } from '@/lib/mock-data';
import { Profile, DocumentRecord } from '@/lib/types';
import { getDaysActive, getDurationBgColor, generateAlerts } from '@/lib/profile-utils';
import StatusBadge from '@/components/profiles/StatusBadge';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [profiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);
  const [documents] = useLocalStorage<DocumentRecord[]>('milmed-documents', MOCK_DOCUMENTS);

  const activeProfiles = useMemo(
    () => profiles.filter((p) => p.status !== 'Resolved' && p.status !== 'Archived'),
    [profiles]
  );

  const over90 = useMemo(
    () => activeProfiles.filter((p) => getDaysActive(p.startDate) > 90),
    [activeProfiles]
  );

  const overdue = useMemo(
    () => activeProfiles.filter((p) => getDaysActive(p.startDate) >= 60),
    [activeProfiles]
  );

  const recentDocs = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return documents.filter((d) => new Date(d.createdAt) >= oneWeekAgo);
  }, [documents]);

  const alerts = useMemo(() => generateAlerts(profiles), [profiles]);

  const recentProfiles = useMemo(
    () => [...profiles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
    [profiles]
  );

  const recentDocsList = useMemo(
    () => [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [documents]
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Clinic overview and alerts</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/profiles">
              <GlassButton variant="primary">
                <Plus size={16} /> Add Profile
              </GlassButton>
            </Link>
            <Link href="/dashboard/documents">
              <GlassButton>
                <FileText size={16} /> Generate Document
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Profiles"
            value={activeProfiles.length}
            icon={<Users size={24} />}
            color="blue"
          />
          <StatCard
            label="Profiles >90 Days"
            value={over90.length}
            icon={<AlertTriangle size={24} />}
            color="red"
            pulse={over90.length > 0}
          />
          <StatCard
            label="Overdue Actions"
            value={overdue.length}
            icon={<Clock size={24} />}
            color="amber"
          />
          <StatCard
            label="Docs This Week"
            value={recentDocs.length}
            icon={<FileText size={24} />}
            color="emerald"
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <GlassPanel>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Alerts</h2>
            <div className="space-y-2">
              {alerts.slice(0, 6).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/dashboard/profiles/${alert.profileId}`)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                    transition-colors hover:bg-white/[0.04]
                    border ${alert.severity === 'red'
                      ? 'border-red-500/20 bg-red-500/[0.05]'
                      : alert.severity === 'amber'
                        ? 'border-amber-500/20 bg-amber-500/[0.05]'
                        : 'border-emerald-500/20 bg-emerald-500/[0.05]'
                    }
                  `}
                >
                  <AlertTriangle
                    size={16}
                    className={
                      alert.severity === 'red'
                        ? 'text-red-400'
                        : alert.severity === 'amber'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                    }
                  />
                  <span className="flex-1 text-sm text-slate-300">{alert.message}</span>
                  <GlassBadge variant={alert.severity === 'red' ? 'red' : alert.severity === 'amber' ? 'amber' : 'emerald'}>
                    {alert.daysActive}d
                  </GlassBadge>
                  <ChevronRight size={14} className="text-slate-600" />
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Recent Profiles + Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">Recent Profiles</h2>
              <Link href="/dashboard/profiles">
                <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">View all</span>
              </Link>
            </div>
            <div className="space-y-2">
              {recentProfiles.map((profile, index) => {
                const days = getDaysActive(profile.startDate);
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/dashboard/profiles/${profile.id}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-200">{profile.rank} {profile.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{profile.profileType}</span>
                        <StatusBadge status={profile.status} />
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getDurationBgColor(days)}`}>
                      {days}d
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300">Recent Documents</h2>
              <Link href="/dashboard/documents">
                <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">View all</span>
              </Link>
            </div>
            <div className="space-y-2">
              {recentDocsList.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <FileText size={16} className="text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-200">{doc.title}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.subject}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 shrink-0">
                    {format(new Date(doc.createdAt), 'dd MMM')}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </PageTransition>
  );
}

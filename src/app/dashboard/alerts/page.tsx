'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Check, ChevronRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import GlassSelect from '@/components/ui/GlassSelect';
import EmptyState from '@/components/ui/EmptyState';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Profile, Alert } from '@/lib/types';
import { generateAlerts } from '@/lib/profile-utils';

export default function AlertsPage() {
  const router = useRouter();
  const [profiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);
  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<string[]>('milmed-dismissed-alerts', []);
  const [filter, setFilter] = useState('');

  const allAlerts = useMemo(() => generateAlerts(profiles), [profiles]);

  const filtered = useMemo(() => {
    let results = allAlerts;

    if (filter === 'overdue') {
      results = results.filter((a) => a.severity === 'red');
    } else if (filter === 'upcoming') {
      results = results.filter((a) => a.severity === 'amber');
    } else if (filter === 'dismissed') {
      return allAlerts.filter((a) => dismissedAlerts.includes(a.id));
    }

    return results.filter((a) => !dismissedAlerts.includes(a.id));
  }, [allAlerts, filter, dismissedAlerts]);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId]);
  };

  const severityConfig = {
    red: { bg: 'border-red-500/20 bg-red-500/[0.05]', text: 'text-red-400', icon: 'text-red-400' },
    amber: { bg: 'border-amber-500/20 bg-amber-500/[0.05]', text: 'text-amber-400', icon: 'text-amber-400' },
    green: { bg: 'border-emerald-500/20 bg-emerald-500/[0.05]', text: 'text-emerald-400', icon: 'text-emerald-400' },
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Alerts</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} active alerts</p>
          </div>
          <GlassSelect
            value={filter}
            onChange={setFilter}
            placeholder="All Alerts"
            options={[
              { value: 'overdue', label: 'Overdue (Red)' },
              { value: 'upcoming', label: 'Upcoming (Amber)' },
              { value: 'dismissed', label: 'Dismissed' },
            ]}
            className="w-44"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const isDismissed = dismissedAlerts.includes(alert.id);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`
                    rounded-xl border ${config.bg} p-4
                    ${isDismissed ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className={`${config.icon} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${config.text}`}>{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.action}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <GlassBadge variant={alert.severity === 'red' ? 'red' : alert.severity === 'amber' ? 'amber' : 'emerald'}>
                          {alert.daysActive} days
                        </GlassBadge>
                        <GlassBadge variant="default">{alert.profileType}</GlassBadge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!isDismissed && (
                        <GlassButton size="sm" onClick={() => handleDismiss(alert.id)}>
                          <Check size={12} /> Dismiss
                        </GlassButton>
                      )}
                      <GlassButton
                        size="sm"
                        variant="primary"
                        onClick={() => router.push(`/dashboard/profiles/${alert.profileId}`)}
                      >
                        View <ChevronRight size={12} />
                      </GlassButton>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <GlassPanel>
            <EmptyState
              icon={<Bell size={40} />}
              title="No Alerts"
              description={filter ? 'No alerts match the current filter' : 'All clear — no active alerts'}
            />
          </GlassPanel>
        )}
      </div>
    </PageTransition>
  );
}

'use client';

import { useMemo } from 'react';
import AmbientBackground from '@/components/layout/AmbientBackground';
import Sidebar from '@/components/layout/Sidebar';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Profile } from '@/lib/types';
import { generateAlerts } from '@/lib/profile-utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profiles] = useLocalStorage<Profile[]>('milmed-profiles', MOCK_PROFILES);

  const activeCount = useMemo(
    () => profiles.filter((p) => p.status !== 'Resolved' && p.status !== 'Archived').length,
    [profiles]
  );

  const alertCount = useMemo(
    () => generateAlerts(profiles).length,
    [profiles]
  );

  return (
    <div className="min-h-screen">
      <AmbientBackground />
      <Sidebar activeProfileCount={activeCount} alertCount={alertCount} />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

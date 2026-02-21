'use client';

import { getStatusColor } from '@/lib/profile-utils';
import GlassBadge from '@/components/ui/GlassBadge';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <GlassBadge variant="custom" className={getStatusColor(status)}>
      {status}
    </GlassBadge>
  );
}

'use client';

import { motion } from 'framer-motion';
import { User, Clock, ChevronRight } from 'lucide-react';
import { Profile } from '@/lib/types';
import { getDaysActive, getDurationColor, getDurationBgColor } from '@/lib/profile-utils';
import StatusBadge from './StatusBadge';

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
}

export default function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const days = getDaysActive(profile.startDate);
  const durationColor = getDurationColor(days);

  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.06)' }}
      onClick={onClick}
      className="
        rounded-xl border border-white/[0.06] bg-white/[0.03]
        backdrop-blur-xl p-4 cursor-pointer transition-colors
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
          <User size={18} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-200">{profile.rank} {profile.name}</span>
            <StatusBadge status={profile.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{profile.afsc.split(' - ')[0]}</span>
            <span>{profile.unit}</span>
            <span>{profile.profileType}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${getDurationBgColor(days)}`}>
            <Clock size={12} />
            {days}d
          </div>
          <ChevronRight size={16} className="text-slate-600" />
        </div>
      </div>
    </motion.div>
  );
}

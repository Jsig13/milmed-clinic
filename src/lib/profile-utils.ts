import { differenceInDays } from 'date-fns';
import type { Profile, Alert } from './types';

export function getDaysActive(startDate: string): number {
  return differenceInDays(new Date(), new Date(startDate));
}

export function getDurationColor(days: number): string {
  if (days > 90) return 'text-red-500';
  if (days >= 60) return 'text-amber-500';
  return 'text-emerald-500';
}

export function getDurationBgColor(days: number): string {
  if (days > 90) return 'bg-red-500/20 text-red-400';
  if (days >= 60) return 'bg-amber-500/20 text-amber-400';
  return 'bg-emerald-500/20 text-emerald-400';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Pending Resolution':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Referred to MEB':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Awaiting PEBLO':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Resolved':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Archived':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getAlertSeverity(days: number): 'red' | 'amber' | 'green' {
  if (days > 90) return 'red';
  if (days >= 60) return 'amber';
  return 'green';
}

export function generateAlerts(profiles: Profile[]): Alert[] {
  const alerts: Alert[] = [];

  for (const profile of profiles) {
    if (profile.status === 'Resolved' || profile.status === 'Archived') continue;

    const days = getDaysActive(profile.startDate);
    const severity = getAlertSeverity(days);

    if (days > 90) {
      alerts.push({
        id: `alert-${profile.id}-overdue`,
        severity: 'red',
        message: `${profile.rank} ${profile.name} — ${profile.profileType} at ${days} days, needs resolution`,
        profileId: profile.id,
        profileName: profile.name,
        profileRank: profile.rank,
        profileType: profile.profileType,
        daysActive: days,
        action: 'Review and resolve immediately',
        date: new Date().toISOString(),
        read: false,
      });
    } else if (days >= 60) {
      alerts.push({
        id: `alert-${profile.id}-approaching`,
        severity: 'amber',
        message: `${profile.rank} ${profile.name} — ${profile.profileType} approaching 90-day limit (${days} days)`,
        profileId: profile.id,
        profileName: profile.name,
        profileRank: profile.rank,
        profileType: profile.profileType,
        daysActive: days,
        action: 'Plan for resolution before 90 days',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (profile.status === 'Awaiting PEBLO') {
      alerts.push({
        id: `alert-${profile.id}-peblo`,
        severity,
        message: `${profile.rank} ${profile.name} — Awaiting PEBLO action`,
        profileId: profile.id,
        profileName: profile.name,
        profileRank: profile.rank,
        profileType: profile.profileType,
        daysActive: days,
        action: 'Follow up with PEBLO',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (profile.status === 'Referred to MEB' && days > 60) {
      alerts.push({
        id: `alert-${profile.id}-meb`,
        severity: 'amber',
        message: `${profile.rank} ${profile.name} — MEB referral pending (${days} days on profile)`,
        profileId: profile.id,
        profileName: profile.name,
        profileRank: profile.rank,
        profileType: profile.profileType,
        daysActive: days,
        action: 'Follow up on MEB status',
        date: new Date().toISOString(),
        read: false,
      });
    }
  }

  return alerts.sort((a, b) => {
    const severityOrder = { red: 0, amber: 1, green: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Settings, Plus, Trash2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import GlassPanel from '@/components/ui/GlassPanel';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';
import GlassBadge from '@/components/ui/GlassBadge';
import GlassSelect from '@/components/ui/GlassSelect';
import GlassTextarea from '@/components/ui/GlassTextarea';
import GlassModal from '@/components/ui/GlassModal';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { TEAM_MEMBERS } from '@/lib/mock-data';
import { TeamMember } from '@/lib/types';
import { generateId } from '@/lib/profile-utils';

export default function SettingsPage() {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('milmed-team', TEAM_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');

  const [pebloEmail, setPebloEmail] = useLocalStorage('milmed-peblo-email', 'peblo@us.af.mil');
  const [emailTemplate, setEmailTemplate] = useLocalStorage('milmed-email-template',
    'Subject: MEB Referral — [Member Name]\n\nTo: PEBLO Office\n\nPlease find attached the medical documentation for the above-referenced member who has been referred to the Medical Evaluation Board.\n\nDocumentation includes:\n- NARSUM\n- Medical records\n- Commander\'s letter\n\nPlease contact our office with any questions.'
  );

  const handleInvite = () => {
    if (!inviteName || !inviteEmail || !inviteRole) return;
    const newMember: TeamMember = {
      id: generateId(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole as 'Admin' | 'Provider' | 'Staff',
    };
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const roleVariant = (role: string) => {
    switch (role) {
      case 'Admin': return 'blue' as const;
      case 'Provider': return 'emerald' as const;
      case 'Staff': return 'default' as const;
      default: return 'default' as const;
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Team management and configuration</p>
        </div>

        {/* Team Members */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-300">Team Members</h2>
            </div>
            <GlassButton variant="primary" size="sm" onClick={() => setShowInviteModal(true)}>
              <Plus size={14} /> Invite
            </GlassButton>
          </div>
          <div className="space-y-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-400">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
                <GlassBadge variant={roleVariant(member.role)}>{member.role}</GlassBadge>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        {/* PEBLO Configuration */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <Mail size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-300">PEBLO Configuration</h2>
          </div>
          <div className="space-y-4">
            <GlassInput
              label="PEBLO Team Email"
              value={pebloEmail}
              onChange={setPebloEmail}
              placeholder="peblo@us.af.mil"
            />
            <GlassTextarea
              label="Default Email Template"
              value={emailTemplate}
              onChange={setEmailTemplate}
              rows={8}
            />
            <GlassButton variant="primary" size="sm">Save PEBLO Settings</GlassButton>
          </div>
        </GlassPanel>

        {/* Preferences */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-300">Preferences</h2>
          </div>
          <div className="space-y-4">
            <GlassSelect
              label="Default Document Format"
              value="standard"
              onChange={() => {}}
              options={[
                { value: 'standard', label: 'Standard Format' },
                { value: 'compact', label: 'Compact Format' },
              ]}
            />
            <GlassSelect
              label="Alert Notifications"
              value="all"
              onChange={() => {}}
              options={[
                { value: 'all', label: 'All Alerts' },
                { value: 'critical', label: 'Critical Only (>90 days)' },
                { value: 'none', label: 'None' },
              ]}
            />
            <GlassButton variant="primary" size="sm">Save Preferences</GlassButton>
          </div>
        </GlassPanel>

        {/* Invite Modal */}
        <GlassModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member" size="md">
          <div className="space-y-4">
            <GlassInput label="Name" value={inviteName} onChange={setInviteName} placeholder="Full name with rank" required />
            <GlassInput label="Email" value={inviteEmail} onChange={setInviteEmail} placeholder="name@us.af.mil" type="email" required />
            <GlassSelect
              label="Role"
              value={inviteRole}
              onChange={setInviteRole}
              placeholder="Select role"
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Provider', label: 'Provider' },
                { value: 'Staff', label: 'Staff' },
              ]}
              required
            />
            <div className="flex justify-end gap-3">
              <GlassButton onClick={() => setShowInviteModal(false)}>Cancel</GlassButton>
              <GlassButton variant="primary" onClick={handleInvite}>Send Invite</GlassButton>
            </div>
          </div>
        </GlassModal>
      </div>
    </PageTransition>
  );
}

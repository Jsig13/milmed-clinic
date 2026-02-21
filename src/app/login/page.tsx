'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import AmbientBackground from '@/components/layout/AmbientBackground';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-2xl shadow-[0_16px_64px_rgba(0,0,0,0.4)] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <Shield size={28} className="text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">MilMed Clinic Manager</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Aerospace Medicine</p>
          </div>

          <div className="space-y-4">
            <GlassInput
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="name@us.af.mil"
              type="email"
            />
            <GlassInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
              type="password"
            />
            <GlassButton variant="primary" onClick={handleLogin} className="w-full" size="lg">
              <LogIn size={16} /> Sign In
            </GlassButton>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-6 uppercase tracking-wider">
            For authorized DoD personnel only
          </p>
        </div>
      </motion.div>
    </div>
  );
}

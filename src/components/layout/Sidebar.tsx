'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Bell,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';
import { SIDEBAR_NAV } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Bell,
  Settings,
};

interface SidebarProps {
  activeProfileCount: number;
  alertCount: number;
}

export default function Sidebar({ activeProfileCount, alertCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="
        w-64 h-screen fixed left-0 top-0 z-40
        bg-white/[0.02] backdrop-blur-2xl
        border-r border-white/[0.06]
        flex flex-col
      "
    >
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Shield size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-wide">MilMed</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Clinic Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href) && item.href !== '/dashboard';
          const badgeCount = item.label === 'Profiles'
            ? activeProfileCount
            : item.label === 'Alerts'
              ? alertCount
              : 0;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  }
                `}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.badge && badgeCount > 0 && (
                  <span className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center
                    ${item.label === 'Alerts'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                    }
                  `}>
                    {badgeCount}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">JR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Maj Reissig</p>
            <p className="text-[10px] text-slate-500">Flight Surgeon</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

'use client';

import { BarChart3, Bot, UserPlus, Settings, Zap, FolderPlus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const actions = [
  { href: '/ai-agents',    label: 'New Agent',   icon: Bot,       shortcut: '⌘A', gradient: 'from-purple-600 to-indigo-600',  glow: 'hover:shadow-purple-500/20' },
  { href: '/analytics',   label: 'Analytics',   icon: BarChart3, shortcut: '⌘N', gradient: 'from-indigo-600 to-blue-600',    glow: 'hover:shadow-indigo-500/20' },
  { href: '/energy',      label: 'Energy',      icon: Zap,       shortcut: '⌘E', gradient: 'from-cyan-600 to-teal-600',      glow: 'hover:shadow-cyan-500/20' },
  { href: '/team',        label: 'Invite Team', icon: UserPlus,  shortcut: '⌘T', gradient: 'from-emerald-600 to-green-600',  glow: 'hover:shadow-emerald-500/20' },
  { href: '/integrations',label: 'Integrations',icon: FolderPlus,shortcut: '⌘I', gradient: 'from-amber-600 to-orange-600',   glow: 'hover:shadow-amber-500/20' },
  { href: '/settings',    label: 'Settings',    icon: Settings,  shortcut: '⌘,', gradient: 'from-slate-600 to-zinc-600',     glow: 'hover:shadow-slate-500/20' },
];

export function QuickActions() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <h2 className="font-semibold text-white/90">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] p-3 text-center',
                'hover:bg-white/[0.08] hover:border-white/[0.12] transition-all group',
                'shadow-lg hover:shadow-xl',
                action.glow,
              )}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-md',
                action.gradient,
              )}>
                <action.icon className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">
                  {action.label}
                </p>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{action.shortcut}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

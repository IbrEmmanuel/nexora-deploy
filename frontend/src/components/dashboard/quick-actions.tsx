'use client';

import { BarChart3, Bot, UserPlus, Settings, Zap, FolderPlus } from 'lucide-react';
import Link from 'next/link';

const actions = [
  { href: '/ai-agents', label: 'New Agent', icon: Bot, description: 'Deploy AI agent', color: 'hover:border-purple-500/30 hover:bg-purple-500/5' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, description: 'View reports', color: 'hover:border-indigo-500/30 hover:bg-indigo-500/5' },
  { href: '/energy', label: 'Energy', icon: Zap, description: 'IoT monitoring', color: 'hover:border-cyan-500/30 hover:bg-cyan-500/5' },
  { href: '/team', label: 'Invite Team', icon: UserPlus, description: 'Add members', color: 'hover:border-emerald-500/30 hover:bg-emerald-500/5' },
  { href: '/integrations', label: 'Integrations', icon: FolderPlus, description: 'Connect apps', color: 'hover:border-amber-500/30 hover:bg-amber-500/5' },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'Configure org', color: 'hover:border-slate-500/30 hover:bg-slate-500/5' },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-center transition-all ${action.color}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <action.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

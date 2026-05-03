'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bot, Zap, TrendingUp, Users, DollarSign,
  GitBranch, FileBarChart, Settings, ChevronLeft, ChevronRight,
  Wifi, BarChart3, CreditCard, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { useAuthToken } from '@/lib/use-auth-token';

const API = process.env.NEXT_PUBLIC_API_URL;

interface LiveBadges {
  activeAgents: number;
  onlineDevices: number;
  pendingInvitations: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();
  const { token, ready } = useAuthToken();
  const [badges, setBadges] = useState<LiveBadges>({ activeAgents: 0, onlineDevices: 0, pendingInvitations: 0 });

  const displayName = session?.user?.name ?? 'User';
  const email = session?.user?.email ?? '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const fetchBadges = useCallback(async () => {
    if (!token || !ready) return;
    try {
      const res = await fetch(`${API}/organizations/current/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return; // silently ignore 401s in sidebar
      const json = await res.json();
      const d = json.data ?? json;
      setBadges({
        activeAgents: d.metrics?.activeAgents ?? 0,
        onlineDevices: 0,
        pendingInvitations: d.metrics?.pendingInvitations ?? 0,
      });
    } catch { /* silent */ }
  }, [token, ready]);

  useEffect(() => { fetchBadges(); }, [fetchBadges]);
  useEffect(() => {
    const id = setInterval(fetchBadges, 30000);
    return () => clearInterval(id);
  }, [fetchBadges]);

  const navGroups = [
    {
      label: 'Command Center',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
        { href: '/ai-agents', label: 'AI Agents', icon: Bot, badge: badges.activeAgents > 0 ? `${badges.activeAgents} active` : null },
        { href: '/automation', label: 'Automation Flows', icon: Zap, badge: null },
      ],
    },
    {
      label: 'Infrastructure',
      items: [
        { href: '/energy', label: 'Energy & IoT', icon: Wifi, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
        { href: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
        { href: '/investors', label: 'Investor Analytics', icon: TrendingUp, badge: null },
      ],
    },
    {
      label: 'Operations',
      items: [
        { href: '/team', label: 'Projects & Teams', icon: Users, badge: badges.pendingInvitations > 0 ? `${badges.pendingInvitations} pending` : null, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
        { href: '/financial', label: 'Financial Intel', icon: DollarSign, badge: null },
        { href: '/integrations', label: 'Integrations', icon: GitBranch, badge: null },
        { href: '/reports', label: 'Reports', icon: FileBarChart, badge: null },
      ],
    },
  ];

  const bottomItems = [
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex h-full flex-col border-r border-sidebar-border bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
              <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
              <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
              <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden">
                NexoraGrid
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                const badgeColor = (item as any).badgeColor ?? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20';
                return (
                  <li key={item.href}>
                    <Link href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative',
                        active
                          ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-indigo-400' : '')} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                            className="flex-1 whitespace-nowrap overflow-hidden">
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && item.badge && (
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border shrink-0', badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-0.5">
        {bottomItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                active ? 'bg-indigo-600/15 text-indigo-400' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* User */}
        <div className={cn('flex items-center gap-3 px-3 py-2 rounded-lg mt-2 cursor-pointer hover:bg-sidebar-accent transition-all', collapsed && 'justify-center')}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden">
                <div className="text-xs font-medium truncate">{displayName}</div>
                <div className="text-[10px] text-sidebar-foreground/40 truncate">{email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-1 rounded hover:bg-white/10 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors shrink-0"
              title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

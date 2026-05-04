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
import * as Tooltip from '@radix-ui/react-tooltip';

const API = process.env.NEXT_PUBLIC_API_URL;

interface LiveBadges {
  activeAgents: number;
  onlineDevices: number;
  pendingInvitations: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { token, ready } = useAuthToken();
  const [badges, setBadges] = useState<LiveBadges>({ activeAgents: 0, onlineDevices: 0, pendingInvitations: 0 });

  // Persist collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  const displayName = session?.user?.name ?? 'User';
  const email = session?.user?.email ?? '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const fetchBadges = useCallback(async () => {
    if (!token || !ready) return;
    try {
      const res = await fetch(`${API}/organizations/current/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
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
        { href: '/ai-agents', label: 'AI Agents', icon: Bot, badge: badges.activeAgents > 0 ? `${badges.activeAgents}` : null },
        { href: '/automation', label: 'Automation', icon: Zap, badge: null },
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
        { href: '/team', label: 'Projects & Teams', icon: Users, badge: badges.pendingInvitations > 0 ? `${badges.pendingInvitations}` : null, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
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
    <Tooltip.Provider delayDuration={0}>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex h-full flex-col bg-black/40 backdrop-blur-xl border-r border-white/[0.08] overflow-hidden shrink-0"
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/[0.06] px-4 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/40 animate-pulse-glow">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="2" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="12" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
                <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden gradient-text-brand"
                >
                  NexoraGrid
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-thin" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25"
                  >
                    {group.label}
                  </motion.div>
                )}
              </AnimatePresence>
              <ul className="space-y-0.5" role="list">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  const badgeColor = (item as any).badgeColor ?? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20';
                  return (
                    <li key={item.href}>
                      <NavItem
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={active}
                        collapsed={collapsed}
                        badge={item.badge}
                        badgeColor={badgeColor}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] px-2 py-3 space-y-0.5">
          {bottomItems.map((item) => {
            const active = pathname === item.href;
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={active}
                collapsed={collapsed}
              />
            );
          })}

          {/* User section */}
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg mt-2 cursor-pointer hover:bg-white/[0.05] transition-all',
              collapsed && 'justify-center',
            )}
          >
            {/* Avatar with gradient ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 blur-[2px] opacity-60" />
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-indigo-500/30">
                {initials}
              </div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <div className="text-xs font-medium truncate text-white/80">{displayName}</div>
                  <div className="text-[10px] text-white/30 truncate">{email}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors shrink-0"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </Tooltip.Provider>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  badge?: string | null;
  badgeColor?: string;
}

function NavItem({ href, label, icon: Icon, active, collapsed, badge, badgeColor = 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' }: NavItemProps) {
  const content = (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative',
        active
          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
          : 'text-white/50 hover:bg-white/[0.05] hover:text-white/90',
        collapsed && 'justify-center px-2',
      )}
    >
      {/* Active left pill */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full" aria-hidden="true" />
      )}
      <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70')} aria-hidden="true" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && badge && (
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 font-medium', badgeColor)}>
          {badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-50 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white/90 shadow-xl animate-slide-in-top"
          >
            {label}
            {badge && <span className="ml-1.5 opacity-60">({badge})</span>}
            <Tooltip.Arrow className="fill-zinc-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return content;
}

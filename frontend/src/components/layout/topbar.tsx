'use client';

import { useSession, signOut } from 'next-auth/react';
import { Bell, Search, Sun, Moon, ChevronDown, Settings, Zap, LogOut, User, CreditCard, Command } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Overview',
  '/ai-agents': 'AI Agents',
  '/automation': 'Automation Flows',
  '/energy': 'Energy & IoT',
  '/analytics': 'Analytics',
  '/investors': 'Investor Analytics',
  '/team': 'Projects & Teams',
  '/financial': 'Financial Intelligence',
  '/integrations': 'Integrations',
  '/reports': 'Reports',
  '/billing': 'Billing',
  '/settings': 'Settings',
};

const notifications = [
  { id: '1', title: 'AI Agent completed task', desc: 'Sales Agent closed 3 leads', time: '2m ago', unread: true },
  { id: '2', title: 'Energy alert resolved', desc: 'Inverter-07 back online', time: '15m ago', unread: true },
  { id: '3', title: 'New team member', desc: 'Alex Rivera joined Engineering', time: '1h ago', unread: false },
];

const commandPages = [
  { label: 'Overview', href: '/dashboard', shortcut: 'G O' },
  { label: 'AI Agents', href: '/ai-agents', shortcut: 'G A' },
  { label: 'Energy & IoT', href: '/energy', shortcut: 'G E' },
  { label: 'Analytics', href: '/analytics', shortcut: 'G N' },
  { label: 'Integrations', href: '/integrations', shortcut: 'G I' },
  { label: 'Billing', href: '/billing', shortcut: 'G B' },
  { label: 'Settings', href: '/settings', shortcut: 'G S' },
];

const commandActions = [
  { label: 'Create AI Agent', action: '/ai-agents', shortcut: 'C A' },
  { label: 'Add Energy Device', action: '/energy', shortcut: 'C D' },
  { label: 'Invite Team Member', action: '/team', shortcut: 'C T' },
  { label: 'View Reports', action: '/reports', shortcut: 'C R' },
];

export function TopBar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  const pageTitle = breadcrumbMap[pathname] ?? 'Dashboard';
  const unreadCount = notifications.filter((n) => n.unread).length;

  const displayName = session?.user?.name ?? 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (cmdOpen) {
      setTimeout(() => cmdInputRef.current?.focus(), 50);
    } else {
      setCmdQuery('');
    }
  }, [cmdOpen]);

  // Close notif on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredPages = cmdQuery
    ? commandPages.filter((p) => p.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : commandPages;
  const filteredActions = cmdQuery
    ? commandActions.filter((a) => a.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : commandActions;

  return (
    <>
      <header className="flex h-16 items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/[0.08] px-6 shrink-0 z-10">
        {/* Left: page title */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base font-semibold leading-none text-white/90">{pageTitle}</h1>
            <p className="text-xs text-white/30 mt-0.5">NexoraGrid Command Center</p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Search / Command Palette trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Open command palette (⌘K)"
            className="flex items-center gap-2 h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all text-sm"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">Search...</span>
            <kbd className="hidden sm:inline text-[10px] bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/80 relative"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={notifOpen}
              className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/80"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black/40 animate-pulse" aria-hidden="true" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-80 glass-md rounded-xl shadow-2xl z-50 overflow-hidden border border-white/[0.08]"
                  role="dialog"
                  aria-label="Notifications"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <span className="font-semibold text-sm text-white/90">Notifications</span>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Mark all read</button>
                  </div>
                  <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'px-4 py-3 hover:bg-white/[0.04] cursor-pointer transition-colors',
                          n.unread && 'bg-indigo-500/[0.05]',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" aria-hidden="true" />}
                          <div className={n.unread ? '' : 'ml-4'}>
                            <div className="text-sm font-medium text-white/80">{n.title}</div>
                            <div className="text-xs text-white/40">{n.desc}</div>
                            <div className="text-xs text-white/25 mt-0.5">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-white/[0.06]">
                    <Link href="/notifications" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upgrade badge */}
          <Link
            href="/billing"
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40 hover:text-indigo-300 transition-all text-xs font-medium"
          >
            <Zap className="w-3 h-3" aria-hidden="true" />
            Upgrade
          </Link>

          {/* User avatar → Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 blur-[2px] opacity-50" aria-hidden="true" />
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-indigo-500/30">
                    {initials}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/40 hidden sm:block" aria-hidden="true" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-52 glass-md rounded-xl border border-white/[0.08] shadow-2xl p-1 animate-slide-in-top"
              >
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <div className="text-sm font-medium text-white/80 truncate">{displayName}</div>
                  <div className="text-xs text-white/30 truncate">{session?.user?.email}</div>
                </div>
                {[
                  { label: 'Profile', href: '/settings', icon: User },
                  { label: 'Settings', href: '/settings', icon: Settings },
                  { label: 'Billing', href: '/billing', icon: CreditCard },
                ].map((item) => (
                  <DropdownMenu.Item key={item.label} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white/90 hover:bg-white/[0.06] transition-colors cursor-pointer outline-none"
                    >
                      <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 border-t border-white/[0.06]" />
                <DropdownMenu.Item asChild>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer outline-none"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    Sign out
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      {/* Command Palette */}
      <Dialog.Root open={cmdOpen} onOpenChange={setCmdOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 glass-md rounded-2xl border border-white/[0.10] shadow-2xl overflow-hidden"
            aria-label="Command palette"
          >
            <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
              <Command className="w-4 h-4 text-white/30 shrink-0" aria-hidden="true" />
              <input
                ref={cmdInputRef}
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/25 outline-none"
                aria-label="Search command palette"
              />
              <kbd className="text-[10px] bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-white/30 font-mono">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {/* Pages group */}
              {filteredPages.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold">Pages</div>
                  {filteredPages.map((page) => (
                    <button
                      key={page.href}
                      onClick={() => { router.push(page.href); setCmdOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white/90 hover:bg-white/[0.06] transition-colors text-left"
                    >
                      <span>{page.label}</span>
                      <kbd className="text-[10px] text-white/25 font-mono">{page.shortcut}</kbd>
                    </button>
                  ))}
                </div>
              )}

              {/* Actions group */}
              {filteredActions.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold">Actions</div>
                  {filteredActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => { router.push(action.action); setCmdOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white/90 hover:bg-white/[0.06] transition-colors text-left"
                    >
                      <span>{action.label}</span>
                      <kbd className="text-[10px] text-white/25 font-mono">{action.shortcut}</kbd>
                    </button>
                  ))}
                </div>
              )}

              {filteredPages.length === 0 && filteredActions.length === 0 && (
                <div className="py-8 text-center text-sm text-white/30">No results for "{cmdQuery}"</div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

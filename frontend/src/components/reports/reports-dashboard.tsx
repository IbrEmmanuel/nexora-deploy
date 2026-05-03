'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion } from 'framer-motion';
import { FileBarChart, Users, Bot, FolderOpen, Mail, Wifi, Key, RefreshCw, Download, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL;

interface ReportData {
  generatedAt: string;
  organization: { name: string; plan: string };
  summary: {
    totalUsers: number; activeUsers: number;
    totalAgents: number; activeAgents: number;
    totalProjects: number; activeProjects: number;
    pendingInvitations: number;
    energyDevices: number; onlineDevices: number;
    apiKeys: number;
  };
  users: any[];
  agents: any[];
  projects: any[];
  invitations: any[];
  energyDevices: any[];
  apiKeys: any[];
}

type ReportTab = 'summary' | 'users' | 'agents' | 'projects' | 'devices' | 'invitations';

const statusColors: Record<string, string> = {
  ACTIVE: 'text-emerald-500 bg-emerald-500/10',
  INACTIVE: 'text-slate-400 bg-slate-500/10',
  SUSPENDED: 'text-red-500 bg-red-500/10',
  PENDING_VERIFICATION: 'text-amber-500 bg-amber-500/10',
  ONLINE: 'text-emerald-500 bg-emerald-500/10',
  OFFLINE: 'text-slate-400 bg-slate-500/10',
  WARNING: 'text-amber-500 bg-amber-500/10',
  FAULT: 'text-red-500 bg-red-500/10',
  IDLE: 'text-slate-400 bg-slate-500/10',
  PAUSED: 'text-amber-500 bg-amber-500/10',
  LEARNING: 'text-indigo-500 bg-indigo-500/10',
  PENDING: 'text-amber-500 bg-amber-500/10',
  ACCEPTED: 'text-emerald-500 bg-emerald-500/10',
  EXPIRED: 'text-red-500 bg-red-500/10',
};

export function ReportsDashboard() {
  const { token, ready } = useAuthToken();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/organizations/current/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setData(json.data ?? json);
    } catch { toast.error('Failed to load report data'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function exportCSV(rows: any[], filename: string) {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename}.csv downloaded`);
  }

  const tabs: Array<{ key: ReportTab; label: string; icon: React.ElementType; count: number }> = [
    { key: 'summary', label: 'Summary', icon: FileBarChart, count: 0 },
    { key: 'users', label: 'Users', icon: Users, count: data?.users.length ?? 0 },
    { key: 'agents', label: 'Agents', icon: Bot, count: data?.agents.length ?? 0 },
    { key: 'projects', label: 'Projects', icon: FolderOpen, count: data?.projects.length ?? 0 },
    { key: 'devices', label: 'Devices', icon: Wifi, count: data?.energyDevices.length ?? 0 },
    { key: 'invitations', label: 'Invitations', icon: Mail, count: data?.invitations.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {data ? `Generated ${formatDistanceToNow(new Date(data.generatedAt), { addSuffix: true })}` : 'Live organization data export'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          <button
            onClick={() => {
              if (!data) return;
              const all = { ...data.summary, generatedAt: data.generatedAt, organization: data.organization?.name };
              exportCSV([all], 'nexoragrid-summary-report');
            }}
            className="flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              activeTab === t.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.count > 0 && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}</div>
      ) : (
        <>
          {/* Summary */}
          {activeTab === 'summary' && data && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Total Users', value: data.summary.totalUsers, sub: `${data.summary.activeUsers} active`, icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
                { label: 'AI Agents', value: data.summary.totalAgents, sub: `${data.summary.activeAgents} active`, icon: Bot, color: 'text-purple-500 bg-purple-500/10' },
                { label: 'Projects', value: data.summary.totalProjects, sub: `${data.summary.activeProjects} active`, icon: FolderOpen, color: 'text-emerald-500 bg-emerald-500/10' },
                { label: 'Energy Devices', value: data.summary.energyDevices, sub: `${data.summary.onlineDevices} online`, icon: Wifi, color: 'text-cyan-500 bg-cyan-500/10' },
                { label: 'Pending Invitations', value: data.summary.pendingInvitations, sub: 'awaiting acceptance', icon: Mail, color: 'text-amber-500 bg-amber-500/10' },
                { label: 'API Keys', value: data.summary.apiKeys, sub: 'active keys', icon: Key, color: 'text-slate-400 bg-slate-500/10' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', s.color)}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold">All Users ({data?.users.length ?? 0})</h3>
                <button onClick={() => exportCSV(data?.users ?? [], 'users-report')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Last Login</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {(data?.users ?? []).map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-5 py-3"><span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">{u.role}</span></td>
                        <td className="px-5 py-3"><span className={cn('text-xs px-2 py-0.5 rounded', statusColors[u.status] ?? '')}>{u.status}</span></td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">{u.lastLoginAt ? formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true }) : 'Never'}</td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Agents */}
          {activeTab === 'agents' && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold">All AI Agents ({data?.agents.length ?? 0})</h3>
                <button onClick={() => exportCSV(data?.agents ?? [], 'agents-report')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {(data?.agents ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Bot className="w-8 h-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No agents deployed yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Tasks</th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Success %</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Last Active</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border">
                      {(data?.agents ?? []).map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 font-medium">{a.name}</td>
                          <td className="px-5 py-3"><span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{a.role}</span></td>
                          <td className="px-5 py-3"><span className={cn('text-xs px-2 py-0.5 rounded', statusColors[a.status] ?? '')}>{a.status}</span></td>
                          <td className="px-5 py-3 text-right font-mono">{a.tasksCompleted}</td>
                          <td className="px-5 py-3 text-right font-mono">{Math.round(a.successRate)}%</td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{a.lastActiveAt ? formatDistanceToNow(new Date(a.lastActiveAt), { addSuffix: true }) : 'Never'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold">All Projects ({data?.projects.length ?? 0})</h3>
                <button onClick={() => exportCSV(data?.projects ?? [], 'projects-report')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {(data?.projects ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <FolderOpen className="w-8 h-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No projects yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {(data?.projects ?? []).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                      <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1"><div className="font-medium text-sm">{p.name}</div></div>
                      <span className={cn('text-xs px-2 py-0.5 rounded', statusColors[p.status] ?? '')}>{p.status}</span>
                      <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Devices */}
          {activeTab === 'devices' && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold">Energy Devices ({data?.energyDevices.length ?? 0})</h3>
                <button onClick={() => exportCSV(data?.energyDevices ?? [], 'devices-report')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {(data?.energyDevices ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Wifi className="w-8 h-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No devices registered</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Location</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Last Seen</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border">
                      {(data?.energyDevices ?? []).map((d) => (
                        <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 font-medium">{d.name}</td>
                          <td className="px-5 py-3 text-xs text-muted-foreground">{d.deviceType.replace(/_/g, ' ')}</td>
                          <td className="px-5 py-3"><span className={cn('text-xs px-2 py-0.5 rounded', statusColors[d.status] ?? '')}>{d.status}</span></td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{d.location ?? '—'}</td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{d.lastSeenAt ? formatDistanceToNow(new Date(d.lastSeenAt), { addSuffix: true }) : 'Never'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Invitations */}
          {activeTab === 'invitations' && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold">Invitations ({data?.invitations.length ?? 0})</h3>
                <button onClick={() => exportCSV(data?.invitations ?? [], 'invitations-report')}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {(data?.invitations ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Mail className="w-8 h-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No invitations sent yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {(data?.invitations ?? []).map((inv) => (
                    <div key={inv.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1"><div className="font-medium text-sm">{inv.email}</div></div>
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">{inv.role}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded', statusColors[inv.status] ?? '')}>{inv.status}</span>
                      <span className="text-xs text-muted-foreground">Expires {new Date(inv.expiresAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

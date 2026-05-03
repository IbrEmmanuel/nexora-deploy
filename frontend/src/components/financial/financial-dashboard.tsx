'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Bot, Zap, TrendingUp, TrendingDown, RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

interface FinancialData {
  organization: { name: string; plan: string };
  monthlyData: Array<{ month: string; newUsers: number; newAgents: number; events: number }>;
  totals: { users: number; agents: number; events: number; devices: number; apiKeys: number };
}

export function FinancialDashboard() {
  const { token, ready } = useAuthToken();
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/organizations/current/financial`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setData(json.data ?? json);
    } catch { toast.error('Failed to load financial data'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  const totals = data?.totals;
  const monthly = data?.monthlyData ?? [];
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const userGrowth = prevMonth?.newUsers > 0 ? ((lastMonth?.newUsers - prevMonth?.newUsers) / prevMonth?.newUsers) * 100 : 0;
  const eventGrowth = prevMonth?.events > 0 ? ((lastMonth?.events - prevMonth?.events) / prevMonth?.events) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {data?.organization?.name} · {data?.organization?.plan ?? 'FREE'} plan · Real-time platform metrics
          </p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: totals?.users ?? 0, icon: Users, color: 'text-indigo-500 bg-indigo-500/10', change: userGrowth },
          { label: 'AI Agents', value: totals?.agents ?? 0, icon: Bot, color: 'text-purple-500 bg-purple-500/10', change: null },
          { label: 'API Events', value: (totals?.events ?? 0).toLocaleString(), icon: Zap, color: 'text-cyan-500 bg-cyan-500/10', change: eventGrowth },
          { label: 'IoT Devices', value: totals?.devices ?? 0, icon: Activity, color: 'text-emerald-500 bg-emerald-500/10', change: null },
          { label: 'API Keys', value: totals?.apiKeys ?? 0, icon: DollarSign, color: 'text-amber-500 bg-amber-500/10', change: null },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', m.color)}>
                <m.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <div className="text-2xl font-bold">{loading ? '—' : m.value}</div>
            {m.change !== null && !loading && (
              <div className={cn('flex items-center gap-1 text-xs mt-1', (m.change ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                {(m.change ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(Math.round(m.change ?? 0))}% vs last month
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">User Growth (6 months)</h3>
          <p className="text-xs text-muted-foreground mb-4">New users added each month</p>
          {loading ? (
            <div className="h-[220px] bg-muted animate-pulse rounded-lg" />
          ) : monthly.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="newUsers" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" name="New Users" dot={{ r: 4, fill: '#6366f1' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">API Event Volume (6 months)</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly event activity</p>
          {loading ? (
            <div className="h-[220px] bg-muted animate-pulse rounded-lg" />
          ) : monthly.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No events tracked yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="events" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">Monthly Breakdown</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Month</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">New Users</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">New Agents</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">API Events</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthly.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No data available</td></tr>
                ) : (
                  monthly.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium">{row.month}</td>
                      <td className="px-5 py-3 text-right text-indigo-400">{row.newUsers}</td>
                      <td className="px-5 py-3 text-right text-purple-400">{row.newAgents}</td>
                      <td className="px-5 py-3 text-right text-cyan-400">{row.events.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

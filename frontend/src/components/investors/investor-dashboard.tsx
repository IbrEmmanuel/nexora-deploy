'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, BarChart3, Users, RefreshCw, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

const SEGMENT_COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#f59e0b'];

export function InvestorDashboard() {
  const { token, ready } = useAuthToken();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    organization: any; metrics: any; recentUsers: any[]; recentAgents: any[];
    monthlyEvents: Array<{ _id: string; count: number }>;
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/organizations/current/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const json = await res.json();
      setData(json.data ?? json);
    } catch { toast.error('Failed to load investor data'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Build chart data from real monthly events
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const eventChart = (data?.monthlyEvents ?? []).map((e) => {
    const [, month] = e._id.split('-');
    return { month: MONTHS[parseInt(month, 10) - 1] ?? e._id, events: e.count };
  });

  const userCount = data?.metrics?.users?.value ?? 0;
  const agentCount = data?.metrics?.agents?.value ?? 0;
  const apiCalls = data?.metrics?.apiCalls?.value ?? 0;
  const userChange = data?.metrics?.users?.change ?? 0;
  const orgName = data?.organization?.name ?? '—';
  const plan = data?.organization?.plan ?? 'FREE';

  // Role distribution from real agents
  const agentRoles = (data?.recentAgents ?? []).reduce((acc: Record<string, number>, a: any) => {
    acc[a.role] = (acc[a.role] ?? 0) + 1;
    return acc;
  }, {});
  const segmentData = Object.entries(agentRoles).map(([name, value], i) => ({ name, value, color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investor Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{orgName} — Platform intelligence overview.</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Team Members', value: loading ? '—' : userCount.toLocaleString(), change: userChange, icon: Users },
          { label: 'AI Agents', value: loading ? '—' : agentCount.toLocaleString(), change: 0, icon: BarChart3 },
          { label: 'API Events (MTD)', value: loading ? '—' : apiCalls.toLocaleString(), change: data?.metrics?.apiCalls?.change ?? 0, icon: TrendingUp },
          { label: 'Plan', value: loading ? '—' : plan, change: null, icon: Target },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <m.icon className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{m.value}</div>
            {m.change !== null && (
              <div className={cn('flex items-center gap-1 text-xs font-medium', (m.change ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                {(m.change ?? 0) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(m.change ?? 0)}% vs last month
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Event trend */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Platform Activity Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly API event volume — real data</p>
          {loading ? (
            <div className="h-[240px] bg-muted animate-pulse rounded-lg" />
          ) : eventChart.length === 0 ? (
            <div className="h-[240px] flex flex-col items-center justify-center gap-2">
              <BarChart3 className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No event data yet</p>
              <p className="text-xs text-muted-foreground/60">Events will appear as your platform generates activity</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={eventChart} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="events" fill="#6366f1" radius={[4, 4, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Agent distribution */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Agent Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">By role type</p>
          {loading ? (
            <div className="h-[160px] bg-muted animate-pulse rounded-lg" />
          ) : segmentData.length === 0 ? (
            <div className="h-[160px] flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">No agents deployed</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={segmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {segmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {segmentData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-muted-foreground text-xs">{s.name}</span>
                    </div>
                    <span className="font-semibold text-xs">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent team members */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">Recent Team Members</h3>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}</div>
        ) : (data?.recentUsers ?? []).length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No team members yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(data?.recentUsers ?? []).map((u: any) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {u.firstName[0]}{u.lastName[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{u.role}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

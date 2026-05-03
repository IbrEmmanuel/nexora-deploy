'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, Zap, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL;

export function AnalyticsDashboard() {
  const { token, ready } = useAuthToken();
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    topEvents: Array<{ _id: string; count: number }>;
    activeUsers: number;
    eventCounts: Array<{ _id: string; count: number }>;
    totalEvents: number;
  } | null>(null);

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - days * 86400000).toISOString();

      const [topRes, activeRes, countsRes] = await Promise.all([
        fetch(`${API}/analytics/events/top?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/analytics/users/active?days=${days}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/analytics/events/counts?eventType=&startDate=${startDate}&endDate=${endDate}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!topRes.ok || !activeRes.ok || !countsRes.ok) return;

      const [topJson, activeJson, countsJson] = await Promise.all([topRes.json(), activeRes.json(), countsRes.json()]);
      const topEvents = topJson.data ?? topJson ?? [];
      const activeUsers = (activeJson.data ?? activeJson)?.count ?? 0;
      const eventCounts = countsJson.data ?? countsJson ?? [];
      const totalEvents = topEvents.reduce((s: number, e: any) => s + e.count, 0);

      setData({ topEvents, activeUsers, eventCounts, totalEvents });
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  }, [token, range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const chartData = data?.eventCounts.map((e) => ({ day: e._id, events: e.count })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Real-time platform usage and event tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {['7d', '30d', '90d', '1y'].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  range === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: loading ? '—' : data?.activeUsers.toLocaleString() ?? '0', icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Total Events', value: loading ? '—' : data?.totalEvents.toLocaleString() ?? '0', icon: Zap, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Event Types', value: loading ? '—' : (data?.topEvents.length ?? 0).toString(), icon: BarChart3, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Time Range', value: range, icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', m.color)}>
                <m.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <div className="text-2xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Event Volume Over Time</h3>
          <p className="text-xs text-muted-foreground mb-4">Daily event counts for selected range</p>
          {loading ? (
            <div className="h-[220px] bg-muted animate-pulse rounded-lg" />
          ) : chartData.length === 0 ? (
            <div className="h-[220px] flex flex-col items-center justify-center gap-2">
              <BarChart3 className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No events tracked yet</p>
              <p className="text-xs text-muted-foreground/60">Events appear here as your app generates activity</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="evGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} fill="url(#evGrad2)" dot={false} name="Events" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold mb-1">Top Event Types</h3>
          <p className="text-xs text-muted-foreground mb-4">Most frequent events in your organization</p>
          {loading ? (
            <div className="h-[220px] bg-muted animate-pulse rounded-lg" />
          ) : !data?.topEvents.length ? (
            <div className="h-[220px] flex flex-col items-center justify-center gap-2">
              <Zap className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No events tracked yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topEvents.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="_id" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top events table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Event Breakdown</h3>
          <span className="text-xs text-muted-foreground">{data?.topEvents.length ?? 0} event types</span>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}</div>
        ) : !data?.topEvents.length ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-sm text-muted-foreground">No events tracked yet</p>
            <p className="text-xs text-muted-foreground/60">Use POST /api/v1/analytics/track to start tracking events</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.topEvents.map((e, i) => (
              <div key={e._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <span className="text-xs text-muted-foreground w-6 font-mono">{i + 1}</span>
                <code className="flex-1 text-sm font-mono text-foreground">{e._id}</code>
                <span className="font-semibold text-sm">{e.count.toLocaleString()}</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (e.count / (data.topEvents[0]?.count ?? 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

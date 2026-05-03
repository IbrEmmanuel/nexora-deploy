'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmt(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
}

export function RevenueChart({ data }: Props) {
  // Build chart data from real monthly events
  const chartData = data.monthlyEvents.length > 0
    ? data.monthlyEvents.map((e) => {
        const [, month] = e._id.split('-');
        return { month: MONTH_LABELS[parseInt(month, 10) - 1] ?? e._id, events: e.count };
      })
    : MONTH_LABELS.slice(0, new Date().getMonth() + 1).map((m) => ({ month: m, events: 0 }));

  const hasData = chartData.some((d) => d.events > 0);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold">API Activity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly event volume — real data</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" />
            Events
          </span>
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={45} />
            <Tooltip
              formatter={(v: number) => [v.toLocaleString(), 'Events']}
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} fill="url(#evGrad)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[220px] gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm text-muted-foreground">No events tracked yet</p>
          <p className="text-xs text-muted-foreground/60">Events will appear here as your app generates activity</p>
        </div>
      )}
    </div>
  );
}

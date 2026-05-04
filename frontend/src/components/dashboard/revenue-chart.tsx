'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, TooltipProps,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function fmt(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return String(v);
}

const TIME_RANGES = [
  { label: '7d',  key: '7d' },
  { label: '30d', key: '30d' },
  { label: '90d', key: '90d' },
  { label: '1y',  key: '1y' },
] as const;

type Range = typeof TIME_RANGES[number]['key'];

// Custom glassmorphism tooltip
function GlassTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-md rounded-xl px-3 py-2.5 border border-white/[0.10] shadow-xl">
      <p className="text-xs text-white/50 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold text-white/90">
          {p.value?.toLocaleString()} <span className="text-white/40 font-normal text-xs">events</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: Props) {
  const [range, setRange] = useState<Range>('30d');

  // Build chart data from real monthly events
  const allData = data.monthlyEvents.length > 0
    ? data.monthlyEvents.map((e) => {
        const [, month] = e._id.split('-');
        return { month: MONTH_LABELS[parseInt(month, 10) - 1] ?? e._id, events: e.count };
      })
    : MONTH_LABELS.slice(0, new Date().getMonth() + 1).map((m) => ({ month: m, events: 0 }));

  // Slice based on range
  const sliceMap: Record<Range, number> = { '7d': 7, '30d': 12, '90d': 12, '1y': 12 };
  const chartData = allData.slice(-sliceMap[range]);
  const hasData = chartData.some((d) => d.events > 0);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-white/90">API Activity</h2>
          <p className="text-xs text-white/35 mt-0.5">Monthly event volume</p>
        </div>

        {/* Time range pills */}
        <div className="relative flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={cn(
                'relative px-3 py-1 rounded-md text-xs font-medium transition-colors z-10',
                range === r.key ? 'text-white' : 'text-white/40 hover:text-white/70',
              )}
            >
              {range === r.key && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 bg-indigo-600 rounded-md"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" aria-hidden="true" />
          Events
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="evGradDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<GlassTooltip />} />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#evGradDark)"
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-[220px] gap-3">
          <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center">
            <span className="text-2xl" aria-hidden="true">📊</span>
          </div>
          <p className="text-sm text-white/40">No events tracked yet</p>
          <p className="text-xs text-white/20">Events will appear here as your app generates activity</p>
        </div>
      )}
    </div>
  );
}

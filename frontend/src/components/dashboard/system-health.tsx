'use client';

import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const statusConfig = {
  operational: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'OK' },
  degraded: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Degraded' },
  outage: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Outage' },
};

export function SystemHealth({ data }: Props) {
  const services = data.systemHealth;
  const allOk = services.every((s) => s.status === 'operational');
  const degraded = services.filter((s) => s.status === 'degraded').length;
  const outages = services.filter((s) => s.status === 'outage').length;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', allOk ? 'bg-emerald-500/10' : 'bg-amber-500/10')}>
          <Activity className={cn('h-4 w-4', allOk ? 'text-emerald-500' : 'text-amber-500')} />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-sm">System Health</h2>
          <p className="text-xs text-muted-foreground">
            {allOk ? 'All systems operational' : `${degraded} degraded · ${outages} outage`}
          </p>
        </div>
        <div className={cn('w-2 h-2 rounded-full animate-pulse', allOk ? 'bg-emerald-500' : 'bg-amber-500')} />
      </div>

      <div className="space-y-2">
        {services.map((s) => {
          const cfg = statusConfig[s.status as keyof typeof statusConfig] ?? statusConfig.operational;
          return (
            <div key={s.name} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <cfg.icon className={cn('w-3.5 h-3.5', cfg.color)} />
                <span className="text-xs font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{s.latency}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cfg.bg, cfg.color)}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const statusConfig = {
  operational: { dot: 'bg-emerald-500', pulse: 'bg-emerald-500/30', label: 'OK', text: 'text-emerald-400', latencyColor: 'text-emerald-400' },
  degraded:    { dot: 'bg-amber-500',   pulse: 'bg-amber-500/30',   label: 'Degraded', text: 'text-amber-400', latencyColor: 'text-amber-400' },
  outage:      { dot: 'bg-red-500',     pulse: 'bg-red-500/30',     label: 'Outage', text: 'text-red-400', latencyColor: 'text-red-400' },
};

// SVG donut ring for overall health score
function HealthRing({ score, size = 72 }: { score: number; size?: number }) {
  const shouldReduce = useReducedMotion();
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={`Health score: ${score}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        {/* Progress */}
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: shouldReduce ? circ - dash : circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white/90 leading-none">{score}</span>
        <span className="text-[9px] text-white/30 mt-0.5">score</span>
      </div>
    </div>
  );
}

export function SystemHealth({ data }: Props) {
  const services = data.systemHealth;
  const allOk = services.every((s) => s.status === 'operational');
  const degraded = services.filter((s) => s.status === 'degraded').length;
  const outages = services.filter((s) => s.status === 'outage').length;
  const score = Math.round(
    services.length === 0
      ? 100
      : ((services.filter((s) => s.status === 'operational').length / services.length) * 100),
  );

  return (
    <div className="glass rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <HealthRing score={score} />
        <div className="flex-1">
          <h2 className="font-semibold text-sm text-white/90">System Health</h2>
          <p className="text-xs text-white/35 mt-0.5">
            {allOk
              ? 'All systems operational'
              : `${degraded > 0 ? `${degraded} degraded` : ''}${degraded > 0 && outages > 0 ? ' · ' : ''}${outages > 0 ? `${outages} outage` : ''}`}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                allOk ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse',
              )}
              aria-hidden="true"
            />
            <span className={cn('text-[10px] font-medium', allOk ? 'text-emerald-400' : 'text-amber-400')}>
              {allOk ? 'Live · All clear' : 'Live · Issues detected'}
            </span>
          </div>
        </div>
      </div>

      {/* Service list */}
      <div className="space-y-1.5" role="list" aria-label="Service statuses">
        {services.map((s, i) => {
          const cfg = statusConfig[s.status as keyof typeof statusConfig] ?? statusConfig.operational;
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
              role="listitem"
            >
              <div className="flex items-center gap-2.5">
                {/* Animated pulse dot */}
                <div className="relative flex items-center justify-center w-3 h-3" aria-hidden="true">
                  <span className={cn('absolute w-3 h-3 rounded-full opacity-40 animate-ping', cfg.pulse)} />
                  <span className={cn('relative w-1.5 h-1.5 rounded-full', cfg.dot)} />
                </div>
                <span className="text-xs font-medium text-white/70">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-mono', cfg.latencyColor)}>{s.latency}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', cfg.text,
                  s.status === 'operational' ? 'bg-emerald-500/10' : s.status === 'degraded' ? 'bg-amber-500/10' : 'bg-red-500/10',
                )}>
                  {cfg.label}
                </span>
              </div>
            </motion.div>
          );
        })}
        {services.length === 0 && (
          <p className="text-xs text-white/25 text-center py-4">No services configured</p>
        )}
      </div>
    </div>
  );
}

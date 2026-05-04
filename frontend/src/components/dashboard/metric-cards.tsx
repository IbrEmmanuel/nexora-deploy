'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Users, Zap, Bot, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

// Inline SVG sparkline from 7 data points
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

// Count-up hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const shouldReduce = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (shouldReduce) { setCount(target); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, shouldReduce]);

  return count;
}

interface CardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  sparkValues: number[];
  sparkColor: string;
  index: number;
}

function MetricCard({ title, value, change, icon: Icon, gradient, iconColor, sparkValues, sparkColor, index }: CardProps) {
  const displayValue = useCountUp(value);
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={shouldReduce ? {} : { y: -2 }}
      className="glass rounded-2xl p-5 hover:border-white/[0.12] transition-all cursor-default group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-white/40 font-medium uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-white/90">
            {displayValue.toLocaleString()}
          </p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg', gradient)}>
          <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {change >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
          )}
          <span className={cn('text-xs font-semibold', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-white/30">vs last month</span>
        </div>
        <Sparkline values={sparkValues} color={sparkColor} />
      </div>
    </motion.div>
  );
}

export function MetricCards({ data }: Props) {
  const cards = [
    {
      title: 'Team Members',
      value: data.metrics.users.value,
      change: data.metrics.users.change,
      icon: Users,
      gradient: 'from-indigo-600 to-indigo-400',
      iconColor: 'text-white',
      sparkValues: [3, 5, 4, 7, 6, 8, data.metrics.users.value || 8],
      sparkColor: '#6366f1',
    },
    {
      title: 'Active Projects',
      value: data.metrics.projects.value,
      change: data.metrics.projects.change,
      icon: FolderOpen,
      gradient: 'from-emerald-600 to-emerald-400',
      iconColor: 'text-white',
      sparkValues: [2, 4, 3, 6, 5, 7, data.metrics.projects.value || 7],
      sparkColor: '#10b981',
    },
    {
      title: 'AI Agents',
      value: data.metrics.agents.value,
      change: data.metrics.agents.change,
      icon: Bot,
      gradient: 'from-purple-600 to-purple-400',
      iconColor: 'text-white',
      sparkValues: [1, 2, 2, 3, 3, 4, data.metrics.agents.value || 4],
      sparkColor: '#a855f7',
    },
    {
      title: 'API Events (MTD)',
      value: data.metrics.apiCalls.value,
      change: data.metrics.apiCalls.change,
      icon: Zap,
      gradient: 'from-cyan-600 to-cyan-400',
      iconColor: 'text-white',
      sparkValues: [100, 250, 180, 400, 320, 500, data.metrics.apiCalls.value || 500],
      sparkColor: '#06b6d4',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <MetricCard key={card.title} {...card} index={i} />
      ))}
    </div>
  );
}

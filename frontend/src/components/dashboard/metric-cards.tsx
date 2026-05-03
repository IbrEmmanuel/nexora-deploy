'use client';

import { ArrowDownRight, ArrowUpRight, Users, Zap, Bot, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

export function MetricCards({ data }: Props) {
  const cards = [
    {
      title: 'Team Members',
      value: data.metrics.users.value.toLocaleString(),
      change: data.metrics.users.change,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400',
    },
    {
      title: 'Active Projects',
      value: data.metrics.projects.value.toLocaleString(),
      change: data.metrics.projects.change,
      icon: FolderOpen,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      title: 'AI Agents',
      value: data.metrics.agents.value.toLocaleString(),
      change: data.metrics.agents.change,
      icon: Bot,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
    },
    {
      title: 'API Events (MTD)',
      value: data.metrics.apiCalls.value.toLocaleString(),
      change: data.metrics.apiCalls.change,
      icon: Zap,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{card.value}</p>
            </div>
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', card.color)}>
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {card.change >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={cn('text-xs font-medium', card.change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {Math.abs(card.change)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}

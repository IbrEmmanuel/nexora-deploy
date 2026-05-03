'use client';

import { formatDistanceToNow } from 'date-fns';
import { Activity, Bot, UserPlus, Settings, Zap } from 'lucide-react';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const iconMap: Record<string, React.ElementType> = {
  user_joined: UserPlus,
  ai_query: Bot,
  settings_changed: Settings,
  report_generated: Activity,
  default: Zap,
};

const colorMap: Record<string, string> = {
  user_joined: 'bg-indigo-500/10 text-indigo-500',
  ai_query: 'bg-purple-500/10 text-purple-500',
  settings_changed: 'bg-amber-500/10 text-amber-500',
  report_generated: 'bg-emerald-500/10 text-emerald-500',
  default: 'bg-cyan-500/10 text-cyan-500',
};

export function ActivityFeed({ data }: Props) {
  const activities = data.recentActivity;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <span className="text-xs text-muted-foreground">{activities.length} events</span>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Activity className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No activity yet</p>
          <p className="text-xs text-muted-foreground/60">Activity will appear as your team uses the platform</p>
        </div>
      ) : (
        <ul className="divide-y divide-border" role="list">
          {activities.map((item) => {
            const Icon = iconMap[item.type] ?? iconMap.default;
            const color = colorMap[item.type] ?? colorMap.default;
            return (
              <li key={item.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground/60">
                    {item.actor} · {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

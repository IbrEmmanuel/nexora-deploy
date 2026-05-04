'use client';

import { formatDistanceToNow } from 'date-fns';
import { Activity, Bot, UserPlus, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

const iconMap: Record<string, React.ElementType> = {
  user_joined: UserPlus,
  ai_query: Bot,
  settings_changed: Settings,
  report_generated: Activity,
  default: Zap,
};

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  user_joined:       { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  ring: 'ring-indigo-500/20' },
  ai_query:          { bg: 'bg-purple-500/15',  text: 'text-purple-400',  ring: 'ring-purple-500/20' },
  settings_changed:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   ring: 'ring-amber-500/20' },
  report_generated:  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  default:           { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    ring: 'ring-cyan-500/20' },
};

// Gradient avatar backgrounds for actors
const avatarGradients = [
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

export function ActivityFeed({ data }: Props) {
  const activities = data.recentActivity;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <h2 className="font-semibold text-white/90">Recent Activity</h2>
        <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
          {activities.length} events
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Activity className="w-8 h-8 text-white/10" aria-hidden="true" />
          <p className="text-sm text-white/40">No activity yet</p>
          <p className="text-xs text-white/20">Activity will appear as your team uses the platform</p>
        </div>
      ) : (
        <ul className="relative" role="list">
          {/* Vertical connector line */}
          <div className="absolute left-[2.35rem] top-0 bottom-0 w-px bg-white/[0.05]" aria-hidden="true" />

          {activities.map((item, i) => {
            const Icon = iconMap[item.type] ?? iconMap.default;
            const color = colorMap[item.type] ?? colorMap.default;
            const avatarGrad = avatarGradients[i % avatarGradients.length];
            const actorInitials = item.actor
              ? item.actor.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
              : '?';

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors relative"
                role="listitem"
              >
                {/* Colored dot on timeline */}
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 z-10',
                    color.bg, color.ring,
                  )}
                  aria-hidden="true"
                >
                  <Icon className={cn('h-3.5 w-3.5', color.text)} />
                </div>

                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{item.title}</p>
                  <p className="text-sm text-white/40 truncate">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Avatar circle */}
                    <div
                      className={cn('w-4 h-4 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white shrink-0', avatarGrad)}
                      aria-hidden="true"
                    >
                      {actorInitials}
                    </div>
                    <p className="text-xs text-white/25">
                      {item.actor} · {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

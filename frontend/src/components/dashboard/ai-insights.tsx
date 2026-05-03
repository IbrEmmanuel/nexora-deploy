'use client';

import { Bot, TrendingUp, Users, Zap, AlertCircle } from 'lucide-react';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

export function AiInsights({ data }: Props) {
  // Generate real insights from actual data
  const insights = buildInsights(data);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
          <Bot className="h-4 w-4 text-indigo-500" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-semibold">AI Insights</h2>
          <p className="text-xs text-muted-foreground">Based on your real data</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-5">
            <Bot className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground text-center">Insights will appear as your data grows</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/10">
                  <insight.icon className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {insight.confidence}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function buildInsights(data: DashboardData) {
  const insights: Array<{ id: string; icon: React.ElementType; title: string; description: string; confidence: number }> = [];

  const { metrics, recentAgents } = data;

  if (metrics.users.change > 0) {
    insights.push({
      id: 'user-growth',
      icon: TrendingUp,
      title: 'Team is growing',
      description: `User count increased by ${metrics.users.change}% compared to last month. ${metrics.users.value} members are now active.`,
      confidence: 95,
    });
  }

  if (metrics.agents.value > 0) {
    const activeAgents = recentAgents.filter((a) => a.status === 'ACTIVE' || a.status === 'active');
    insights.push({
      id: 'agents-active',
      icon: Bot,
      title: `${metrics.agents.value} AI agent${metrics.agents.value > 1 ? 's' : ''} deployed`,
      description: `${activeAgents.length} agent${activeAgents.length !== 1 ? 's' : ''} currently active. Total tasks completed: ${recentAgents.reduce((s, a) => s + a.tasksCompleted, 0)}.`,
      confidence: 99,
    });
  }

  if (metrics.apiCalls.value > 0) {
    insights.push({
      id: 'api-activity',
      icon: Zap,
      title: 'API activity this month',
      description: `${metrics.apiCalls.value.toLocaleString()} events tracked so far this month${metrics.apiCalls.change !== 0 ? `, ${metrics.apiCalls.change > 0 ? 'up' : 'down'} ${Math.abs(metrics.apiCalls.change)}% vs last month` : ''}.`,
      confidence: 98,
    });
  }

  if (metrics.users.value === 1) {
    insights.push({
      id: 'invite-team',
      icon: Users,
      title: 'Invite your team',
      description: 'You\'re the only member. Invite colleagues to unlock collaboration features and team analytics.',
      confidence: 100,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'getting-started',
      icon: AlertCircle,
      title: 'Getting started',
      description: 'Create AI agents, invite team members, and track events to see personalized insights here.',
      confidence: 100,
    });
  }

  return insights.slice(0, 3);
}

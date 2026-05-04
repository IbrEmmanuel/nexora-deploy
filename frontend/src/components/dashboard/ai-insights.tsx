'use client';

import { useState, useRef } from 'react';
import { Bot, TrendingUp, Users, Zap, AlertCircle, Sparkles, Send } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props { data: DashboardData }

// Animated confidence bar
function ConfidenceBar({ value, color = 'bg-indigo-500' }: { value: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduce = useReducedMotion();

  return (
    <div ref={ref} className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: inView || shouldReduce ? `${value}%` : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      <span className="text-xs text-white/40 w-8 text-right shrink-0">{value}%</span>
    </div>
  );
}

export function AiInsights({ data }: Props) {
  const [askValue, setAskValue] = useState('');
  const [asking, setAsking] = useState(false);
  const insights = buildInsights(data);

  const handleAsk = () => {
    if (!askValue.trim()) return;
    setAsking(true);
    // Simulate response
    setTimeout(() => { setAsking(false); setAskValue(''); }, 1500);
  };

  return (
    <div className="gradient-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </motion.div>
        </div>
        <div>
          <h2 className="font-semibold text-white/90">AI Insights</h2>
          <p className="text-xs text-white/35">Based on your real data</p>
        </div>
      </div>

      {/* Insights */}
      <div className="divide-y divide-white/[0.04]">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-5">
            <Bot className="w-8 h-8 text-white/10" aria-hidden="true" />
            <p className="text-sm text-white/35 text-center">Insights will appear as your data grows</p>
          </div>
        ) : (
          insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15">
                  <insight.icon className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white/80">{insight.title}</p>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{insight.description}</p>
                  <ConfidenceBar value={insight.confidence} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Ask AI input */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.06] px-3 py-2 focus-within:border-indigo-500/40 transition-colors">
          <input
            value={askValue}
            onChange={(e) => setAskValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask AI anything..."
            className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/25 outline-none"
            aria-label="Ask AI a question"
          />
          <button
            onClick={handleAsk}
            disabled={asking || !askValue.trim()}
            aria-label="Send question to AI"
            className="w-7 h-7 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg flex items-center justify-center transition-colors shrink-0"
          >
            {asking ? (
              <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-3 h-3 text-white" aria-hidden="true" />
            )}
          </button>
        </div>
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
      description: "You're the only member. Invite colleagues to unlock collaboration features and team analytics.",
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

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MetricCards } from '@/components/dashboard/metric-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { AiInsights } from '@/components/dashboard/ai-insights';
import { SystemHealth } from '@/components/dashboard/system-health';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { AgentsPanel } from '@/components/dashboard/agents-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

export interface DashboardData {
  organization: { id: string; name: string; plan: string };
  metrics: {
    users: { value: number; change: number };
    projects: { value: number; change: number };
    agents: { value: number; change: number };
    apiCalls: { value: number; change: number };
  };
  recentUsers: Array<{ id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string; avatarUrl: string | null }>;
  recentAgents: Array<{ id: string; name: string; role: string; status: string; tasksCompleted: number; successRate: number; lastActiveAt: string | null }>;
  monthlyEvents: Array<{ _id: string; count: number }>;
  recentActivity: Array<{ id: string; type: string; title: string; description: string; timestamp: string; actor: string }>;
  systemHealth: Array<{ name: string; status: string; latency: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REFRESH_INTERVAL = 30_000;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Wait until NextAuth has resolved the session before reading the token
  const token = status === 'authenticated' ? session?.accessToken : undefined;

  const fetchDashboard = useCallback(async (silent = false) => {
    // Don't fire if session is still loading or token is missing
    if (status === 'loading') return;
    if (status !== 'authenticated' || !token) {
      setLoading(false);
      setError('Session expired. Please sign in again.');
      return;
    }
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/organizations/current/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        setError('Session expired. Please sign in again.');
        return;
      }
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      setData(json.data ?? json);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message ?? 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, status]);

  // Only fetch once the session is authenticated and token is available
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated' && token) {
      fetchDashboard();
    } else if (status === 'authenticated' && !token) {
      // Authenticated but no token — session is stale, stop loading
      setLoading(false);
      setError('Session expired. Please sign in again.');
    }
  }, [status, token, fetchDashboard]);

  // Auto-refresh every 30s (only when authenticated)
  useEffect(() => {
    if (status !== 'authenticated' || !token) return;
    const id = setInterval(() => fetchDashboard(true), REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [status, token, fetchDashboard]);

  // Show skeleton while NextAuth is loading OR while data is fetching
  if (status === 'loading' || (status === 'authenticated' && loading && !data)) {
    return <DashboardSkeleton />;
  }

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-muted-foreground">Failed to load dashboard: {error}</p>
      {error.includes('Session expired') ? (
        <button onClick={() => signIn()} className="text-sm text-indigo-500 hover:text-indigo-400 underline">Sign in again</button>
      ) : (
        <button onClick={() => fetchDashboard()} className="text-sm text-indigo-500 hover:text-indigo-400 underline">Retry</button>
      )}
    </div>
  );

  if (!data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {data.organization?.name} · Real-time overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      <MetricCards data={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart data={data} />
          <ActivityFeed data={data} />
        </div>
        <div className="space-y-6">
          <AiInsights data={data} />
          <SystemHealth data={data} />
          <QuickActions />
        </div>
      </div>

      <AgentsPanel data={data} onRefresh={() => fetchDashboard(true)} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

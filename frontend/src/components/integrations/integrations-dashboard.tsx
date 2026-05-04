'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Plus, CheckCircle2, XCircle, AlertCircle, Key,
  RefreshCw, Zap, Activity, BarChart3, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { IntegrationCard } from './integration-card';
import { IntegrationConfigModal } from './integration-config-modal';
import { ApiKeysPanel } from './api-keys-panel';

const API = process.env.NEXT_PUBLIC_API_URL;

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  color: string;
  description: string;
  docsUrl: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'password' | 'select';
    required: boolean;
    placeholder: string;
    options?: string[];
  }>;
  capabilities: string[];
  webhookPath: string | null;
}

export interface Connection {
  id: string;
  integrationId: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: string;
  lastTestedAt?: string;
  lastError?: string;
  totalCalls: number;
  metadata: Record<string, unknown>;
  credentials: Record<string, string>;
}

export interface Stats {
  apiKeyCount: number;
  connectedCount: number;
  errorCount: number;
  totalCalls: number;
  plan: string;
}

const TABS = [
  { key: 'integrations' as const, label: 'Integrations', icon: GitBranch },
  { key: 'api-keys' as const, label: 'API Keys', icon: Key },
];

const CATEGORIES = ['All', 'Messaging', 'Payments', 'CRM', 'Communications', 'Storage', 'Finance'];

export function IntegrationsDashboard() {
  const { token, ready } = useAuthToken();
  const [activeTab, setActiveTab] = useState<'integrations' | 'api-keys'>('integrations');
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [configModal, setConfigModal] = useState<CatalogItem | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!token || !ready) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [catRes, connRes, statsRes] = await Promise.all([
        fetch(`${API}/integrations/catalog`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/integrations/connections`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/integrations/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [catJson, connJson, statsJson] = await Promise.all([catRes.json(), connRes.json(), statsRes.json()]);
      setCatalog(Array.isArray(catJson.data ?? catJson) ? (catJson.data ?? catJson) : []);
      setConnections(Array.isArray(connJson.data ?? connJson) ? (connJson.data ?? connJson) : []);
      setStats(statsJson.data ?? statsJson);
    } catch {
      if (!silent) toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time polling every 15s
  useEffect(() => {
    if (!ready || !token) return;
    pollRef.current = setInterval(() => fetchData(true), 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [ready, token, fetchData]);

  const getConnection = (integrationId: string) =>
    connections.find((c) => c.integrationId === integrationId);

  const filteredCatalog = selectedCategory === 'All'
    ? catalog
    : catalog.filter((i) => i.category === selectedCategory);

  const connectedCount = stats?.connectedCount ?? connections.filter((c) => c.status === 'connected').length;
  const errorCount = stats?.errorCount ?? connections.filter((c) => c.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations & API</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Connect your tools and manage API access in real time.
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Connected',
            value: connectedCount,
            icon: CheckCircle2,
            gradient: 'from-emerald-600 to-emerald-400',
          },
          {
            label: 'Errors',
            value: errorCount,
            icon: AlertCircle,
            gradient: errorCount > 0 ? 'from-red-600 to-red-400' : 'from-slate-600 to-slate-400',
          },
          {
            label: 'API Keys',
            value: stats?.apiKeyCount ?? 0,
            icon: Key,
            gradient: 'from-indigo-600 to-indigo-400',
          },
          {
            label: 'Total API Calls',
            value: (stats?.totalCalls ?? 0).toLocaleString(),
            icon: Activity,
            gradient: 'from-cyan-600 to-cyan-400',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-4 flex items-center gap-3"
          >
            <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', s.gradient)}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white/90">{s.value}</div>
              <div className="text-xs text-white/35">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.key
                ? 'bg-white/[0.08] text-white/90 shadow-sm'
                : 'text-white/40 hover:text-white/70',
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Integrations tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                    : 'border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/[0.15] bg-white/[0.03]',
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Integration cards grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredCatalog.map((item, i) => (
                  <IntegrationCard
                    key={item.id}
                    item={item}
                    connection={getConnection(item.id)}
                    index={i}
                    onConfigure={() => setConfigModal(item)}
                    onDisconnect={async () => {
                      try {
                        await fetch(`${API}/integrations/connections/${item.id}/disconnect`, {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        toast.success(`${item.name} disconnected`);
                        fetchData(true);
                      } catch {
                        toast.error('Failed to disconnect');
                      }
                    }}
                    onTest={async () => {
                      const res = await fetch(`${API}/integrations/connections/${item.id}/test`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const json = await res.json();
                      const result = json.data ?? json;
                      if (result.success) {
                        toast.success(`✓ ${result.message}${result.latency ? ` (${result.latency}ms)` : ''}`);
                      } else {
                        toast.error(`✗ ${result.message}`);
                      }
                      fetchData(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* API Keys tab */}
      {activeTab === 'api-keys' && (
        <ApiKeysPanel token={token} onRefresh={() => fetchData(true)} />
      )}

      {/* Config modal */}
      <AnimatePresence>
        {configModal && (
          <IntegrationConfigModal
            item={configModal}
            connection={getConnection(configModal.id)}
            token={token}
            onClose={() => setConfigModal(null)}
            onSaved={() => {
              setConfigModal(null);
              fetchData(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

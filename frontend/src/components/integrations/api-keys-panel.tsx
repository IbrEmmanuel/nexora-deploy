'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Key, Copy, Trash2, X, Loader2, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  isActive: boolean;
  rawKey?: string;
}

const SCOPE_OPTIONS = ['read', 'write', 'admin', 'webhooks', 'analytics', 'billing'];

interface Props {
  token?: string;
  onRefresh?: () => void;
}

export function ApiKeysPanel({ token, onRefresh }: Props) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    scopes: ['read'] as string[],
  });

  const fetchKeys = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/integrations/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setApiKeys(Array.isArray(json.data ?? json) ? (json.data ?? json) : []);
    } catch {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const toggleScope = (scope: string) => {
    setForm((p) => ({
      ...p,
      scopes: p.scopes.includes(scope)
        ? p.scopes.filter((s) => s !== scope)
        : [...p.scopes, scope],
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Key name is required'); return; }
    if (form.scopes.length === 0) { toast.error('Select at least one scope'); return; }
    setCreating(true);
    try {
      const res = await fetch(`${API}/integrations/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, scopes: form.scopes }),
      });
      const json = await res.json();
      const key = json.data ?? json;
      if (key.rawKey) {
        setRevealedKey(key.rawKey);
        toast.success('API key created — copy it now!');
      }
      setForm({ name: '', scopes: ['read'] });
      setShowForm(false);
      fetchKeys();
      onRefresh?.();
    } catch {
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    try {
      await fetch(`${API}/integrations/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('API key revoked');
      fetchKeys();
      onRefresh?.();
    } catch {
      toast.error('Failed to revoke key');
    } finally {
      setRevoking(null);
    }
  };

  const scopeColors: Record<string, string> = {
    read: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    write: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    webhooks: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    analytics: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    billing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="space-y-4">
      {/* Revealed key banner */}
      {revealedKey && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <Key className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-400 mb-1.5">
              Copy your API key now — it won't be shown again
            </p>
            <code className="text-xs font-mono bg-muted px-3 py-2 rounded-lg block break-all">
              {revealedKey}
            </code>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { navigator.clipboard.writeText(revealedKey); toast.success('Copied!'); }}
              className="flex items-center gap-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
            <button onClick={() => setRevealedKey(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Panel */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-sm">API Keys</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use API keys to authenticate requests from your applications.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate Key
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="px-5 py-4 border-b border-border bg-muted/20 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Key Name <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Production Backend"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Scopes</label>
                <div className="flex flex-wrap gap-1.5">
                  {SCOPE_OPTIONS.map((scope) => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => toggleScope(scope)}
                      className={cn(
                        'text-[11px] px-2 py-0.5 rounded-full border transition-all',
                        form.scopes.includes(scope)
                          ? scopeColors[scope] ?? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'border-border text-muted-foreground hover:border-foreground/20',
                      )}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating || !form.name.trim()}
                className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {creating ? 'Generating…' : 'Generate'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Keys list */}
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Key className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">No API keys yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Generate a key to authenticate your applications</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs text-indigo-500 hover:text-indigo-400 underline"
            >
              Generate your first key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{key.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs text-muted-foreground font-mono">
                      {key.keyPrefix}{'•'.repeat(12)}
                    </code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(key.keyPrefix); toast.success('Prefix copied'); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="hidden sm:flex gap-1 flex-wrap max-w-[140px]">
                  {key.scopes.map((s) => (
                    <span key={s} className={cn('text-[10px] px-1.5 py-0.5 rounded-full border', scopeColors[s] ?? 'bg-muted text-muted-foreground border-border')}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {key.lastUsedAt
                    ? `Used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                    : 'Never used'}
                </div>
                <button
                  onClick={() => handleRevoke(key.id)}
                  disabled={revoking === key.id}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                >
                  {revoking === key.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Trash2 className="w-3 h-3" />}
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer info */}
        {apiKeys.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-muted/10">
            <p className="text-[11px] text-muted-foreground">
              API keys grant access to your organization's data. Revoke any key that may be compromised.
              Keys are prefixed with <code className="font-mono">ng_live_</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

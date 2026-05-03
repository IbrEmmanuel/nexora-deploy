'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion } from 'framer-motion';
import { Zap, Plus, Play, Pause, Trash2, RefreshCw, CheckCircle2, Clock, X, Bot, Mail, Bell, GitBranch, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Automation {
  id: string; name: string; trigger: string; actions: string[];
  enabled: boolean; runs: number; lastRunAt: string | null; createdAt: string;
  organizationId: string;
}

const TRIGGERS = [
  { value: 'schedule.daily', label: 'Daily Schedule', icon: Clock },
  { value: 'schedule.weekly', label: 'Weekly Schedule', icon: Clock },
  { value: 'event.user_joined', label: 'User Joins', icon: Bell },
  { value: 'event.agent_completed', label: 'Agent Completes Task', icon: Bot },
  { value: 'event.alert_triggered', label: 'Alert Triggered', icon: Bell },
  { value: 'webhook.incoming', label: 'Incoming Webhook', icon: GitBranch },
  { value: 'api.call', label: 'API Call', icon: Activity },
];

const ACTIONS = [
  'Send email notification',
  'Notify Slack channel',
  'Run AI agent task',
  'Generate report',
  'Update CRM record',
  'Trigger webhook',
  'Create task',
];

const triggerColors: Record<string, string> = {
  'schedule.daily': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'schedule.weekly': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'event.user_joined': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'event.agent_completed': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'event.alert_triggered': 'bg-red-500/10 text-red-400 border-red-500/20',
  'webhook.incoming': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'api.call': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export function AutomationDashboard() {
  const { token, ready } = useAuthToken();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', trigger: 'schedule.daily', actions: ['Send email notification'] });

  const fetchAutomations = useCallback(async () => {
    if (!token || !ready) return;
    try {
      const res = await fetch(`${API}/ai/automations`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const json = await res.json();
      const data = json.data ?? json;
      const autos = data.automations ?? data; setAutomations(Array.isArray(autos) ? autos : []);
    } catch { toast.error('Failed to load automations'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchAutomations(); }, [fetchAutomations]);
  useEffect(() => {
    const id = setInterval(fetchAutomations, 15000);
    return () => clearInterval(id);
  }, [fetchAutomations]);

  async function createAutomation() {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/ai/automations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const newAuto = json.data ?? json;
      setAutomations((prev) => [newAuto, ...prev]);
      toast.success(`Automation "${form.name}" created`);
      setShowForm(false);
      setForm({ name: '', trigger: 'schedule.daily', actions: ['Send email notification'] });
    } catch { toast.error('Failed to create automation'); }
    finally { setCreating(false); }
  }

  function toggleAction(action: string) {
    setForm((f) => ({
      ...f,
      actions: f.actions.includes(action)
        ? f.actions.filter((a) => a !== action)
        : [...f.actions, action],
    }));
  }

  const enabled = automations.filter((a) => a.enabled).length;
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automation Flows</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Build trigger-based workflows that run automatically.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAutomations} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
            <Plus className="w-4 h-4" /> New Flow
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Flows', value: automations.length, icon: Zap, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Active', value: enabled, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Total Runs', value: totalRuns.toLocaleString(), icon: Activity, color: 'text-cyan-500 bg-cyan-500/10' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', s.color)}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Create Automation Flow</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Flow Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Daily Report Email"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Trigger</label>
              <select value={form.trigger} onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Actions (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((action) => (
                <button key={action} onClick={() => toggleAction(action)}
                  className={cn('text-xs px-3 py-1.5 rounded-lg border transition-colors',
                    form.actions.includes(action)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-border text-muted-foreground hover:border-indigo-500/40 hover:text-foreground')}>
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createAutomation} disabled={creating || !form.name.trim() || form.actions.length === 0}
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors">
              {creating ? 'Creating...' : 'Create Flow'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Flows list */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
      ) : automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl border border-dashed border-border">
          <Zap className="w-12 h-12 text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">No automation flows yet</p>
          <p className="text-sm text-muted-foreground/60">Create your first flow to automate repetitive tasks</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-indigo-500 hover:text-indigo-400 underline">Create flow</button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((auto, i) => {
            const triggerLabel = TRIGGERS.find((t) => t.value === auto.trigger)?.label ?? auto.trigger;
            const color = triggerColors[auto.trigger] ?? 'bg-muted text-muted-foreground border-border';
            return (
              <motion.div key={auto.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card p-5 hover:border-indigo-500/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', color)}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{auto.name}</span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', color)}>{triggerLabel}</span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border',
                          auto.enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border')}>
                          {auto.enabled ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {auto.actions.map((a) => (
                          <span key={a} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">{a}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{auto.runs} runs</span>
                        {auto.lastRunAt && <span>Last run {formatDistanceToNow(new Date(auto.lastRunAt), { addSuffix: true })}</span>}
                        <span>Created {formatDistanceToNow(new Date(auto.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className={cn('p-2 rounded-lg border transition-colors',
                      auto.enabled ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10')}>
                      {auto.enabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, MessageSquare, Settings, X, Send, Trash2, RefreshCw, CheckCircle2, Clock, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

type AgentStatus = 'ACTIVE' | 'IDLE' | 'PAUSED' | 'LEARNING' | 'active' | 'idle' | 'paused' | 'learning';

interface Agent {
  id: string; name: string; role: string; status: AgentStatus;
  tasksCompleted: number; successRate: number; capabilities: string[];
  systemPrompt?: string; lastActiveAt?: string; createdAt: string;
}

const statusCfg: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  ACTIVE: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400 animate-pulse' },
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400 animate-pulse' },
  LEARNING: { label: 'Learning', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  learning: { label: 'Learning', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  IDLE: { label: 'Idle', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400' },
  idle: { label: 'Idle', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400' },
  PAUSED: { label: 'Paused', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  paused: { label: 'Paused', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
};

const roleGradients: Record<string, string> = {
  SALES: 'from-emerald-500 to-teal-500', SUPPORT: 'from-indigo-500 to-purple-500',
  OPERATIONS: 'from-cyan-500 to-blue-500', FINANCE: 'from-amber-500 to-orange-500',
  EMAIL: 'from-pink-500 to-rose-500', CUSTOM: 'from-violet-500 to-indigo-500',
};

export function AgentsDashboard() {
  const { token, ready } = useAuthToken();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [chatMsg, setChatMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'SUPPORT', systemPrompt: '', capabilities: '' });

  const fetchAgents = useCallback(async () => {
    if (!token || !ready) return;
    try {
      const res = await fetch(`${API}/agents`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return; // Don't update state on auth errors
      const json = await res.json();
      const data = json.data ?? json;
      setAgents(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load agents'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);
  useEffect(() => { const id = setInterval(fetchAgents, 15000); return () => clearInterval(id); }, [fetchAgents]);

  async function createAgent() {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name, role: form.role, systemPrompt: form.systemPrompt,
          capabilities: form.capabilities.split(',').map((c) => c.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Agent "${form.name}" created`);
      setShowForm(false);
      setForm({ name: '', role: 'SUPPORT', systemPrompt: '', capabilities: '' });
      fetchAgents();
    } catch { toast.error('Failed to create agent'); }
    finally { setCreating(false); }
  }

  async function deleteAgent(id: string, name: string) {
    try {
      await fetch(`${API}/agents/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${name} deleted`);
      fetchAgents();
    } catch { toast.error('Failed to delete agent'); }
  }

  async function sendChat() {
    if (!chatMsg.trim() || !chatAgent) return;
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatHistory((h) => [...h, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/agents/${chatAgent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg }),
      });
      const json = await res.json();
      const reply = json.data?.response ?? json.response ?? 'No response from agent.';
      setChatHistory((h) => [...h, { role: 'agent', content: reply }]);
    } catch {
      setChatHistory((h) => [...h, { role: 'agent', content: 'Error: could not reach agent.' }]);
    } finally { setChatLoading(false); }
  }

  const activeCount = agents.filter((a) => ['ACTIVE', 'active'].includes(a.status)).length;
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
  const avgSuccess = agents.length ? Math.round(agents.reduce((s, a) => s + a.successRate, 0) / agents.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Deploy and manage intelligent automation agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAgents} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
            <Plus className="w-4 h-4" /> Create Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Bot, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Active Now', value: activeCount, icon: Activity, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Tasks Completed', value: totalTasks.toLocaleString(), icon: CheckCircle2, color: 'text-cyan-500 bg-cyan-500/10' },
          { label: 'Avg Success Rate', value: `${avgSuccess}%`, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Create New Agent</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Agent Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Sales Agent" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                {['SALES', 'SUPPORT', 'OPERATIONS', 'FINANCE', 'EMAIL', 'CUSTOM'].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Capabilities (comma-separated)</label>
              <input value={form.capabilities} onChange={(e) => setForm((f) => ({ ...f, capabilities: e.target.value }))}
                placeholder="e.g. Lead qualification, CRM updates" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">System Prompt (optional)</label>
              <input value={form.systemPrompt} onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                placeholder="Describe agent behavior..." className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createAgent} disabled={creating || !form.name.trim()}
              className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors">
              {creating ? 'Creating...' : 'Create Agent'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Agents grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl border border-dashed border-border">
          <Bot className="w-12 h-12 text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">No agents yet</p>
          <p className="text-sm text-muted-foreground/60">Create your first AI agent to start automating tasks</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-indigo-500 hover:text-indigo-400 underline">Create agent</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const cfg = statusCfg[agent.status] ?? statusCfg.IDLE;
            const grad = roleGradients[agent.role] ?? roleGradients.CUSTOM;
            return (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:border-indigo-500/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', grad)}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.role}</div>
                    </div>
                  </div>
                  <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border', cfg.bg, cfg.color)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />{cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold">{agent.tasksCompleted}</div>
                    <div className="text-[10px] text-muted-foreground">Tasks done</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold">{Math.round(agent.successRate)}%</div>
                    <div className="text-[10px] text-muted-foreground">Success rate</div>
                  </div>
                </div>

                {agent.capabilities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.capabilities.slice(0, 3).map((c) => (
                      <span key={c} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => { setChatAgent(agent); setChatHistory([]); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-1.5 rounded-lg transition-colors">
                    <MessageSquare className="w-3 h-3" /> Chat
                  </button>
                  <button onClick={() => deleteAgent(agent.id, agent.name)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors border border-border">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {chatAgent && (
          <motion.div initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', roleGradients[chatAgent.role] ?? roleGradients.CUSTOM)}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{chatAgent.name}</div>
                <div className="text-xs text-muted-foreground">{chatAgent.role}</div>
              </div>
              <button onClick={() => setChatAgent(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">Start a conversation with {chatAgent.name}</p>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-xl px-4 py-2.5 text-sm', m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-muted text-foreground')}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-4 py-2.5 text-sm text-muted-foreground">Thinking...</div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
                placeholder={`Message ${chatAgent.name}...`}
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <button onClick={sendChat} disabled={chatLoading || !chatMsg.trim()}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

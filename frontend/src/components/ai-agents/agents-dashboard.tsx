'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, MessageSquare, X, Send, Trash2, RefreshCw, CheckCircle2, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

type AgentStatus = 'ACTIVE' | 'IDLE' | 'PAUSED' | 'LEARNING' | 'active' | 'idle' | 'paused' | 'learning';

interface Agent {
  id: string; name: string; role: string; status: AgentStatus;
  tasksCompleted: number; successRate: number; capabilities: string[];
  systemPrompt?: string; lastActiveAt?: string; createdAt: string;
}

const statusCfg: Record<string, { label: string; color: string; bg: string; dot: string; pulse: boolean }> = {
  ACTIVE:   { label: 'Active',   color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20', dot: 'bg-emerald-400', pulse: true },
  active:   { label: 'Active',   color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20', dot: 'bg-emerald-400', pulse: true },
  LEARNING: { label: 'Learning', color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/20',     dot: 'bg-amber-400',   pulse: false },
  learning: { label: 'Learning', color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/20',     dot: 'bg-amber-400',   pulse: false },
  IDLE:     { label: 'Idle',     color: 'text-white/40',    bg: 'bg-white/[0.06] border-white/[0.08]',     dot: 'bg-white/30',    pulse: false },
  idle:     { label: 'Idle',     color: 'text-white/40',    bg: 'bg-white/[0.06] border-white/[0.08]',     dot: 'bg-white/30',    pulse: false },
  PAUSED:   { label: 'Paused',   color: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/20',         dot: 'bg-red-400',     pulse: false },
  paused:   { label: 'Paused',   color: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/20',         dot: 'bg-red-400',     pulse: false },
};

const roleGradients: Record<string, string> = {
  SALES:      'from-emerald-500 to-teal-500',
  SUPPORT:    'from-indigo-500 to-purple-500',
  OPERATIONS: 'from-cyan-500 to-blue-500',
  FINANCE:    'from-amber-500 to-orange-500',
  EMAIL:      'from-pink-500 to-rose-500',
  CUSTOM:     'from-violet-500 to-indigo-500',
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
      if (!res.ok) return;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Deploy and manage intelligent automation agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAgents} className="p-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70" aria-label="Refresh">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Create Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents',    value: agents.length,              icon: Bot,          gradient: 'from-indigo-600 to-indigo-400' },
          { label: 'Active Now',      value: activeCount,                icon: Activity,     gradient: 'from-emerald-600 to-emerald-400' },
          { label: 'Tasks Completed', value: totalTasks.toLocaleString(),icon: CheckCircle2, gradient: 'from-cyan-600 to-cyan-400' },
          { label: 'Avg Success Rate',value: `${avgSuccess}%`,           icon: Zap,          gradient: 'from-amber-600 to-amber-400' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', s.gradient)}>
                <s.icon className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-bold text-white/90">{s.value}</div>
                <div className="text-xs text-white/35">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 space-y-4 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white/90">Create New Agent</h3>
                <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white/70 transition-colors" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="agent-name">Agent Name *</label>
                  <input
                    id="agent-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Sales Agent"
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="agent-role">Role</label>
                  <select
                    id="agent-role"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {['SALES', 'SUPPORT', 'OPERATIONS', 'FINANCE', 'EMAIL', 'CUSTOM'].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="agent-caps">Capabilities (comma-separated)</label>
                  <input
                    id="agent-caps"
                    value={form.capabilities}
                    onChange={(e) => setForm((f) => ({ ...f, capabilities: e.target.value }))}
                    placeholder="e.g. Lead qualification, CRM updates"
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="agent-prompt">System Prompt (optional)</label>
                  <input
                    id="agent-prompt"
                    value={form.systemPrompt}
                    onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                    placeholder="Describe agent behavior..."
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createAgent}
                  disabled={creating || !form.name.trim()}
                  className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Agent'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-white/40 hover:text-white/70 px-4 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agents grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-white/[0.04] animate-pulse" />)}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 glass rounded-2xl">
          <Bot className="w-12 h-12 text-white/10" aria-hidden="true" />
          <p className="text-white/40 font-medium">No agents yet</p>
          <p className="text-sm text-white/25">Create your first AI agent to start automating tasks</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-indigo-400 hover:text-indigo-300 underline">Create agent</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const cfg = statusCfg[agent.status] ?? statusCfg.IDLE;
            const grad = roleGradients[agent.role] ?? roleGradients.CUSTOM;
            const progress = Math.min(100, agent.tasksCompleted > 0 ? Math.round(agent.successRate) : 0);

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 hover:border-white/[0.12] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Gradient ring avatar */}
                    <div className="relative">
                      <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br blur-[3px] opacity-50', grad)} aria-hidden="true" />
                      <div className={cn('relative w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', grad)}>
                        <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-white/80">{agent.name}</div>
                      <div className="text-xs text-white/35">{agent.role}</div>
                    </div>
                  </div>
                  <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border', cfg.bg, cfg.color)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot, cfg.pulse && 'animate-pulse')} aria-hidden="true" />
                    {cfg.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                    <div className="text-lg font-bold text-white/80">{agent.tasksCompleted}</div>
                    <div className="text-[10px] text-white/30">Tasks done</div>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                    <div className="text-lg font-bold text-white/80">{Math.round(agent.successRate)}%</div>
                    <div className="text-[10px] text-white/30">Success rate</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-white/25 mb-1">
                    <span>Task progress</span><span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full bg-gradient-to-r', grad)}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                    />
                  </div>
                </div>

                {agent.capabilities?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.capabilities.slice(0, 3).map((c) => (
                      <span key={c} className="text-[10px] bg-white/[0.04] text-white/35 px-1.5 py-0.5 rounded border border-white/[0.06]">{c}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => { setChatAgent(agent); setChatHistory([]); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-1.5 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" aria-hidden="true" /> Chat
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id, agent.name)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors border border-white/[0.06]"
                    aria-label={`Delete ${agent.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
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
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 glass-md border-l border-white/[0.08] shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', roleGradients[chatAgent.role] ?? roleGradients.CUSTOM)}>
                <Bot className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white/80">{chatAgent.name}</div>
                <div className="text-xs text-white/35">{chatAgent.role}</div>
              </div>
              <button onClick={() => setChatAgent(null)} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors text-white/30 hover:text-white/70" aria-label="Close chat">
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 && (
                <p className="text-xs text-white/25 text-center py-8">Start a conversation with {chatAgent.name}</p>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-xl px-4 py-2.5 text-sm', m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-white/70')}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/40">Thinking...</div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/[0.06] flex gap-2">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
                placeholder={`Message ${chatAgent.name}...`}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                aria-label="Chat message"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatMsg.trim()}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

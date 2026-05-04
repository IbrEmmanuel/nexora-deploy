'use client';

import { useState } from 'react';
import { Bot, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useAuthToken } from '@/lib/use-auth-token';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props {
  data: DashboardData;
  onRefresh: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const roleGradients: Record<string, string> = {
  SALES:      'from-emerald-500 to-teal-500',
  SUPPORT:    'from-indigo-500 to-purple-500',
  OPERATIONS: 'from-cyan-500 to-blue-500',
  FINANCE:    'from-amber-500 to-orange-500',
  EMAIL:      'from-pink-500 to-rose-500',
  CUSTOM:     'from-violet-500 to-indigo-500',
};

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  ACTIVE:   { label: 'Active',   dot: 'bg-emerald-500 animate-pulse', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  active:   { label: 'Active',   dot: 'bg-emerald-500 animate-pulse', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  IDLE:     { label: 'Idle',     dot: 'bg-slate-400',                 badge: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  idle:     { label: 'Idle',     dot: 'bg-slate-400',                 badge: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  PAUSED:   { label: 'Paused',   dot: 'bg-amber-500',                 badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  paused:   { label: 'Paused',   dot: 'bg-amber-500',                 badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  LEARNING: { label: 'Learning', dot: 'bg-indigo-500',                badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
  learning: { label: 'Learning', dot: 'bg-indigo-500',                badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
};

export function AgentsPanel({ data, onRefresh }: Props) {
  const { token } = useAuthToken();
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'SUPPORT', systemPrompt: '' });
  const [chatAgent, setChatAgent] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const agents = data.recentAgents;

  async function createAgent() {
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, role: form.role, capabilities: [], systemPrompt: form.systemPrompt }),
      });
      if (!res.ok) throw new Error('Failed to create agent');
      toast.success(`Agent "${form.name}" created`);
      setShowForm(false);
      setForm({ name: '', role: 'SUPPORT', systemPrompt: '' });
      onRefresh();
    } catch {
      toast.error('Failed to create agent');
    } finally {
      setCreating(false);
    }
  }

  async function sendChat() {
    if (!chatMsg.trim() || !chatAgent) return;
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatHistory((h) => [...h, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch(`${API_URL}/agents/${chatAgent}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg }),
      });
      const json = await res.json();
      const reply = json.data?.response ?? json.response ?? 'No response';
      setChatHistory((h) => [...h, { role: 'assistant', content: reply }]);
    } catch {
      setChatHistory((h) => [...h, { role: 'assistant', content: 'Error: could not reach agent.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30">
            <Bot className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-white/90">AI Agents</h2>
            <p className="text-xs text-white/35">{agents.length} deployed</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" /> New Agent
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-b border-white/[0.06] p-5 bg-white/[0.02] space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Create New Agent</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="agent-name">Name</label>
                  <input
                    id="agent-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Sales Agent"
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40"
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
                    {['SALES', 'SUPPORT', 'OPERATIONS', 'FINANCE', 'EMAIL', 'CUSTOM'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createAgent}
                  disabled={creating || !form.name.trim()}
                  className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Agent'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-xs text-white/40 hover:text-white/70 px-4 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agents grid */}
      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Bot className="w-10 h-10 text-white/10" aria-hidden="true" />
          <p className="text-sm text-white/40">No agents yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Create your first agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
          {agents.map((agent, i) => {
            const cfg = statusConfig[agent.status] ?? statusConfig.IDLE;
            const grad = roleGradients[agent.role] ?? roleGradients.CUSTOM;
            const progress = Math.min(100, agent.tasksCompleted > 0 ? Math.round(agent.successRate) : 0);

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-xl p-4 space-y-3 hover:border-white/[0.12] transition-all"
              >
                {/* Avatar + status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Gradient ring avatar */}
                    <div className="relative">
                      <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br blur-[3px] opacity-50', grad)} aria-hidden="true" />
                      <div className={cn('relative w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', grad)}>
                        <Bot className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80 truncate max-w-[90px]">{agent.name}</p>
                      <p className="text-[10px] text-white/35">{agent.role}</p>
                    </div>
                  </div>
                  {/* Status pulse */}
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} aria-hidden="true" />
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', cfg.badge)}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/[0.04] rounded-lg p-2 text-center">
                    <div className="font-bold text-sm text-white/80">{agent.tasksCompleted}</div>
                    <div className="text-white/30">Tasks</div>
                  </div>
                  <div className="bg-white/[0.04] rounded-lg p-2 text-center">
                    <div className="font-bold text-sm text-white/80">{Math.round(agent.successRate)}%</div>
                    <div className="text-white/30">Success</div>
                  </div>
                </div>

                {/* Task progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-white/30 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
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

                <button
                  onClick={() => { setChatAgent(agent.id); setChatHistory([]); }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-medium border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 py-1.5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3 h-3" aria-hidden="true" /> Chat
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Chat modal */}
      <AnimatePresence>
        {chatAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md glass-md border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  <span className="font-semibold text-sm text-white/80">
                    {agents.find((a) => a.id === chatAgent)?.name ?? 'Agent'}
                  </span>
                </div>
                <button
                  onClick={() => setChatAgent(null)}
                  className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
                {chatHistory.length === 0 && (
                  <p className="text-xs text-white/25 text-center py-4">Send a message to start chatting</p>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                      m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-white/70',
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.06] rounded-xl px-3 py-2 text-sm text-white/40">Thinking...</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 p-4 border-t border-white/[0.06]">
                <input
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
                  placeholder="Ask the agent..."
                  className="flex-1 h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/70 placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-label="Chat message"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatMsg.trim()}
                  className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

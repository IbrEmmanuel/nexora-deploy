'use client';

import { useState } from 'react';
import { Bot, Plus, Play, Pause, Trash2, MessageSquare, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useAuthToken } from '@/lib/use-auth-token';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/app/(dashboard)/dashboard/page';

interface Props {
  data: DashboardData;
  onRefresh: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const roleColors: Record<string, string> = {
  SALES: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  SUPPORT: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  OPERATIONS: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  FINANCE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  EMAIL: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  CUSTOM: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const statusDot: Record<string, string> = {
  ACTIVE: 'bg-emerald-500',
  active: 'bg-emerald-500',
  IDLE: 'bg-slate-400',
  idle: 'bg-slate-400',
  PAUSED: 'bg-amber-500',
  paused: 'bg-amber-500',
  LEARNING: 'bg-indigo-500',
  learning: 'bg-indigo-500',
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
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Bot className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <h2 className="font-semibold">AI Agents</h2>
            <p className="text-xs text-muted-foreground">{agents.length} deployed</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> New Agent
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="border-b border-border p-5 bg-muted/30 space-y-3">
          <h3 className="text-sm font-semibold">Create New Agent</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Sales Agent"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {['SALES', 'SUPPORT', 'OPERATIONS', 'FINANCE', 'EMAIL', 'CUSTOM'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">System Prompt (optional)</label>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
              placeholder="Describe the agent's behavior and goals..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
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
              className="text-xs text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Agents grid */}
      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Bot className="w-10 h-10 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No agents yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-indigo-500 hover:text-indigo-400 underline"
          >
            Create your first agent
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-border bg-background p-4 space-y-3 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold truncate max-w-[100px]">{agent.name}</p>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', roleColors[agent.role] ?? roleColors.CUSTOM)}>
                      {agent.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={cn('w-2 h-2 rounded-full', statusDot[agent.status] ?? 'bg-slate-400')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <div className="font-bold text-sm">{agent.tasksCompleted}</div>
                  <div className="text-muted-foreground">Tasks</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-center">
                  <div className="font-bold text-sm">{Math.round(agent.successRate)}%</div>
                  <div className="text-muted-foreground">Success</div>
                </div>
              </div>

              <button
                onClick={() => { setChatAgent(agent.id); setChatHistory([]); }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 py-1.5 rounded-lg transition-colors"
              >
                <MessageSquare className="w-3 h-3" /> Chat
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat modal */}
      {chatAgent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-500" />
                <span className="font-semibold text-sm">
                  {agents.find((a) => a.id === chatAgent)?.name ?? 'Agent'}
                </span>
              </div>
              <button onClick={() => setChatAgent(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {chatHistory.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Send a message to start chatting</p>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-xl px-3 py-2 text-sm', m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-muted text-foreground')}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">Thinking...</div>
                </div>
              )}
            </div>

            <div className="flex gap-2 p-4 border-t border-border">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
                placeholder="Ask the agent..."
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatMsg.trim()}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

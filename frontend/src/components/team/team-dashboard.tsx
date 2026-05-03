'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Mail, MoreHorizontal, Search, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Member {
  id: string; firstName: string; lastName: string; email: string;
  role: string; status: string; lastLoginAt?: string; createdAt: string; avatarUrl?: string;
}

const roleCfg: Record<string, { color: string; bg: string }> = {
  SUPER_ADMIN: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ADMIN: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  MANAGER: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  MEMBER: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  VIEWER: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  GUEST: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};

const statusCfg: Record<string, { color: string; dot: string }> = {
  ACTIVE: { color: 'text-emerald-500', dot: 'bg-emerald-500' },
  INACTIVE: { color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  SUSPENDED: { color: 'text-red-500', dot: 'bg-red-500' },
  PENDING_VERIFICATION: { color: 'text-amber-500', dot: 'bg-amber-500' },
};

export function TeamDashboard() {
  const { token, ready } = useAuthToken();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!token || !ready) return;
    try {
      const res = await fetch(`${API}/users?pageSize=50${search ? `&search=${encodeURIComponent(search)}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      const payload = json.data ?? json;
      const items = payload.items ?? payload; setMembers(Array.isArray(items) ? items : []);
    } catch { toast.error('Failed to load team members'); }
    finally { setLoading(false); }
  }, [token, search]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function sendInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch(`${API}/users/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteOpen(false);
      setInviteEmail('');
    } catch { toast.error('Failed to send invitation'); }
    finally { setInviting(false); }
  }

  const active = members.filter((m) => m.status === 'ACTIVE').length;
  const admins = members.filter((m) => ['ADMIN', 'SUPER_ADMIN'].includes(m.role)).length;
  const pending = members.filter((m) => m.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects & Teams</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage team members, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMembers} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Active', value: active, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Admins', value: admins, icon: Shield, color: 'text-red-500 bg-red-500/10' },
          { label: 'Pending', value: pending, icon: Mail, color: 'text-amber-500 bg-amber-500/10' },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
      </div>

      {/* Members table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Team Members</h3>
          <span className="text-xs text-muted-foreground">{members.length} members</span>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Users className="w-8 h-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">No members found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {members.map((member, i) => {
              const role = roleCfg[member.role] ?? roleCfg.MEMBER;
              const status = statusCfg[member.status] ?? statusCfg.INACTIVE;
              const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
              return (
                <motion.div key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{member.firstName} {member.lastName}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border hidden sm:inline-flex', role.bg, role.color)}>
                    {member.role}
                  </span>
                  <div className={cn('flex items-center gap-1.5 text-xs hidden md:flex', status.color)}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                    {member.status === 'PENDING_VERIFICATION' ? 'Pending' : member.status.charAt(0) + member.status.slice(1).toLowerCase()}
                  </div>
                  <div className="text-xs text-muted-foreground hidden lg:block w-28 text-right">
                    {member.lastLoginAt ? formatDistanceToNow(new Date(member.lastLoginAt), { addSuffix: true }) : 'Never'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Invite Team Member</h2>
              <button onClick={() => setInviteOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Email address</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  {['MEMBER', 'MANAGER', 'ADMIN', 'VIEWER', 'GUEST'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setInviteOpen(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={sendInvite} disabled={inviting || !inviteEmail.trim()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

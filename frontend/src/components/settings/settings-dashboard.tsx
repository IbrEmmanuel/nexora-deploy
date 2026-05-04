'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { User, Building2, Shield, Bell, Palette, ChevronRight, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL;

const sections = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'organization',  label: 'Organization',  icon: Building2 },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
];

interface UserData { id: string; firstName: string; lastName: string; email: string; jobTitle?: string; bio?: string; department?: string; timezone?: string; }
interface OrgData { id: string; name: string; website?: string; industry?: string; plan: string; }

// Gradient toggle switch
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
        checked
          ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/30'
          : 'bg-white/[0.08]',
      )}
    >
      <motion.span
        animate={{ x: checked ? 16 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

export function SettingsDashboard() {
  const { token, ready } = useAuthToken();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('profile');
  const [user, setUser] = useState<UserData | null>(null);
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', jobTitle: '', bio: '', department: '', timezone: 'UTC' });
  const [orgForm, setOrgForm] = useState({ name: '', website: '', industry: '' });
  const [notifToggles, setNotifToggles] = useState({ email: true, agents: true, energy: true, digest: false });

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const [userRes, orgRes] = await Promise.all([
        fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/organizations/current`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!userRes.ok || !orgRes.ok) return;
      const [userJson, orgJson] = await Promise.all([userRes.json(), orgRes.json()]);
      const u = userJson.data ?? userJson;
      const o = orgJson.data ?? orgJson;
      setUser(u);
      setOrg(o);
      setProfileForm({ firstName: u.firstName ?? '', lastName: u.lastName ?? '', jobTitle: u.jobTitle ?? '', bio: u.bio ?? '', department: u.department ?? '', timezone: u.timezone ?? 'UTC' });
      setOrgForm({ name: o.name ?? '', website: o.website ?? '', industry: o.industry ?? '' });
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function saveProfile() {
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Profile updated');
      fetchData();
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  }

  async function saveOrg() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/organizations/current`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orgForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Organization updated');
      fetchData();
    } catch { toast.error('Failed to save organization'); }
    finally { setSaving(false); }
  }

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '?';

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your account, organization, and preferences.</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70" aria-label="Refresh">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} aria-hidden="true" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left nav */}
        <div className="w-52 shrink-0">
          <nav className="space-y-0.5" aria-label="Settings sections">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  active === s.id
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80',
                )}
                aria-current={active === s.id ? 'page' : undefined}
              >
                <s.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {s.label}
                {active === s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" aria-hidden="true" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {active === 'profile' && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="font-semibold text-lg text-white/90">Profile Settings</h2>
                  {loading ? <div className="h-48 bg-white/[0.04] animate-pulse rounded-xl" /> : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 blur-[4px] opacity-50" aria-hidden="true" />
                          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white ring-2 ring-indigo-500/30">
                            {initials}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-white/80">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-white/35">{user?.email}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { label: 'First Name', key: 'firstName' as const },
                          { label: 'Last Name',  key: 'lastName' as const },
                          { label: 'Job Title',  key: 'jobTitle' as const },
                          { label: 'Department', key: 'department' as const },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="text-sm font-medium text-white/60 block mb-1.5" htmlFor={`profile-${f.key}`}>{f.label}</label>
                            <input
                              id={`profile-${f.key}`}
                              value={profileForm[f.key]}
                              onChange={(e) => setProfileForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              className={inputClass}
                            />
                          </div>
                        ))}
                        <div className="sm:col-span-2">
                          <label className="text-sm font-medium text-white/60 block mb-1.5" htmlFor="profile-bio">Bio</label>
                          <textarea
                            id="profile-bio"
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                            rows={3}
                            className={cn(inputClass, 'resize-none')}
                          />
                        </div>
                      </div>
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {active === 'organization' && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="font-semibold text-lg text-white/90">Organization Settings</h2>
                  {loading ? <div className="h-48 bg-white/[0.04] animate-pulse rounded-xl" /> : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Organization Name', key: 'name' as const },
                          { label: 'Website',           key: 'website' as const },
                          { label: 'Industry',          key: 'industry' as const },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="text-sm font-medium text-white/60 block mb-1.5" htmlFor={`org-${f.key}`}>{f.label}</label>
                            <input
                              id={`org-${f.key}`}
                              value={orgForm[f.key]}
                              onChange={(e) => setOrgForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              className={inputClass}
                            />
                          </div>
                        ))}
                        <div>
                          <label className="text-sm font-medium text-white/60 block mb-1.5">Plan</label>
                          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/40">{org?.plan ?? 'FREE'}</div>
                        </div>
                      </div>
                      <button
                        onClick={saveOrg}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                      >
                        <Save className="w-4 h-4" aria-hidden="true" /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {active === 'security' && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="font-semibold text-lg text-white/90">Security</h2>
                  {[
                    { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', action: 'Enable 2FA', primary: true },
                    { title: 'Change Password',           desc: 'Update your account password',                  action: 'Update',     primary: false },
                    { title: 'Active Sessions',           desc: 'View and revoke active login sessions',         action: 'View Sessions', primary: false },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                      <div>
                        <div className="font-medium text-sm text-white/80">{item.title}</div>
                        <div className="text-xs text-white/35 mt-0.5">{item.desc}</div>
                      </div>
                      <button className={cn(
                        'text-xs font-semibold px-4 py-2 rounded-xl transition-colors',
                        item.primary
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/20'
                          : 'border border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:text-white/80',
                      )}>
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {active === 'notifications' && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="font-semibold text-lg text-white/90">Notification Preferences</h2>
                  {[
                    { key: 'email' as const,  label: 'Email notifications',  desc: 'Receive updates via email' },
                    { key: 'agents' as const, label: 'Agent task alerts',     desc: 'Get notified when agents complete tasks' },
                    { key: 'energy' as const, label: 'Energy alerts',         desc: 'Receive IoT device alerts' },
                    { key: 'digest' as const, label: 'Weekly digest',         desc: 'Weekly summary of platform activity' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                      <div>
                        <div className="font-medium text-sm text-white/80">{item.label}</div>
                        <div className="text-xs text-white/35 mt-0.5">{item.desc}</div>
                      </div>
                      <Toggle
                        checked={notifToggles[item.key]}
                        onChange={(v) => setNotifToggles((t) => ({ ...t, [item.key]: v }))}
                        label={item.label}
                      />
                    </div>
                  ))}
                </div>
              )}

              {active === 'appearance' && (
                <div className="glass rounded-2xl p-6 space-y-6">
                  <h2 className="font-semibold text-lg text-white/90">Appearance</h2>
                  <div>
                    <label className="text-sm font-medium text-white/60 block mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'dark',   label: 'Dark',   desc: 'Deep navy, neon accents' },
                        { value: 'light',  label: 'Light',  desc: 'Clean enterprise feel' },
                        { value: 'system', label: 'System', desc: 'Follows OS preference' },
                      ].map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setTheme(t.value)}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-all',
                            theme === t.value
                              ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                              : 'border-white/[0.08] hover:border-indigo-500/30 hover:bg-white/[0.04]',
                          )}
                        >
                          <div className="font-medium text-sm text-white/80 mb-0.5">{t.label}</div>
                          <div className="text-xs text-white/35">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

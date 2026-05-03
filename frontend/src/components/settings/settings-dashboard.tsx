'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { User, Building2, Shield, Bell, Palette, ChevronRight, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const API = process.env.NEXT_PUBLIC_API_URL;

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

interface UserData { id: string; firstName: string; lastName: string; email: string; jobTitle?: string; bio?: string; department?: string; timezone?: string; }
interface OrgData { id: string; name: string; website?: string; industry?: string; plan: string; }

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

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your account, organization, and preferences.</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 shrink-0">
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                  active === s.id ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                <s.icon className="w-4 h-4 shrink-0" />
                {s.label}
                {active === s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === 'profile' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg">Profile Settings</h2>
              {loading ? <div className="h-48 bg-muted animate-pulse rounded-lg" /> : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', key: 'firstName' as const },
                      { label: 'Last Name', key: 'lastName' as const },
                      { label: 'Job Title', key: 'jobTitle' as const },
                      { label: 'Department', key: 'department' as const },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-sm font-medium block mb-1.5">{f.label}</label>
                        <input value={profileForm[f.key]} onChange={(e) => setProfileForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium block mb-1.5">Bio</label>
                      <textarea value={profileForm.bio} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} rows={3}
                        className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                    </div>
                  </div>
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          )}

          {active === 'organization' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg">Organization Settings</h2>
              {loading ? <div className="h-48 bg-muted animate-pulse rounded-lg" /> : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Organization Name', key: 'name' as const },
                      { label: 'Website', key: 'website' as const },
                      { label: 'Industry', key: 'industry' as const },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-sm font-medium block mb-1.5">{f.label}</label>
                        <input value={orgForm[f.key]} onChange={(e) => setOrgForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    ))}
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Plan</label>
                      <div className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">{org?.plan ?? 'FREE'}</div>
                    </div>
                  </div>
                  <button onClick={saveOrg} disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          )}

          {active === 'security' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Security</h2>
              {[
                { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', action: 'Enable 2FA', variant: 'primary' },
                { title: 'Change Password', desc: 'Update your account password', action: 'Update', variant: 'secondary' },
                { title: 'Active Sessions', desc: 'View and revoke active login sessions', action: 'View Sessions', variant: 'secondary' },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <button className={cn('text-xs font-semibold px-4 py-2 rounded-lg transition-colors',
                    item.variant === 'primary' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'border border-border hover:bg-muted')}>
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          )}

          {active === 'notifications' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Notification Preferences</h2>
              {[
                { label: 'Email notifications', desc: 'Receive updates via email' },
                { label: 'Agent task alerts', desc: 'Get notified when agents complete tasks' },
                { label: 'Energy alerts', desc: 'Receive IoT device alerts' },
                { label: 'Weekly digest', desc: 'Weekly summary of platform activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                  <button className="w-10 h-6 bg-indigo-600 rounded-full relative transition-colors">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {active === 'appearance' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <div>
                <label className="text-sm font-medium block mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dark', label: 'Dark', desc: 'Deep navy, neon accents' },
                    { value: 'light', label: 'Light', desc: 'Clean enterprise feel' },
                    { value: 'system', label: 'System', desc: 'Follows OS preference' },
                  ].map((t) => (
                    <button key={t.value} onClick={() => setTheme(t.value)}
                      className={cn('p-4 rounded-xl border text-left transition-all',
                        theme === t.value ? 'border-indigo-500 bg-indigo-500/10' : 'border-border hover:border-indigo-500/40')}>
                      <div className="font-medium text-sm mb-0.5">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

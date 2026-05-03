'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion } from 'framer-motion';
import { Wifi, Sun, Battery, Zap, AlertTriangle, CheckCircle2, MapPin, Activity, RefreshCw, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Device { id: string; name: string; deviceType: string; status: string; location?: string; lastSeenAt?: string; alerts: any[]; readings: any[]; }
interface Alert { id: string; severity: string; message: string; resolved: boolean; createdAt: string; device: { name: string; deviceType: string }; }
interface Stats { total: number; online: number; warnings: number; faults: number; totalAlerts: number; byType: Record<string, number>; devices: Device[]; }

const statusCfg: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  ONLINE: { color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500', label: 'Online' },
  OFFLINE: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400', label: 'Offline' },
  WARNING: { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500', label: 'Warning' },
  FAULT: { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500', label: 'Fault' },
  MAINTENANCE: { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500', label: 'Maintenance' },
};

const deviceIcons: Record<string, React.ElementType> = {
  SOLAR_PANEL: Sun, BATTERY: Battery, INVERTER: Activity, EV_CHARGER: Zap,
  SMART_METER: Wifi, WIND_TURBINE: Activity, SENSOR: Wifi,
};

export function EnergyDashboard() {
  const { token, ready } = useAuthToken();
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'alerts'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [form, setForm] = useState({ name: '', deviceType: 'SOLAR_PANEL', location: '' });
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const [statsRes, alertsRes] = await Promise.all([
        fetch(`${API}/energy/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/energy/alerts`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!statsRes.ok || !alertsRes.ok) return;
      const [statsJson, alertsJson] = await Promise.all([statsRes.json(), alertsRes.json()]);
      setStats(statsJson.data ?? statsJson);
      const alertsData = alertsJson.data ?? alertsJson;
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch { toast.error('Failed to load energy data'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const id = setInterval(fetchData, 20000); return () => clearInterval(id); }, [fetchData]);

  async function addDevice() {
    if (!form.name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`${API}/energy/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(`Device "${form.name}" registered`);
      setShowAddDevice(false);
      setForm({ name: '', deviceType: 'SOLAR_PANEL', location: '' });
      fetchData();
    } catch { toast.error('Failed to add device'); }
    finally { setAdding(false); }
  }

  async function resolveAlert(id: string) {
    try {
      await fetch(`${API}/energy/alerts/${id}/resolve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      toast.success('Alert resolved');
      fetchData();
    } catch { toast.error('Failed to resolve alert'); }
  }

  const devices = stats?.devices ?? [];
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Energy & IoT Infrastructure</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Real-time monitoring of all energy assets and IoT devices.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: loading ? '—' : stats?.total ?? 0, icon: Wifi, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Online', value: loading ? '—' : stats?.online ?? 0, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Warnings / Faults', value: loading ? '—' : `${stats?.warnings ?? 0} / ${stats?.faults ?? 0}`, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Active Alerts', value: loading ? '—' : unresolvedAlerts.length, icon: Zap, color: 'text-red-500 bg-red-500/10' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', m.color)}>
                <m.icon className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </div>
            <div className="text-2xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Add device form */}
      {showAddDevice && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Register New Device</h3>
            <button onClick={() => setShowAddDevice(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Device Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Solar Array Alpha" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Device Type</label>
              <select value={form.deviceType} onChange={(e) => setForm((f) => ({ ...f, deviceType: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                {['SOLAR_PANEL', 'BATTERY', 'INVERTER', 'EV_CHARGER', 'SMART_METER', 'WIND_TURBINE', 'SENSOR'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Location</label>
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Site A — North" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addDevice} disabled={adding || !form.name.trim()}
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors">
              {adding ? 'Registering...' : 'Register Device'}
            </button>
            <button onClick={() => setShowAddDevice(false)} className="text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {(['overview', 'assets', 'alerts'] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              activeTab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {t} {t === 'alerts' && unresolvedAlerts.length > 0 && (
              <span className="ml-1 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">{unresolvedAlerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats?.byType ?? {}).map(([type, count]) => {
            const Icon = deviceIcons[type] ?? Wifi;
            return (
              <div key={type} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{type.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-muted-foreground">{count} device{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (count / (stats?.total || 1)) * 100)}%` }} />
                </div>
              </div>
            );
          })}
          {!loading && Object.keys(stats?.byType ?? {}).length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed border-border">
              <Wifi className="w-10 h-10 text-muted-foreground/20" />
              <p className="text-muted-foreground">No devices registered yet</p>
              <button onClick={() => setShowAddDevice(true)} className="text-sm text-indigo-500 hover:text-indigo-400 underline">Add your first device</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Asset Registry</h3>
            <span className="text-xs text-muted-foreground">{devices.length} devices</span>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}</div>
          ) : devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Wifi className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No devices registered</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {devices.map((device, i) => {
                const cfg = statusCfg[device.status] ?? statusCfg.OFFLINE;
                const Icon = deviceIcons[device.deviceType] ?? Wifi;
                return (
                  <motion.div key={device.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{device.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{device.deviceType.replace(/_/g, ' ')}</span>
                      </div>
                      {device.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" /> {device.location}
                        </div>
                      )}
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-muted-foreground">
                        {device.lastSeenAt ? formatDistanceToNow(new Date(device.lastSeenAt), { addSuffix: true }) : 'Never seen'}
                      </div>
                      {device.alerts.length > 0 && (
                        <div className="text-xs text-red-400">{device.alerts.length} alert{device.alerts.length > 1 ? 's' : ''}</div>
                      )}
                    </div>
                    <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shrink-0', cfg.bg, cfg.color)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />{cfg.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>
          ) : unresolvedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed border-border">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/30" />
              <p className="text-muted-foreground">No active alerts</p>
              <p className="text-sm text-muted-foreground/60">All systems are operating normally</p>
            </div>
          ) : (
            unresolvedAlerts.map((alert, i) => {
              const sev = alert.severity.toLowerCase();
              const color = sev === 'critical' ? 'text-red-500 bg-red-500/10 border-red-500/20' : sev === 'warning' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-blue-500 bg-blue-500/10 border-blue-500/20';
              return (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className={cn('flex items-start gap-4 p-4 rounded-xl border', color)}>
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{alert.device?.name ?? 'Unknown Device'}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', color)}>{alert.severity}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</p>
                  </div>
                  <button onClick={() => resolveAlert(alert.id)}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors shrink-0 hover:bg-muted">
                    Resolve
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

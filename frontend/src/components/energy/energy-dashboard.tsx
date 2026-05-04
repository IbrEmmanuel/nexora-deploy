'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Sun, Battery, Zap, AlertTriangle, CheckCircle2, MapPin, Activity, RefreshCw, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, TooltipProps,
} from 'recharts';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Device { id: string; name: string; deviceType: string; status: string; location?: string; lastSeenAt?: string; alerts: any[]; readings: any[]; }
interface Alert { id: string; severity: string; message: string; resolved: boolean; createdAt: string; device: { name: string; deviceType: string }; }
interface Stats { total: number; online: number; warnings: number; faults: number; totalAlerts: number; byType: Record<string, number>; devices: Device[]; }

const statusCfg: Record<string, { color: string; bg: string; dot: string; pulse: boolean; label: string }> = {
  ONLINE:      { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20', dot: 'bg-emerald-500', pulse: true,  label: 'Online' },
  OFFLINE:     { color: 'text-white/40',    bg: 'bg-white/[0.06] border-white/[0.08]',     dot: 'bg-white/30',   pulse: false, label: 'Offline' },
  WARNING:     { color: 'text-amber-400',   bg: 'bg-amber-500/15 border-amber-500/20',     dot: 'bg-amber-500',  pulse: true,  label: 'Warning' },
  FAULT:       { color: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/20',         dot: 'bg-red-500',    pulse: true,  label: 'Fault' },
  MAINTENANCE: { color: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/20',       dot: 'bg-blue-500',   pulse: false, label: 'Maintenance' },
};

const deviceIcons: Record<string, React.ElementType> = {
  SOLAR_PANEL: Sun, BATTERY: Battery, INVERTER: Activity, EV_CHARGER: Zap,
  SMART_METER: Wifi, WIND_TURBINE: Activity, SENSOR: Wifi,
};

const deviceGradients: Record<string, string> = {
  SOLAR_PANEL: 'from-amber-500 to-orange-500',
  BATTERY:     'from-emerald-500 to-teal-500',
  INVERTER:    'from-indigo-500 to-purple-500',
  EV_CHARGER:  'from-cyan-500 to-blue-500',
  SMART_METER: 'from-violet-500 to-indigo-500',
  WIND_TURBINE:'from-sky-500 to-cyan-500',
  SENSOR:      'from-pink-500 to-rose-500',
};

// Mock power consumption data for chart
const mockPowerData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  kw: Math.round(200 + Math.random() * 600 + Math.sin(i / 4) * 150),
}));

function GlassTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-md rounded-xl px-3 py-2.5 border border-white/[0.10] shadow-xl">
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white/90">{payload[0]?.value?.toLocaleString()} <span className="text-white/40 font-normal text-xs">kW</span></p>
    </div>
  );
}

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

  const kpiCards = [
    { label: 'Total Devices', value: loading ? '—' : stats?.total ?? 0, icon: Wifi, gradient: 'from-indigo-600 to-indigo-400', glow: 'shadow-indigo-500/20' },
    { label: 'Online', value: loading ? '—' : stats?.online ?? 0, icon: CheckCircle2, gradient: 'from-emerald-600 to-emerald-400', glow: 'shadow-emerald-500/20' },
    { label: 'Warnings / Faults', value: loading ? '—' : `${stats?.warnings ?? 0} / ${stats?.faults ?? 0}`, icon: AlertTriangle, gradient: 'from-amber-600 to-amber-400', glow: 'shadow-amber-500/20' },
    { label: 'Active Alerts', value: loading ? '—' : unresolvedAlerts.length, icon: Zap, gradient: 'from-red-600 to-red-400', glow: 'shadow-red-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Energy & IoT Infrastructure</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Real-time monitoring of all energy assets and IoT devices.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" /> Live
          </div>
          <button onClick={fetchData} className="p-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white/70" aria-label="Refresh">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} aria-hidden="true" />
          </button>
          <button
            onClick={() => setShowAddDevice(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" aria-hidden="true" /> Add Device
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', m.gradient, m.glow)}>
                <m.icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-xs text-white/40">{m.label}</div>
            </div>
            <div className="text-2xl font-bold text-white/90">{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Power consumption chart */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white/90">Power Consumption</h2>
            <p className="text-xs text-white/35 mt-0.5">24-hour rolling window (kW)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={mockPowerData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<GlassTooltip />} />
            <Area type="monotone" dataKey="kw" stroke="#06b6d4" strokeWidth={2} fill="url(#powerGrad)" dot={false} activeDot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Add device form */}
      <AnimatePresence>
        {showAddDevice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-2xl p-5 space-y-4 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white/90">Register New Device</h3>
                <button onClick={() => setShowAddDevice(false)} className="text-white/30 hover:text-white/70 transition-colors" aria-label="Close">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Device Name *', key: 'name', placeholder: 'e.g. Solar Array Alpha', type: 'text' },
                  { label: 'Location', key: 'location', placeholder: 'e.g. Site A — North', type: 'text' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block" htmlFor={`device-${f.key}`}>{f.label}</label>
                    <input
                      id={`device-${f.key}`}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-white/40 mb-1 block" htmlFor="device-type">Device Type</label>
                  <select
                    id="device-type"
                    value={form.deviceType}
                    onChange={(e) => setForm((f) => ({ ...f, deviceType: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {['SOLAR_PANEL', 'BATTERY', 'INVERTER', 'EV_CHARGER', 'SMART_METER', 'WIND_TURBINE', 'SENSOR'].map((t) => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addDevice}
                  disabled={adding || !form.name.trim()}
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  {adding ? 'Registering...' : 'Register Device'}
                </button>
                <button
                  onClick={() => setShowAddDevice(false)}
                  className="text-sm text-white/40 hover:text-white/70 px-4 py-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl w-fit">
        {(['overview', 'assets', 'alerts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all',
              activeTab === tab ? 'bg-white/[0.08] text-white/90 shadow-sm' : 'text-white/40 hover:text-white/70',
            )}
          >
            {tab}
            {tab === 'alerts' && unresolvedAlerts.length > 0 && (
              <span className="ml-1.5 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">{unresolvedAlerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats?.byType ?? {}).map(([type, count], i) => {
            const Icon = deviceIcons[type] ?? Wifi;
            const grad = deviceGradients[type] ?? 'from-indigo-500 to-purple-500';
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', grad)}>
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white/80">{type.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-white/35">{count} device{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full bg-gradient-to-r', grad)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (count / (stats?.total || 1)) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
          {!loading && Object.keys(stats?.byType ?? {}).length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 gap-3 glass rounded-2xl">
              <Wifi className="w-10 h-10 text-white/10" aria-hidden="true" />
              <p className="text-white/40">No devices registered yet</p>
              <button onClick={() => setShowAddDevice(true)} className="text-sm text-indigo-400 hover:text-indigo-300 underline">
                Add your first device
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assets tab */}
      {activeTab === 'assets' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-semibold text-white/90">Asset Registry</h3>
            <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{devices.length} devices</span>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-white/[0.04] animate-pulse rounded-lg" />)}</div>
          ) : devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Wifi className="w-8 h-8 text-white/10" aria-hidden="true" />
              <p className="text-sm text-white/40">No devices registered</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {devices.map((device, i) => {
                const cfg = statusCfg[device.status] ?? statusCfg.OFFLINE;
                const Icon = deviceIcons[device.deviceType] ?? Wifi;
                const grad = deviceGradients[device.deviceType] ?? 'from-indigo-500 to-purple-500';
                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md', grad)}>
                      <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white/80">{device.name}</span>
                        <span className="text-xs text-white/30 font-mono">{device.deviceType.replace(/_/g, ' ')}</span>
                      </div>
                      {device.location && (
                        <div className="flex items-center gap-1.5 text-xs text-white/30 mt-0.5">
                          <MapPin className="w-3 h-3" aria-hidden="true" /> {device.location}
                        </div>
                      )}
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-white/25">
                        {device.lastSeenAt ? formatDistanceToNow(new Date(device.lastSeenAt), { addSuffix: true }) : 'Never seen'}
                      </div>
                      {device.alerts.length > 0 && (
                        <div className="text-xs text-red-400">{device.alerts.length} alert{device.alerts.length > 1 ? 's' : ''}</div>
                      )}
                    </div>
                    <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shrink-0', cfg.bg, cfg.color)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot, cfg.pulse && 'animate-pulse')} aria-hidden="true" />
                      {cfg.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Alerts tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/[0.04] animate-pulse rounded-2xl" />)}</div>
          ) : unresolvedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 glass rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/30" aria-hidden="true" />
              <p className="text-white/40">No active alerts</p>
              <p className="text-sm text-white/25">All systems are operating normally</p>
            </div>
          ) : (
            unresolvedAlerts.map((alert, i) => {
              const sev = alert.severity.toLowerCase();
              const color = sev === 'critical'
                ? 'text-red-400 bg-red-500/10 border-red-500/20'
                : sev === 'warning'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-blue-400 bg-blue-500/10 border-blue-500/20';
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn('flex items-start gap-4 p-4 rounded-2xl border', color)}
                >
                  <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{alert.device?.name ?? 'Unknown Device'}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', color)}>{alert.severity}</span>
                    </div>
                    <p className="text-sm text-white/50">{alert.message}</p>
                    <p className="text-xs text-white/25 mt-1">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</p>
                  </div>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="text-xs text-white/40 hover:text-white/70 border border-white/[0.08] px-3 py-1.5 rounded-lg transition-colors shrink-0 hover:bg-white/[0.06]"
                  >
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

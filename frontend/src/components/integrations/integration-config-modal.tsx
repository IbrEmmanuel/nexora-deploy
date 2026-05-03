'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, ExternalLink, CheckCircle2, AlertCircle, Loader2, Webhook, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CatalogItem, Connection } from './integrations-dashboard';

const API = process.env.NEXT_PUBLIC_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

interface Props {
  item: CatalogItem;
  connection?: Connection;
  token?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function IntegrationConfigModal({ item, connection, token, onClose, onSaved }: Props) {
  const isConnected = connection?.status === 'connected';

  // Pre-fill with masked values if already connected
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of item.fields) {
      init[f.key] = isConnected && connection?.credentials?.[f.key]
        ? connection.credentials[f.key] // masked value from backend
        : '';
    }
    return init;
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  const webhookUrl = item.webhookPath
    ? `${APP_URL.replace('3000', '4000')}${item.webhookPath}`
    : null;

  const handleSave = async () => {
    // Validate required fields
    for (const f of item.fields) {
      if (f.required && !fields[f.key]?.trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/integrations/connections/${item.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ credentials: fields }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to save');
      }
      toast.success(`${item.name} connected successfully`);
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save integration');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!isConnected) {
      toast.error('Save the integration first before testing');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${API}/integrations/connections/${item.id}/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      const result = json.data ?? json;
      setTestResult(result);
      if (result.success) {
        toast.success(`✓ ${result.message}`);
      } else {
        toast.error(`✗ ${result.message}`);
      }
    } catch {
      setTestResult({ success: false, message: 'Test request failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <span style={{ color: item.color }} className="text-lg font-bold">
                  {item.name[0]}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-sm">{item.name}</h2>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{item.description}</p>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1.5">
              {item.capabilities.map((cap) => (
                <span key={cap} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                  {cap}
                </span>
              ))}
            </div>

            {/* Credential fields */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Credentials
              </h3>
              {item.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-medium flex items-center gap-1">
                    {f.label}
                    {f.required && <span className="text-red-400">*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      value={fields[f.key] ?? ''}
                      onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type={f.type === 'password' && !showPasswords[f.key] ? 'password' : 'text'}
                        value={fields[f.key] ?? ''}
                        onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-9"
                      />
                      {f.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPasswords((p) => ({ ...p, [f.key]: !p[f.key] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords[f.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Webhook URL */}
            {webhookUrl && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Webhook className="w-3.5 h-3.5" />
                  Webhook URL
                </h3>
                <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2">
                  <code className="text-xs font-mono flex-1 truncate text-muted-foreground">{webhookUrl}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success('Copied!'); }}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Add this URL to your {item.name} webhook settings to receive real-time events.
                </p>
              </div>
            )}

            {/* Test result */}
            {testResult && (
              <div className={cn(
                'flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border',
                testResult.success
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-400',
              )}>
                {testResult.success
                  ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  <span>{testResult.message}</span>
                  {testResult.latency && (
                    <span className="ml-2 text-xs opacity-70">{testResult.latency}ms</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <a
              href={item.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View docs
            </a>
            <div className="flex items-center gap-2">
              {isConnected && (
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {testing ? 'Testing…' : 'Test connection'}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 font-medium"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? 'Saving…' : isConnected ? 'Update' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

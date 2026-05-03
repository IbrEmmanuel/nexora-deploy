'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthToken } from '@/lib/use-auth-token';
import { CreditCard, CheckCircle2, Zap, ArrowUpRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL;

const PLANS = [
  { id: 'FREE', name: 'Free', price: 0, features: ['1 AI Agent', '1K API calls/mo', 'Basic analytics', '1 team member'] },
  { id: 'STARTER', name: 'Starter', price: 49, features: ['5 AI Agents', '10K API calls/mo', 'Advanced analytics', '5 team members'] },
  { id: 'PRO', name: 'Pro', price: 199, features: ['25 AI Agents', '100K API calls/mo', 'IoT monitoring', 'Priority support', 'Unlimited members'] },
  { id: 'ENTERPRISE', name: 'Enterprise', price: null, features: ['Unlimited agents', 'Unlimited API', 'Full IoT suite', 'Dedicated support', 'SLA guarantee'] },
];

interface OrgData {
  id: string; name: string; plan: string; subscriptionStatus: string;
  billingInterval: string; trialEndsAt?: string; subscriptionEndsAt?: string;
  stripeCustomerId?: string;
}

interface UsageData { userCount: number; projectCount: number; }

export function BillingDashboard() {
  const { token, ready } = useAuthToken();
  const [annual, setAnnual] = useState(false);
  const [org, setOrg] = useState<OrgData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token || !ready) return;
    setLoading(true);
    try {
      const [orgRes, usageRes] = await Promise.all([
        fetch(`${API}/organizations/current`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/organizations/current/usage`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!orgRes.ok || !usageRes.ok) return;
      const [orgJson, usageJson] = await Promise.all([orgRes.json(), usageRes.json()]);
      setOrg(orgJson.data ?? orgJson);
      setUsage(usageJson.data ?? usageJson);
    } catch { toast.error('Failed to load billing data'); }
    finally { setLoading(false); }
  }, [token, ready]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleUpgrade(planId: string) {
    if (planId === 'ENTERPRISE') {
      toast.info('Contact sales@nexoragrid.com for Enterprise pricing');
      return;
    }
    setUpgrading(planId);
    try {
      const res = await fetch(`${API}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          priceId: `price_${planId.toLowerCase()}_${annual ? 'yearly' : 'monthly'}`,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing`,
        }),
      });
      const json = await res.json();
      const url = (json.data ?? json)?.url;
      if (url) window.location.href = url;
      else toast.info('Stripe not configured — add STRIPE_SECRET_KEY to backend .env');
    } catch { toast.error('Failed to start checkout'); }
    finally { setUpgrading(null); }
  }

  const currentPlan = PLANS.find((p) => p.id === org?.plan) ?? PLANS[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your plan, payment methods, and usage.</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Current plan */}
      {loading ? (
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      ) : (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold">{currentPlan.name} Plan</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">Current</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full border',
                  org?.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20')}>
                  {org?.subscriptionStatus ?? 'ACTIVE'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/month`}
                {org?.subscriptionEndsAt && ` · Renews ${new Date(org.subscriptionEndsAt).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              {org?.stripeCustomerId && (
                <button onClick={async () => {
                  const res = await fetch(`${API}/billing/portal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ returnUrl: window.location.href }),
                  });
                  const json = await res.json();
                  const url = (json.data ?? json)?.url;
                  if (url) window.location.href = url;
                }} className="text-sm border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  Manage
                </button>
              )}
              <button onClick={() => handleUpgrade('PRO')}
                className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" /> Upgrade
              </button>
            </div>
          </div>

          {/* Usage */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            {[
              { label: 'Team Members', used: usage?.userCount ?? 0, total: org?.plan === 'FREE' ? 1 : org?.plan === 'STARTER' ? 5 : 999 },
              { label: 'Projects', used: usage?.projectCount ?? 0, total: org?.plan === 'FREE' ? 3 : 999 },
            ].map((u) => (
              <div key={u.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="font-medium">{u.used} / {u.total === 999 ? '∞' : u.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(100, u.total === 999 ? 10 : (u.used / u.total) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Available Plans</h2>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <button onClick={() => setAnnual(false)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all', !annual ? 'bg-background shadow-sm' : 'text-muted-foreground')}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all', annual ? 'bg-background shadow-sm' : 'text-muted-foreground')}>
              Annual <span className="text-emerald-500 ml-1">-20%</span>
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === org?.plan;
            return (
              <div key={plan.id} className={cn('rounded-xl border p-5', isCurrent ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-border bg-card')}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">{plan.name}</span>
                  {isCurrent && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <div className="text-2xl font-bold mb-4">
                  {plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${annual ? Math.round(plan.price * 0.8) : plan.price}/mo`}
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => !isCurrent && handleUpgrade(plan.id)}
                  disabled={isCurrent || upgrading === plan.id}
                  className={cn('w-full py-2 rounded-lg text-sm font-medium transition-colors',
                    isCurrent ? 'bg-muted text-muted-foreground cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white')}>
                  {isCurrent ? 'Current Plan' : upgrading === plan.id ? 'Loading...' : plan.price === null ? 'Contact Sales' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

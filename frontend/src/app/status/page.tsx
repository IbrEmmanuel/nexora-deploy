"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const HEALTH_URL = "http://localhost:4000/api/v1/health";
const POLL_INTERVAL = 10000;

type ServiceStatus = {
  status: "operational" | "degraded" | "outage" | "unknown";
  latency?: number;
};

type HealthData = {
  status: string;
  services?: {
    api?: ServiceStatus;
    database?: ServiceStatus;
    redis?: ServiceStatus;
    mongodb?: ServiceStatus;
  };
  uptime?: number;
  version?: string;
  timestamp?: string;
};

type PollResult = {
  data: HealthData | null;
  responseTime: number;
  error: string | null;
  fetchedAt: Date;
};

const serviceLabels: Record<string, string> = {
  api: "API Gateway",
  database: "PostgreSQL Database",
  redis: "Redis Cache",
  mongodb: "MongoDB",
};

const serviceDescriptions: Record<string, string> = {
  api: "REST & GraphQL API endpoints",
  database: "Primary relational database",
  redis: "Real-time caching layer",
  mongodb: "Event & analytics store",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "operational") {
    return (
      <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4" /> Operational
      </span>
    );
  }
  if (status === "degraded") {
    return (
      <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
        <AlertTriangle className="w-4 h-4" /> Degraded
      </span>
    );
  }
  if (status === "outage") {
    return (
      <span className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
        <XCircle className="w-4 h-4" /> Outage
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium opacity-40">
      <Clock className="w-4 h-4" /> Unknown
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    operational: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]",
    degraded: "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.5)]",
    outage: "bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.5)]",
    unknown: "bg-white/20",
  };
  return (
    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${colors[status] ?? colors.unknown}`} />
  );
}

const incidentHistory = [
  {
    date: "May 1, 2026",
    title: "Scheduled maintenance — database migration",
    duration: "45 min",
    impact: "No user impact",
    resolved: true,
  },
  {
    date: "Apr 18, 2026",
    title: "Elevated API latency in EU region",
    duration: "12 min",
    impact: "Minor — p99 latency increased to 800ms",
    resolved: true,
  },
  {
    date: "Mar 30, 2026",
    title: "Redis cache eviction causing slow dashboard loads",
    duration: "8 min",
    impact: "Minor — dashboard load times increased",
    resolved: true,
  },
];

function StatusContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  const [result, setResult] = useState<PollResult | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [loading, setLoading] = useState(true);

  const poll = useCallback(async () => {
    const start = Date.now();
    try {
      const res = await fetch(HEALTH_URL, { cache: "no-store" });
      const responseTime = Date.now() - start;
      if (res.ok) {
        const data: HealthData = await res.json();
        setResult({ data, responseTime, error: null, fetchedAt: new Date() });
      } else {
        setResult({
          data: null,
          responseTime: Date.now() - start,
          error: `HTTP ${res.status}`,
          fetchedAt: new Date(),
        });
      }
    } catch {
      setResult({
        data: null,
        responseTime: Date.now() - start,
        error: "Cannot reach server",
        fetchedAt: new Date(),
      });
    } finally {
      setLoading(false);
      setSecondsAgo(0);
    }
  }, []);

  useEffect(() => {
    poll();
    const pollTimer = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollTimer);
  }, [poll]);

  useEffect(() => {
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [result]);

  // Build services from response or fallback
  const services = result?.data?.services ?? {
    api: { status: "unknown" as const },
    database: { status: "unknown" as const },
    redis: { status: "unknown" as const },
    mongodb: { status: "unknown" as const },
  };

  const allOperational =
    !result?.error &&
    Object.values(services).every((s) => s?.status === "operational");

  const overallStatus = result?.error
    ? "outage"
    : allOperational
    ? "operational"
    : "degraded";

  const overallBg = {
    operational: "from-emerald-900/30 to-emerald-900/10 border-emerald-500/20",
    degraded: "from-amber-900/30 to-amber-900/10 border-amber-500/20",
    outage: "from-red-900/30 to-red-900/10 border-red-500/20",
  }[overallStatus];

  const overallText = {
    operational: "All Systems Operational",
    degraded: "Partial System Degradation",
    outage: "Service Disruption Detected",
  }[overallStatus];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Activity className="w-3.5 h-3.5" /> System Status
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            NexoraGrid{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Status
            </span>
          </h1>
          <p className={`text-xl ${t(T.textMuted, theme)}`}>
            Real-time health monitoring for all platform services.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Overall status banner */}
          <div className={`bg-gradient-to-r ${overallBg} border rounded-2xl p-6 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <StatusDot status={overallStatus} />
              <div>
                <div className="font-semibold text-lg">{overallText}</div>
                {result?.data?.uptime && (
                  <div className={`text-sm ${t(T.textMuted, theme)}`}>
                    {result.data.uptime}% uptime over the last 90 days
                  </div>
                )}
              </div>
            </div>
            <div className={`text-right text-sm ${t(T.textDim40, theme)}`}>
              <div className="flex items-center gap-1.5 justify-end">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Checking..." : `${secondsAgo}s ago`}
              </div>
              <div className={`text-xs mt-0.5 ${t(T.textFaint, theme)}`}>Polls every 10s</div>
            </div>
          </div>

          {/* Services */}
          <div className={`border rounded-2xl overflow-hidden ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <div className={`px-6 py-4 border-b ${t(T.border, theme)}`}>
              <h2 className="font-semibold">Services</h2>
            </div>
            <div className={`divide-y ${t(T.divider, theme)}`}>
              {Object.entries(services).map(([key, svc]) => (
                <div key={key} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <StatusDot status={svc?.status ?? "unknown"} />
                    <div>
                      <div className="font-medium text-sm">{serviceLabels[key] ?? key}</div>
                      <div className={`text-xs ${t(T.textDim40, theme)}`}>{serviceDescriptions[key] ?? ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {svc?.latency !== undefined && (
                      <div className="text-right">
                        <div className={`text-sm font-mono ${t(T.textDim, theme)}`}>{svc.latency}ms</div>
                        <div className={`text-xs ${t(T.textFaint, theme)}`}>latency</div>
                      </div>
                    )}
                    <StatusBadge status={svc?.status ?? "unknown"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API response details */}
          {result && (
            <div className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
              <h2 className="font-semibold mb-4">Response Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`rounded-xl p-4 text-center ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                  <div className="text-2xl font-bold text-indigo-400">{result.responseTime}ms</div>
                  <div className={`text-xs mt-1 ${t(T.textDim40, theme)}`}>Response Time</div>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                  <div className="text-2xl font-bold text-emerald-400">
                    {result.data?.uptime ?? "—"}
                    {result.data?.uptime ? "%" : ""}
                  </div>
                  <div className={`text-xs mt-1 ${t(T.textDim40, theme)}`}>Uptime</div>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                  <div className="text-2xl font-bold text-cyan-400">
                    {result.data?.version ?? "—"}
                  </div>
                  <div className={`text-xs mt-1 ${t(T.textDim40, theme)}`}>Version</div>
                </div>
                <div className={`rounded-xl p-4 text-center ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                  <div className={`text-2xl font-bold ${result.error ? "text-red-400" : "text-emerald-400"}`}>
                    {result.error ? "Error" : "OK"}
                  </div>
                  <div className={`text-xs mt-1 ${t(T.textDim40, theme)}`}>HTTP Status</div>
                </div>
              </div>
              {result.error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                  <strong>Error:</strong> {result.error}. Make sure the backend is running at{" "}
                  <code className={`font-mono text-xs px-1.5 py-0.5 rounded ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                    {HEALTH_URL}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Incident history */}
          <div className={`border rounded-2xl overflow-hidden ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <div className={`px-6 py-4 border-b ${t(T.border, theme)}`}>
              <h2 className="font-semibold">Incident History</h2>
            </div>
            <div className={`divide-y ${t(T.divider, theme)}`}>
              {incidentHistory.map((inc) => (
                <div key={inc.title} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium text-sm">{inc.title}</span>
                      </div>
                      <div className={`text-xs ml-6 ${t(T.textDim40, theme)}`}>
                        {inc.impact} · Duration: {inc.duration}
                      </div>
                    </div>
                    <span className={`text-xs shrink-0 ${t(T.textFaint, theme)}`}>{inc.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime bars */}
          <div className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <h2 className="font-semibold mb-4">90-Day Uptime</h2>
            <div className="space-y-4">
              {Object.entries(serviceLabels).map(([key, label]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={t(T.textDim, theme)}>{label}</span>
                    <span className="text-emerald-400 font-medium">99.99%</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 90 }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-6 rounded-sm ${
                          i === 17 || i === 28 || i === 59
                            ? "bg-amber-500/60"
                            : "bg-emerald-500/60"
                        }`}
                      />
                    ))}
                  </div>
                  <div className={`flex justify-between text-xs mt-1 ${t(T.textFaint, theme)}`}>
                    <span>90 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function StatusPage() {
  return (
    <LandingWrapper>
      <StatusContent />
    </LandingWrapper>
  );
}

"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Code2, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const BASE_URL = "http://localhost:4000/api/v1";

const endpoints = [
  {
    method: "POST",
    path: "/auth/login",
    desc: "Authenticate and receive JWT tokens",
    methodColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    method: "GET",
    path: "/dashboard/metrics",
    desc: "Fetch real-time dashboard metrics",
    methodColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    method: "GET",
    path: "/integrations",
    desc: "List all configured integrations",
    methodColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    method: "POST",
    path: "/integrations",
    desc: "Create a new integration connection",
    methodColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    method: "GET",
    path: "/agents",
    desc: "List all AI agents in your organization",
    methodColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    method: "POST",
    path: "/agents/:id/run",
    desc: "Trigger an AI agent task",
    methodColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    method: "GET",
    path: "/health",
    desc: "Platform health check",
    methodColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    method: "DELETE",
    path: "/integrations/:id",
    desc: "Remove an integration",
    methodColor: "text-red-400 bg-red-500/10",
  },
];

const sdks = [
  { name: "JavaScript / TypeScript", status: "Available", color: "text-yellow-400" },
  { name: "Python", status: "Available", color: "text-blue-400" },
  { name: "Go", status: "Available", color: "text-cyan-400" },
  { name: "Ruby", status: "Coming Q3 2026", color: "" },
  { name: "Java / Kotlin", status: "Coming Q3 2026", color: "" },
  { name: "PHP", status: "Coming Q4 2026", color: "" },
];

function DevelopersContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        {isDark && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Code2 className="w-3.5 h-3.5" /> Developers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Build on{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NexoraGrid
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            A powerful REST and GraphQL API, official SDKs, webhooks, and comprehensive documentation.
            Everything you need to integrate NexoraGrid into your stack.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Get API Key <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#api-reference"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              View API Reference
            </a>
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`border rounded-xl p-4 flex items-center gap-3 ${t(T.sectionBg, theme)} ${t(T.borderMd, theme)}`}>
            <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className={`text-sm ${t(T.textMuted, theme)}`}>Base URL:</span>
            <code className="text-sm font-mono text-cyan-400">{BASE_URL}</code>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="py-12" id="api-reference">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-3xl font-bold">Quick Start</h2>

          {/* Auth example */}
          <div className={`border rounded-2xl overflow-hidden ${t(T.sectionBg, theme)} ${t(T.borderMd, theme)}`}>
            <div className={`flex items-center justify-between px-5 py-3 border-b ${t(T.border, theme)} ${isDark ? "bg-white/[0.02]" : "bg-slate-100/50"}`}>
              <span className={`text-sm font-medium ${t(T.textDim, theme)}`}>1. Authenticate</span>
              <span className={`text-xs font-mono ${t(T.textFaint, theme)}`}>POST /auth/login</span>
            </div>
            <pre className="p-5 text-sm font-mono overflow-x-auto">
              <code className={t(T.textDim, theme)}>{`curl -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "you@company.com",
    "password": "your-password"
  }'`}</code>
            </pre>
            <div className={`border-t px-5 py-3 ${t(T.border, theme)} ${isDark ? "bg-white/[0.01]" : "bg-slate-50"}`}>
              <p className={`text-xs mb-2 ${t(T.textDim40, theme)}`}>Response:</p>
              <pre className="text-xs font-mono text-emerald-400">{`{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "usr_01", "email": "you@company.com" }
  }
}`}</pre>
            </div>
          </div>

          {/* Dashboard metrics */}
          <div className={`border rounded-2xl overflow-hidden ${t(T.sectionBg, theme)} ${t(T.borderMd, theme)}`}>
            <div className={`flex items-center justify-between px-5 py-3 border-b ${t(T.border, theme)} ${isDark ? "bg-white/[0.02]" : "bg-slate-100/50"}`}>
              <span className={`text-sm font-medium ${t(T.textDim, theme)}`}>2. Fetch Dashboard Metrics</span>
              <span className={`text-xs font-mono ${t(T.textFaint, theme)}`}>GET /dashboard/metrics</span>
            </div>
            <pre className="p-5 text-sm font-mono overflow-x-auto">
              <code className={t(T.textDim, theme)}>{`curl ${BASE_URL}/dashboard/metrics \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</code>
            </pre>
            <div className={`border-t px-5 py-3 ${t(T.border, theme)} ${isDark ? "bg-white/[0.01]" : "bg-slate-50"}`}>
              <p className={`text-xs mb-2 ${t(T.textDim40, theme)}`}>Response:</p>
              <pre className="text-xs font-mono text-emerald-400">{`{
  "data": {
    "revenue": { "value": 4280000, "change": 12.5 },
    "aiTasks": { "value": 8420, "change": 8.2 },
    "uptime": 99.99,
    "activeAgents": 4
  }
}`}</pre>
            </div>
          </div>

          {/* Integrations */}
          <div className={`border rounded-2xl overflow-hidden ${t(T.sectionBg, theme)} ${t(T.borderMd, theme)}`}>
            <div className={`flex items-center justify-between px-5 py-3 border-b ${t(T.border, theme)} ${isDark ? "bg-white/[0.02]" : "bg-slate-100/50"}`}>
              <span className={`text-sm font-medium ${t(T.textDim, theme)}`}>3. List Integrations</span>
              <span className={`text-xs font-mono ${t(T.textFaint, theme)}`}>GET /integrations</span>
            </div>
            <pre className="p-5 text-sm font-mono overflow-x-auto">
              <code className={t(T.textDim, theme)}>{`curl ${BASE_URL}/integrations \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</code>
            </pre>
            <div className={`border-t px-5 py-3 ${t(T.border, theme)} ${isDark ? "bg-white/[0.01]" : "bg-slate-50"}`}>
              <p className={`text-xs mb-2 ${t(T.textDim40, theme)}`}>Response:</p>
              <pre className="text-xs font-mono text-emerald-400">{`{
  "data": [
    { "id": "int_01", "name": "Stripe", "status": "connected" },
    { "id": "int_02", "name": "WhatsApp Business", "status": "connected" },
    { "id": "int_03", "name": "Salesforce", "status": "pending" }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints table */}
      <section className={`py-12 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
          <div className={`border rounded-2xl overflow-hidden ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <div className={`divide-y ${t(T.divider, theme)}`}>
              {endpoints.map((ep) => (
                <div key={ep.path} className="flex items-center gap-4 px-5 py-4">
                  <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg shrink-0 ${ep.methodColor}`}>
                    {ep.method}
                  </span>
                  <code className={`text-sm font-mono flex-1 ${t(T.textDim, theme)}`}>{ep.path}</code>
                  <span className={`text-sm hidden sm:block ${t(T.textDim40, theme)}`}>{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className={`py-12 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-6">Official SDKs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sdks.map((sdk) => (
              <div
                key={sdk.name}
                className={`border rounded-xl p-4 flex items-center justify-between ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <span className="font-medium text-sm">{sdk.name}</span>
                <span className={`text-xs ${sdk.color || t(T.textDim40, theme)}`}>{sdk.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`py-12 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-6">Developer Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "REST & GraphQL APIs",
              "Real-time WebSocket subscriptions",
              "Webhook delivery with retry logic",
              "OpenAPI 3.0 specification",
              "Interactive API playground",
              "Rate limiting with burst allowance",
              "Idempotency keys for safe retries",
              "Comprehensive error codes",
            ].map((f) => (
              <div key={f} className={`flex items-center gap-3 text-sm ${t(T.textDim, theme)}`}>
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        {isDark
          ? <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-cyan-900/10" />
          : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
        }
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Start building today</h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            Get your API key and start integrating in minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
          >
            Get API Key <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function DevelopersPage() {
  return (
    <LandingWrapper>
      <DevelopersContent />
    </LandingWrapper>
  );
}

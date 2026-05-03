"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import {
  Bot, Wifi, LineChart, GitBranch, LayoutDashboard, Shield,
  Zap, Database, Bell, Users, CheckCircle2, ArrowRight
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "AI Automation Agents",
    desc: "Deploy intelligent agents that handle customer support, sales, operations, and financial analysis autonomously. Agents learn from your data and escalate only when needed.",
    bullets: ["WhatsApp & email automation", "Lead qualification & follow-up", "Financial report generation", "Context-aware memory across sessions"],
    color: "from-indigo-500 to-purple-500",
    badge: "Core",
  },
  {
    icon: Wifi,
    title: "Energy & IoT Monitoring",
    desc: "Real-time monitoring of solar panels, EV stations, inverters, and battery systems with predictive fault detection and SCADA integration.",
    bullets: ["Live sensor data streams", "Predictive maintenance AI", "SCADA & Modbus integration", "Fault detection & alerting"],
    color: "from-cyan-500 to-teal-500",
    badge: "Energy",
  },
  {
    icon: LineChart,
    title: "Investor Dashboard",
    desc: "Bloomberg-grade analytics with revenue forecasting, ROI tracking, and AI-powered next-best-move recommendations for your board.",
    bullets: ["Revenue forecasting models", "ROI & KPI tracking", "Board-ready reports", "AI-powered insights"],
    color: "from-emerald-500 to-green-500",
    badge: "Analytics",
  },
  {
    icon: GitBranch,
    title: "API Ecosystem & Integrations",
    desc: "Connect WhatsApp, Twilio, Stripe, CRMs, and banking APIs through a unified integration hub with webhook support and real-time sync.",
    bullets: ["200+ pre-built connectors", "Custom webhook builder", "OAuth 2.0 flows", "Real-time event streaming"],
    color: "from-orange-500 to-amber-500",
    badge: "Integrations",
  },
  {
    icon: LayoutDashboard,
    title: "Enterprise Command Center",
    desc: "Drag-and-drop modular dashboard with real-time widgets, system health monitors, and ROI trackers. Fully customizable per team.",
    bullets: ["Drag-and-drop widgets", "Role-based views", "Real-time data refresh", "Custom branding"],
    color: "from-pink-500 to-rose-500",
    badge: "Dashboard",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    desc: "SOC 2 Type II compliant. Multi-tenant RBAC, 2FA, SSO, audit logs, and enterprise-grade encryption built in from day one.",
    bullets: ["SOC 2 Type II certified", "GDPR & ISO 27001", "SSO & SAML 2.0", "Full audit trail"],
    color: "from-violet-500 to-indigo-500",
    badge: "Security",
  },
  {
    icon: Database,
    title: "Unified Data Layer",
    desc: "PostgreSQL for core data, MongoDB for events, Redis for real-time caching. One API surface, zero data silos, infinite scale.",
    bullets: ["Multi-database architecture", "GraphQL & REST APIs", "Real-time subscriptions", "Automatic backups"],
    color: "from-blue-500 to-cyan-500",
    badge: "Infrastructure",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Intelligent alerting that learns your patterns. Get notified via Slack, email, SMS, or webhook — only when it actually matters.",
    bullets: ["AI-filtered alerts", "Multi-channel delivery", "Escalation policies", "On-call scheduling"],
    color: "from-amber-500 to-yellow-500",
    badge: "Alerts",
  },
  {
    icon: Users,
    title: "Team & Organization Management",
    desc: "Multi-tenant architecture with granular permissions. Manage teams, roles, and access across unlimited organizations.",
    bullets: ["Unlimited organizations", "Granular RBAC", "Team workspaces", "Activity audit logs"],
    color: "from-teal-500 to-emerald-500",
    badge: "Teams",
  },
];

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "500+", label: "Enterprise Clients" },
  { value: "200+", label: "Integrations" },
  { value: "140ms", label: "Avg Response Time" },
];

function FeaturesContent() {
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
            <Zap className="w-3.5 h-3.5" /> Platform Features
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Everything your enterprise{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              needs to scale
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            One unified platform replacing dozens of point solutions. Built for energy companies,
            enterprises, and governments from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-12 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border ${t(T.statsGrid, theme)}`}>
            {stats.map((s) => (
              <div key={s.label} className={`${t(T.statsBg, theme)} px-6 py-6 text-center`}>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className={`text-sm mt-1 ${t(T.textDim40, theme)}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className={`group border rounded-2xl p-7 transition-all duration-300 ${t(T.featureCard, theme)}`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${t(T.tagBg, theme)}`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${t(T.textMuted, theme)}`}>{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className={`flex items-center gap-2 text-sm ${t(T.textDim, theme)}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        {isDark
          ? <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-cyan-900/10" />
          : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
        }
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Ready to see it in action?
          </h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            Start your 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function FeaturesPage() {
  return (
    <LandingWrapper>
      <FeaturesContent />
    </LandingWrapper>
  );
}

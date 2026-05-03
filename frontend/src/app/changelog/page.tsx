"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { GitBranch } from "lucide-react";

const releases = [
  {
    version: "2.1.0",
    date: "May 2026",
    tag: "Latest",
    tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "AI Agent Memory & Multi-Step Workflows",
    summary: "Major upgrade to the AI agent system with persistent memory, multi-step workflow orchestration, and new WhatsApp Business API integration.",
    changes: [
      { type: "new", text: "AI agents now have persistent cross-session memory using vector embeddings" },
      { type: "new", text: "Multi-step workflow builder with conditional branching and loops" },
      { type: "new", text: "WhatsApp Business API integration with template message support" },
      { type: "new", text: "Agent performance analytics dashboard with task completion metrics" },
      { type: "improved", text: "Response latency reduced by 40% through edge caching" },
      { type: "improved", text: "Dashboard load time improved from 2.1s to 340ms" },
      { type: "fixed", text: "Fixed race condition in concurrent webhook processing" },
      { type: "fixed", text: "Resolved timezone handling bug in scheduled reports" },
    ],
  },
  {
    version: "2.0.0",
    date: "March 2026",
    tag: "Major",
    tagColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    title: "NexoraGrid 2.0 — Complete Platform Rebuild",
    summary: "Complete platform rebuild with new architecture, GraphQL API, real-time subscriptions, and the new Enterprise Command Center.",
    changes: [
      { type: "new", text: "Complete platform rebuild on Next.js 14 + NestJS microservices" },
      { type: "new", text: "GraphQL API with real-time subscriptions via WebSockets" },
      { type: "new", text: "Enterprise Command Center with drag-and-drop dashboard builder" },
      { type: "new", text: "Investor Dashboard with Bloomberg-grade analytics" },
      { type: "new", text: "Multi-tenant RBAC with granular permission system" },
      { type: "new", text: "SSO & SAML 2.0 support for enterprise customers" },
      { type: "new", text: "SOC 2 Type II certification achieved" },
      { type: "improved", text: "API throughput increased 10x with new infrastructure" },
    ],
  },
  {
    version: "1.8.2",
    date: "January 2026",
    tag: "Patch",
    tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    title: "Security Patches & Performance Improvements",
    summary: "Critical security updates and performance improvements across the platform.",
    changes: [
      { type: "fixed", text: "Patched XSS vulnerability in dashboard widget renderer" },
      { type: "fixed", text: "Fixed JWT token refresh race condition" },
      { type: "improved", text: "Database query optimization reducing p99 latency by 60%" },
      { type: "improved", text: "Redis cache hit rate improved to 94%" },
    ],
  },
  {
    version: "1.8.0",
    date: "December 2025",
    tag: "Feature",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    title: "IoT Monitoring & Energy Dashboard",
    summary: "Full IoT monitoring suite with support for solar panels, EV stations, and SCADA systems.",
    changes: [
      { type: "new", text: "Real-time IoT device monitoring with sub-second refresh" },
      { type: "new", text: "Solar panel performance analytics with weather correlation" },
      { type: "new", text: "EV charging station management and billing integration" },
      { type: "new", text: "SCADA protocol support (Modbus TCP/RTU, DNP3)" },
      { type: "new", text: "Predictive maintenance AI with 94% fault detection accuracy" },
      { type: "improved", text: "Alert system now supports escalation policies" },
    ],
  },
  {
    version: "1.7.0",
    date: "October 2025",
    tag: "Feature",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    title: "Integration Hub & Webhook Builder",
    summary: "New integration hub with 200+ pre-built connectors and a visual webhook builder.",
    changes: [
      { type: "new", text: "Integration hub with 200+ pre-built connectors" },
      { type: "new", text: "Visual webhook builder with retry logic and dead-letter queues" },
      { type: "new", text: "Stripe billing integration with usage-based pricing support" },
      { type: "new", text: "Twilio SMS & voice integration for AI agent communications" },
      { type: "new", text: "Salesforce CRM bidirectional sync" },
    ],
  },
];

const typeColors: Record<string, string> = {
  new: "text-emerald-400",
  improved: "text-indigo-400",
  fixed: "text-amber-400",
};

const typeLabels: Record<string, string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

function ChangelogContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <GitBranch className="w-3.5 h-3.5" /> Changelog
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            What&apos;s new in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NexoraGrid
            </span>
          </h1>
          <p className={`text-xl ${t(T.textMuted, theme)}`}>
            Every update, improvement, and fix — documented in full.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-0 top-0 bottom-0 w-px ml-[7px] hidden sm:block ${t(T.border, theme)}`} />

            <div className="space-y-12">
              {releases.map((release) => (
                <div key={release.version} className="sm:pl-10 relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 hidden sm:block ${isDark ? "border-[#07071a]" : "border-white"}`} />

                  <div className={`border rounded-2xl p-7 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-2xl font-bold font-mono">v{release.version}</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${release.tagColor}`}
                      >
                        {release.tag}
                      </span>
                      <span className={`text-sm ml-auto ${t(T.textDim40, theme)}`}>{release.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold mb-2">{release.title}</h2>
                    <p className={`text-sm leading-relaxed mb-6 ${t(T.textMuted, theme)}`}>{release.summary}</p>
                    <ul className="space-y-2.5">
                      {release.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span
                            className={`text-xs font-bold uppercase tracking-wide shrink-0 mt-0.5 w-16 ${typeColors[change.type]}`}
                          >
                            {typeLabels[change.type]}
                          </span>
                          <span className={t(T.textDim, theme)}>{change.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Stay up to date</h2>
          <p className={`mb-6 ${t(T.textMuted, theme)}`}>
            Get notified when we ship new features and improvements.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"}`}
            />
            <button className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold px-5 py-3 rounded-xl text-sm hover:from-indigo-500 hover:to-cyan-400 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ChangelogPage() {
  return (
    <LandingWrapper>
      <ChangelogContent />
    </LandingWrapper>
  );
}

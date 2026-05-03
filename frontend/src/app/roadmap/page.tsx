"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Map, CheckCircle2, Clock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const quarters = [
  {
    label: "Q1 2026",
    status: "completed",
    statusLabel: "Completed",
    statusColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    items: [
      { title: "NexoraGrid 2.0 Launch", desc: "Complete platform rebuild with new architecture, GraphQL API, and Enterprise Command Center.", done: true },
      { title: "SOC 2 Type II Certification", desc: "Achieved SOC 2 Type II compliance across all platform services.", done: true },
      { title: "SSO & SAML 2.0", desc: "Enterprise single sign-on with support for Okta, Azure AD, and Google Workspace.", done: true },
      { title: "Investor Dashboard", desc: "Bloomberg-grade analytics dashboard with AI-powered insights and board reporting.", done: true },
    ],
  },
  {
    label: "Q2 2026",
    status: "in-progress",
    statusLabel: "In Progress",
    statusColor: "text-indigo-400",
    dotColor: "bg-indigo-500",
    items: [
      { title: "AI Agent Memory System", desc: "Persistent cross-session memory for AI agents using vector embeddings and RAG.", done: true },
      { title: "Multi-Step Workflow Builder", desc: "Visual workflow orchestration with conditional branching, loops, and human-in-the-loop steps.", done: true },
      { title: "Mobile App (iOS & Android)", desc: "Native mobile apps for on-the-go monitoring and AI agent management.", done: false },
      { title: "Advanced Anomaly Detection", desc: "ML-powered anomaly detection across all data streams with root cause analysis.", done: false },
    ],
  },
  {
    label: "Q3 2026",
    status: "planned",
    statusLabel: "Planned",
    statusColor: "text-amber-400",
    dotColor: "bg-amber-500",
    items: [
      { title: "NexoraGrid Marketplace", desc: "App marketplace for third-party integrations, AI agent templates, and dashboard widgets.", done: false },
      { title: "Edge Computing Support", desc: "Deploy NexoraGrid agents at the edge for ultra-low latency IoT processing.", done: false },
      { title: "Natural Language Queries", desc: "Ask questions about your data in plain English and get instant AI-generated reports.", done: false },
      { title: "Multi-Region Data Residency", desc: "Choose where your data lives — EU, US, APAC, or on-premise.", done: false },
    ],
  },
  {
    label: "Q4 2026",
    status: "planned",
    statusLabel: "Planned",
    statusColor: "text-white/40",
    dotColor: "bg-white/20",
    items: [
      { title: "NexoraGrid AI Studio", desc: "No-code AI model fine-tuning and deployment platform for domain-specific models.", done: false },
      { title: "Blockchain Audit Trail", desc: "Immutable audit logs on a private blockchain for regulated industries.", done: false },
      { title: "Digital Twin Platform", desc: "Create digital twins of physical infrastructure for simulation and predictive planning.", done: false },
      { title: "ISO 27001 Certification", desc: "Achieve ISO 27001 certification to expand into government and defense markets.", done: false },
    ],
  },
];

const upcomingFeatures = [
  "Generative BI — AI writes your reports",
  "Voice-controlled dashboard navigation",
  "Automated compliance reporting (GDPR, SOX, HIPAA)",
  "Real-time carbon footprint tracking",
  "Predictive energy pricing models",
  "Multi-cloud cost optimization AI",
];

function RoadmapContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Map className="w-3.5 h-3.5" /> Product Roadmap
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Where we&apos;re{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              headed
            </span>
          </h1>
          <p className={`text-xl ${t(T.textMuted, theme)}`}>
            Our public roadmap. See what we&apos;re building, what&apos;s coming, and what&apos;s shipped.
          </p>
        </div>
      </section>

      {/* Quarters */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {quarters.map((q) => (
              <div key={q.label}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-3 h-3 rounded-full ${q.dotColor}`} />
                  <h2 className="text-xl font-bold">{q.label}</h2>
                  <span className={`text-sm font-medium ${q.statusColor}`}>{q.statusLabel}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pl-7">
                  {q.items.map((item) => (
                    <div
                      key={item.title}
                      className={`border rounded-xl p-5 transition-all ${
                        item.done
                          ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                          : `${t(T.border, theme)} ${t(T.cardBg, theme)}`
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? "text-white/20" : "text-slate-300"}`} />
                        )}
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                          <p className={`text-xs leading-relaxed ${t(T.textMuted, theme)}`}>{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future ideas */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">On our radar</h2>
            <p className={t(T.textMuted, theme)}>Features we&apos;re exploring for future releases.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingFeatures.map((f) => (
              <div
                key={f}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className={`text-sm ${t(T.textDim, theme)}`}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Shape the roadmap</h2>
          <p className={`mb-6 ${t(T.textMuted, theme)}`}>
            Have a feature request? We read every submission and prioritize based on customer impact.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            Submit a Feature Request <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function RoadmapPage() {
  return (
    <LandingWrapper>
      <RoadmapContent />
    </LandingWrapper>
  );
}

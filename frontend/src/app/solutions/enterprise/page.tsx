"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Building2, Shield, Users, LayoutDashboard, GitBranch, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: LayoutDashboard,
    title: "Enterprise Command Center",
    desc: "A unified operations hub with drag-and-drop dashboards, real-time KPI monitoring, and role-based views for every team — from the C-suite to the ops floor.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Users,
    title: "Multi-Tenant RBAC",
    desc: "Granular role-based access control across unlimited organizations. Define custom roles, permission sets, and data access policies that match your org structure.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "SOC 2 & Compliance",
    desc: "SOC 2 Type II certified. GDPR, ISO 27001, and HIPAA-ready. Full audit trails, data residency controls, and automated compliance reporting built in.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Lock,
    title: "SSO & Identity Management",
    desc: "SAML 2.0 and OIDC support for Okta, Azure AD, Google Workspace, and any identity provider. Enforce MFA and session policies enterprise-wide.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: GitBranch,
    title: "Custom Integrations",
    desc: "Connect your existing ERP, CRM, ITSM, and data warehouse systems. Our professional services team builds custom connectors for your specific stack.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Building2,
    title: "Dedicated Infrastructure",
    desc: "Private cloud or on-premise deployment options. Dedicated Kubernetes clusters, isolated databases, and custom SLA agreements up to 99.99% uptime.",
    color: "from-pink-500 to-rose-500",
  },
];

const enterpriseFeatures = [
  "Unlimited AI agents and API calls",
  "Dedicated customer success manager",
  "24/7 priority support with 1-hour SLA",
  "Custom contract and billing terms",
  "Security review and penetration testing",
  "Executive business reviews (QBR)",
  "Custom onboarding and training",
  "On-premise deployment option",
];

const trustedBy = [
  { name: "EnergyCore", industry: "Energy" },
  { name: "FinVault Capital", industry: "Finance" },
  { name: "TeleGrid", industry: "Utilities" },
  { name: "NovaCorp", industry: "Technology" },
  { name: "QuantumBank", industry: "Banking" },
  { name: "ArcLight", industry: "Infrastructure" },
];

function EnterpriseContent() {
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
            <Building2 className="w-3.5 h-3.5" /> Enterprise
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Enterprise-grade infrastructure{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              at any scale
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            NexoraGrid gives large enterprises the security, compliance, and customization they need
            without sacrificing the speed and intelligence of a modern platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Contact Enterprise Sales <ArrowRight className="w-4 h-4" />
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

      {/* Capabilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for enterprise requirements</h2>
            <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>
              Every feature designed to meet the security, compliance, and scale demands of large organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className={`border rounded-2xl p-7 transition-all ${t(T.featureCard, theme)}`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${c.color} mb-5 shadow-lg`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{c.title}</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise features list */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Everything in Enterprise</h2>
              <p className={`mb-6 leading-relaxed ${t(T.textMuted, theme)}`}>
                The Enterprise plan includes everything in Growth, plus dedicated infrastructure,
                custom SLAs, and white-glove support.
              </p>
              <ul className="space-y-3">
                {enterpriseFeatures.map((f) => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${t(T.textDim, theme)}`}>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                <div className={`text-sm mb-1 ${t(T.textDim40, theme)}`}>Trusted by</div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {trustedBy.map((c) => (
                    <div key={c.name} className={`rounded-xl p-3 ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className={`text-xs ${t(T.textDim40, theme)}`}>{c.industry}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="text-lg font-bold mb-2">99.99% Uptime SLA</div>
                <p className={`text-sm ${t(T.textMuted, theme)}`}>
                  Backed by a contractual SLA with financial penalties. Your operations never stop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        {isDark
          ? <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10" />
          : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        }
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Let&apos;s build something together</h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            Our enterprise team will design a custom solution for your organization.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
          >
            Talk to Enterprise Sales <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function EnterpriseSolutionPage() {
  return (
    <LandingWrapper>
      <EnterpriseContent />
    </LandingWrapper>
  );
}

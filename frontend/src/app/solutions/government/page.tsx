"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Globe, Shield, Lock, BarChart3, Wifi, Server, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: Shield,
    title: "Government-Grade Security",
    desc: "FedRAMP-ready architecture with FIPS 140-2 encryption, zero-trust networking, and continuous compliance monitoring. Meets NIST 800-53 and FISMA requirements.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Server,
    title: "On-Premise & Air-Gapped Deployment",
    desc: "Deploy NexoraGrid entirely within your own data centers. Air-gapped deployments available for classified environments. No data ever leaves your perimeter.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wifi,
    title: "Smart City Infrastructure",
    desc: "Monitor and manage public utilities, traffic systems, water treatment, and energy grids from a single command center. Real-time visibility across your entire city.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Public Sector Analytics",
    desc: "Citizen service metrics, budget utilization tracking, and performance dashboards for elected officials and department heads. Automated regulatory reporting.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Lock,
    title: "Identity & Access Management",
    desc: "PIV/CAC card authentication, LDAP/Active Directory integration, and attribute-based access control (ABAC) for complex government org structures.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Globe,
    title: "National Grid Management",
    desc: "Manage national energy infrastructure with SCADA integration, real-time grid monitoring, and AI-powered demand forecasting for grid stability.",
    color: "from-pink-500 to-rose-500",
  },
];

const complianceItems = [
  "FedRAMP Moderate (in progress)",
  "NIST 800-53 Rev 5",
  "FISMA compliance",
  "FIPS 140-2 encryption",
  "SOC 2 Type II",
  "ISO 27001",
  "GDPR & ePrivacy",
  "Section 508 accessibility",
];

function GovernmentContent() {
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
            <Globe className="w-3.5 h-3.5" /> Government & Public Sector
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Secure infrastructure for{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              public services
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            NexoraGrid provides government agencies and public utilities with the security, compliance,
            and operational intelligence needed to serve citizens at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Contact Government Sales <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/legal/security"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              Security Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for public sector requirements</h2>
            <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>
              Every feature designed to meet the unique security, compliance, and operational demands of government.
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

      {/* Compliance */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Compliance & certifications</h2>
              <p className={`mb-6 leading-relaxed ${t(T.textMuted, theme)}`}>
                NexoraGrid maintains the highest security certifications required for government
                deployments. Our security team works directly with your compliance officers.
              </p>
              <ul className="space-y-3">
                {complianceItems.map((item) => (
                  <li key={item} className={`flex items-center gap-3 text-sm ${t(T.textDim, theme)}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                <div className="text-lg font-bold mb-2">Data Sovereignty</div>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
                  Choose exactly where your data lives. On-premise, private cloud, or government-
                  specific cloud regions. Your data never crosses borders without your explicit consent.
                </p>
              </div>
              <div className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                <div className="text-lg font-bold mb-2">Dedicated Security Team</div>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
                  Every government deployment includes a dedicated security engineer, quarterly
                  penetration testing, and 24/7 security operations center (SOC) monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        {isDark
          ? <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-emerald-900/10" />
          : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50" />
        }
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Modernize public infrastructure</h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            Our government team will work with your procurement and security teams to design the right solution.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
          >
            Contact Government Sales <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function GovernmentSolutionPage() {
  return (
    <LandingWrapper>
      <GovernmentContent />
    </LandingWrapper>
  );
}

"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Shield, Lock, Server, Eye, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const certifications = [
  { name: "SOC 2 Type II",    status: "Certified",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { name: "ISO 27001",        status: "In Progress", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { name: "GDPR",             status: "Compliant",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { name: "FedRAMP Moderate", status: "In Progress", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { name: "HIPAA",            status: "Ready",       color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { name: "PCI DSS",          status: "Compliant",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption",
    items: ["TLS 1.3 for all data in transit", "AES-256 encryption at rest", "End-to-end encryption for sensitive fields", "FIPS 140-2 compliant cryptography"],
  },
  {
    icon: Shield,
    title: "Access Control",
    items: ["Multi-factor authentication (MFA)", "SSO & SAML 2.0 support", "Role-based access control (RBAC)", "Attribute-based access control (ABAC)", "Session management and timeout policies"],
  },
  {
    icon: Server,
    title: "Infrastructure",
    items: ["AWS multi-region deployment", "Zero-trust network architecture", "DDoS protection via AWS Shield", "Web Application Firewall (WAF)", "Automated vulnerability scanning"],
  },
  {
    icon: Eye,
    title: "Monitoring & Audit",
    items: ["24/7 Security Operations Center (SOC)", "Real-time threat detection", "Immutable audit logs", "Anomaly detection and alerting", "Quarterly penetration testing"],
  },
];

function SecurityContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Shield className="w-3.5 h-3.5" /> Security
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Security at{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NexoraGrid
            </span>
          </h1>
          <p className={`text-xl leading-relaxed ${t(T.textMuted, theme)}`}>
            Security is not a feature — it&apos;s the foundation. Every layer of NexoraGrid is built
            with security-first principles.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Certifications */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Certifications & Compliance</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <div key={cert.name} className={`border rounded-xl p-4 flex items-center justify-between ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                  <span className="font-medium">{cert.name}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cert.color}`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security architecture */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Security Architecture</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature) => (
                <div key={feature.title} className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${t(T.sectionBadge.indigo, theme)}`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item} className={`flex items-center gap-2 text-sm ${t(T.textDim, theme)}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible disclosure */}
          <div className={`border rounded-2xl p-7 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <h2 className="text-xl font-bold mb-3">Responsible Disclosure</h2>
            <p className={`text-sm leading-relaxed mb-4 ${t(T.textMuted, theme)}`}>
              We take security vulnerabilities seriously. If you discover a security issue in
              NexoraGrid, please report it to us responsibly. We commit to:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                "Acknowledge your report within 24 hours",
                "Provide regular updates on our progress",
                "Credit you in our security hall of fame (if desired)",
                "Not pursue legal action for good-faith security research",
              ].map((item) => (
                <li key={item} className={`flex items-center gap-2 text-sm ${t(T.textDim, theme)}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:security@nexoragrid.com"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Report a vulnerability → security@nexoragrid.com
            </a>
          </div>

          {/* Data residency */}
          <div className={`border rounded-2xl p-7 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <h2 className="text-xl font-bold mb-3">Data Residency</h2>
            <p className={`text-sm leading-relaxed mb-4 ${t(T.textMuted, theme)}`}>
              Enterprise customers can choose where their data is stored. We support the following regions:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { region: "US East", location: "Virginia, USA" },
                { region: "EU West", location: "Frankfurt, Germany" },
                { region: "APAC",    location: "Singapore" },
              ].map((r) => (
                <div key={r.region} className={`rounded-xl p-3 text-center ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                  <div className="font-semibold text-sm">{r.region}</div>
                  <div className={`text-xs mt-0.5 ${t(T.textDim40, theme)}`}>{r.location}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t pt-6 flex flex-wrap gap-4 text-sm ${t(T.border, theme)}`}>
            {[
              { href: "/legal/privacy", label: "Privacy Policy" },
              { href: "/legal/terms",   label: "Terms of Service" },
              { href: "/legal/gdpr",    label: "GDPR" },
              { href: "/contact",       label: "Contact Security Team" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function SecurityPage() {
  return (
    <LandingWrapper>
      <SecurityContent />
    </LandingWrapper>
  );
}

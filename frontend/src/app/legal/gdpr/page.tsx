"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Globe, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const rights = [
  { title: "Right of Access (Art. 15)",          desc: "You have the right to obtain confirmation of whether we process your personal data and, if so, to receive a copy of that data along with information about how it is processed." },
  { title: "Right to Rectification (Art. 16)",   desc: "You have the right to have inaccurate personal data corrected and incomplete data completed." },
  { title: "Right to Erasure (Art. 17)",          desc: "You have the right to request deletion of your personal data when it is no longer necessary for the purposes for which it was collected, or when you withdraw consent." },
  { title: "Right to Restriction (Art. 18)",      desc: "You have the right to request that we restrict the processing of your personal data in certain circumstances." },
  { title: "Right to Data Portability (Art. 20)", desc: "You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit it to another controller." },
  { title: "Right to Object (Art. 21)",           desc: "You have the right to object to the processing of your personal data for direct marketing purposes or when processing is based on legitimate interests." },
];

const legalBases = [
  { basis: "Contract Performance", desc: "Processing necessary to provide the Services you have subscribed to.",                                                    examples: ["Account management", "Service delivery", "Billing"] },
  { basis: "Legitimate Interests", desc: "Processing necessary for our legitimate business interests, balanced against your rights.",                               examples: ["Security monitoring", "Fraud prevention", "Service improvement"] },
  { basis: "Consent",              desc: "Processing based on your explicit consent, which you can withdraw at any time.",                                          examples: ["Marketing emails", "Analytics cookies", "Product updates"] },
  { basis: "Legal Obligation",     desc: "Processing required to comply with applicable laws and regulations.",                                                     examples: ["Tax records", "Legal holds", "Regulatory reporting"] },
];

function GdprContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Globe className="w-3.5 h-3.5" /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">GDPR Compliance</h1>
          <p className={`text-sm ${t(T.textDim40, theme)}`}>Last updated: May 3, 2026</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <div className={`border rounded-xl p-5 text-sm leading-relaxed ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.textMuted, theme)}`}>
            NexoraGrid is committed to compliance with the General Data Protection Regulation (GDPR)
            for all users in the European Economic Area (EEA). This page explains how we comply with
            GDPR requirements and how you can exercise your rights.
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Data Controller</h2>
            <div className={`border rounded-xl p-5 text-sm leading-relaxed ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.textMuted, theme)}`}>
              <p className="mb-2">
                <strong className={t(T.textDim, theme)}>NexoraGrid, Inc.</strong> is the data controller
                for personal data processed through our Services.
              </p>
              <p>
                548 Market St, Suite 12000, San Francisco, CA 94104, USA<br />
                EU Representative: NexoraGrid EU Ltd., Frankfurt, Germany<br />
                DPO Contact: dpo@nexoragrid.com
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-5">Legal Bases for Processing</h2>
            <div className="space-y-4">
              {legalBases.map((lb) => (
                <div key={lb.basis} className={`border rounded-xl p-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                  <h3 className="font-semibold mb-1">{lb.basis}</h3>
                  <p className={`text-sm mb-3 ${t(T.textMuted, theme)}`}>{lb.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {lb.examples.map((ex) => (
                      <span key={ex} className={`text-xs px-2.5 py-1 rounded-lg border ${t(T.tagBg, theme)}`}>{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-5">Your Rights Under GDPR</h2>
            <div className="space-y-4">
              {rights.map((right) => (
                <div key={right.title} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{right.title}</h3>
                    <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{right.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">International Data Transfers</h2>
            <p className={`text-sm leading-relaxed mb-3 ${t(T.textMuted, theme)}`}>
              NexoraGrid is headquartered in the United States. When we transfer personal data from
              the EEA to the US, we rely on the following safeguards:
            </p>
            <ul className="space-y-2">
              {[
                "Standard Contractual Clauses (SCCs) approved by the European Commission",
                "EU-US Data Privacy Framework (where applicable)",
                "Binding Corporate Rules for intra-group transfers",
              ].map((item) => (
                <li key={item} className={`flex items-center gap-2 text-sm ${t(T.textMuted, theme)}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Data Retention</h2>
            <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
              We retain personal data only for as long as necessary to fulfill the purposes for which
              it was collected. Account data is retained for the duration of your subscription plus
              30 days after termination. You can request immediate deletion by contacting
              dpo@nexoragrid.com.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/5 border border-indigo-500/20 rounded-2xl p-7">
            <h2 className="text-xl font-bold mb-3">Exercise Your Rights</h2>
            <p className={`text-sm leading-relaxed mb-5 ${t(T.textMuted, theme)}`}>
              To exercise any of your GDPR rights, contact our Data Protection Officer. We will
              respond within 30 days. You also have the right to lodge a complaint with your local
              supervisory authority.
            </p>
            <a
              href="mailto:dpo@nexoragrid.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              Contact DPO <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className={`border-t pt-6 flex flex-wrap gap-4 text-sm ${t(T.border, theme)}`}>
            {[
              { href: "/legal/privacy",  label: "Privacy Policy" },
              { href: "/legal/terms",    label: "Terms of Service" },
              { href: "/legal/cookies",  label: "Cookie Policy" },
              { href: "/legal/security", label: "Security" },
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

export default function GdprPage() {
  return (
    <LandingWrapper>
      <GdprContent />
    </LandingWrapper>
  );
}

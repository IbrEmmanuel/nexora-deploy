"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { CheckCircle2, X, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 49,
    annualPrice: 39,
    desc: "Perfect for startups and small teams getting started.",
    features: [
      "5 AI Agents",
      "10,000 API calls/month",
      "Basic analytics dashboard",
      "Email support",
      "1 organization",
      "Standard integrations",
      "Community access",
    ],
    notIncluded: ["IoT monitoring", "Investor dashboard", "SSO & SAML", "SLA guarantee"],
    cta: "Start Free Trial",
    href: "/register",
    highlight: false,
  },
  {
    name: "Growth",
    monthlyPrice: 199,
    annualPrice: 159,
    desc: "For scaling businesses with advanced automation needs.",
    features: [
      "25 AI Agents",
      "100,000 API calls/month",
      "Advanced analytics",
      "IoT monitoring (50 devices)",
      "Priority support",
      "5 organizations",
      "Webhook integrations",
      "Custom dashboards",
      "API access",
    ],
    notIncluded: ["Investor dashboard", "SSO & SAML", "Dedicated support"],
    cta: "Start Free Trial",
    href: "/register",
    highlight: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    desc: "For large enterprises, governments, and energy companies.",
    features: [
      "Unlimited AI Agents",
      "Unlimited API calls",
      "Investor dashboard",
      "Full IoT suite (unlimited devices)",
      "Dedicated support manager",
      "Unlimited organizations",
      "SSO & SAML 2.0",
      "99.99% SLA guarantee",
      "Custom integrations",
      "On-premise deployment",
      "Compliance reporting",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

const comparisonRows = [
  { feature: "AI Agents", starter: "5", growth: "25", enterprise: "Unlimited" },
  { feature: "API calls/month", starter: "10K", growth: "100K", enterprise: "Unlimited" },
  { feature: "Organizations", starter: "1", growth: "5", enterprise: "Unlimited" },
  { feature: "IoT Devices", starter: false, growth: "50", enterprise: "Unlimited" },
  { feature: "Analytics", starter: "Basic", growth: "Advanced", enterprise: "Bloomberg-grade" },
  { feature: "Investor Dashboard", starter: false, growth: false, enterprise: true },
  { feature: "SSO & SAML", starter: false, growth: false, enterprise: true },
  { feature: "SLA Guarantee", starter: false, growth: false, enterprise: "99.99%" },
  { feature: "Support", starter: "Email", growth: "Priority", enterprise: "Dedicated" },
  { feature: "Custom Integrations", starter: false, growth: false, enterprise: true },
  { feature: "Audit Logs", starter: false, growth: true, enterprise: true },
  { feature: "On-premise", starter: false, growth: false, enterprise: true },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "All Starter and Growth plans include a 14-day free trial with no credit card required. Enterprise plans include a custom proof-of-concept period.",
  },
  {
    q: "What counts as an API call?",
    a: "Any request to the NexoraGrid REST or GraphQL API counts as one API call. Webhook deliveries and internal agent actions do not count toward your limit.",
  },
  {
    q: "Do you offer discounts for nonprofits or education?",
    a: "Yes. We offer 50% discounts for verified nonprofits and educational institutions. Contact our sales team to apply.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, ACH bank transfers, and wire transfers for Enterprise plans. All payments are processed securely via Stripe.",
  },
  {
    q: "Is my data secure?",
    a: "NexoraGrid is SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest and in transit. Enterprise plans support on-premise deployment.",
  },
];

function PricingContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        {isDark && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px] pointer-events-none" />
        )}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.cyan, theme)}`}>
            <DollarSign className="w-3.5 h-3.5" /> Pricing
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className={`text-xl mb-10 ${t(T.textMuted, theme)}`}>
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className={`inline-flex items-center gap-3 border rounded-xl p-1 ${t(T.toggleBg, theme)}`}>
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !annual ? t(T.toggleActive, theme) : t(T.toggleInactive, theme)
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                annual ? t(T.toggleActive, theme) : t(T.toggleInactive, theme)
              }`}
            >
              Annual{" "}
              <span className="text-emerald-400 text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border border-indigo-500/40 shadow-2xl shadow-indigo-500/20"
                    : `border ${t(T.planCard, theme)}`
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="mb-7">
                  <div className="text-xl font-bold mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    {plan.monthlyPrice ? (
                      <>
                        <span className="text-5xl font-bold">
                          ${annual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className={t(T.planPeriod, theme)}>/mo</span>
                        {annual && (
                          <span className="text-xs text-emerald-400 ml-1">billed annually</span>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>
                  <p className={`text-sm ${t(T.planDesc, theme)}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${t(T.pricingFeature, theme)}`}>
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${t(T.textFaint, theme)}`}>
                      <X className={`w-4 h-4 shrink-0 ${isDark ? "text-white/20" : "text-slate-300"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`text-center py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                      : t(T.planCta, theme)
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className={`py-24 border-t ${t(T.border, theme)}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Full feature comparison</h2>
            <p className={t(T.textMuted, theme)}>See exactly what&apos;s included in each plan.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${t(T.borderMd, theme)}`}>
                  <th className={`text-left py-4 pr-8 text-sm font-medium ${t(T.textMuted, theme)}`}>Feature</th>
                  {["Starter", "Growth", "Enterprise"].map((p) => (
                    <th key={p} className="text-center py-4 px-4 text-sm font-semibold">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b ${t(T.border, theme)} ${i % 2 === 0 ? (isDark ? "bg-white/[0.01]" : "bg-slate-50/50") : ""}`}
                  >
                    <td className={`py-4 pr-8 text-sm ${t(T.textDim, theme)}`}>{row.feature}</td>
                    {[row.starter, row.growth, row.enterprise].map((val, j) => (
                      <td key={j} className="py-4 px-4 text-center text-sm">
                        {val === true ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 mx-auto" />
                        ) : val === false ? (
                          <X className={`w-4 h-4 mx-auto ${isDark ? "text-white/20" : "text-slate-300"}`} />
                        ) : (
                          <span className={t(T.textDim, theme)}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-24 border-t ${t(T.border, theme)}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently asked questions</h2>
            <p className={t(T.textMuted, theme)}>Everything you need to know about pricing.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className={`border rounded-xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{faq.a}</p>
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
            14-day free trial. No credit card required. Cancel anytime.
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

export default function PricingPage() {
  return (
    <LandingWrapper>
      <PricingContent />
    </LandingWrapper>
  );
}

"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { TrendingUp, Bot, BarChart3, GitBranch, DollarSign, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: Bot,
    title: "Replace 10 SaaS tools with one",
    desc: "Stop paying for Intercom, Mixpanel, Zapier, HubSpot, and five other tools. NexoraGrid replaces your entire stack with one unified platform.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "AI agents from day one",
    desc: "Deploy AI agents for sales, support, and operations on day one. No ML team required. Your agents learn from your data and improve automatically.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Investor-ready analytics",
    desc: "Generate board decks, investor updates, and KPI reports automatically. Show your investors the metrics that matter with Bloomberg-grade visualizations.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: GitBranch,
    title: "API-first architecture",
    desc: "Build on top of NexoraGrid's REST and GraphQL APIs. Integrate with your existing tools or build custom workflows in minutes, not months.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: DollarSign,
    title: "Startup-friendly pricing",
    desc: "Start at $49/month. Scale your plan as you grow. No enterprise contracts, no minimum commitments. Cancel anytime.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Zap,
    title: "Ship faster",
    desc: "Pre-built modules for auth, billing, notifications, and analytics mean you can focus on your core product instead of rebuilding infrastructure.",
    color: "from-violet-500 to-indigo-500",
  },
];

const toolsReplaced = [
  { name: "Intercom", category: "Customer Support" },
  { name: "Mixpanel", category: "Analytics" },
  { name: "Zapier", category: "Automation" },
  { name: "HubSpot", category: "CRM" },
  { name: "PagerDuty", category: "Alerting" },
  { name: "Datadog", category: "Monitoring" },
  { name: "Segment", category: "Data Pipeline" },
  { name: "Retool", category: "Internal Tools" },
];

function StartupsContent() {
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
            <TrendingUp className="w-3.5 h-3.5" /> Startups & Scale-ups
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Move fast without{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              breaking things
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            Replace your entire SaaS stack with one platform. Get AI agents, analytics, billing, and
            team management from day one — at startup pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              See Pricing
            </Link>
          </div>
          <p className={`mt-4 text-sm ${t(T.textFaint, theme)}`}>14-day free trial · Cancel anytime · From $49/mo</p>
        </div>
      </section>

      {/* Tools replaced */}
      <section className={`py-12 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className={`text-center text-sm uppercase tracking-widest mb-8 ${t(T.textFaint, theme)}`}>
            Replace all of these with NexoraGrid
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {toolsReplaced.map((tool) => (
              <div
                key={tool.name}
                className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <span className={`font-semibold text-sm line-through ${t(T.textDim, theme)}`}>{tool.name}</span>
                <span className={`text-xs ${t(T.textFaint, theme)}`}>{tool.category}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <span className={`text-sm ${t(T.textDim40, theme)}`}>Average startup saves </span>
            <span className="text-emerald-400 font-bold">$3,200/month</span>
            <span className={`text-sm ${t(T.textDim40, theme)}`}> by switching to NexoraGrid</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>
              Built for startups that want to move fast without rebuilding infrastructure every 6 months.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className={`border rounded-2xl p-7 transition-all ${t(T.featureCard, theme)}`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${b.color} mb-5 shadow-lg`}>
                  <b.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{b.title}</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className={`border rounded-2xl p-8 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
            <p className={`text-lg leading-relaxed italic mb-6 ${t(T.textDim, theme)}`}>
              &ldquo;NexoraGrid replaced 7 tools we were using. Our AI agents now handle 80% of customer
              support automatically. ROI was positive in week 2. I wish we had found this sooner.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                SC
              </div>
              <div className="text-left">
                <div className="font-semibold">Sarah Chen</div>
                <div className={`text-xs ${t(T.textDim40, theme)}`}>CTO, EnergyCore (Series B)</div>
              </div>
            </div>
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
            Join 200+ startups already running on NexoraGrid.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function StartupsSolutionPage() {
  return (
    <LandingWrapper>
      <StartupsContent />
    </LandingWrapper>
  );
}

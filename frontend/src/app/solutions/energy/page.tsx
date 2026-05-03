"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Zap, Wifi, Activity, Shield, BarChart3, Bell, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const capabilities = [
  {
    icon: Wifi,
    title: "Real-Time IoT Monitoring",
    desc: "Monitor solar panels, wind turbines, EV charging stations, inverters, and battery systems with sub-second data refresh. Supports Modbus TCP/RTU, DNP3, and IEC 61850.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Activity,
    title: "Predictive Fault Detection",
    desc: "AI models trained on millions of energy data points detect anomalies before they become failures. Achieve 94% fault prediction accuracy with 72-hour advance warning.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Energy Analytics & Forecasting",
    desc: "Correlate production data with weather forecasts, grid demand, and market prices. Generate automated performance reports for regulators and investors.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Bell,
    title: "Smart Alerting",
    desc: "Intelligent alert routing that learns your team's patterns. Get notified via SMS, email, Slack, or PagerDuty — only when it actually matters.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "SCADA Integration",
    desc: "Seamlessly integrate with existing SCADA systems. NexoraGrid acts as a unified data layer on top of your existing infrastructure — no rip-and-replace required.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Grid Optimization AI",
    desc: "AI-powered dispatch optimization that maximizes revenue from energy storage, demand response programs, and ancillary services markets.",
    color: "from-pink-500 to-rose-500",
  },
];

const metrics = [
  { value: "2,400+", label: "Solar panels monitored" },
  { value: "180+", label: "EV stations managed" },
  { value: "$2M+", label: "Downtime costs saved" },
  { value: "94%", label: "Fault prediction accuracy" },
];

const useCases = [
  "Utility-scale solar & wind farms",
  "Commercial & industrial solar portfolios",
  "EV charging network operators",
  "Battery energy storage systems (BESS)",
  "Microgrids & virtual power plants",
  "Smart building energy management",
];

function EnergyContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        {isDark && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.cyan, theme)}`}>
            <Zap className="w-3.5 h-3.5" /> Energy Companies
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            The intelligence layer for{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              energy infrastructure
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
            Monitor, predict, and optimize your entire energy portfolio in real time. From solar farms
            to EV networks — NexoraGrid gives you complete operational visibility.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-cyan-500/30"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className={`py-12 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border ${t(T.statsGrid, theme)}`}>
            {metrics.map((m) => (
              <div key={m.label} className={`${t(T.statsBg, theme)} px-6 py-6 text-center`}>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {m.value}
                </div>
                <div className={`text-sm mt-1 ${t(T.textDim40, theme)}`}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for energy operations</h2>
            <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>
              Every feature designed for the unique demands of energy infrastructure management.
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

      {/* Use cases */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Who uses NexoraGrid for energy?</h2>
              <p className={`mb-6 leading-relaxed ${t(T.textMuted, theme)}`}>
                From utility-scale operators to commercial building managers, NexoraGrid adapts to
                your specific energy infrastructure needs.
              </p>
              <ul className="space-y-3">
                {useCases.map((uc) => (
                  <li key={uc} className={`flex items-center gap-3 text-sm ${t(T.textDim, theme)}`}>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`border rounded-2xl p-7 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                  PS
                </div>
                <div>
                  <div className="font-semibold">Priya Sharma</div>
                  <div className={`text-xs ${t(T.textDim40, theme)}`}>Head of Operations, TeleGrid</div>
                </div>
              </div>
              <p className={`text-sm leading-relaxed italic ${t(T.textDim, theme)}`}>
                &ldquo;We monitor 2,400 solar panels and 180 EV stations in real time. The predictive
                maintenance AI has saved us $2M in downtime costs in the first year alone. NexoraGrid
                is the backbone of our entire energy operations.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        {isDark
          ? <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-emerald-900/10" />
          : <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-emerald-50" />
        }
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to modernize your energy operations?</h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            Join 150+ energy companies already running on NexoraGrid.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-cyan-500/30"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function EnergySolutionPage() {
  return (
    <LandingWrapper>
      <EnergyContent />
    </LandingWrapper>
  );
}

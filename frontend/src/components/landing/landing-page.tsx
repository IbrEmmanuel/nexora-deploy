"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Bot, Zap, Shield, Globe, Cpu,
  TrendingUp, Activity, CheckCircle2, Star, Building2,
  Database, Lock, Play, Users, DollarSign,
  Wifi, ChevronRight, Layers, Sparkles, LineChart,
  GitBranch, Settings, LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";
import { LandingThemeProvider, useLandingTheme, t, T } from "./landing-theme";
import { cn } from "@/lib/utils";

// ─── Root ─────────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <LandingThemeProvider>
      <LandingPageInner />
    </LandingThemeProvider>
  );
}

function LandingPageInner() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${t(T.pageBg, theme)} ${t(T.text, theme)} overflow-x-hidden transition-colors duration-300`}>
      <LandingNav />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <PlatformPowerSection />
      <UseCasesSection />
      <AiSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Mesh gradient orbs */}
      {isDark && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none animate-float" />
          <div className="absolute top-1/3 left-[15%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/3 right-[15%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-cyan-50/60 pointer-events-none" />
      )}

      {/* Grid */}
      <div className={cn(
        "absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px]",
        isDark ? "opacity-100" : "opacity-20",
      )} aria-hidden="true" />

      {/* Glowing nodes */}
      {isDark && (
        <>
          <div className="absolute top-1/4 left-[20%] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_12px_4px_rgba(99,102,241,0.6)] animate-pulse" aria-hidden="true" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_3px_rgba(6,182,212,0.6)] animate-pulse" style={{ animationDelay: "0.5s" }} aria-hidden="true" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_12px_4px_rgba(168,85,247,0.6)] animate-pulse" style={{ animationDelay: "1s" }} aria-hidden="true" />
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full shadow-[0_0_10px_3px_rgba(165,180,252,0.6)] animate-pulse" style={{ animationDelay: "1.5s" }} aria-hidden="true" />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={cn(
            "inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-8",
            t(T.sectionBadge.indigo, theme),
          )}>
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            AI-Powered Business Infrastructure OS
            <span className={cn("text-xs px-2 py-0.5 rounded-full", isDark ? "bg-indigo-500/20 text-indigo-200" : "bg-indigo-100 text-indigo-700")}>v2.0</span>
          </div>
        </motion.div>

        {/* Animated gradient headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
        >
          The Operating System
          <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            for Modern Business
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className={cn("text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed", t(T.textMuted, theme))}
        >
          Unify AI automation, infrastructure monitoring, and enterprise intelligence in one platform.
          Built for energy companies, enterprises, and governments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/register"
            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
          >
            Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            href="#demo"
            className={cn(
              "group flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all",
              isDark ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white" : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 shadow-sm",
            )}
          >
            <Play className="w-4 h-4 text-indigo-500" aria-hidden="true" />
            Book Enterprise Demo
          </Link>
        </motion.div>

        {/* Floating dashboard preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="animate-float mb-16"
        >
          <div className={cn(
            "relative rounded-2xl border overflow-hidden shadow-2xl mx-auto max-w-2xl",
            isDark ? "border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-indigo-500/10" : "border-slate-200 bg-white shadow-slate-200",
          )}>
            {/* Browser chrome */}
            <div className={cn("flex items-center gap-2 px-4 py-2.5 border-b", isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50")}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" aria-hidden="true" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" aria-hidden="true" />
              <div className={cn("flex-1 mx-3 rounded px-2 py-0.5 text-xs", isDark ? "bg-white/5 text-white/30" : "bg-white text-slate-400 border border-slate-200")}>
                app.nexoragrid.com/dashboard
              </div>
            </div>
            {/* Mini dashboard */}
            <div className="p-4 grid grid-cols-4 gap-2">
              {[
                { label: "Revenue", value: "$4.28M", color: "text-emerald-500" },
                { label: "AI Tasks", value: "8,420", color: "text-indigo-500" },
                { label: "Energy kWh", value: "2.34M", color: "text-cyan-500" },
                { label: "Uptime", value: "99.99%", color: "text-purple-500" },
              ].map((m) => (
                <div key={m.label} className={cn("rounded-xl p-3 text-center", isDark ? "bg-white/[0.03] border border-white/[0.05]" : "bg-slate-50 border border-slate-100")}>
                  <div className={cn("text-lg font-bold", m.color)}>{m.value}</div>
                  <div className={cn("text-[10px] mt-0.5", isDark ? "text-white/30" : "text-slate-400")}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
          className={cn("grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border", t(T.statsGrid, theme))}
        >
          {[
            { value: "$2.4B+", label: "Assets Monitored" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "500+",   label: "Enterprise Clients" },
            { value: "140ms",  label: "Avg Response Time" },
          ].map((s) => (
            <div key={s.label} className={cn(t(T.statsBg, theme), "px-6 py-5 text-center")}>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">{s.value}</div>
              <div className={cn("text-xs mt-1", t(T.textFaint, theme))}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Trusted By ───────────────────────────────────────────────────────────────
function TrustedBySection() {
  const { theme } = useLandingTheme();
  const logos = ["EnergyCore","FinVault","TeleGrid","NovaCorp","QuantumBank","ArcLight","DataStream","OmniTech"];
  // Duplicate for seamless marquee
  const doubled = [...logos, ...logos];
  return (
    <section className={cn("py-16 border-y", t(T.trustedBg, theme))}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className={cn("text-center text-sm uppercase tracking-widest mb-10", t(T.trustedLabel, theme))}>
          Trusted by industry leaders worldwide
        </p>
        <div className="marquee-container">
          <div className="marquee-track">
            {doubled.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className={cn("mx-8 transition-colors font-bold text-lg tracking-tight select-none shrink-0", t(T.trustedLogo, theme))}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: Bot,           title: "AI Automation",           desc: "Deploy intelligent agents that handle customer support, sales, operations, and financial analysis autonomously.",                                    color: "from-indigo-500 to-purple-500" },
  { icon: Wifi,          title: "Energy & IoT Monitoring",  desc: "Real-time monitoring of solar panels, EV stations, inverters, and battery systems with predictive fault detection.",                              color: "from-cyan-500 to-teal-500" },
  { icon: LineChart,     title: "Investor Dashboard",       desc: "Bloomberg-grade analytics with revenue forecasting, ROI tracking, and AI-powered next-best-move recommendations.",                               color: "from-emerald-500 to-green-500" },
  { icon: GitBranch,     title: "API Ecosystem",            desc: "Connect WhatsApp, Twilio, Stripe, CRMs, and banking APIs through a unified integration hub with webhook support.",                               color: "from-orange-500 to-amber-500" },
  { icon: LayoutDashboard, title: "Enterprise Command Center", desc: "Drag-and-drop modular dashboard with real-time widgets, system health monitors, and ROI trackers.",                                          color: "from-pink-500 to-rose-500" },
  { icon: Shield,        title: "Security & Compliance",    desc: "SOC 2 compliant. Multi-tenant RBAC, 2FA, SSO, audit logs, and enterprise-grade encryption built in.",                                           color: "from-violet-500 to-indigo-500" },
];

function FeaturesSection() {
  const { theme } = useLandingTheme();
  return (
    <section id="features" className="py-28 relative">
      <div className={cn(`absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none`, theme === "light" ? "opacity-0" : "")} aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className={cn("inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-4", t(T.sectionBadge.indigo, theme))}>
            <Zap className="w-3.5 h-3.5" aria-hidden="true" /> Platform Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Everything your enterprise needs</h2>
          <p className={cn("text-lg max-w-2xl mx-auto", t(T.textMuted, theme))}>
            One unified platform replacing dozens of point solutions. Built for scale from day one.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className={cn(
                "group relative border rounded-2xl p-6 transition-all duration-300 hover:gradient-border",
                t(T.featureCard, theme),
              )}
            >
              <div className={cn("inline-flex p-3 rounded-xl bg-gradient-to-br mb-5 shadow-lg", f.color)}>
                <f.icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className={cn("text-sm leading-relaxed", t(T.textMuted, theme))}>{f.desc}</p>
              <div className={cn("mt-4 flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity", t(T.featureLearnMore, theme))}>
                Learn more <ChevronRight className="w-3 h-3" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Demo ─────────────────────────────────────────────────────────
function InteractiveDemoSection() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Overview", "AI Agents", "Energy", "Analytics"];

  return (
    <section id="demo" className="py-28 relative">
      <div className={`absolute inset-0 bg-gradient-to-b from-indigo-950/10 to-transparent pointer-events-none ${isDark ? "" : "opacity-0"}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-4 ${t(T.sectionBadge.cyan, theme)}`}>
            <Play className="w-3.5 h-3.5" /> Live Platform Preview
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">See NexoraGrid in action</h2>
          <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>Explore the command center that powers enterprise operations.</p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : isDark
                    ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className={`relative rounded-2xl border overflow-hidden shadow-2xl ${isDark ? "border-white/10 bg-[#0d0d2b]/80 backdrop-blur-xl shadow-indigo-500/10" : "border-slate-200 bg-slate-50 shadow-slate-200/80"}`}>
          {/* Browser bar */}
          <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <div className={`flex-1 mx-4 rounded-md px-3 py-1 text-xs ${isDark ? "bg-white/5 text-white/30" : "bg-slate-100 text-slate-400"}`}>
              app.nexoragrid.com/dashboard
            </div>
          </div>

          <div className="flex h-[480px]">
            {/* Sidebar */}
            <div className={`w-52 border-r p-3 flex flex-col gap-1 shrink-0 ${isDark ? "border-white/5 bg-white/[0.01]" : "border-slate-200 bg-white"}`}>
              {[
                { icon: LayoutDashboard, label: "Overview",     active: activeTab === 0 },
                { icon: Bot,             label: "AI Agents",    active: activeTab === 1 },
                { icon: Wifi,            label: "Energy",       active: activeTab === 2 },
                { icon: LineChart,       label: "Analytics",    active: activeTab === 3 },
                { icon: GitBranch,       label: "Integrations", active: false },
                { icon: Users,           label: "Team",         active: false },
                { icon: Settings,        label: "Settings",     active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    item.active
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                      : isDark
                        ? "text-white/40 hover:text-white/70 hover:bg-white/5"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-hidden">
              {activeTab === 0 && <DemoOverview />}
              {activeTab === 1 && <DemoAgents />}
              {activeTab === 2 && <DemoEnergy />}
              {activeTab === 3 && <DemoAnalytics />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { theme } = useLandingTheme();
  return (
    <div className={`rounded-xl border p-3 ${theme === "dark" ? "bg-white/[0.03] border-white/5" : "bg-white border-slate-200 shadow-sm"} ${className}`}>
      {children}
    </div>
  );
}

function DemoLabel({ children }: { children: React.ReactNode }) {
  const { theme } = useLandingTheme();
  return <div className={`text-xs mb-1 ${t(T.textDim40, theme)}`}>{children}</div>;
}

function DemoOverview() {
  const { theme } = useLandingTheme();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Revenue",   value: "$4.28M", change: "+12.5%", color: "text-emerald-500" },
          { label: "AI Tasks",  value: "8,420",  change: "+8.2%",  color: "text-indigo-500" },
          { label: "Energy kWh",value: "2.34M",  change: "-3.1%",  color: "text-cyan-500" },
          { label: "Uptime",    value: "99.99%", change: "+0.01%", color: "text-purple-500" },
        ].map((m) => (
          <DemoCard key={m.label}>
            <DemoLabel>{m.label}</DemoLabel>
            <div className="text-xl font-bold">{m.value}</div>
            <div className={`text-xs ${m.color}`}>{m.change}</div>
          </DemoCard>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DemoCard className="col-span-2 h-48">
          <DemoLabel>Revenue Trend</DemoLabel>
          <div className="flex items-end gap-1 h-32">
            {[40,55,45,70,60,80,75,90,85,95,88,100].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
            ))}
          </div>
        </DemoCard>
        <DemoCard className="h-48">
          <DemoLabel>AI Activity</DemoLabel>
          <div className="space-y-2">
            {["Sales agent closed deal","Email workflow triggered","Report generated","Alert resolved"].map((a, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs ${t(T.textMuted, theme)}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />{a}
              </div>
            ))}
          </div>
        </DemoCard>
      </div>
    </div>
  );
}

function DemoAgents() {
  const { theme } = useLandingTheme();
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { name: "Sales Agent",   role: "Lead Follow-up",    status: "active",   tasks: 142, color: "bg-emerald-500" },
        { name: "Support Agent", role: "Customer Support",  status: "active",   tasks: 89,  color: "bg-indigo-500" },
        { name: "Finance Agent", role: "Financial Analysis",status: "learning", tasks: 34,  color: "bg-amber-500" },
        { name: "Ops Agent",     role: "Operations",        status: "idle",     tasks: 0,   color: "bg-slate-400" },
      ].map((a) => (
        <DemoCard key={a.name}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">{a.name}</div>
                <div className={`text-xs ${t(T.textDim40, theme)}`}>{a.role}</div>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${a.status==="active"?"bg-emerald-500/20 text-emerald-500":a.status==="learning"?"bg-amber-500/20 text-amber-500":"bg-slate-200 text-slate-500"}`}>
              {a.status}
            </span>
          </div>
          <div className={`text-xs ${t(T.textDim40, theme)}`}>{a.tasks} tasks completed today</div>
        </DemoCard>
      ))}
    </div>
  );
}

function DemoEnergy() {
  const { theme } = useLandingTheme();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Solar Output",  value: "847 kW", status: "normal" },
          { label: "Battery Level", value: "78%",    status: "normal" },
          { label: "EV Stations",   value: "12/15",  status: "warning" },
        ].map((d) => (
          <DemoCard key={d.label}>
            <DemoLabel>{d.label}</DemoLabel>
            <div className="text-xl font-bold">{d.value}</div>
            <div className={`text-xs ${d.status==="normal"?"text-emerald-500":"text-amber-500"}`}>
              {d.status === "normal" ? "● Normal" : "⚠ Attention"}
            </div>
          </DemoCard>
        ))}
      </div>
      <DemoCard className="h-40">
        <DemoLabel>Power Consumption (24h)</DemoLabel>
        <div className="flex items-end gap-0.5 h-24">
          {[30,45,40,60,55,70,65,80,75,85,80,90,85,95,88,92,87,94,89,96,91,88,85,82].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
          ))}
        </div>
      </DemoCard>
    </div>
  );
}

function DemoAnalytics() {
  const { theme } = useLandingTheme();
  return (
    <div className="grid grid-cols-2 gap-3">
      <DemoCard className="h-52">
        <DemoLabel>Revenue Growth</DemoLabel>
        <div className="flex items-end gap-1 h-36">
          {[50,60,55,75,70,85,80,95,90,100,95,110].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm opacity-80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </DemoCard>
      <DemoCard className="h-52">
        <DemoLabel>AI Insights</DemoLabel>
        <div className="space-y-3">
          {[
            { text: "Revenue up 23% — driven by Pro upgrades", conf: 94 },
            { text: "APAC API spike detected — Tanaka Corp launch", conf: 87 },
            { text: "Churn risk: 3 accounts flagged", conf: 91 },
          ].map((ins, i) => (
            <div key={i} className={`rounded-lg p-2.5 ${theme === "dark" ? "bg-white/[0.03]" : "bg-slate-50"}`}>
              <div className={`text-xs mb-1 ${t(T.textDim, theme)}`}>{ins.text}</div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-1 rounded-full overflow-hidden ${t(T.progressBg, theme)}`}>
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ins.conf}%` }} />
                </div>
                <span className="text-xs text-indigo-500">{ins.conf}%</span>
              </div>
            </div>
          ))}
        </div>
      </DemoCard>
    </div>
  );
}

// ─── Platform Power ───────────────────────────────────────────────────────────
function PlatformPowerSection() {
  const { theme } = useLandingTheme();
  const pillars = [
    { icon: Cpu,      title: "AI-First Architecture", desc: "Every module is powered by AI. From anomaly detection to natural language queries, intelligence is built in — not bolted on." },
    { icon: Globe,    title: "Global Infrastructure",  desc: "Multi-region deployment on AWS with 99.99% SLA. Your data stays compliant with GDPR, SOC 2, and ISO 27001." },
    { icon: Database, title: "Unified Data Layer",     desc: "PostgreSQL for core data, MongoDB for events, Redis for real-time. One API surface, zero data silos." },
    { icon: Lock,     title: "Enterprise Security",    desc: "Zero-trust architecture, end-to-end encryption, RBAC, 2FA, SSO, and full audit trails out of the box." },
  ];
  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.purple, theme)}`}>
              <Layers className="w-3.5 h-3.5" /> All-in-One Command Center
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              One platform.<br />
              <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Infinite scale.</span>
            </h2>
            <p className={`text-lg mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
              NexoraGrid replaces your fragmented stack with a single, intelligent operating system.
              From IoT sensors to boardroom dashboards — everything connected, everything automated.
            </p>
            <div className="space-y-4">
              {pillars.map((p) => (
                <div key={p.title} className="flex items-start gap-4 group">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${t(T.pillarsIcon, theme)}`}>
                    <p.icon className={`w-5 h-5 ${t(T.pillarsIconColor, theme)}`} />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{p.title}</div>
                    <div className={`text-sm leading-relaxed ${t(T.pillarsDesc, theme)}`}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />
            <div className={`relative border rounded-3xl p-8 space-y-4 ${t(T.platformCard, theme)}`}>
              {[
                { label: "System Health",    value: 98, color: "bg-emerald-500" },
                { label: "AI Accuracy",      value: 94, color: "bg-indigo-500" },
                { label: "Energy Efficiency",value: 87, color: "bg-cyan-500" },
                { label: "API Reliability",  value: 99, color: "bg-purple-500" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={t(T.textDim, theme)}>{m.label}</span>
                    <span className="font-semibold">{m.value}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${t(T.progressBg, theme)}`}>
                    <motion.div
                      className={`h-full ${m.color} rounded-full`}
                      initial={{ width: 0 }} whileInView={{ width: `${m.value}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Uptime",   value: "99.99%" },
                  { label: "Latency",  value: "142ms" },
                  { label: "Regions",  value: "12" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl p-3 text-center ${theme === "dark" ? "bg-white/[0.03]" : "bg-slate-50"}`}>
                    <div className="text-lg font-bold text-indigo-500">{s.value}</div>
                    <div className={`text-xs ${t(T.textDim40, theme)}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────
const useCases = [
  { icon: Zap,        title: "Energy Companies",  desc: "Monitor solar farms, wind turbines, EV charging networks, and battery storage in real time. Predict failures before they happen.", tags: ["IoT Monitoring","Predictive AI","SCADA Integration"], color: "from-amber-500 to-orange-500" },
  { icon: TrendingUp, title: "Startups & Scale-ups", desc: "Replace 10 SaaS tools with one. Get AI agents, analytics, billing, and team management from day one.",                          tags: ["AI Agents","Analytics","Billing"],                   color: "from-indigo-500 to-purple-500" },
  { icon: Building2,  title: "Enterprises",        desc: "Enterprise command center with multi-tenant RBAC, SSO, audit logs, and custom integrations for your existing stack.",             tags: ["Multi-tenant","SSO","Audit Logs"],                   color: "from-cyan-500 to-blue-500" },
  { icon: Globe,      title: "Governments",         desc: "Secure, compliant infrastructure management for public utilities, smart cities, and national energy grids.",                     tags: ["Compliance","Smart Cities","Grid Management"],       color: "from-emerald-500 to-teal-500" },
];

function UseCasesSection() {
  const { theme } = useLandingTheme();
  return (
    <section id="use-cases" className="py-28 relative">
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none ${theme === "light" ? "opacity-0" : ""}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-4 ${t(T.sectionBadge.emerald, theme)}`}>
            <Globe className="w-3.5 h-3.5" /> Use Cases
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Built for every industry</h2>
          <p className={`text-lg max-w-xl mx-auto ${t(T.textMuted, theme)}`}>From energy grids to fintech startups — NexoraGrid adapts to your domain.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group border rounded-2xl p-7 transition-all ${t(T.useCaseCard, theme)}`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${uc.color} mb-5 shadow-lg`}>
                <uc.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{uc.title}</h3>
              <p className={`text-sm leading-relaxed mb-5 ${t(T.useCaseDesc, theme)}`}>{uc.desc}</p>
              <div className="flex flex-wrap gap-2">
                {uc.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-3 py-1 rounded-full border ${t(T.tagBg, theme)}`}>{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Section ───────────────────────────────────────────────────────────────
function AiSection() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  const agentTasks = [
    { agent: "Sales Agent",   action: "Qualified 14 leads from CRM, sent follow-up emails", time: "2s ago",  status: "done" },
    { agent: "Support Agent", action: "Resolved 8 tickets, escalated 1 to human",           time: "5s ago",  status: "done" },
    { agent: "Finance Agent", action: "Generated Q2 revenue forecast report",                time: "12s ago", status: "done" },
    { agent: "Ops Agent",     action: "Detected anomaly in Server-04, auto-scaled",          time: "18s ago", status: "alert" },
  ];
  return (
    <section className="py-28 relative">
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/15 to-transparent pointer-events-none ${isDark ? "" : "opacity-0"}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Agent feed */}
          <div className="relative">
            {isDark && <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-3xl blur-2xl" />}
            <div className={`relative border rounded-2xl overflow-hidden ${t(T.agentFeed, theme)}`}>
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${t(T.agentFeedBorder, theme)}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium">AI Agent Activity Feed</span>
                <span className={`ml-auto text-xs ${t(T.aiLive, theme)}`}>Live</span>
              </div>
              <div className={`divide-y ${t(T.divider, theme)}`}>
                {agentTasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-4 px-5 py-4"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${task.status==="alert"?"bg-amber-500/20":"bg-indigo-500/20"}`}>
                      <Bot className={`w-4 h-4 ${task.status==="alert"?"text-amber-500":"text-indigo-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-medium">{task.agent}</span>
                        <span className={`text-xs shrink-0 ${t(T.aiTime, theme)}`}>{task.time}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${t(T.aiAction, theme)}`}>{task.action}</p>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${task.status==="alert"?"text-amber-500":"text-emerald-500"}`} />
                  </motion.div>
                ))}
              </div>
              <div className={`px-5 py-3 border-t ${t(T.agentFeedBorder, theme)} ${t(T.agentFeedBg, theme)}`}>
                <div className={`flex items-center gap-2 text-xs ${t(T.aiFooter, theme)}`}>
                  <Activity className="w-3.5 h-3.5" />
                  4 agents active · 243 tasks completed today
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
              <Bot className="w-3.5 h-3.5" /> AI Automation
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Your business<br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">runs itself.</span>
            </h2>
            <p className={`text-lg mb-8 leading-relaxed ${t(T.aiDesc, theme)}`}>
              Deploy AI agents that handle sales, support, operations, and finance autonomously.
              They learn from your data, execute tasks, and escalate only when needed.
            </p>
            <div className="space-y-3 mb-8">
              {[
                "WhatsApp & email automation",
                "Lead qualification & follow-up",
                "Financial report generation",
                "Anomaly detection & auto-remediation",
                "Context-aware memory across sessions",
              ].map((item) => (
                <div key={item} className={`flex items-center gap-3 text-sm ${t(T.aiCheck, theme)}`}>
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Deploy Your First Agent <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  { name: "Starter",    price: "$49",    period: "/mo", desc: "Perfect for startups and small teams.",          features: ["5 AI Agents","10K API calls/mo","Basic analytics","Email support","1 organization"],                                                                                  cta: "Start Free Trial", highlight: false },
  { name: "Growth",     price: "$199",   period: "/mo", desc: "For scaling businesses with advanced needs.",    features: ["25 AI Agents","100K API calls/mo","Advanced analytics","IoT monitoring (50 devices)","Priority support","5 organizations","Webhook integrations"],                   cta: "Start Free Trial", highlight: true },
  { name: "Enterprise", price: "Custom", period: "",    desc: "For large enterprises and governments.",         features: ["Unlimited AI Agents","Unlimited API calls","Investor dashboard","Full IoT suite","Dedicated support","Unlimited orgs","SSO & SAML","SLA guarantee","Custom integrations"], cta: "Contact Sales",    highlight: false },
];

function PricingSection() {
  const { theme } = useLandingTheme();
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="py-28 relative">
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none ${theme === "light" ? "opacity-0" : ""}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-4 ${t(T.sectionBadge.cyan, theme)}`}>
            <DollarSign className="w-3.5 h-3.5" /> Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className={`text-lg max-w-xl mx-auto mb-8 ${t(T.pricingDesc, theme)}`}>Start free. Scale as you grow. No hidden fees.</p>
          <div className={`inline-flex items-center gap-3 border rounded-xl p-1 ${t(T.toggleBg, theme)}`}>
            <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? t(T.toggleActive, theme) : t(T.toggleInactive, theme)}`}>Monthly</button>
            <button onClick={() => setAnnual(true)}  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${annual  ? t(T.toggleActive, theme) : t(T.toggleInactive, theme)}`}>
              Annual <span className="text-emerald-500 text-xs ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border border-indigo-500/40 shadow-2xl shadow-indigo-500/20"
                  : `border ${t(T.planCard, theme)}`
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-lg font-bold mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${t(T.planPeriod, theme)}`}>{plan.period}</span>
                </div>
                <p className={`text-sm ${t(T.planDesc, theme)}`}>{plan.desc}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${t(T.pricingFeature, theme)}`}>
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/register"}
                className={`text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                    : `border ${t(T.planCta, theme)}`
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "NexoraGrid replaced 7 tools we were using. Our AI agents now handle 80% of customer support automatically. ROI was positive in week 2.", name: "Sarah Chen",    title: "CTO, EnergyCore",       avatar: "SC", stars: 5 },
  { quote: "The investor dashboard is Bloomberg-level quality. Our board meetings are now data-driven in a way that wasn't possible before.",         name: "Marcus Johnson", title: "CFO, FinVault Capital",  avatar: "MJ", stars: 5 },
  { quote: "We monitor 2,400 solar panels and 180 EV stations in real time. The predictive maintenance AI has saved us $2M in downtime costs.",      name: "Priya Sharma",  title: "Head of Operations, TeleGrid", avatar: "PS", stars: 5 },
];

function TestimonialsSection() {
  const { theme } = useLandingTheme();
  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-4 ${t(T.sectionBadge.amber, theme)}`}>
            <Star className="w-3.5 h-3.5" /> Customer Stories
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Trusted by industry leaders</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`border rounded-2xl p-7 flex flex-col ${t(T.testimonialCard, theme)}`}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: item.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className={`text-sm leading-relaxed flex-1 mb-6 ${t(T.testimonialQuote, theme)}`}>"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className={`text-xs ${t(T.textDim40, theme)}`}>{item.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCtaSection() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  return (
    <section className="py-28 relative overflow-hidden">
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[100px]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      )}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Power Your Infrastructure<br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              with NexoraGrid
            </span>
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${t(T.textMuted, theme)}`}>
            Join 500+ enterprises already running on the world's most advanced business operating system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 text-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 border font-semibold px-10 py-4 rounded-xl transition-all text-lg ${t(T.ctaSecondary, theme)}`}
            >
              Talk to Sales
            </Link>
          </div>
          <p className={`mt-6 text-sm ${t(T.ctaNote, theme)}`}>No credit card required · 14-day free trial · Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}

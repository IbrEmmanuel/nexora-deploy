"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Newspaper, Download, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const pressReleases = [
  {
    date: "May 3, 2026",
    title: "NexoraGrid Launches v2.0 with AI Agent Memory and Multi-Step Workflow Orchestration",
    excerpt: "NexoraGrid today announced the release of NexoraGrid 2.1, featuring persistent AI agent memory, multi-step workflow builder, and WhatsApp Business API integration.",
  },
  {
    date: "March 15, 2026",
    title: "NexoraGrid Achieves SOC 2 Type II Certification, Expands Enterprise Security Capabilities",
    excerpt: "NexoraGrid has successfully completed its SOC 2 Type II audit, reinforcing its commitment to enterprise-grade security and compliance.",
  },
  {
    date: "January 20, 2026",
    title: "NexoraGrid Raises $18M Series A to Accelerate AI-Powered Business Infrastructure",
    excerpt: "NexoraGrid today announced the close of an $18 million Series A funding round led by Sequoia Capital, with participation from Andreessen Horowitz and Y Combinator.",
  },
  {
    date: "October 5, 2025",
    title: "NexoraGrid Launches IoT Monitoring Suite for Energy Companies",
    excerpt: "NexoraGrid today launched its comprehensive IoT monitoring suite, enabling energy companies to monitor solar panels, EV stations, and battery systems in real time.",
  },
];

const coverage = [
  {
    outlet: "TechCrunch",
    headline: "NexoraGrid is building the operating system for enterprise infrastructure",
    date: "April 2026",
    url: "#",
  },
  {
    outlet: "Forbes",
    headline: "The 30 Under 30 Startups Reshaping Enterprise Software in 2026",
    date: "March 2026",
    url: "#",
  },
  {
    outlet: "The Information",
    headline: "How NexoraGrid is winning the energy sector with AI-powered monitoring",
    date: "February 2026",
    url: "#",
  },
  {
    outlet: "VentureBeat",
    headline: "NexoraGrid's AI agents are replacing entire SaaS stacks for startups",
    date: "January 2026",
    url: "#",
  },
  {
    outlet: "Bloomberg",
    headline: "The startup that wants to be the Bloomberg Terminal for business operations",
    date: "December 2025",
    url: "#",
  },
  {
    outlet: "Wired",
    headline: "Inside the platform that monitors $2.4 billion in energy assets",
    date: "November 2025",
    url: "#",
  },
];

const stats = [
  { value: "$18M", label: "Series A raised" },
  { value: "500+", label: "Enterprise customers" },
  { value: "$2.4B+", label: "Assets monitored" },
  { value: "80", label: "Team members" },
];

function PressContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Newspaper className="w-3.5 h-3.5" /> Press
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            NexoraGrid in the{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              news
            </span>
          </h1>
          <p className={`text-xl mb-8 ${t(T.textMuted, theme)}`}>
            Press releases, media coverage, and brand assets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className={`flex items-center gap-2 border font-semibold px-6 py-3 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              <Download className="w-4 h-4" /> Download Press Kit
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Media Inquiries <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-12 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border ${t(T.statsGrid, theme)}`}>
            {stats.map((s) => (
              <div key={s.label} className={`${t(T.statsBg, theme)} px-6 py-6 text-center`}>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className={`text-sm mt-1 ${t(T.textDim40, theme)}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press releases */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-8">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((pr) => (
              <div
                key={pr.title}
                className={`border rounded-2xl p-6 transition-all group cursor-pointer ${t(T.featureCard, theme)}`}
              >
                <div className={`text-xs mb-2 ${t(T.textDim40, theme)}`}>{pr.date}</div>
                <h3 className={`font-semibold mb-2 group-hover:text-indigo-400 transition-colors leading-snug`}>
                  {pr.title}
                </h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{pr.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media coverage */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-8">Media Coverage</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {coverage.map((item) => (
              <a
                key={item.headline}
                href={item.url}
                className={`border rounded-2xl p-5 transition-all group ${t(T.featureCard, theme)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-indigo-400 mb-1">{item.outlet}</div>
                    <div className={`text-sm leading-snug group-hover:text-indigo-400 transition-colors ${t(T.textDim, theme)}`}>
                      {item.headline}
                    </div>
                    <div className={`text-xs mt-2 ${t(T.textFaint, theme)}`}>{item.date}</div>
                  </div>
                  <ExternalLink className={`w-4 h-4 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5 ${isDark ? "text-white/20" : "text-slate-300"}`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Media contact */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Media Contact</h2>
          <p className={`mb-2 ${t(T.textMuted, theme)}`}>For press inquiries, interview requests, and media assets:</p>
          <a
            href="mailto:press@nexoragrid.com"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            press@nexoragrid.com
          </a>
        </div>
      </section>
    </>
  );
}

export default function PressPage() {
  return (
    <LandingWrapper>
      <PressContent />
    </LandingWrapper>
  );
}

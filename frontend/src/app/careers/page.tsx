"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Zap, Globe, Users } from "lucide-react";
import Link from "next/link";

const openRoles = [
  {
    title: "Senior Backend Engineer",
    team: "Engineering",
    location: "San Francisco / Remote",
    type: "Full-time",
    level: "Senior",
    desc: "Build the core NestJS microservices that power NexoraGrid's API layer. Experience with TypeScript, PostgreSQL, and distributed systems required.",
  },
  {
    title: "Staff Frontend Engineer",
    team: "Engineering",
    location: "San Francisco / Remote",
    type: "Full-time",
    level: "Staff",
    desc: "Lead the development of NexoraGrid's Next.js frontend. Own the design system, performance, and developer experience for our web platform.",
  },
  {
    title: "ML Engineer — AI Agents",
    team: "AI",
    location: "San Francisco / Remote",
    type: "Full-time",
    level: "Senior",
    desc: "Build and improve the AI agent system that powers NexoraGrid's automation capabilities. Experience with LLMs, RAG, and production ML systems required.",
  },
  {
    title: "Senior DevOps / Platform Engineer",
    team: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    desc: "Own NexoraGrid's Kubernetes infrastructure on AWS. Build the CI/CD pipelines, observability stack, and deployment automation that keeps us at 99.99% uptime.",
  },
  {
    title: "Enterprise Account Executive",
    team: "Sales",
    location: "New York / London",
    type: "Full-time",
    level: "Senior",
    desc: "Close $500K+ enterprise deals with energy companies, governments, and large enterprises. 5+ years of enterprise SaaS sales experience required.",
  },
  {
    title: "Product Manager — Energy",
    team: "Product",
    location: "San Francisco / Remote",
    type: "Full-time",
    level: "Mid-Senior",
    desc: "Own the product roadmap for NexoraGrid's energy and IoT monitoring suite. Domain expertise in energy or industrial IoT strongly preferred.",
  },
  {
    title: "Security Engineer",
    team: "Security",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    desc: "Own NexoraGrid's security posture. Lead penetration testing, vulnerability management, and compliance programs (FedRAMP, SOC 2, ISO 27001).",
  },
  {
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    desc: "Own the success of 20-30 enterprise accounts. Drive adoption, expansion, and renewal. Technical background preferred.",
  },
];

const benefits = [
  { icon: Heart, title: "Health & Wellness", desc: "100% covered medical, dental, and vision for you and your family. $2,000 annual wellness stipend." },
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere. We have hubs in SF, NYC, and London, but most of our team is fully remote." },
  { icon: Zap, title: "Equity", desc: "Meaningful equity in a high-growth company. We believe everyone who builds NexoraGrid should own a piece of it." },
  { icon: Users, title: "Learning & Growth", desc: "$3,000 annual learning budget. Conference attendance, courses, books — whatever helps you grow." },
];

const teamColors: Record<string, string> = {
  Engineering: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Infrastructure: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Sales: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Product: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Security: "bg-red-500/10 text-red-400 border-red-500/20",
  "Customer Success": "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

function CareersContent() {
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
            <Briefcase className="w-3.5 h-3.5" /> Careers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Build the future of{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              business infrastructure
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-6 leading-relaxed ${t(T.textMuted, theme)}`}>
            We&apos;re a team of 80 people building the operating system for modern business. We&apos;re
            well-funded, growing fast, and looking for exceptional people to join us.
          </p>
          <div className={`flex items-center justify-center gap-6 text-sm ${t(T.textDim40, theme)}`}>
            <span>80 employees</span>
            <span>·</span>
            <span>Remote-first</span>
            <span>·</span>
            <span>Series A — $18M raised</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`py-16 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-4 ${t(T.sectionBadge.indigo, theme)}`}>
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Open Roles</h2>
            <span className={`text-sm ${t(T.textDim40, theme)}`}>{openRoles.length} positions</span>
          </div>
          <div className="space-y-4">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className={`border rounded-2xl p-6 transition-all group cursor-pointer ${t(T.featureCard, theme)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className={`font-semibold group-hover:text-indigo-400 transition-colors`}>
                        {role.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          teamColors[role.team] ?? t(T.tagBg, theme)
                        }`}
                      >
                        {role.team}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 leading-relaxed ${t(T.textMuted, theme)}`}>{role.desc}</p>
                    <div className={`flex flex-wrap items-center gap-4 text-xs ${t(T.textDim40, theme)}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {role.type}
                      </span>
                      <span>{role.level}</span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-1 ${isDark ? "text-white/20" : "text-slate-300"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No role CTA */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Don&apos;t see the right role?</h2>
          <p className={`mb-6 ${t(T.textMuted, theme)}`}>
            We&apos;re always looking for exceptional people. Send us your resume and tell us how you&apos;d
            contribute to NexoraGrid.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
          >
            Send Open Application <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export default function CareersPage() {
  return (
    <LandingWrapper>
      <CareersContent />
    </LandingWrapper>
  );
}

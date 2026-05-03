"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Users, Globe, Zap, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-founder",
    bio: "Former VP Engineering at Palantir. Built data infrastructure for 3 Fortune 500 companies. Stanford CS, MBA Wharton.",
    avatar: "AR",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    name: "Maya Patel",
    role: "CTO & Co-founder",
    bio: "Ex-Google Brain researcher. Published 12 papers on distributed AI systems. Led ML infrastructure at Stripe.",
    avatar: "MP",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    name: "James Okonkwo",
    role: "CPO",
    bio: "Former Head of Product at Datadog. Scaled product from $10M to $1B ARR. Passionate about developer experience.",
    avatar: "JO",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    name: "Sofia Lindqvist",
    role: "VP Engineering",
    bio: "Built real-time infrastructure at Spotify serving 500M users. Expert in distributed systems and event-driven architecture.",
    avatar: "SL",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "David Kim",
    role: "VP Sales",
    bio: "Closed $200M+ in enterprise deals at Salesforce and ServiceNow. Specializes in energy and government verticals.",
    avatar: "DK",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Aisha Mohammed",
    role: "Head of Security",
    bio: "Former NSA cybersecurity analyst. Led SOC 2 and FedRAMP certifications at three SaaS companies.",
    avatar: "AM",
    gradient: "from-violet-500 to-indigo-500",
  },
];

const values = [
  {
    icon: Zap,
    title: "Move with urgency",
    desc: "We ship fast, iterate faster, and never let perfect be the enemy of good. Speed is a feature.",
  },
  {
    icon: Users,
    title: "Customer obsession",
    desc: "Every decision starts with the customer. We measure success by the outcomes we create for the people who use our platform.",
  },
  {
    icon: Globe,
    title: "Think at scale",
    desc: "We build for the world, not just the next quarter. Every architectural decision considers what happens at 1000x.",
  },
  {
    icon: Heart,
    title: "Radical transparency",
    desc: "We share our roadmap, our mistakes, and our thinking openly. Trust is built through honesty, not polish.",
  },
];

const milestones = [
  { year: "2023", event: "NexoraGrid founded in San Francisco by Alex Rivera and Maya Patel" },
  { year: "2023", event: "Raised $4.2M seed round led by Sequoia Capital" },
  { year: "2024", event: "Launched v1.0 with first 50 enterprise customers" },
  { year: "2024", event: "Raised $18M Series A. Expanded to EU and APAC markets" },
  { year: "2025", event: "Achieved SOC 2 Type II certification. Launched IoT monitoring suite" },
  { year: "2026", event: "Launched NexoraGrid 2.0. 500+ enterprise customers. $2.4B assets monitored" },
];

function AboutContent() {
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
            <Users className="w-3.5 h-3.5" /> About NexoraGrid
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            We&apos;re building the{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              operating system for business
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${t(T.textMuted, theme)}`}>
            NexoraGrid was founded on a simple belief: businesses shouldn&apos;t need 20 different tools
            to run their operations. We&apos;re building the unified intelligence layer that makes
            enterprises faster, smarter, and more resilient.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={`py-16 border-y ${t(T.trustedBg, theme)}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className={`text-lg leading-relaxed ${t(T.textMuted, theme)}`}>
            To give every business — from a 5-person startup to a national energy grid — the same
            AI-powered operational intelligence that was previously only available to the world&apos;s
            largest technology companies.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What we believe</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className={`border rounded-2xl p-7 flex gap-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${t(T.sectionBadge.indigo, theme)}`}>
                  <v.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">The team</h2>
            <p className={t(T.textMuted, theme)}>
              Built by engineers and operators from Google, Palantir, Stripe, Datadog, and Spotify.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className={`border rounded-2xl p-6 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-sm font-bold text-white`}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className={`text-xs ${t(T.textDim40, theme)}`}>{member.role}</div>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our journey</h2>
          </div>
          <div className="relative">
            <div className={`absolute left-[7px] top-0 bottom-0 w-px ${t(T.border, theme)}`} />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 pl-8 relative">
                  <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 ${isDark ? "border-[#07071a]" : "border-white"}`} />
                  <div>
                    <div className="text-sm font-bold text-indigo-400 mb-1">{m.year}</div>
                    <div className={`text-sm ${t(T.textDim, theme)}`}>{m.event}</div>
                  </div>
                </div>
              ))}
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
          <h2 className="text-4xl font-bold mb-4">Join us</h2>
          <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>
            We&apos;re hiring across engineering, product, and sales. Come build the future of business infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/careers"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-500/30"
            >
              View Open Roles <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AboutPage() {
  return (
    <LandingWrapper>
      <AboutContent />
    </LandingWrapper>
  );
}

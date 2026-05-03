"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { BookOpen, Clock } from "lucide-react";

const featuredPost = {
  title: "How NexoraGrid's AI Agents Saved TeleGrid $2M in Downtime Costs",
  excerpt:
    "A deep dive into how TeleGrid deployed NexoraGrid's predictive maintenance AI across 2,400 solar panels and 180 EV stations — and the results after 12 months.",
  category: "Case Study",
  date: "May 3, 2026",
  readTime: "8 min read",
  author: "Maya Patel",
  authorRole: "CTO",
  avatar: "MP",
};

const posts = [
  {
    title: "Building Real-Time IoT Dashboards at Scale: Lessons from 2M+ Data Points Per Day",
    excerpt: "How we architected NexoraGrid's IoT monitoring layer to handle millions of sensor readings per day with sub-second latency.",
    category: "Engineering",
    date: "Apr 28, 2026",
    readTime: "12 min read",
    author: "Sofia Lindqvist",
    avatar: "SL",
  },
  {
    title: "The State of AI Automation in Enterprise: 2026 Report",
    excerpt: "We surveyed 500 enterprise customers about their AI automation journey. Here's what we found — and what it means for the next 12 months.",
    category: "Research",
    date: "Apr 20, 2026",
    readTime: "15 min read",
    author: "Alex Rivera",
    avatar: "AR",
  },
  {
    title: "Why We Chose NestJS + Next.js for NexoraGrid's Architecture",
    excerpt: "A technical deep dive into our technology choices, the tradeoffs we made, and what we'd do differently if we were starting today.",
    category: "Engineering",
    date: "Apr 15, 2026",
    readTime: "10 min read",
    author: "Maya Patel",
    avatar: "MP",
  },
  {
    title: "From 10 SaaS Tools to One: A Startup's Guide to Consolidating Your Stack",
    excerpt: "How EnergyCore replaced Intercom, Mixpanel, Zapier, and 7 other tools with NexoraGrid — and cut their SaaS spend by 73%.",
    category: "Product",
    date: "Apr 8, 2026",
    readTime: "7 min read",
    author: "James Okonkwo",
    avatar: "JO",
  },
  {
    title: "SOC 2 Type II: What It Means and Why It Matters for Enterprise SaaS",
    excerpt: "We just achieved SOC 2 Type II certification. Here's what the process looked like, what we learned, and why it matters for our customers.",
    category: "Security",
    date: "Mar 30, 2026",
    readTime: "9 min read",
    author: "Aisha Mohammed",
    avatar: "AM",
  },
  {
    title: "Designing for Energy: UX Lessons from Building for Industrial Operators",
    excerpt: "Energy operators have unique UX needs. Here's how we redesigned NexoraGrid's energy dashboard based on 6 months of field research.",
    category: "Design",
    date: "Mar 22, 2026",
    readTime: "6 min read",
    author: "James Okonkwo",
    avatar: "JO",
  },
];

const categories = ["All", "Engineering", "Product", "Case Study", "Research", "Security", "Design"];

const categoryColors: Record<string, string> = {
  "Case Study": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Engineering: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Research: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Product: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Security: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

function BlogContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <BookOpen className="w-3.5 h-3.5" /> Blog
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Insights from the{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              NexoraGrid team
            </span>
          </h1>
          <p className={`text-xl ${t(T.textMuted, theme)}`}>
            Engineering deep dives, product updates, customer stories, and industry research.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  cat === "All"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : `${t(T.cardBg, theme)} ${t(T.textMuted, theme)} ${t(T.border, theme)} hover:${t(T.borderMd, theme)}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured post */}
          <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/5 border border-indigo-500/20 rounded-2xl p-8 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  categoryColors[featuredPost.category]
                }`}
              >
                {featuredPost.category}
              </span>
              <span className={`text-xs ${t(T.textFaint, theme)}`}>Featured</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-snug">{featuredPost.title}</h2>
            <p className={`mb-6 leading-relaxed ${t(T.textMuted, theme)}`}>{featuredPost.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                  {featuredPost.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{featuredPost.author}</div>
                  <div className={`text-xs ${t(T.textDim40, theme)}`}>{featuredPost.authorRole}</div>
                </div>
              </div>
              <div className={`flex items-center gap-4 text-xs ${t(T.textDim40, theme)}`}>
                <span>{featuredPost.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featuredPost.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Post grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.title}
                className={`border rounded-2xl p-6 transition-all group cursor-pointer ${t(T.featureCard, theme)}`}
              >
                <div className="mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      categoryColors[post.category] ?? t(T.tagBg, theme)
                    }`}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className={`font-semibold mb-2 leading-snug group-hover:text-indigo-400 transition-colors`}>
                  {post.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-5 ${t(T.textMuted, theme)}`}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                      {post.avatar}
                    </div>
                    <span className={`text-xs ${t(T.textMuted, theme)}`}>{post.author}</span>
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${t(T.textFaint, theme)}`}>
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={`py-16 border-t ${t(T.border, theme)}`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Stay in the loop</h2>
          <p className={`mb-6 ${t(T.textMuted, theme)}`}>
            Get our best articles delivered to your inbox every two weeks.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/30" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"}`}
            />
            <button className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold px-5 py-3 rounded-xl text-sm hover:from-indigo-500 hover:to-cyan-400 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BlogPage() {
  return (
    <LandingWrapper>
      <BlogContent />
    </LandingWrapper>
  );
}

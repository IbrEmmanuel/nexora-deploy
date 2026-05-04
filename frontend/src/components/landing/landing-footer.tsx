"use client";

import Link from "next/link";
import { useState } from "react";
import { Twitter, Linkedin, Github, Youtube, Send } from "lucide-react";
import { useLandingTheme, t, T } from "./landing-theme";
import { cn } from "@/lib/utils";

const footerCols = [
  {
    title: "Product",
    links: [
      { label: "Features",  href: "/features" },
      { label: "Pricing",   href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap",   href: "/roadmap" },
      { label: "Status",    href: "/status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Energy Companies", href: "/solutions/energy" },
      { label: "Enterprises",      href: "/solutions/enterprise" },
      { label: "Startups",         href: "/solutions/startups" },
      { label: "Governments",      href: "/solutions/government" },
      { label: "Developers",       href: "/solutions/developers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",   href: "/about" },
      { label: "Blog",    href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press",   href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy",    href: "/legal/cookies" },
      { label: "Security",         href: "/legal/security" },
      { label: "GDPR",             href: "/legal/gdpr" },
    ],
  },
];

const socialLinks = [
  { label: "Twitter / X",  href: "https://twitter.com/nexoragrid",           icon: Twitter },
  { label: "LinkedIn",     href: "https://linkedin.com/company/nexoragrid",  icon: Linkedin },
  { label: "GitHub",       href: "https://github.com/nexoragrid",            icon: Github },
  { label: "YouTube",      href: "https://youtube.com/@nexoragrid",          icon: Youtube },
];

export function LandingFooter() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className={`border-t ${t(T.footerBorderTop, theme)} ${t(T.footerBg, theme)}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Newsletter */}
        <div className={cn(
          "rounded-2xl p-8 mb-12 border",
          isDark
            ? "bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500/20"
            : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
        )}>
          <div className="max-w-xl">
            <h3 className={cn("text-lg font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
              Stay in the loop
            </h3>
            <p className={cn("text-sm mb-4", isDark ? "text-white/50" : "text-slate-500")}>
              Get product updates, AI insights, and enterprise news delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="text-sm text-emerald-500 font-medium">✓ You're subscribed! Thanks for joining.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className={cn(
                  "flex-1 flex items-center rounded-xl border px-3 transition-all",
                  isDark
                    ? "bg-white/[0.04] border-white/[0.08] focus-within:border-indigo-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    : "bg-white border-slate-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]",
                )}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={cn(
                      "flex-1 bg-transparent py-2.5 text-sm outline-none",
                      isDark ? "text-white/80 placeholder:text-white/25" : "text-slate-800 placeholder:text-slate-400",
                    )}
                    aria-label="Email address for newsletter"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2"  y="2"  width="6" height="6" rx="1" fill="white" opacity="0.9" />
                  <rect x="12" y="2"  width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="2"  y="12" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9" />
                </svg>
              </div>
              <span className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>NexoraGrid</span>
            </Link>
            <p className={cn("text-sm leading-relaxed mb-5", t(T.footerText, theme))}>
              The AI-powered operating system for modern business infrastructure.
            </p>
            {/* Social links */}
            <div className="flex gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={cn(
                    "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                    t(T.footerSocial, theme),
                  )}
                >
                  <s.icon className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <div className={cn("text-sm font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={cn("text-sm transition-colors", t(T.footerLink, theme))}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={cn("border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4", t(T.footerBorderTop, theme))}>
          <p className={cn("text-sm", t(T.footerBottom, theme))}>
            © 2026 NexoraGrid, Inc. All rights reserved.
          </p>
          {/* Animated status dot */}
          <div className={cn("flex items-center gap-2 text-xs", t(T.footerBottom, theme))}>
            <div className="relative flex items-center justify-center w-3 h-3" aria-hidden="true">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-500/30 animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

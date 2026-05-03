"use client";

import Link from "next/link";
import { useLandingTheme, t, T } from "./landing-theme";

const footerCols = [
  {
    title: "Product",
    links: [
      { label: "Features",   href: "/features" },
      { label: "Pricing",    href: "/pricing" },
      { label: "Changelog",  href: "/changelog" },
      { label: "Roadmap",    href: "/roadmap" },
      { label: "Status",     href: "/status" },
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
      { label: "About",    href: "/about" },
      { label: "Blog",     href: "/blog" },
      { label: "Careers",  href: "/careers" },
      { label: "Press",    href: "/press" },
      { label: "Contact",  href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",    href: "/legal/privacy" },
      { label: "Terms of Service",  href: "/legal/terms" },
      { label: "Cookie Policy",     href: "/legal/cookies" },
      { label: "Security",          href: "/legal/security" },
      { label: "GDPR",              href: "/legal/gdpr" },
    ],
  },
];

const socialLinks = [
  { label: "X",  href: "https://twitter.com/nexoragrid" },
  { label: "Li", href: "https://linkedin.com/company/nexoragrid" },
  { label: "Gh", href: "https://github.com/nexoragrid" },
  { label: "Yt", href: "https://youtube.com/@nexoragrid" },
];

export function LandingFooter() {
  const { theme } = useLandingTheme();

  return (
    <footer className={`border-t ${t(T.footerBorderTop, theme)} ${t(T.footerBg, theme)}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2"  y="2"  width="6" height="6" rx="1" fill="white" opacity="0.9" />
                  <rect x="12" y="2"  width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="2"  y="12" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9" />
                </svg>
              </div>
              <span className="font-bold text-white">NexoraGrid</span>
            </Link>
            <p className={`text-sm leading-relaxed mb-4 ${t(T.footerText, theme)}`}>
              The AI-powered operating system for modern business infrastructure.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs cursor-pointer transition-all ${t(T.footerSocial, theme)}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold mb-4 text-white">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={`text-sm transition-colors ${t(T.footerLink, theme)}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t ${t(T.footerBorderTop, theme)} pt-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm ${t(T.footerBottom, theme)}`}>
            © 2026 NexoraGrid, Inc. All rights reserved.
          </p>
          <div className={`flex items-center gap-2 text-xs ${t(T.footerBottom, theme)}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

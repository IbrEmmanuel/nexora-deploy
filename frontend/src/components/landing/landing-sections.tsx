"use client";

// Shared themed primitives used across all landing sub-pages.
// Import from here instead of duplicating per-page.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLandingTheme, t, T } from "./landing-theme";

// ── Section badge ─────────────────────────────────────────────────────────────
type BadgeColor = "indigo" | "cyan" | "purple" | "emerald" | "amber";

export function SectionBadge({ icon: Icon, label, color = "indigo" }: {
  icon: React.ElementType;
  label: string;
  color?: BadgeColor;
}) {
  const { theme } = useLandingTheme();
  return (
    <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge[color], theme)}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

// ── Page hero ─────────────────────────────────────────────────────────────────
export function PageHero({ badge, badgeColor = "indigo", title, titleGradient, subtitle, cta, ctaHref = "/register", secondaryCta, secondaryCtaHref = "/contact", glowColor = "indigo" }: {
  badge: string;
  badgeColor?: BadgeColor;
  title: string;
  titleGradient: string;
  subtitle: string;
  cta: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  glowColor?: string;
}) {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  const gradientMap: Record<string, string> = {
    indigo: "bg-indigo-600/10",
    cyan:   "bg-cyan-600/10",
    emerald:"bg-emerald-600/10",
    purple: "bg-purple-600/10",
    amber:  "bg-amber-600/10",
  };
  const ctaGradientMap: Record<string, string> = {
    indigo: "from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-500/30",
    cyan:   "from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 shadow-cyan-500/30",
    emerald:"from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/30",
    purple: "from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 shadow-purple-500/30",
    amber:  "from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-500/30",
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
      {/* Glow */}
      {isDark && (
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] ${gradientMap[glowColor] ?? gradientMap.indigo} rounded-full blur-[100px] pointer-events-none`} />
      )}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 pointer-events-none" />
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <SectionBadge icon={ArrowRight} label={badge} color={badgeColor} />
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          {title}{" "}
          <span className={`bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
            {titleGradient && ""}
          </span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${t(T.textMuted, theme)}`}>
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className={`flex items-center gap-2 bg-gradient-to-r ${ctaGradientMap[glowColor] ?? ctaGradientMap.indigo} text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl`}
          >
            {cta} <ArrowRight className="w-4 h-4" />
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCtaHref}
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              {secondaryCta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
export function StatsBar({ stats, gradientFrom = "indigo-400", gradientTo = "cyan-400" }: {
  stats: Array<{ value: string; label: string }>;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const { theme } = useLandingTheme();
  return (
    <section className={`py-12 border-y ${t(T.trustedBg, theme)}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border ${t(T.statsGrid, theme)}`}>
          {stats.map((s) => (
            <div key={s.label} className={`${t(T.statsBg, theme)} px-6 py-6 text-center`}>
              <div className={`text-3xl font-bold bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent`}>
                {s.value}
              </div>
              <div className={`text-sm mt-1 ${t(T.textDim40, theme)}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
export function FeatureCard({ icon: Icon, title, desc, bullets, color, badge }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  bullets?: string[];
  color: string;
  badge?: string;
}) {
  const { theme } = useLandingTheme();
  return (
    <div className={`group border rounded-2xl p-7 transition-all duration-300 ${t(T.featureCard, theme)}`}>
      <div className="flex items-start justify-between mb-5">
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {badge && (
          <span className={`text-xs px-2.5 py-1 rounded-full border ${t(T.tagBg, theme)}`}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)} ${bullets ? "mb-5" : ""}`}>{desc}</p>
      {bullets && (
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className={`flex items-center gap-2 text-sm ${t(T.textDim, theme)}`}>
              <span className="w-3.5 h-3.5 text-indigo-500 shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── CTA section ───────────────────────────────────────────────────────────────
export function CtaSection({ title, subtitle, cta, ctaHref = "/register", secondaryCta, secondaryCtaHref = "/contact", gradient = "from-indigo-600 to-cyan-500" }: {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  gradient?: string;
}) {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";
  return (
    <section className="py-24 relative overflow-hidden">
      {isDark
        ? <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-cyan-900/10" />
        : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
      }
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">{title}</h2>
        <p className={`text-lg mb-8 ${t(T.textMuted, theme)}`}>{subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className={`flex items-center gap-2 bg-gradient-to-r ${gradient} hover:opacity-90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xl`}
          >
            {cta} <ArrowRight className="w-4 h-4" />
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCtaHref}
              className={`flex items-center gap-2 border font-semibold px-8 py-3.5 rounded-xl transition-all ${isDark ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"}`}
            >
              {secondaryCta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Divider section ───────────────────────────────────────────────────────────
export function SectionDivider() {
  const { theme } = useLandingTheme();
  return <div className={`border-t ${t(T.border, theme)}`} />;
}

// ── Card container ────────────────────────────────────────────────────────────
export function ThemedCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { theme } = useLandingTheme();
  return (
    <div className={`border rounded-2xl ${t(T.cardBg, theme)} ${t(T.border, theme)} ${className}`}>
      {children}
    </div>
  );
}

// ── Muted text ────────────────────────────────────────────────────────────────
export function Muted({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { theme } = useLandingTheme();
  return <p className={`${t(T.textMuted, theme)} ${className}`}>{children}</p>;
}

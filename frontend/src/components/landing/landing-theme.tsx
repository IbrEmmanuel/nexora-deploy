"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type LandingTheme = "dark" | "light";

interface ThemeCtx {
  theme: LandingTheme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export function LandingThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<LandingTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("landing-theme") as LandingTheme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("landing-theme", next);
      return next;
    });
  };

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useLandingTheme() {
  return useContext(Ctx);
}

// ── Token maps ────────────────────────────────────────────────────────────────
// Every component reads from these instead of hardcoding dark-only classes.

export const T = {
  // Page backgrounds
  pageBg:    { dark: "bg-[#07071a]",          light: "bg-white" },
  sectionBg: { dark: "bg-[#0d0d2b]/80",       light: "bg-slate-50" },
  cardBg:    { dark: "bg-white/[0.03]",        light: "bg-white" },
  cardBgHov: { dark: "hover:bg-white/[0.06]",  light: "hover:bg-slate-50" },
  footerBg:  { dark: "bg-[#05050f]",           light: "bg-slate-900" },

  // Borders
  border:    { dark: "border-white/5",         light: "border-slate-200" },
  borderHov: { dark: "hover:border-white/10",  light: "hover:border-slate-300" },
  borderMd:  { dark: "border-white/10",        light: "border-slate-200" },

  // Text
  text:      { dark: "text-white",             light: "text-slate-900" },
  textMuted: { dark: "text-white/50",          light: "text-slate-500" },
  textFaint: { dark: "text-white/30",          light: "text-slate-400" },
  textDim:   { dark: "text-white/70",          light: "text-slate-600" },
  textDim40: { dark: "text-white/40",          light: "text-slate-400" },

  // Nav
  navBg:     { dark: "bg-[#07071a]/90",        light: "bg-white/95" },
  navLink:   { dark: "text-white/70 hover:text-white hover:bg-white/5", light: "text-slate-600 hover:text-slate-900 hover:bg-slate-100" },
  navSignIn: { dark: "text-white/70 hover:text-white", light: "text-slate-600 hover:text-slate-900" },
  navBorder: { dark: "border-white/5",         light: "border-slate-200" },
  mobileBg:  { dark: "bg-[#0d0d2b]/95",        light: "bg-white/98" },

  // Dividers
  divider:   { dark: "divide-white/5",         light: "divide-slate-100" },

  // Misc
  statsBg:   { dark: "bg-[#0d0d2b]/80",        light: "bg-slate-50" },
  statsGrid: { dark: "bg-white/5",             light: "bg-slate-200" },
  glowNode:  { dark: "opacity-100",            light: "opacity-0" },
  gridLines: { dark: "opacity-100",            light: "opacity-30" },
  demoPanel: { dark: "bg-[#0d0d2b]/80",        light: "bg-slate-50" },
  demoBorder:{ dark: "border-white/10",        light: "border-slate-200" },
  demoSide:  { dark: "bg-white/[0.01]",        light: "bg-slate-100" },
  demoSideBorder: { dark: "border-white/5",    light: "border-slate-200" },
  demoCard:  { dark: "bg-white/[0.03] border-white/5", light: "bg-white border-slate-200" },
  agentFeed: { dark: "bg-[#0d0d2b]/80 border-white/10", light: "bg-white border-slate-200" },
  agentFeedBorder: { dark: "border-white/5",   light: "border-slate-100" },
  agentFeedBg: { dark: "bg-white/[0.01]",      light: "bg-slate-50" },
  progressBg:{ dark: "bg-white/5",             light: "bg-slate-100" },
  platformCard: { dark: "bg-white/[0.03] border-white/10", light: "bg-white border-slate-200" },
  tagBg:     { dark: "bg-white/5 border-white/10 text-white/60", light: "bg-slate-100 border-slate-200 text-slate-500" },
  toggleBg:  { dark: "bg-white/5 border-white/10", light: "bg-slate-100 border-slate-200" },
  toggleActive: { dark: "bg-white/10 text-white", light: "bg-white text-slate-900 shadow-sm" },
  toggleInactive: { dark: "text-white/50",     light: "text-slate-500" },
  planCard:  { dark: "bg-white/[0.03] border-white/5", light: "bg-white border-slate-200" },
  planPeriod:{ dark: "text-white/40",          light: "text-slate-400" },
  planDesc:  { dark: "text-white/50",          light: "text-slate-500" },
  planCta:   { dark: "bg-white/5 hover:bg-white/10 border-white/10 text-white", light: "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900" },
  testimonialCard: { dark: "bg-white/[0.03] border-white/5", light: "bg-white border-slate-200 shadow-sm" },
  testimonialQuote: { dark: "text-white/70",   light: "text-slate-600" },
  ctaSecondary: { dark: "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white", light: "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900" },
  ctaNote:   { dark: "text-white/30",          light: "text-slate-400" },
  logoText:  { dark: "text-white",             light: "text-slate-900" },
  footerText:{ dark: "text-white/40",          light: "text-slate-400" },
  footerLink:{ dark: "text-white/40 hover:text-white", light: "text-slate-400 hover:text-slate-900" },
  footerSocial: { dark: "bg-white/5 hover:bg-white/10 border-white/5 text-white/40 hover:text-white", light: "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900" },
  footerBottom: { dark: "text-white/30",       light: "text-slate-400" },
  footerBorderTop: { dark: "border-white/5",   light: "border-slate-200" },
  sectionBadge: {
    indigo: { dark: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300", light: "bg-indigo-50 border-indigo-200 text-indigo-600" },
    cyan:   { dark: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",       light: "bg-cyan-50 border-cyan-200 text-cyan-600" },
    purple: { dark: "bg-purple-500/10 border-purple-500/20 text-purple-300", light: "bg-purple-50 border-purple-200 text-purple-600" },
    emerald:{ dark: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300", light: "bg-emerald-50 border-emerald-200 text-emerald-600" },
    amber:  { dark: "bg-amber-500/10 border-amber-500/20 text-amber-300",    light: "bg-amber-50 border-amber-200 text-amber-600" },
  },
  featureCard: { dark: "bg-white/[0.03] hover:bg-white/[0.06] border-white/5 hover:border-white/10", light: "bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md" },
  featureLearnMore: { dark: "text-indigo-400", light: "text-indigo-600" },
  trustedBg: { dark: "bg-white/[0.01] border-white/5", light: "bg-slate-50 border-slate-200" },
  trustedLogo: { dark: "text-white/20 hover:text-white/50", light: "text-slate-300 hover:text-slate-600" },
  trustedLabel: { dark: "text-white/30",       light: "text-slate-400" },
  pillarsIcon: { dark: "bg-white/5 border-white/10 hover:border-indigo-500/40", light: "bg-indigo-50 border-indigo-100 hover:border-indigo-300" },
  pillarsIconColor: { dark: "text-indigo-400", light: "text-indigo-600" },
  pillarsDesc: { dark: "text-white/50",        light: "text-slate-500" },
  useCaseCard: { dark: "bg-white/[0.03] hover:bg-white/[0.05] border-white/5 hover:border-white/10", light: "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm" },
  useCaseDesc: { dark: "text-white/50",        light: "text-slate-500" },
  aiDesc:    { dark: "text-white/50",          light: "text-slate-500" },
  aiCheck:   { dark: "text-white/70",          light: "text-slate-600" },
  aiTime:    { dark: "text-white/30",          light: "text-slate-400" },
  aiAction:  { dark: "text-white/50",          light: "text-slate-500" },
  aiFooter:  { dark: "text-white/30",          light: "text-slate-400" },
  aiLive:    { dark: "text-white/30",          light: "text-slate-400" },
  pricingDesc: { dark: "text-white/50",        light: "text-slate-500" },
  pricingFeature: { dark: "text-white/70",     light: "text-slate-600" },
  themeToggle: { dark: "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700", light: "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm" },
} as const;

export function t(token: { dark: string; light: string }, theme: LandingTheme): string {
  return token[theme];
}

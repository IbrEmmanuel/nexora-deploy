"use client";

import { LandingThemeProvider, useLandingTheme, t, T } from "./landing-theme";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

// ── Inner wrapper that reads theme ────────────────────────────────────────────
function Inner({ children }: { children: React.ReactNode }) {
  const { theme } = useLandingTheme();
  return (
    <div className={`min-h-screen ${t(T.pageBg, theme)} ${t(T.text, theme)} overflow-x-hidden transition-colors duration-300`}>
      <LandingNav />
      {children}
      <LandingFooter />
    </div>
  );
}

// ── Public export — wrap every landing sub-page with this ─────────────────────
export function LandingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LandingThemeProvider>
      <Inner>{children}</Inner>
    </LandingThemeProvider>
  );
}

// ── Re-export theme hook so sub-pages can read the theme ──────────────────────
export { useLandingTheme, t, T } from "./landing-theme";

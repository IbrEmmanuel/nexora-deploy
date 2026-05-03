"use client";

import Link from "next/link";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLandingTheme, t, T } from "./landing-theme";

const navLinks = [
  { label: "Product",    href: "/features" },
  { label: "Solutions",  href: "/solutions/energy" },
  { label: "Pricing",    href: "/pricing" },
  { label: "Developers", href: "/solutions/developers" },
  { label: "Company",    href: "/about" },
];

export function LandingNav() {
  const { theme, toggle } = useLandingTheme();
  const [open, setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? `${t(T.navBg, theme)} backdrop-blur-xl border-b ${t(T.navBorder, theme)} shadow-lg`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg rotate-3 group-hover:rotate-6 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2"  y="2"  width="6" height="6" rx="1" fill="white" opacity="0.9" />
                  <rect x="12" y="2"  width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="2"  y="12" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9" />
                </svg>
              </div>
            </div>
            <span className={`text-lg font-bold tracking-tight ${t(T.logoText, theme)}`}>
              NexoraGrid
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${t(T.navLink, theme)}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${t(T.themeToggle, theme)}`}
            >
              {isDark
                ? <Sun  className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/login"
              className={`text-sm transition-colors px-3 py-2 ${t(T.navSignIn, theme)}`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Request Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${t(T.themeToggle, theme)}`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/5 text-white" : "hover:bg-slate-100 text-slate-700"}`}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden backdrop-blur-xl border-t ${t(T.navBorder, theme)} px-4 py-4 space-y-1 ${t(T.mobileBg, theme)}`}>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm rounded-lg transition-all ${t(T.navLink, theme)}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className={`text-center py-2.5 text-sm border rounded-lg transition-colors ${
                isDark
                  ? "text-white/70 border-white/10 hover:bg-white/5"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-center py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg"
            >
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

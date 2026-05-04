"use client";

import Link from "next/link";
import { ArrowRight, Menu, X, Sun, Moon, ChevronDown, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLandingTheme, t, T } from "./landing-theme";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";

const productLinks = [
  { label: "AI Agents",        href: "/features#agents",    desc: "Autonomous AI automation" },
  { label: "Energy & IoT",     href: "/features#energy",    desc: "Real-time infrastructure monitoring" },
  { label: "Analytics",        href: "/features#analytics", desc: "Bloomberg-grade insights" },
  { label: "Integrations",     href: "/features#integrations", desc: "Connect 50+ tools" },
  { label: "Command Center",   href: "/features#dashboard", desc: "Unified enterprise dashboard" },
  { label: "Security",         href: "/features#security",  desc: "SOC 2 compliant" },
];

const solutionLinks = [
  { label: "Energy Companies", href: "/solutions/energy",     desc: "Solar, wind, EV monitoring" },
  { label: "Enterprises",      href: "/solutions/enterprise", desc: "Multi-tenant command center" },
  { label: "Startups",         href: "/solutions/startups",   desc: "Replace 10 SaaS tools" },
  { label: "Governments",      href: "/solutions/government", desc: "Smart city infrastructure" },
  { label: "Developers",       href: "/solutions/developers", desc: "APIs & webhooks" },
];

const navLinks = [
  { label: "Pricing",    href: "/pricing",   hasMenu: false },
  { label: "Developers", href: "/solutions/developers", hasMenu: false },
  { label: "Company",    href: "/about",     hasMenu: false },
];

export function LandingNav() {
  const { theme, toggle } = useLandingTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Dispatch to any open command palette
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? isDark
            ? "bg-black/60 backdrop-blur-xl border-b border-white/[0.08] shadow-lg"
            : "bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg rotate-3 group-hover:rotate-6 transition-transform" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2"  y="2"  width="6" height="6" rx="1" fill="white" opacity="0.9" />
                  <rect x="12" y="2"  width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="2"  y="12" width="6" height="6" rx="1" fill="white" opacity="0.6" />
                  <rect x="12" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9" />
                </svg>
              </div>
            </div>
            <span className={cn("text-lg font-bold tracking-tight", t(T.logoText, theme))}>
              NexoraGrid
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {/* Product mega-menu */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className={cn("flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all", t(T.navLink, theme))}>
                  Product <ChevronDown className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  className={cn(
                    "z-50 w-[480px] rounded-2xl border p-4 shadow-2xl animate-slide-in-top",
                    isDark
                      ? "bg-zinc-950/95 backdrop-blur-xl border-white/[0.08]"
                      : "bg-white border-slate-200",
                  )}
                >
                  <div className="grid grid-cols-2 gap-1">
                    {productLinks.map((l) => (
                      <Link
                        key={l.label}
                        href={l.href}
                        className={cn(
                          "flex flex-col gap-0.5 px-3 py-2.5 rounded-xl transition-all",
                          isDark ? "hover:bg-white/[0.06]" : "hover:bg-slate-50",
                        )}
                      >
                        <span className={cn("text-sm font-medium", isDark ? "text-white/80" : "text-slate-800")}>{l.label}</span>
                        <span className={cn("text-xs", isDark ? "text-white/35" : "text-slate-500")}>{l.desc}</span>
                      </Link>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Solutions mega-menu */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className={cn("flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-all", t(T.navLink, theme))}>
                  Solutions <ChevronDown className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  className={cn(
                    "z-50 w-72 rounded-2xl border p-2 shadow-2xl animate-slide-in-top",
                    isDark
                      ? "bg-zinc-950/95 backdrop-blur-xl border-white/[0.08]"
                      : "bg-white border-slate-200",
                  )}
                >
                  {solutionLinks.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className={cn(
                        "flex flex-col gap-0.5 px-3 py-2.5 rounded-xl transition-all",
                        isDark ? "hover:bg-white/[0.06]" : "hover:bg-slate-50",
                      )}
                    >
                      <span className={cn("text-sm font-medium", isDark ? "text-white/80" : "text-slate-800")}>{l.label}</span>
                      <span className={cn("text-xs", isDark ? "text-white/35" : "text-slate-500")}>{l.desc}</span>
                    </Link>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {navLinks.map((l) => (
              <Link key={l.label} href={l.href} className={cn("px-4 py-2 text-sm rounded-lg transition-all", t(T.navLink, theme))}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* ⌘K trigger */}
            <button
              aria-label="Open command palette (⌘K)"
              className={cn(
                "flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs transition-all",
                isDark
                  ? "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
                  : "border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100",
              )}
            >
              <Command className="w-3 h-3" aria-hidden="true" />
              <kbd className="font-mono">⌘K</kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={cn("w-9 h-9 rounded-lg border flex items-center justify-center transition-all", t(T.themeToggle, theme))}
            >
              {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
            </button>

            <Link href="/login" className={cn("text-sm transition-colors px-3 py-2", t(T.navSignIn, theme))}>
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Request Demo <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all", t(T.themeToggle, theme))}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" aria-hidden="true" /> : <Moon className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn("p-2 rounded-lg transition-colors", isDark ? "hover:bg-white/5 text-white" : "hover:bg-slate-100 text-slate-700")}
            >
              {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "md:hidden backdrop-blur-xl border-t px-4 py-4 overflow-hidden",
              t(T.navBorder, theme),
              t(T.mobileBg, theme),
            )}
          >
            {/* Product links */}
            <div className="mb-3">
              <p className={cn("text-[10px] uppercase tracking-widest font-semibold mb-2 px-2", isDark ? "text-white/25" : "text-slate-400")}>
                Product
              </p>
              {productLinks.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn("block px-3 py-2 text-sm rounded-lg transition-all", t(T.navLink, theme))}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Other links */}
            {navLinks.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (productLinks.length + i) * 0.04 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn("block px-3 py-2.5 text-sm rounded-lg transition-all", t(T.navLink, theme))}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/login"
                className={cn(
                  "text-center py-2.5 text-sm border rounded-lg transition-colors",
                  isDark
                    ? "text-white/70 border-white/10 hover:bg-white/5"
                    : "text-slate-600 border-slate-200 hover:bg-slate-50",
                )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

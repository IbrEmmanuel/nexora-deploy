"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Cookie } from "lucide-react";
import Link from "next/link";

const cookieTypes = [
  {
    name: "Strictly Necessary",
    required: true,
    desc: "Essential for the website to function. Cannot be disabled. Set in response to actions like logging in or filling out forms.",
    examples: ["Session authentication token", "CSRF protection token", "Load balancer affinity"],
  },
  {
    name: "Performance & Analytics",
    required: false,
    desc: "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    examples: ["Page view tracking", "Feature usage analytics", "Error reporting"],
  },
  {
    name: "Functional",
    required: false,
    desc: "Enable enhanced functionality and personalization, such as remembering your preferences and settings.",
    examples: ["Language preference", "Dashboard layout", "Theme preference"],
  },
  {
    name: "Marketing",
    required: false,
    desc: "Used to track visitors across websites to display relevant advertisements. Used sparingly and only with your consent.",
    examples: ["Ad conversion tracking", "Retargeting pixels"],
  },
];

function CookiesContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Cookie className="w-3.5 h-3.5" /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className={`text-sm ${t(T.textDim40, theme)}`}>Last updated: May 3, 2026</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className={`border rounded-xl p-5 text-sm leading-relaxed ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.textMuted, theme)}`}>
            This Cookie Policy explains how NexoraGrid, Inc. uses cookies and similar tracking
            technologies when you visit our website or use our platform. By using our Services, you
            consent to our use of cookies as described in this policy.
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">What are cookies?</h2>
            <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
              Cookies are small text files stored on your device when you visit a website.
              They help websites remember your preferences, keep you logged in, and understand how
              you use the site. We also use similar technologies like local storage and session storage.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-5">Types of cookies we use</h2>
            <div className="space-y-4">
              {cookieTypes.map((type) => (
                <div key={type.name} className={`border rounded-xl p-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{type.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      type.required
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : isDark ? "bg-white/5 text-white/40 border-white/10" : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {type.required ? "Always active" : "Optional"}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-3 ${t(T.textMuted, theme)}`}>{type.desc}</p>
                  <div>
                    <p className={`text-xs mb-1.5 ${t(T.textDim40, theme)}`}>Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((ex) => (
                        <span key={ex} className={`text-xs px-2.5 py-1 rounded-lg border ${t(T.tagBg, theme)}`}>{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Managing cookies</h2>
            <p className={`text-sm leading-relaxed mb-3 ${t(T.textMuted, theme)}`}>You can control and manage cookies in several ways:</p>
            <ul className="space-y-2">
              {[
                { label: "Browser settings:", text: "Most browsers allow you to refuse or delete cookies through their settings. Note that disabling cookies may affect the functionality of our Services." },
                { label: "Cookie consent banner:", text: "When you first visit our website, you can choose which optional cookies to accept." },
                { label: "Opt-out tools:", text: "For analytics cookies, you can opt out using tools like the Google Analytics Opt-out Browser Add-on." },
              ].map((item) => (
                <li key={item.label} className={`flex items-start gap-2 text-sm ${t(T.textMuted, theme)}`}>
                  <span className="text-indigo-400 shrink-0">•</span>
                  <span><strong className={t(T.textDim, theme)}>{item.label}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Third-party cookies</h2>
            <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
              Some cookies on our site are set by third-party services including Stripe (payment processing),
              Intercom (customer support), and analytics providers. These third parties have their own
              privacy policies governing their use of cookies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Updates to this policy</h2>
            <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
              We may update this Cookie Policy from time to time. We will notify you of significant
              changes by posting a notice on our website or sending you an email.
            </p>
          </div>

          <div className={`border-t pt-6 flex flex-wrap gap-4 text-sm ${t(T.border, theme)}`}>
            {[
              { href: "/legal/privacy", label: "Privacy Policy" },
              { href: "/legal/terms",   label: "Terms of Service" },
              { href: "/legal/gdpr",    label: "GDPR" },
              { href: "/legal/security",label: "Security" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function CookiesPage() {
  return (
    <LandingWrapper>
      <CookiesContent />
    </LandingWrapper>
  );
}

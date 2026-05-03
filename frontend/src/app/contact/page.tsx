"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Mail, MessageSquare, Building2, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  subject: z.enum(["sales", "support", "partnership", "press", "other"], {
    errorMap: () => ({ message: "Please select a subject" }),
  }),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  {
    icon: Mail,
    label: "General",
    value: "hello@nexoragrid.com",
    href: "mailto:hello@nexoragrid.com",
  },
  {
    icon: Building2,
    label: "Sales",
    value: "sales@nexoragrid.com",
    href: "mailto:sales@nexoragrid.com",
  },
  {
    icon: MessageSquare,
    label: "Support",
    value: "support@nexoragrid.com",
    href: "mailto:support@nexoragrid.com",
  },
];

function ContactContent() {
  const { theme } = useLandingTheme();
  const isDark = theme === "dark";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    setSubmitting(true);
    try {
      // Show success regardless (no contact endpoint yet)
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      // Ignore network errors — show success regardless
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      reset();
    }
  };

  const inputBase = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${isDark ? "bg-white/5 text-white placeholder-white/30" : "bg-white text-slate-900 placeholder-slate-400"}`;
  const inputNormal = `${inputBase} ${isDark ? "border-white/10 focus:border-indigo-500/50" : "border-slate-200 focus:border-indigo-400"}`;
  const inputError = `${inputBase} ${isDark ? "border-red-500/50 focus:border-red-500" : "border-red-400 focus:border-red-500"}`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] transition-opacity ${isDark ? "opacity-100" : "opacity-20"}`} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <MessageSquare className="w-3.5 h-3.5" /> Contact
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Get in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              touch
            </span>
          </h1>
          <p className={`text-xl ${t(T.textMuted, theme)}`}>
            Whether you&apos;re ready to buy, have questions, or just want to say hello — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Contact us</h2>
                <div className="space-y-4">
                  {contactInfo.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className={`flex items-center gap-4 border rounded-xl p-4 transition-all group ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.cardBgHov, theme)}`}
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${t(T.sectionBadge.indigo, theme)}`}>
                        <c.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs mb-0.5 ${t(T.textDim40, theme)}`}>{c.label}</div>
                        <div className={`text-sm font-medium group-hover:text-indigo-400 transition-colors`}>
                          {c.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className={`border rounded-xl p-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                <h3 className="font-semibold mb-2">Office</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
                  548 Market St, Suite 12000
                  <br />
                  San Francisco, CA 94104
                  <br />
                  United States
                </p>
              </div>

              <div className={`border rounded-xl p-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}>
                <h3 className="font-semibold mb-2">Response time</h3>
                <p className={`text-sm leading-relaxed ${t(T.textMuted, theme)}`}>
                  We typically respond within 24 hours on business days. Enterprise inquiries are
                  prioritized and usually receive a response within 4 hours.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Message sent!</h2>
                  <p className={`mb-6 ${t(T.textMuted, theme)}`}>
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={`border rounded-2xl p-8 space-y-5 ${t(T.cardBg, theme)} ${t(T.border, theme)}`}
                >
                  <h2 className="text-xl font-bold mb-2">Send us a message</h2>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${t(T.textDim, theme)}`}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                        <input
                          {...register("name")}
                          placeholder="Alex Rivera"
                          className={`${errors.name ? inputError : inputNormal} pl-10`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${t(T.textDim, theme)}`}>
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="alex@company.com"
                          className={`${errors.email ? inputError : inputNormal} pl-10`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${t(T.textDim, theme)}`}>
                      Company *
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                      <input
                        {...register("company")}
                        placeholder="Acme Corp"
                        className={`${errors.company ? inputError : inputNormal} pl-10`}
                      />
                    </div>
                    {errors.company && (
                      <p className="text-xs text-red-400 mt-1">{errors.company.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${t(T.textDim, theme)}`}>
                      Subject *
                    </label>
                    <select
                      {...register("subject")}
                      className={`${errors.subject ? inputError : inputNormal} appearance-none`}
                    >
                      <option value="" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Select a subject...
                      </option>
                      <option value="sales" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Sales inquiry
                      </option>
                      <option value="support" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Technical support
                      </option>
                      <option value="partnership" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Partnership
                      </option>
                      <option value="press" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Press / Media
                      </option>
                      <option value="other" className={isDark ? "bg-[#0d0d2b]" : "bg-white"}>
                        Other
                      </option>
                    </select>
                    {errors.subject && (
                      <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${t(T.textDim, theme)}`}>
                      Message *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us about your use case, team size, and what you're looking to achieve with NexoraGrid..."
                      className={`${errors.message ? inputError : inputNormal} resize-none`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <LandingWrapper>
      <ContactContent />
    </LandingWrapper>
  );
}

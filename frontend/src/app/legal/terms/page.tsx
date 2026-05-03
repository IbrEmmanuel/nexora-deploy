"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { FileText } from "lucide-react";
import Link from "next/link";

function TermsContent() {
  const { theme } = useLandingTheme();

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <FileText className="w-3.5 h-3.5" /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className={`text-sm ${t(T.textDim40, theme)}`}>Last updated: May 3, 2026</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            <div className={`border rounded-xl p-5 text-sm leading-relaxed ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.textMuted, theme)}`}>
              Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using NexoraGrid&apos;s
              platform and services. By accessing or using our Services, you agree to be bound by these Terms.
            </div>

            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing or using NexoraGrid's Services, you agree to be bound by these Terms and our Privacy Policy. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.`,
              },
              {
                title: "2. Description of Services",
                content: `NexoraGrid provides an AI-powered business infrastructure platform including AI automation agents, IoT monitoring, analytics dashboards, and API integrations (the "Services"). We reserve the right to modify, suspend, or discontinue any part of the Services at any time with reasonable notice.`,
              },
              {
                title: "3. Account Registration",
                content: `To use the Services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.

You must be at least 18 years old to use the Services. By creating an account, you represent that you meet this requirement.`,
              },
              {
                title: "4. Subscription and Payment",
                content: `Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as explicitly stated in these Terms.

We may change our pricing with 30 days' notice. Continued use of the Services after a price change constitutes acceptance of the new pricing.

If your payment fails, we will attempt to collect payment for 7 days before suspending your account.`,
              },
              {
                title: "5. Acceptable Use",
                content: `You agree not to use the Services to:

• Violate any applicable laws or regulations
• Infringe the intellectual property rights of others
• Transmit malware, viruses, or other harmful code
• Attempt to gain unauthorized access to our systems
• Use the Services to send spam or unsolicited communications
• Reverse engineer or attempt to extract source code
• Use the Services in a way that could damage, disable, or impair our infrastructure`,
              },
              {
                title: "6. Data and Privacy",
                content: `You retain ownership of all data you submit to the Services ("Customer Data"). By using the Services, you grant NexoraGrid a limited license to process your Customer Data solely to provide the Services.

We will handle your Customer Data in accordance with our Privacy Policy and applicable data protection laws.`,
              },
              {
                title: "7. Intellectual Property",
                content: `NexoraGrid and its licensors own all intellectual property rights in the Services, including software, documentation, and trademarks. These Terms do not grant you any rights to use NexoraGrid's trademarks, logos, or brand features.`,
              },
              {
                title: "8. Service Level Agreement",
                content: `For Enterprise customers, we provide a 99.99% monthly uptime SLA. For Growth customers, we target 99.9% uptime. Starter plans do not include an SLA.

In the event of an SLA breach, Enterprise customers are eligible for service credits as described in their Enterprise Agreement.`,
              },
              {
                title: "9. Limitation of Liability",
                content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXORAGRID SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID TO NEXORAGRID IN THE 12 MONTHS PRECEDING THE CLAIM.`,
              },
              {
                title: "10. Termination",
                content: `Either party may terminate these Terms at any time. Upon termination, your right to use the Services will immediately cease. We will provide you with a 30-day window to export your data before deletion.

We may terminate your account immediately if you violate these Terms or engage in fraudulent or illegal activity.`,
              },
              {
                title: "11. Governing Law",
                content: `These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in San Francisco, California.`,
              },
              {
                title: "12. Contact",
                content: `For questions about these Terms, contact us at legal@nexoragrid.com.`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
                <div className={`text-sm leading-relaxed whitespace-pre-line ${t(T.textMuted, theme)}`}>
                  {section.content}
                </div>
              </div>
            ))}

            <div className={`border-t pt-6 flex flex-wrap gap-4 text-sm ${t(T.border, theme)}`}>
              <Link href="/legal/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
              <Link href="/legal/cookies" className="text-indigo-400 hover:text-indigo-300 transition-colors">Cookie Policy</Link>
              <Link href="/legal/gdpr" className="text-indigo-400 hover:text-indigo-300 transition-colors">GDPR</Link>
              <Link href="/legal/security" className="text-indigo-400 hover:text-indigo-300 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TermsPage() {
  return (
    <LandingWrapper>
      <TermsContent />
    </LandingWrapper>
  );
}

"use client";

import { LandingWrapper, useLandingTheme, t, T } from "@/components/landing/landing-wrapper";
import { Shield } from "lucide-react";
import Link from "next/link";

function PrivacyContent() {
  const { theme } = useLandingTheme();

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm mb-6 ${t(T.sectionBadge.indigo, theme)}`}>
            <Shield className="w-3.5 h-3.5" /> Legal
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className={`text-sm ${t(T.textDim40, theme)}`}>Last updated: May 3, 2026</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">

            <div className={`border rounded-xl p-5 text-sm leading-relaxed ${t(T.cardBg, theme)} ${t(T.border, theme)} ${t(T.textMuted, theme)}`}>
              This Privacy Policy describes how NexoraGrid, Inc. (&ldquo;NexoraGrid,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              collects, uses, and shares information about you when you use our services, including our
              website, platform, and APIs (collectively, the &ldquo;Services&rdquo;).
            </div>

            {[
              {
                title: "1. Information We Collect",
                content: `We collect information you provide directly to us, such as when you create an account, use our Services, or contact us for support.

Account Information: When you register, we collect your name, email address, password, and company name.

Usage Data: We automatically collect information about how you use our Services, including log data, device information, IP addresses, browser type, and pages visited.

Payment Information: If you subscribe to a paid plan, we collect payment information through our payment processor, Stripe. We do not store full credit card numbers.

Communications: If you contact us, we may keep a record of that correspondence.`,
              },
              {
                title: "2. How We Use Your Information",
                content: `We use the information we collect to:

• Provide, maintain, and improve our Services
• Process transactions and send related information
• Send technical notices, updates, security alerts, and support messages
• Respond to your comments and questions
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Comply with legal obligations`,
              },
              {
                title: "3. Information Sharing",
                content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

Service Providers: We share information with vendors and service providers that perform services on our behalf, such as cloud hosting (AWS), payment processing (Stripe), and analytics.

Business Transfers: If NexoraGrid is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.

Legal Requirements: We may disclose your information if required by law or in response to valid legal process.

With Your Consent: We may share your information with your consent or at your direction.`,
              },
              {
                title: "4. Data Retention",
                content: `We retain your information for as long as your account is active or as needed to provide you Services. You may request deletion of your account and associated data at any time by contacting us at privacy@nexoragrid.com. We will delete your data within 30 days of your request, subject to legal retention requirements.`,
              },
              {
                title: "5. Security",
                content: `We take reasonable measures to help protect your information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We are SOC 2 Type II certified and undergo regular third-party security audits.`,
              },
              {
                title: "6. Your Rights",
                content: `Depending on your location, you may have certain rights regarding your personal information, including:

• The right to access your personal information
• The right to correct inaccurate data
• The right to request deletion of your data
• The right to data portability
• The right to opt out of marketing communications

To exercise these rights, contact us at privacy@nexoragrid.com.`,
              },
              {
                title: "7. Cookies",
                content: `We use cookies and similar tracking technologies to collect and use personal information about you. For more information about our use of cookies, please see our Cookie Policy.`,
              },
              {
                title: "8. International Transfers",
                content: `NexoraGrid is based in the United States. If you are located outside the US, your information may be transferred to and processed in the US. We comply with applicable data transfer mechanisms, including Standard Contractual Clauses for transfers from the EU/EEA.`,
              },
              {
                title: "9. Contact Us",
                content: `If you have questions about this Privacy Policy, please contact us at:

NexoraGrid, Inc.
548 Market St, Suite 12000
San Francisco, CA 94104
privacy@nexoragrid.com`,
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
              <Link href="/legal/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
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

export default function PrivacyPage() {
  return (
    <LandingWrapper>
      <PrivacyContent />
    </LandingWrapper>
  );
}

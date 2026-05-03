import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NexoraGrid — AI-Powered Business Infrastructure',
    template: '%s | NexoraGrid',
  },
  description:
    'Unify your business operations with AI-powered analytics, automation, and team collaboration in one intelligent platform.',
  keywords: ['SaaS', 'AI', 'business intelligence', 'analytics', 'automation', 'collaboration'],
  authors: [{ name: 'NexoraGrid' }],
  creator: 'NexoraGrid',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'NexoraGrid',
    title: 'NexoraGrid — AI-Powered Business Infrastructure',
    description: 'Unify your business operations with AI-powered analytics and automation.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NexoraGrid' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexoraGrid',
    description: 'AI-Powered Business Infrastructure',
    images: ['/og-image.png'],
    creator: '@nexoragrid',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CouncilCode — Prove Every Bug Before You Merge',
  description:
    'One verified, green-tested Pull Request instead of a thread of AI comments. Competing AI models prove bugs with executable evidence before code reaches human review.',
  keywords: [
    'CouncilCode',
    'AI Code Review',
    'Multi-Agent',
    'Deterministic Sandbox',
    'Proof Gate',
    'BYOK',
    'Code Verification'
  ]
};

export const viewport: Viewport = {
  themeColor: '#F5F5F4',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-[#F5F5F4] text-[#141413] font-sans"
      >
        {children}
      </body>
    </html>
  );
}

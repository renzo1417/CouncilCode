import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CouncilCode — Multi-Agent AI Code Review & Verification Platform',
  description:
    'One verified, green-tested Pull Request instead of a thread of AI comments. Competing AI models prove bugs with executable evidence before code reaches human review.',
  keywords: [
    'CouncilCode',
    'AI Code Review',
    'Multi-Agent',
    'Deterministic Sandbox',
    'Proof Gate',
    'Interactive 3D Demo',
    'Three.js',
    'R3F'
  ]
};

export const viewport: Viewport = {
  themeColor: '#FAF8F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="h-full w-full overflow-hidden bg-[#FAF8F5] text-stone-800 flex flex-col font-sans"
      >
        {children}
      </body>
    </html>
  );
}

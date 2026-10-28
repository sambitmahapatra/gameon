import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ScrollProgress } from '@/components/scroll-progress';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `${SITE.name} — %s`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'gaming lounge',
    'VR free-roam arena',
    'esports station',
    'flight simulator',
    'racing simulator',
    'streaming pod',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GameOn — Enter another world.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/logo-mark.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF5' },
    { media: '(prefers-color-scheme: dark)', color: '#06080F' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: next-themes writes data-theme on <html> before
    // React hydrates, which is a deliberate server/client difference.
    <html lang="en" suppressHydrationWarning>
      <body className={cn(display.variable, body.variable, mono.variable, 'min-h-dvh')}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-button focus:bg-brand focus:px-4 focus:py-2 focus:font-medium focus:text-brand-foreground"
          >
            Skip to content
          </a>

          <Navbar />
          <ScrollProgress />
          <main id="main" className="above-grain">
            {children}
          </main>
          <Footer />
          <Toaster />

          {/*
            Grain sits at z-index 2 over the whole page. Everything
            interactive is inside .above-grain (z-index 3) or a higher
            stacking context, and the layer never takes pointer events.
          */}
          <div className="grain" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}

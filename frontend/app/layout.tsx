/*frontend/app/layout.tsx */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SkipLink from "../components/ui/SkipLink";
import ConsentManager from "../components/consent/ConsentManager";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_TWITTER } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport = {
  themeColor: 'var(--petrol)',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${AUTHOR_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico',    sizes: 'any' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: SITE_URL.includes('cloudfront.net')
    ? { index: false, follow: false }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    creator: AUTHOR_TWITTER,
    site: AUTHOR_TWITTER,
  },
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
};

// JSON-LD: Organization + WebSite (SearchAction para busca interna)
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/marcelo-jgoncalves",
    "https://github.com/marcelo-jgoncalves",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/busca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Consent Mode v2 — deve rodar ANTES de qualquer script de ads */}
        <script
          id="consent-init"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent','default',{
            ad_storage:'denied',
            ad_user_data:'denied',
            ad_personalization:'denied',
            analytics_storage:'denied',
            wait_for_update:500
          });
          window.APP_ENV = (
            window.location.hostname === 'localhost' ||
            window.location.hostname.includes('cloudfront.net')
          ) ? 'dev' : 'prod';
          if (window.APP_ENV === 'dev') {
            console.log('[CONSENT INIT] Consent Mode defaults aplicados (all denied)');
          }
        `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${interDisplay.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning={true}
      >
        <SkipLink />
        <Header />
        <main id="main-content" style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
}
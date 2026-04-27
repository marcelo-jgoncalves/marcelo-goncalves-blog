/*frontend/app/layout.tsx */

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SkipLink from "../components/ui/SkipLink";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_TWITTER } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
  robots: { index: true, follow: true },
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
        className={`${inter.variable} ${spaceGrotesk.variable}`}
        suppressHydrationWarning={true}
      >
        <SkipLink />
        <Header />
        <main id="main-content" style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
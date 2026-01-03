import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Importa os componentes
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SkipLink from "../components/ui/SkipLink";

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
  title: "IA Decifrada | Marcelo Gonçalves",
  description: "Blog de autoridade sobre IA, AWS e Engenharia de Software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Solução CDN para FontAwesome: Estável e Rápida para Dev */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      {/* ADICIONADO: suppressHydrationWarning para evitar erros de extensões no body */}
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
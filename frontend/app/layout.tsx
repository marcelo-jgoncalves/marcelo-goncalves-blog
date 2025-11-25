import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Importa os componentes
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {/* Elementos Persistentes */}
        <Header />
        
        {/* O conteúdo da página muda aqui */}
        <main style={{ minHeight: '80vh' }}>
            {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}

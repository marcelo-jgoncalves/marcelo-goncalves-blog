import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Performance: Ativação de Formatos Next-Gen (AVIF prioritário)
    formats: ['image/avif', 'image/webp'],

    // 2. Permissão de SVGs para os ícones
    dangerouslyAllowSVG: true,
    
    // 3. Segurança: Blindagem obrigatória contra XSS em SVGs externos
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // 4. Domínios Autorizados (Sua lista original mantida e intacta)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'icon.icepanel.io',
      },
      {
        protocol: 'https',
        hostname: 'dsns2wusdrj9z.cloudfront.net', // O seu CDN na AWS
      },
    ],
  },
};

export default nextConfig;
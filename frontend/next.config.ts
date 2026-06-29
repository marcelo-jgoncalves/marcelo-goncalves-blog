import type { NextConfig } from "next";
import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    // Restrito ao hostname exato do projeto — evita que Next/Image otimize
    // imagens de qualquer CloudFront/S3 da AWS (vetor de abuso).
    // Atualizar quando o domínio definitivo for configurado.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dsns2wusdrj9z.cloudfront.net",
      },
    ],
  },

  experimental: {
    // fontawesome-free (CSS de todos os ícones, ~74KB) foi substituído por
    // SVG por ícone (free-solid/regular/brands-svg-icons) — agora esses
    // pacotes têm imports JS nomeados de verdade, então optimizePackageImports
    // tem efeito real (antes apontava pro pacote CSS, que nunca era importado
    // via JS, então a flag não fazia nada).
    optimizePackageImports: [
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

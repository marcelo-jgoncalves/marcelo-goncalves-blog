import type { NextConfig } from "next";

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
    optimizePackageImports: ["@fortawesome/fontawesome-free"],
  },
};

export default nextConfig;

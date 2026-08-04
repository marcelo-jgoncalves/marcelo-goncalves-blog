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
    // Restricted to the project's exact hostname: prevents Next/Image from
    // optimizing images from any AWS CloudFront/S3 (abuse vector).
    // Update once the final domain is configured.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dsns2wusdrj9z.cloudfront.net",
      },
    ],
  },

  experimental: {
    // fontawesome-free (CSS for all icons, ~74KB) was replaced with per-icon
    // SVG imports (free-solid/regular/brands-svg-icons): those packages now
    // have real named JS exports, so optimizePackageImports has an actual
    // effect (previously it pointed at the CSS package, which was never
    // imported via JS, so the flag was a no-op).
    optimizePackageImports: [
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

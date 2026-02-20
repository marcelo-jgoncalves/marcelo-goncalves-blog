import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    // Permite que o Next.js processe SVGs (usamos vários nos ícones das tecnologias)
    dangerouslyAllowSVG: true, 
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
        hostname: 'dsns2wusdrj9z.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;

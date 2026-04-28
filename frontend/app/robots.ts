import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

const isDevDomain = SITE_URL.includes('cloudfront.net');

export default function robots(): MetadataRoute.Robots {
  if (isDevDomain) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/busca', '/busca/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

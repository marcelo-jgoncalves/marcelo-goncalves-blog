import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/config';

export const revalidate = 3600;

const CATEGORY_SLUGS = [
  'inteligencia-artificial',
  'cloud-computing',
  'devops-automacao',
  'seguranca-na-nuvem',
  'engenharia-de-software',
  'noticias-e-mercado',
  'tutoriais-aws',
];

const now = new Date();

// As 4 landing pages de pilar (sessão 43) — substituem o hub /servicos, que saiu
// do sitemap por estar órfão de navegação desde que o dropdown "Serviços" do nav
// passou a linkar direto pra elas (docs/analise-funil-ctas-servicos.md, achado 4).
const PILLAR_SLUGS = [
  'software',
  'plataforma',
  'automacao',
  'inteligencia-artificial',
];

const staticPages: MetadataRoute.Sitemap = [
  { url: SITE_URL,                     lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
  { url: `${SITE_URL}/artigos`,        lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
  { url: `${SITE_URL}/o-projeto`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${SITE_URL}/sobre`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ...PILLAR_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  })),
  ...CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/categoria/${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })),
];

async function fetchAllPosts() {
  const posts: { slug: string; data_publicacao?: string; data_atualizacao?: string }[] = [];
  let nextToken: string | undefined;

  do {
    try {
      const data = await getAllPosts(nextToken, 100);
      if (!data?.posts?.length) break;
      posts.push(...data.posts);
      nextToken = data.nextToken;
    } catch {
      break;
    }
  } while (nextToken);

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: post.data_atualizacao || post.data_publicacao || new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...postEntries];
}

/**frontend/app/page.tsx */

import './home.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import CategoryCard from '@/components/ui/CategoryCard';
import HomeSidebar from '@/components/ui/HomeSidebar';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
import ServiceCallout from '@/components/ui/ServiceCallout';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/config';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | ${AUTHOR_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    title: `${SITE_NAME} | ${AUTHOR_NAME}`,
    description: SITE_DESCRIPTION,
  },
};

// Skeleton para enquanto os posts carregam via Suspense
function PostsSkeleton() {
  return (
    <div className="home-posts-grid" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="post-card-skeleton">
          <div className="post-card-skeleton__image" />
          <div className="post-card-skeleton__body">
            <div className="post-card-skeleton__line post-card-skeleton__line--title" />
            <div className="post-card-skeleton__line" />
            <div className="post-card-skeleton__line post-card-skeleton__line--short" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente async isolado — busca seus próprios dados em request-time
async function RecentPostsSection() {
  const data = await getRecentPosts().catch(() => ({ posts: [] }));
  const posts = (data.posts || []).slice(0, 6);

  return (
    <>
      <div className="home-posts-grid">
        {posts.map((post: any) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="home-see-all">
        <Link href="/artigos">Ver todos os artigos →</Link>
      </div>
    </>
  );
}

// Componente async isolado — busca seus próprios dados em request-time
async function PopularPostsSection() {
  const data = await getPopularPosts().catch(() => ({ posts: [] }));
  const posts = (data.posts || []).slice(0, 6);

  if (posts.length === 0) return null;

  return (
    <div className="home-posts-grid">
      {posts.map((post: any) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero>
        <h1 className="hero-title">
          Desvendando a{' '}
          <span className="accent">Inteligência Artificial</span>
          , AWS e DevOps detalhe por detalhe
        </h1>
      </PageHero>

      {/* 2. Grid principal + sidebar */}
      <div className="home-layout container">

        <main className="home-main">

          {/* Ad banner — alinhado ao topo da sidebar; oculto no mobile */}
          <AdSenseBanner hideOnMobile />

          {/* Últimos Artigos */}
          <section aria-labelledby="recentes-heading">
            <div className="section-header">
              <h2 id="recentes-heading">Últimos Artigos</h2>
              <p>O conteúdo mais recente sobre IA e Nuvem</p>
            </div>
            <Suspense fallback={<PostsSkeleton />}>
              <RecentPostsSection />
            </Suspense>
          </section>

          <ServiceCallout />
          <div className="home-ad-desktop"><AdSenseBanner /></div>

          {/* Populares & Mais Lidos */}
          <section aria-labelledby="populares-heading">
            <div className="section-header">
              <h2 id="populares-heading">Populares & Mais Lidos</h2>
              <p>O conteúdo que a comunidade mais acessou</p>
            </div>
            <Suspense fallback={<PostsSkeleton />}>
              <PopularPostsSection />
            </Suspense>
          </section>

          <AdSenseBanner />

          {/* Explore nossos Tópicos */}
          <section aria-labelledby="topicos-heading">
            <div className="section-header">
              <h2 id="topicos-heading">Explore nossos Tópicos</h2>
              <p>Navegue pelo conteúdo principal do blog</p>
            </div>
            <div className="categories-grid">
              <CategoryCard
                href="/categoria/inteligencia-artificial"
                icon="fa-solid fa-brain"
                title="Inteligência Artificial"
                description="Análises de modelos como GPT-4, Llama 3 e o futuro da IA generativa."
              />
              <CategoryCard
                href="/categoria/cloud-computing"
                icon="fa-solid fa-cloud"
                title="Cloud Computing"
                description="Arquitetura serverless, serviços gerenciados e otimização de custos na AWS."
              />
              <CategoryCard
                href="/categoria/devops-automacao"
                icon="fa-solid fa-gears"
                title="DevOps e Automação"
                description="Pipelines de CI/CD, Terraform e infraestrutura como código (IaC)."
              />
              <CategoryCard
                href="/categoria/seguranca-na-nuvem"
                icon="fa-solid fa-shield-halved"
                title="Segurança na Nuvem"
                description="Melhores práticas de IAM, redes e proteção de dados em ambientes cloud."
              />
              <CategoryCard
                href="/categoria/engenharia-de-software"
                icon="fa-solid fa-code"
                title="Engenharia de Software"
                description="Design patterns, arquitetura limpa e boas práticas de desenvolvimento."
              />
              <CategoryCard
                href="/categoria/noticias-e-mercado"
                icon="fa-solid fa-newspaper"
                title="Notícias & Mercado"
                description="As últimas atualizações e o impacto da inteligência artificial nos negócios."
              />
            </div>
          </section>

        </main>

        <HomeSidebar />

      </div>

      {/* 3. CTA Newsletter fullwidth */}
      <NewsletterCTA />
    </>
  );
}

/**frontend/app/page.tsx */

import './home.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import HomeSidebar from '@/components/ui/HomeSidebar';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import PageHero from '@/components/ui/PageHero';
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
  const posts = (data.posts || []).slice(0, 4);

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
  const posts = (data.posts || []).slice(0, 4);

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

          {/* Ad banner — alinhado ao topo da sidebar */}
          <AdSenseBanner />

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

          <AdSenseBanner />

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
              <Link href="/categoria/inteligencia-artificial" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-brain" aria-hidden="true" /></div>
                <h3>Inteligência Artificial</h3>
                <p>Análises de modelos como GPT-4, Llama 3 e o futuro da IA generativa.</p>
              </Link>
              <Link href="/categoria/cloud-computing" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-cloud" aria-hidden="true" /></div>
                <h3>Cloud Computing</h3>
                <p>Arquitetura serverless, serviços gerenciados e otimização de custos na AWS.</p>
              </Link>
              <Link href="/categoria/devops-automacao" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-gears" aria-hidden="true" /></div>
                <h3>DevOps e Automação</h3>
                <p>Pipelines de CI/CD, Terraform e infraestrutura como código (IaC).</p>
              </Link>
              <Link href="/categoria/seguranca-na-nuvem" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true" /></div>
                <h3>Segurança na Nuvem</h3>
                <p>Melhores práticas de IAM, redes e proteção de dados em ambientes cloud.</p>
              </Link>
              <Link href="/categoria/engenharia-de-software" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-code" aria-hidden="true" /></div>
                <h3>Engenharia de Software</h3>
                <p>Design patterns, arquitetura limpa e boas práticas de desenvolvimento.</p>
              </Link>
              <Link href="/categoria/noticias-e-mercado" className="category-card">
                <div className="category-icon"><i className="fa-solid fa-newspaper" aria-hidden="true" /></div>
                <h3>Notícias & Mercado</h3>
                <p>As últimas atualizações e o impacto da inteligência artificial nos negócios.</p>
              </Link>
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

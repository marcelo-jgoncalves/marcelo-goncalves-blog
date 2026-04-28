/**frontend/app/page.tsx */

import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
import HomeSidebar from '@/components/ui/HomeSidebar';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/config';

export const revalidate = 60;

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

export default async function Home() {
  const fallback = { posts: [] };
  const [recentData, popularData] = await Promise.all([
    getRecentPosts().catch(() => fallback),
    getPopularPosts().catch(() => fallback),
  ]);

  const recentPosts = (recentData.posts || []).slice(0, 4);
  const popularPosts = (popularData.posts || []).slice(0, 4);

  return (
    <>
      {/* 1. Hero */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Desvendando a{' '}
            <span className="accent">Inteligência Artificial</span>
            , AWS e DevOps detalhe por detalhe
          </h1>
          <p className="hero-subtitle">
            Análises profundas, tutoriais práticos e as últimas notícias do mundo da tecnologia, da AWS à OpenAI.
          </p>
          <Link href="/artigos" className="btn btn-primary">
            Ver Todos os Artigos
          </Link>
        </div>
      </section>

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
            <div className="home-posts-grid">
              {recentPosts.map((post: any) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="home-see-all">
              <Link href="/artigos">Ver todos os artigos →</Link>
            </div>
          </section>

          <AdSenseBanner />

          {/* Populares & Mais Lidos */}
          <section aria-labelledby="populares-heading">
            <div className="section-header">
              <h2 id="populares-heading">Populares & Mais Lidos</h2>
              <p>O conteúdo que a comunidade mais acessou</p>
            </div>
            <div className="home-posts-grid">
              {popularPosts.length > 0 ? (
                popularPosts.map((post: any) => (
                  <PostCard key={post.slug} post={post} />
                ))
              ) : (
                <p className="home-empty" style={{ gridColumn: '1 / -1' }}>
                  Sem dados disponíveis.
                </p>
              )}
            </div>
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

      {/* 3. Super Destaque fullwidth */}
      <section className="super-destaque">
        <div className="container">
          <h2>
            Um Blog sobre as tecnologias do futuro, construído{' '}
            <span className="highlight">quase</span> 100% com IA.
          </h2>
          <p>
            Acompanhe a jornada, os desafios e os custos reais de construir este site do zero na AWS.
          </p>
          <Link href="/o-projeto" className="btn btn-primary">
            Conheça &ldquo;O Projeto&rdquo; →
          </Link>
        </div>
      </section>

      {/* 4. CTA Newsletter fullwidth */}
      <section className="cta">
        <div className="container">
          <h2>Quer se aprofundar em IA, DevOps e muito mais?</h2>
          <p>
            Inscreva-se na nossa newsletter e receba análises exclusivas e os melhores artigos da semana.
          </p>
          <Link href="/newsletter" className="btn-outline">
            Inscrever-se agora
          </Link>
        </div>
      </section>
    </>
  );
}

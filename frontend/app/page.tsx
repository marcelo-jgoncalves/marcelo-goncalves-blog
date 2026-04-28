/**frontend/app/page.tsx */

import './home.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts, getPopularPosts } from '@/lib/api';
import PostCard from '@/components/ui/PostCard';
import AdSenseBanner from '@/components/ui/AdSenseBanner';
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

  const recentPosts = recentData.posts || [];
  const popularPosts = popularData.posts || [];

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Desvendando a Inteligência Artificial, AWS e DevOps detalhe por detalhe
          </h1>
          <p className="hero-subtitle">
            Análises profundas, tutoriais práticos e as últimas notícias do mundo da tecnologia, da AWS à OpenAI.
          </p>
          <Link href="/artigos" className="btn btn-primary">
            Ver Todos os Artigos
          </Link>
        </div>
      </section>

      {/* 2. AdSense Superior */}
      <AdSenseBanner />

      {/* 3. Últimos Artigos */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div className="section-header">
          <h2>Últimos Artigos</h2>
          <p>O conteúdo mais recente sobre IA e Nuvem</p>
        </div>

        <div className="posts-grid">
          {recentPosts.map((post: any) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div style={{ textAlign: 'right', marginTop: '25px' }}>
          <Link href="/artigos" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Ver todos os artigos →
          </Link>
        </div>
      </section>

      {/* 4. Super Destaque */}
      <section className="super-destaque">
        <div className="container">
          <h2>
            Um Blog sobre as tecnologias do futuro, construído <span className="highlight">quase</span> 100% com IA.
          </h2>
          <p>
            Acompanhe a jornada, os desafios e os custos reais de construir este site do zero na AWS.
          </p>
          <Link href="/o-projeto" className="btn btn-primary">
            Conheça "O Projeto" →
          </Link>
        </div>
      </section>

      {/* 5. Populares */}
      <section style={{ padding: '80px 20px', backgroundColor: '#fdfdfd' }}>
        <div className="container">
          <div className="section-header">
            <h2>Populares & Mais Lidos</h2>
            <p>O conteúdo que a comunidade mais acessou</p>
          </div>

          <div className="posts-grid">
            {popularPosts.length > 0 ? (
              popularPosts.map((post: any) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <p className="text-center col-span-full" style={{ color: '#999', textAlign: 'center', width: '100%' }}>
                Carregando destaques ou sem dados disponíveis...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 6. AdSense Inferior */}
      <AdSenseBanner />
      
      {/* 7. Categorias / Tópicos */}
      <section className="categories">
          <div className="container">
              <div className="section-header">
                  <h2>Explore nossos Tópicos</h2>
                  <p>Navegue pelo conteúdo principal do blog</p>
              </div>

              <div className="categories-grid">
                  <Link href="/categoria/inteligencia-artificial" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-brain"></i></div>
                      <h3>Inteligência Artificial</h3>
                      <p>Análises de modelos como GPT-4, Llama 3 e o futuro da IA generativa.</p>
                  </Link>

                  {/* 2. Cloud Computing */}
                  <Link href="/categoria/cloud-computing" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-cloud"></i></div>
                      <h3>Cloud Computing</h3>
                      <p>Arquitetura serverless, serviços gerenciados e otimização de custos na AWS.</p>
                  </Link>

                  {/* 3. DevOps e Automação */}
                  <Link href="/categoria/devops-automacao" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-gears"></i></div>
                      <h3>DevOps e Automação</h3>
                      <p>Pipelines de CI/CD, Terraform e infraestrutura como código (IaC).</p>
                  </Link>

                  {/* 4. Segurança na Nuvem */}
                  <Link href="/categoria/seguranca-na-nuvem" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-shield-halved"></i></div>
                      <h3>Segurança na Nuvem</h3>
                      <p>Melhores práticas de IAM, redes e proteção de dados em ambientes cloud.</p>
                  </Link>

                  {/* 5. Engenharia de Software */}
                  <Link href="/categoria/engenharia-de-software" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-code"></i></div>
                      <h3>Engenharia de Software</h3>
                      <p>Design patterns, arquitetura limpa e boas práticas de desenvolvimento.</p>
                  </Link>

                  {/* 6. Notícias e Mercado */}
                  <Link href="/categoria/noticias-e-mercado" className="category-card">
                      <div className="category-icon"><i className="fa-solid fa-newspaper"></i></div>
                      <h3>Notícias & Mercado</h3>
                      <p>As últimas atualizações e o impacto da inteligência artificial nos negócios.</p>
                  </Link>
              </div>
          </div>
      </section>

      {/* 8. CTA Newsletter */}
      <section className="cta">
        <div className="container">
          <h2>
            Quer se aprofundar em IA, DevOps e muito mais?
          </h2>
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
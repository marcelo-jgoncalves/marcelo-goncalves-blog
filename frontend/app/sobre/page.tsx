import './sobre.css';
import type { Metadata } from 'next';
import { getAuthor } from '@/lib/api';
import SobreHero from '@/components/ui/SobreHero';
import NewsletterCTA from '@/components/ui/NewsletterCTA';
import BlogSidebar from '@/components/ui/BlogSidebar';
import CertificacoesWidget from '@/components/ui/CertificacoesWidget';
import FormacaoWidget from '@/components/ui/FormacaoWidget';
import FullwidthCallout from '@/components/ui/FullwidthCallout';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';

export const revalidate = 3600;

const AUTOR_ID = 'marcelo-goncalves';
const FALLBACK_DESC = 'Conheça Marcelo Gonçalves, especialista em AWS com mais de 8 anos de experiência, Mestre em Linguística e criador do blog.';

const EXPERTISE_AREAS = [
  { titulo: 'Arquitetura AWS',    descricao: 'Design de soluções seguras e escaláveis seguindo o Well-Architected Framework.', icon: 'fa-cloud'                  },
  { titulo: 'DevOps & Automação', descricao: 'Infraestrutura como Código (Terraform) e pipelines de CI/CD eficientes.',         icon: 'fa-gears'                  },
  { titulo: 'Serverless',         descricao: 'Arquiteturas orientadas a eventos com Lambda, API Gateway e DynamoDB.',            icon: 'fa-bolt'                   },
  { titulo: 'FinOps',             descricao: 'Governança financeira e otimização de custos para máxima eficiência na nuvem.',    icon: 'fa-hand-holding-dollar'    },
];

const LANGUAGES = [
  { nome: 'Português', nivel: 'Nativo',       flag: '🇧🇷' },
  { nome: 'Inglês',    nivel: 'Avançado',  flag: '🇺🇸' },
  { nome: 'Alemão',    nivel: 'Avançado',  flag: '🇩🇪' },
];

export async function generateMetadata(): Promise<Metadata> {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const autor = authorData?.autor;
  const nome = autor?.nome_exibicao || 'Marcelo Gonçalves';
  const rawBio = autor?.bio?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
  const desc = rawBio ? rawBio.substring(0, 160) : FALLBACK_DESC;
  const canonicalUrl = `${SITE_URL}/sobre`;
  const avatarUrl = autor?.foto_avatar_url;

  return {
    title: { absolute: `Sobre Mim | ${nome}` },
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Sobre Mim | ${nome}`, description: desc, url: canonicalUrl,
      type: 'profile', siteName: SITE_NAME, locale: 'pt_BR',
      ...(avatarUrl && { images: [{ url: avatarUrl, alt: `Foto de ${nome}` }] }),
    },
    twitter: { card: 'summary_large_image', title: `Sobre Mim | ${nome}`, description: desc, creator: AUTHOR_TWITTER },
  };
}

export default async function SobrePage() {
  const authorData = await getAuthor(AUTOR_ID).catch(() => null);
  const author = authorData?.autor || {};
  const linkedinUrl  = author.linkedin_url   || '#';
  const githubUrl    = author.github_url     || '#';
  const instagramUrl = author.instagram_url  || '#';
  const avatarUrl    = author.foto_avatar_url;
  const nome         = author.nome_exibicao  || 'Marcelo Gonçalves';

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nome,
    url: `${SITE_URL}/sobre`,
    image: avatarUrl || undefined,
    jobTitle: 'Especialista em AWS & DevOps',
    description: author.bio || FALLBACK_DESC,
    sameAs: [linkedinUrl, githubUrl].filter((u) => u && u !== '#'),
    knowsAbout: ['AWS', 'Arquitetura Serverless', 'DevOps', 'Terraform', 'FinOps', 'Inteligência Artificial'],
    worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      {/* ── HERO ─────────────────────────────────────── */}
      <SobreHero
        nome={nome}
        linkedinUrl={linkedinUrl}
        instagramUrl={instagramUrl}
        githubUrl={githubUrl}
      />

      {/* ── CONTEÚDO + SIDEBAR ─────────────────────── */}
      <div className="container page-layout sobre-content">

        {/* Coluna principal */}
        <section className="sobre-bio">

          {/* Trajetória — glass card */}
          <div className="sobre-bio-card">
            <h2>Trajetória Profissional</h2>
            <p>
              Especialista em <strong>alta disponibilidade e eficiência</strong>, com mais de 8 anos
              resolvendo desafios técnicos complexos e projetando infraestruturas cloud que sustentam
              negócios em escala global. Minha carreira é definida pela busca de resiliência,
              automação e arquiteturas que envelhecem bem.
            </p>
            <p>
              Colaborei com empresas líderes no <strong>Brasil e no exterior</strong>, como{' '}
              <strong>Accenture</strong>, <strong>Deutsche Bahn</strong>, <strong>Anynines</strong> e{' '}
              <strong>Credisis</strong>. Essa atuação internacional me permitiu refinar metodologias que
              equilibram agilidade técnica com governança corporativa.
            </p>
            <p>
              Como <strong>professor há mais de 15 anos</strong>, acredito que a tecnologia só atinge seu
              potencial máximo quando é comunicada com clareza — uma ponte entre o detalhe da engenharia
              e a decisão estratégica.
            </p>

            {/* Stats — rodapé do card */}
            <div className="sobre-bio-card__stats">
              <div className="sobre-bio-card__stat">
                <span className="sobre-bio-card__stat-num">10+</span>
                <span className="sobre-bio-card__stat-label">Exp. AWS</span>
              </div>
              <div className="sobre-bio-card__stat">
                <span className="sobre-bio-card__stat-num">3+</span>
                <span className="sobre-bio-card__stat-label">Países</span>
              </div>
              <div className="sobre-bio-card__stat">
                <span className="sobre-bio-card__stat-num">15+</span>
                <span className="sobre-bio-card__stat-label">Anos de Ensino</span>
              </div>
            </div>
          </div>

          {/* Áreas de atuação */}
          <h2>Áreas em que atuo</h2>

          <div className="sobre-expertise-grid">
            {EXPERTISE_AREAS.map((area, index) => (
              <div
                key={area.titulo}
                className={`sobre-expertise-card${index === 2 ? ' sobre-expertise-card--service' : ' sobre-expertise-card--light'}`}
              >
                <div className="sobre-expertise-num-frame" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h4>{area.titulo}</h4>
                <p>{area.descricao}</p>
              </div>
            ))}
          </div>

          {/* CTA Serviços */}
          <FullwidthCallout
            variant="navy"
            rounded
            icon="fa-headset"
            iconVariant="dark"
            size="md"
            title="Precisa de ajuda com cloud ou IA?"
            description="Arquitetura AWS, automação, DevOps, serverless e otimização de custos — com foco em resultados reais."
            href="/servicos"
            ctaText="Conheça Meus Serviços"
            ctaVariant="white"
            maxWidth="600px"
          />

          {/* Widgets mobile — sidebar oculta em telas pequenas */}
          <div className="sobre-mobile-widgets">
            <CertificacoesWidget />
            <FormacaoWidget />
          </div>

        </section>

        <BlogSidebar
          showPopularPosts={false}
          showNewsletter={true}
          showProjeto={false}
          showAdsense={false}
          adsenseBlockId="sobre-sidebar-300x600"
        >
          <CertificacoesWidget />
          <FormacaoWidget />
        </BlogSidebar>

      </div>

      {/* Diferencial — fora do grid, sem interferência da sidebar sticky */}
      <div className="container sobre-differential-outer">
        <div className="sobre-differential">
          <div className="sobre-eyebrow sobre-eyebrow--light">O Diferencial</div>
          <h3>Engenharia encontra linguagem</h3>
          <blockquote>
            Minha base não é apenas engenharia. Sou formado em Letras, com Mestrado em Linguística.
            No mundo atual, onde a IA e os modelos de linguagem dominam a arquitetura, entender a
            estrutura da palavra é o que me permite conectar o <em>como</em> técnico ao{' '}
            <em>porquê</em> estratégico.
            <cite>Marcelo Gonçalves</cite>
          </blockquote>

          {/* Idiomas */}
          <div className="sobre-lang-block">
            <span className="sobre-lang-block__label">Idiomas</span>
            <div className="sobre-lang-pills">
              {LANGUAGES.map((lang) => (
                <div key={lang.nome} className="sobre-lang-pill">
                  <span className="sobre-lang-flag" aria-hidden="true">{lang.flag}</span>
                  <strong>{lang.nome}</strong>
                  <span>{lang.nivel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewsletterCTA />
    </>
  );
}

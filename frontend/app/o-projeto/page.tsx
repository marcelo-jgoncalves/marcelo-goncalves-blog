import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectPosts } from '@/lib/api';
import Pagination from '@/components/ui/Pagination';
import { formatDateShort, categoryName } from '@/lib/format';
import { SITE_URL, SITE_NAME, AUTHOR_TWITTER } from '@/lib/config';
import { jsonLdScript } from '@/lib/json-ld';
import ReadArticle from '@/components/ui/ReadArticle';
import PageHero from '@/components/ui/PageHero';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import IconTile from '@/components/ui/IconTile';
import {
  IconLayers,
  IconCycle,
  IconInfraestruturaCodigo,
  IconChart,
  IconObservabilidade,
  IconChip,
} from '@/components/ui/InstitutionalIcons';
import styles from './o-projeto.module.css';

const TITLE = 'O Projeto | Plataforma Editorial e Engenharia AWS';
const DESCRIPTION = 'Conheça a arquitetura, os princípios, o fluxo editorial e a evolução da plataforma construída por Marcelo Gonçalves como produto de engenharia.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/o-projeto` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/o-projeto`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: AUTHOR_TWITTER,
  },
};

export const revalidate = 300;

interface ProjectPost {
  slug: string;
  titulo: string;
  resumo?: string;
  categoria_slug?: string;
  categoria?: { nome_exibicao: string };
  data_publicacao?: string;
  tempo_leitura_min?: number;
  imagem_destaque_url?: string;
  imagem_destaque_alt_text?: string;
  imagem_lqip_base64?: string;
}

type CapabilityStatus = 'delivered' | 'in_development' | 'planned';

interface Capability {
  title: string;
  description: string;
  status: CapabilityStatus;
}

const CAPABILITIES: Capability[] = [
  { title: 'Site público em português', description: 'Experiência editorial pública com Home, artigos, páginas institucionais e páginas de serviço.', status: 'delivered' },
  { title: 'Publicação de artigos', description: 'Listagem, categorias e páginas individuais para conteúdo técnico.', status: 'delivered' },
  { title: 'Distribuição por CloudFront', description: 'Entrega do conteúdo e dos assets por uma camada de distribuição na AWS.', status: 'delivered' },
  { title: 'Infraestrutura como código', description: 'Recursos de infraestrutura definidos e versionados com Terraform.', status: 'delivered' },
  { title: 'Integração e entrega contínuas', description: 'Pipelines no GitHub Actions para validação e publicação das mudanças.', status: 'delivered' },
  { title: 'Editor estruturado', description: 'Editor rico com blocos, callouts, código, tabelas e vídeo, usado na administração editorial.', status: 'delivered' },
  { title: 'Processamento automático de imagens', description: 'Geração de formatos otimizados e derivados adequados à web a partir de cada upload.', status: 'delivered' },
  { title: 'Administração editorial separada', description: 'Interface administrativa independente da experiência pública, para criação, revisão e publicação do conteúdo.', status: 'delivered' },
  { title: 'Métricas editoriais', description: 'Visualizações e sinais de interesse para apoiar decisões de conteúdo.', status: 'in_development' },
  { title: 'Versão em inglês', description: 'Publicação multilíngue com rotas, metadata, canonical e hreflang próprios.', status: 'planned' },
  { title: 'Tradução assistida por IA', description: 'Geração de rascunho em inglês após decisão editorial, sempre com revisão humana.', status: 'planned' },
  { title: 'Publicação social com aprovação', description: 'Geração de rascunhos e mídias para redes sociais com etapa explícita de aprovação.', status: 'planned' },
  { title: 'Newsletter', description: 'Canal editorial opcional, condicionado a consentimento e infraestrutura específica.', status: 'planned' },
  { title: 'Licenciamento da plataforma', description: 'Possibilidade futura de disponibilizar a base editorial como produto self-hosted ou serviço gerenciado.', status: 'planned' },
];

const STATUS_LABEL: Record<CapabilityStatus, string> = {
  delivered: 'Entregue',
  in_development: 'Em desenvolvimento',
  planned: 'Planejado',
};

const STATUS_CLASS: Record<CapabilityStatus, string> = {
  delivered: styles.opCapStatusDelivered,
  in_development: styles.opCapStatusInDevelopment,
  planned: styles.opCapStatusPlanned,
};

const LAYERS = [
  { title: 'Experiência pública', description: 'Aplicação web responsável pela navegação, descoberta e leitura do conteúdo, com foco em desempenho, SEO e acessibilidade.', tags: ['Next.js', 'CloudFront'] },
  { title: 'Administração editorial', description: 'Interface separada para criação, revisão, organização e publicação do conteúdo.', tags: ['Admin separado', 'Conteúdo estruturado'] },
  { title: 'Serviços de conteúdo', description: 'APIs e funções responsáveis por validar, armazenar e disponibilizar artigos, categorias, imagens e metadados.', tags: ['API Gateway', 'Lambda'] },
  { title: 'Dados e mídia', description: 'Persistência de metadados e conteúdo, com armazenamento de assets e derivados para distribuição.', tags: ['DynamoDB', 'S3'] },
  { title: 'Infraestrutura e entrega', description: 'Recursos versionados e pipelines responsáveis por validar e publicar mudanças de forma reproduzível.', tags: ['Terraform', 'GitHub Actions'] },
];

const PRINCIPLES = [
  { title: 'Conteúdo como dado estruturado', description: 'Artigos, metadados e blocos editoriais devem permanecer versionáveis, validáveis e independentes da apresentação final.', icon: <IconLayers /> },
  { title: 'Automação com controle', description: 'Publicação, tradução e distribuição podem ser automatizadas, mas ações de maior impacto mantêm validação e aprovação explícitas.', icon: <IconCycle /> },
  { title: 'Infraestrutura reproduzível', description: 'Mudanças na infraestrutura devem ser declaradas, revisadas e aplicadas por pipelines, evitando configuração manual como fonte de verdade.', icon: <IconInfraestruturaCodigo /> },
  { title: 'Evolução incremental', description: 'Novas capacidades são incorporadas em ciclos completos e testáveis, sem transformar a base em uma sequência de exceções.', icon: <IconChart /> },
  { title: 'Falhas observáveis', description: 'Erros de publicação, integração ou processamento precisam gerar sinais claros para diagnóstico e correção.', icon: <IconObservabilidade /> },
  { title: 'Custo proporcional ao uso', description: 'A arquitetura prioriza serviços gerenciados e custos compatíveis com o volume real da plataforma.', icon: <IconChip /> },
];

const EDITORIAL_FLOW = [
  { title: 'Conteúdo original', description: 'O artigo nasce de uma experiência, análise, pesquisa ou decisão editorial definida por Marcelo.' },
  { title: 'Assistência', description: 'A IA pode sugerir estrutura, resumo, revisão, metadata, tradução ou adaptação para redes sociais.' },
  { title: 'Revisão humana', description: 'Fatos, exemplos, código, fontes, tom e conclusões são verificados antes da aprovação.' },
  { title: 'Publicação controlada', description: 'O conteúdo só se torna público após os quality gates e a mudança explícita do estado editorial.' },
  { title: 'Medição e evolução', description: 'Sinais de leitura e interesse podem orientar atualizações, tradução ou novos conteúdos.' },
];

const ROADMAP_GROUPS: { label: string; items: { title: string; description: string }[] }[] = [
  {
    label: 'Agora',
    items: [
      { title: 'Métricas editoriais', description: 'Visualizações e sinais de interesse para apoiar decisões de conteúdo.' },
    ],
  },
  {
    label: 'Depois',
    items: [
      { title: 'Versão em inglês', description: 'Publicação multilíngue com rotas, metadata, canonical e hreflang próprios.' },
      { title: 'Tradução assistida por IA', description: 'Geração de rascunho em inglês após decisão editorial, sempre com revisão humana.' },
      { title: 'Publicação social com aprovação', description: 'Geração de rascunhos e mídias para redes sociais com etapa explícita de aprovação.' },
      { title: 'Newsletter', description: 'Canal editorial opcional, condicionado a consentimento e infraestrutura específica.' },
    ],
  },
  {
    label: 'Exploração',
    items: [
      { title: 'Licenciamento da plataforma', description: 'Possibilidade futura de disponibilizar a base editorial como produto self-hosted ou serviço gerenciado.' },
      { title: 'Resumos com IA', description: 'Síntese inteligente para cada artigo, facilitando leitura rápida e navegação eficiente.' },
      { title: 'Atendimento via WhatsApp com IA', description: 'Triagem inicial automatizada, com escalonamento para atendimento humano quando necessário.' },
      { title: 'Nutrição automatizada de leads', description: 'Sequência combinada a gatilhos por comportamento de leitura, conduzindo o contato até o diagnóstico de consultoria.' },
      { title: 'Ebook proprietário', description: 'Material estruturado com os aprendizados e frameworks do projeto.' },
    ],
  },
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LIMIT = 6;

export default async function OProjetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextToken  = typeof params.nextToken  === 'string' ? params.nextToken  : undefined;
  const prevTokens = typeof params.prevTokens === 'string' ? params.prevTokens : '';
  const page       = typeof params.page       === 'string' ? Math.max(1, parseInt(params.page)) : 1;

  const data = await getProjectPosts(nextToken, LIMIT).catch(() => null);
  const posts: ProjectPost[] = data?.posts || [];
  const nextPageToken = data?.nextToken ?? undefined;
  const totalCount: number = data?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O Projeto", "item": `${SITE_URL}/o-projeto` },
    ],
  };

  const grouped = (status: CapabilityStatus) => CAPABILITIES.filter((c) => c.status === status);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />

      {/* HERO */}
      <PageHero
        singleColumn
        className={styles.opHero}
        dataAudit="op-hero"
        eyebrow="O Projeto"
        title="Uma plataforma editorial construída como produto de engenharia."
        subtitle="Este site também funciona como um laboratório prático para arquitetura serverless, infraestrutura como código, automação editorial e uso responsável de inteligência artificial."
      >
        <div className={styles.opHeroActions}>
          <a className="btn" href="#arquitetura">Explorar a arquitetura</a>
          <a className="btn btn-petrol" href="#timeline">Ler os bastidores</a>
        </div>
        <p className={styles.opHeroMicro}>Projeto próprio · Evolução contínua · Estados publicados com transparência</p>
      </PageHero>

      {/* POR QUE CONSTRUIR */}
      <div className={styles.opWrap}>
        <section className={styles.opSection} data-audit="op-why">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Por que construir</div>
              <h2 className="sec-t">Mais do que publicar artigos: controlar toda a cadeia editorial.</h2>
            </div>
          </div>
          <div className={styles.opWhyBody}>
            <p>A plataforma nasceu da necessidade de publicar conteúdo técnico com identidade própria, bom desempenho, controle sobre os dados e liberdade para evoluir o processo editorial.</p>
            <p>Em vez de tratar o site apenas como uma vitrine, o projeto reúne conteúdo, administração, automações e infraestrutura em uma base que pode ser observada, testada e aprimorada continuamente.</p>
            <p>O objetivo não é reconstruir todas as ferramentas existentes, mas criar uma arquitetura adequada à estratégia editorial, à geração de autoridade e às futuras integrações da consultoria.</p>
            <div className={styles.opCallout}>
              <span className={styles.opCalloutLabel}>Princípio</span>
              <p>A plataforma deve evoluir sem comprometer o conteúdo já publicado.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ESTADO ATUAL */}
      <section className={`${styles.opSection} ${styles.opSectionSurface}`} data-audit="op-status">
        <div className={styles.opWrap}>
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Estado atual</div>
              <h2 className="sec-t">O que já está entregue e o que ainda está em evolução.</h2>
              <p className="sec-desc">Cada capacidade possui um estado explícito. Funcionalidades planejadas não são apresentadas como se já estivessem disponíveis.</p>
            </div>
          </div>

          <div className={styles.opCapGrid} data-audit="op-cap-grid">
            {(['delivered', 'in_development', 'planned'] as CapabilityStatus[]).map((status) => (
              <div className={`op-cap-col op-cap-${status}`} key={status}>
                <div className={`${styles.opCapStatus} ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</div>
                <ul className={styles.opCapList}>
                  {grouped(status).map((cap) => (
                    <li key={cap.title}>
                      <span className={styles.opCapTitle}>{cap.title}</span>
                      <span className={styles.opCapDesc}>{cap.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARQUITETURA */}
      <div className={styles.opWrap}>
        <section className={styles.opSection} id="arquitetura" data-audit="op-arquitetura">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Arquitetura</div>
              <h2 className="sec-t">Uma base serverless, versionada e orientada à automação.</h2>
              <p className="sec-desc">A plataforma separa a experiência pública, a administração editorial, os serviços de conteúdo e a infraestrutura. Essa separação permite evoluir cada parte com responsabilidades mais claras.</p>
            </div>
          </div>

          <div className={styles.opLayers} data-audit="op-layers">
            {LAYERS.map((layer, i) => (
              <div className={styles.opLayer} key={layer.title} data-audit={i === 0 ? 'op-layer' : undefined}>
                <span className={styles.opLayerNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.opLayerBody}>
                  <h3>{layer.title}</h3>
                  <p>{layer.description}</p>
                  <div className={styles.opLayerTags}>
                    {layer.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.opDiagram} role="img" aria-label="Fluxo de dados: leitor passa pelo CloudFront até a aplicação pública, que consome APIs e serviços conectados a dados e mídia; a administração editorial acessa os mesmos serviços e dados; infraestrutura como código e CI/CD sustentam todas as camadas.">
            <div className={styles.opDiagramRow}>Leitor → CloudFront → Aplicação pública → APIs → Serviços → Dados e mídia</div>
            <div className={styles.opDiagramRow}>Admin → APIs → Serviços → Dados e mídia</div>
            <div className={styles.opDiagramFoot}>Infraestrutura e CI/CD como camada transversal</div>
          </div>
        </section>
      </div>

      {/* PRINCÍPIOS DE ENGENHARIA */}
      <section className={`${styles.opSection} ${styles.opSectionSurface}`} data-audit="op-principles">
        <div className={styles.opWrap}>
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Princípios de engenharia</div>
              <h2 className="sec-t">A plataforma é construída para continuar compreensível enquanto evolui.</h2>
            </div>
          </div>

          <div className={styles.opPrinciplesGrid} data-audit="op-principles-grid">
            {PRINCIPLES.map((p, i) => (
              <div className={styles.opPrincipleCard} key={p.title} data-audit={i === 0 ? 'op-principle-card' : undefined}>
                <IconTile icon={p.icon} variant="petrol" />
                <div className={styles.opTxt}>
                  <div className={styles.opT}>{p.title}</div>
                  <div className={styles.opD}>{p.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLUXO EDITORIAL E IA */}
      <div className={styles.opWrap}>
        <section className={styles.opSection} data-audit="op-flow">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Fluxo editorial</div>
              <h2 className="sec-t">A IA participa do processo, mas não publica sozinha.</h2>
              <p className="sec-desc">A inteligência artificial pode acelerar tarefas editoriais, desde que o resultado permaneça como rascunho até ser revisado e aprovado.</p>
            </div>
          </div>

          <ol className={styles.opFlowList} data-audit="op-flow-list">
            {EDITORIAL_FLOW.map((step, i) => (
              <li key={step.title}>
                <span className={styles.opFlowNum}>{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.opCallout}>
            <span className={styles.opCalloutLabel}>Responsabilidade editorial</span>
            <p>O uso de IA não transfere a responsabilidade sobre o conteúdo, as fontes ou as decisões de publicação.</p>
          </div>
        </section>
      </div>

      {/* EVOLUÇÃO */}
      <section className={`${styles.opSection} ${styles.opSectionSurface}`} data-audit="op-evolution">
        <div className={styles.opWrap}>
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Evolução</div>
              <h2 className="sec-t">O roadmap é orientado por valor editorial, não por quantidade de funcionalidades.</h2>
              <p className="sec-desc">Novas capacidades entram no projeto quando melhoram a produção, a distribuição, a qualidade ou a sustentabilidade da plataforma. Ideias podem ser adiadas ou removidas quando não justificam a complexidade.</p>
            </div>
          </div>

          <div className={styles.opRoadmapGroups} data-audit="op-roadmap-groups">
            {ROADMAP_GROUPS.map((group) => (
              <div className={styles.opRoadmapGroup} key={group.label}>
                <div className={styles.opRoadmapGroupLabel}>{group.label}</div>
                <div className={styles.opRoadmapGroupItems}>
                  {group.items.map((item) => (
                    <div className={styles.opRoadmapItem} key={item.title}>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BASTIDORES */}
      <div className={styles.opWrap}>
        <section className={styles.opSection} id="timeline" data-audit="op-backstage">
          <div className="sec-head-row sec-head-row--center">
            <div className="left">
              <div className="sec-ey sec-ey--dual">Bastidores</div>
              <h2 className="sec-t" id="timeline-title">Decisões, erros e aprendizados documentados durante a construção.</h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className={`op-empty-state ${styles.opEmptyState}`}>
              <p>Os bastidores serão publicados conforme as decisões e os aprendizados estiverem documentados.</p>
              <Link className="btn" href="/todos-artigos">Explorar todos os artigos</Link>
            </div>
          ) : (
            <div className={styles.opTimeline}>
              {posts.map((post, i) => {
                const num = (page - 1) * LIMIT + i + 1;
                const isLatest = page === totalPages && i === posts.length - 1;
                return (
                  <div className={`${styles.opTlEntry}${isLatest ? ` ${styles.opLatest}` : ''}`} key={post.slug}>
                    <Link className={`op-tl-card ${styles.opTlCard}`} href={`/post/${post.slug}`} data-audit={i === 0 ? 'op-tl-card' : undefined}>
                      <div className={styles.opTlNumBg}>{String(num).padStart(2, '0')}</div>
                      {post.imagem_destaque_url && (
                        <div className={styles.opTlCover}>
                          <ResponsiveImage
                            src={post.imagem_destaque_url}
                            alt={post.imagem_destaque_alt_text || post.titulo}
                            fill
                            lqip={post.imagem_lqip_base64}
                          />
                        </div>
                      )}
                      <div className={styles.opTlBody}>
                        <div className={styles.opTlCardTop}>
                          <span className={styles.opTlCat}>{categoryName(post)}</span>
                          {isLatest && <span className={`${styles.opTlBadge} ${styles.opLatestTag}`}>Mais recente</span>}
                        </div>
                        <h3>{post.titulo}</h3>
                        {post.resumo && <p>{post.resumo}</p>}
                        <div className={styles.opTlCardFoot}>
                          <div className={styles.opMeta}>
                            <span>{formatDateShort(post.data_publicacao)}</span>
                            <span>{post.tempo_leitura_min || 5} min</span>
                          </div>
                          <span className={styles.opRead}><ReadArticle /></span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.opPagWrap}>
              <Pagination
                basePath="/o-projeto"
                page={page}
                totalPages={totalPages}
                nextToken={nextPageToken}
                currentPageToken={nextToken}
                prevTokens={prevTokens}
                scrollToId="timeline-title"
              />
            </div>
          )}
        </section>
      </div>

      {/* CTA FINAL */}
      <section className={`wrap ${styles.opCtaEditorial}`} data-audit="op-cta-editorial">
        <div className={styles.opCtaIn}>
          <div className="sec-ey sec-ey--dual">Da plataforma à operação</div>
          <h2>Precisa aplicar esse nível de engenharia a um problema da sua empresa?</h2>
          <p>Conheça as frentes de atuação da consultoria ou apresente o contexto que precisa evoluir.</p>
          <div className={styles.opCtaActions}>
            <Link className="btn" href="/servicos">Conhecer os serviços</Link>
            <Link className="btn btn-petrol" href="/contato">Apresentar um desafio</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getProjectPosts } from "../../lib/api";
import Pagination from "../../components/ui/Pagination";

// Tipagem baseada nos atributos REAIS retornados pelo DynamoDB
export interface ProjectPost {
  id?: string;
  slug: string;
  titulo: string;       
  resumo: string;       
  data_publicacao: string; 
  imagem_destaque_url?: string; // <-- CHAVE CORRIGIDA!
  categoria?: {
    nome_exibicao: string;
    icone_fa?: string;
  };
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OProjetoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextToken = typeof params.nextToken === 'string' ? params.nextToken : undefined;

  const data = await getProjectPosts(nextToken);
  const posts: ProjectPost[] = data?.posts || [];
  const returnedNextToken = data?.nextToken;

  return (
    <>
      {/* 1. HERO */}
      <section className="op-hero" aria-labelledby="hero-title">
        <div className="container op-hero-content">
          <h1 id="hero-title">
            O Projeto: Construindo um Blog <span className="op-highlight">quase</span> 100% com IA
          </h1>
          <p className="op-subtitle">
            Acompanhe a jornada, os desafios técnicos, os custos e os aprendizados de construir este blog do zero, usando IA em cada etapa da arquitetura 100% serverless na AWS.
          </p>
        </div>
      </section>

      {/* 2. TECH RIBBON */}
      <div className="op-tech-ribbon" aria-label="Tecnologias Core da Arquitetura">
        <div className="container op-tech-container">
          <span className="op-tech-label">Core Stack</span>
          <div className="op-tech-list">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google Gemini" title="Architected with Gemini" width={100} height={35} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" title="TypeScript" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="Next.js" title="React & Next.js" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" alt="Vue.js" title="Vue.js (Admin)" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="Terraform" title="Terraform (IaC)" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg" alt="AWS Lambda" title="AWS Lambda" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg" alt="DynamoDB" title="Amazon DynamoDB" width={45} height={45} className="op-tech-icon" />
          </div>
        </div>
      </div>

      {/* 3. MAIN LAYOUT */}
      <div className="container op-main-layout">
        
        {/* Coluna Esquerda: Timeline Feed */}
        <div className="op-timeline-feed">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <article key={post.id || post.slug} className="op-project-card">
                
                {/* CORREÇÃO 1: Usando <div> em vez de <header> para não herdar CSS global */}
                <div className="op-card-header">
                  <i className="far fa-calendar-alt" aria-hidden="true"></i>
                  <time dateTime={post.data_publicacao}>
                    {post.data_publicacao 
                      ? new Date(post.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                      : 'Data indisponível'}
                  </time>
                </div>

                {/* CORREÇÃO 2: Renderizando a imagem com a propriedade correta */}
                {post.imagem_destaque_url && (
                  <div className="op-card-image">
                    <Image 
                      src={post.imagem_destaque_url} 
                      alt={`Capa do artigo: ${post.titulo}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      priority={index === 0} 
                      style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    />
                  </div>
                )}

                <div className="op-card-body">
                  {post.categoria?.nome_exibicao && (
                    <span style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "var(--aws-orange)", color: "white", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "10px" }}>
                      {post.categoria.icone_fa && <i className={post.categoria.icone_fa} style={{ marginRight: "5px" }}></i>}
                      {post.categoria.nome_exibicao}
                    </span>
                  )}
                  <h2>
                    <Link href={`/post/${post.slug}`}>
                      {post.titulo}
                    </Link>
                  </h2>
                  <p>{post.resumo}</p>
                </div>

                {/* CORREÇÃO 3: Usando <div> em vez de <footer> para sumir com a barra preta */}
                <div className="op-card-footer">
                  <Link href={`/post/${post.slug}`} className="op-read-more" aria-label={`Ler o artigo: ${post.titulo}`}>
                    Ler mais <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>

              </article>
            ))
          ) : (
            <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
          )}

          <Pagination nextToken={returnedNextToken} basePath="/o-projeto" />

          <div className="op-adsense-feed" aria-hidden="true">
            <strong>Publicidade</strong>
            <span>Espaço reservado para AdSense (In-Feed)</span>
          </div>
        </div>

        {/* Coluna Direita: Sidebar */}
        <aside className="op-sidebar">
          <div className="op-sticky">
            {/* Widgets omitidos por brevidade, mas idênticos à versão anterior */}
            <div className="op-widget">
              <div className="op-widget-header">
                <h4>System Status</h4>
                <span className="op-status-dot" aria-label="Status Online"></span>
              </div>
              <div className="op-status-list">
                <div><span><i className="fas fa-code-branch" style={{ color: "var(--blue-600)" }}></i> Version</span><strong>v1.2.0</strong></div>
                <div><span><i className="fas fa-server" style={{ color: "var(--aws-orange)" }}></i> Env</span><span className="op-env-tag">Production</span></div>
                <div><span><i className="fas fa-globe" style={{ color: "var(--gray-text)" }}></i> Region</span><span>us-east-1</span></div>
                <div><span><i className="fas fa-bolt" style={{ color: "#ecc94b" }}></i> Uptime</span><strong>99.99%</strong></div>
              </div>
            </div>

            <div className="op-widget op-author-widget">
              <Image src="https://placehold.co/200x200/232F3E/white?text=MG" alt="Marcelo Gonçalves" width={100} height={100} className="op-author-img" />
              <h3>Marcelo Gonçalves</h3>
              <p>Arquiteto de Soluções Cloud. Transformando desafios complexos em sistemas escaláveis.</p>
              <Link href="/sobre" className="btn btn-full" style={{ background: "var(--aws-dark)", color: "white", display: "block", textAlign: "center", padding: "12px", borderRadius: "6px", marginTop: "15px", fontWeight: 600 }}>Minha Biografia</Link>
            </div>

            <div className="op-widget" style={{ background: "var(--aws-dark)", color: "white", border: "none", textAlign: "center" }}>
              <i className="fas fa-rocket" style={{ fontSize: "2.5rem", color: "var(--aws-orange)", marginBottom: "20px" }}></i>
              <h3 style={{ color: "white" }}>Consultoria Cloud & IA</h3>
              <p style={{ fontSize: "0.95rem", color: "#cbd5e0", margin: "15px 0 25px 0" }}>Precisa de ajuda para arquitetar sua solução na AWS ou integrar LLMs?</p>
              <Link href="/servicos" className="btn btn-full" style={{ background: "var(--aws-orange)", color: "var(--aws-dark)", display: "block", padding: "12px", borderRadius: "6px", fontWeight: 600 }}>Conhecer Serviços</Link>
            </div>
          </div>
        </aside>

      </div>

      {/* 4. SALES CTA */}
      <section className="op-sales-cta" aria-labelledby="cta-title">
        <div className="container">
          <h2 id="cta-title">Pronto para levar seu projeto para o próximo nível?</h2>
          <p>Vamos conversar. Agende uma chamada inicial de 30 minutos (sem custo) para discutirmos a sua arquitetura e os seus objetivos de negócio.</p>
          <Link href="/servicos" className="btn btn-primary" style={{ display: "inline-block", backgroundColor: "var(--aws-orange)", color: "var(--aws-dark)", padding: "15px 35px", borderRadius: "6px", fontWeight: 700, fontSize: "1.1rem" }}>
            Agendar Chamada →
          </Link>
        </div>
      </section>
    </>
  );
}
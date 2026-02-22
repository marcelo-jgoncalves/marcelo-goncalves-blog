import Image from "next/image";
import Link from "next/link";
import { getProjectPosts } from "../../lib/api";
import Pagination from "../../components/ui/Pagination";
import ReadMoreLink from "../../components/ui/ReadMoreLink";
import SystemStatus from "../../components/ui/SystemStatus";
import BlogSidebar from "../../components/ui/BlogSidebar";
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';

// Tipagem baseada nos atributos REAIS retornados pelo DynamoDB
export interface ProjectPost {
  id?: string;
  slug: string;
  titulo: string;       
  resumo: string;       
  data_publicacao: string; 
  imagem_destaque_url?: string; 
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

      {/* 2. TECH RIBBON (Stack Atualizada) */}
      <div className="op-tech-ribbon" aria-label="Tecnologias Core da Arquitetura">
        <div className="container op-tech-container">
          <span className="op-tech-label">Core Stack</span>
          <div className="op-tech-list">
            <Image src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Google Gemini" title="Architected with Gemini" width={100} height={35} className="op-tech-icon" />
            <Image src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" alt="ChatGPT" title="ChatGPT" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" title="Next.js" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" alt="Vue.js" title="Vue.js (Admin)" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" alt="GitHub Actions" title="GitHub Actions (CI/CD)" width={45} height={45} className="op-tech-icon" />
            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="Terraform" title="Terraform (IaC)" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Compute/Lambda.svg" alt="AWS Lambda" title="AWS Lambda" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/App-Integration/API-Gateway.svg" alt="API Gateway" title="AWS API Gateway" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Database/DynamoDB.svg" alt="DynamoDB" title="Amazon DynamoDB" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Storage/Simple-Storage-Service.svg" alt="S3" title="Amazon S3" width={45} height={45} className="op-tech-icon" />
            <Image src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg" alt="CloudFront" title="Amazon CloudFront" width={45} height={45} className="op-tech-icon" />
          </div>
        </div>
      </div>

      {/* 3. MAIN LAYOUT */}
      <div className="container op-main-layout">
        
        {/* Coluna Esquerda: Timeline Feed (Agora com as duas classes para não perder o gap!) */}
        <div className="main-content-column op-timeline-feed">
          {posts.length > 0 ? (
            posts.map((post, index) => {
              // Lógica de formatação definitiva (À prova de Bugs de Calendário)
              let dataFormatada = 'Data indisponível';
              if (post.data_publicacao) {
                const dateObj = new Date(post.data_publicacao);
                // getUTCDate() e getUTCFullYear() garantem o dia real ignorando fusos
                const dia = String(dateObj.getUTCDate()).padStart(2, '0'); 
                const mes = dateObj.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
                const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
                const ano = dateObj.getUTCFullYear();
                dataFormatada = `${dia} de ${mesCapitalizado}, ${ano}`;
              }

              return (
                <article key={post.id || post.slug} className="op-project-card">
                  
                  <div className="op-card-header">
                    <i className="far fa-calendar-alt" aria-hidden="true"></i>
                    <time dateTime={post.data_publicacao}>{dataFormatada}</time>
                  </div>

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

                  <div className="op-card-footer">
                    <ReadMoreLink href={`/post/${post.slug}`} />
                  </div>

                </article>
              );
            })
          ) : (
            <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
          )}

          <Pagination nextToken={returnedNextToken} basePath="/o-projeto" />

          <div className="op-adsense-feed" aria-hidden="true">
            <strong>Publicidade</strong>
            <span>Espaço reservado para AdSense (In-Feed)</span>
          </div>
        </div>

        {/* Coluna Direita: Sidebar (Padronizada) */}
        <BlogSidebar>
          {/* Injetamos apenas o System Status, o resto a Sidebar já resolve sozinha! */}
          <SystemStatus />
        </BlogSidebar>
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
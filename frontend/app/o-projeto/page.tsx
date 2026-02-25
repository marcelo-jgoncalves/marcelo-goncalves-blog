/** frontend/app/o-projeto/page.tsx */

import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { getProjectPosts } from "../../lib/api";
import Pagination from "../../components/ui/Pagination";
import ReadMoreLink from "../../components/ui/ReadMoreLink";
import SystemStatus from "../../components/ui/SystemStatus";
import BlogSidebar from "../../components/ui/BlogSidebar";
import AdsenseInArticle from '@/components/ui/AdsenseInArticle';
import TechRibbon from "../../components/ui/TechRibbon";
import TimelineCard from "../../components/ui/TimelineCard";

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

      {/* 2. TECH RIBBON (Refatorado para Componente) */}
      <TechRibbon />

      {/* 3. MAIN LAYOUT */}
      <div className="container op-main-layout">
        
        {/* Coluna Esquerda: Timeline Feed */}
        <div className="main-content-column op-timeline-feed">
          {posts.length > 0 ? (
              posts.map((post, index) => (
                <React.Fragment key={post.id || post.slug}>
                  <TimelineCard 
                    post={post} 
                    isPriority={index === 0} 
                  />
                  {/* INJEÇÃO DO ADSENSE APÓS O 4º POST */}
                  {index === 3 && (
                    <AdsenseInArticle 
                        blockId="in-feed-adsense" 
                        variant="in-feed" 
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="op-empty-state">Nenhuma atualização do projeto publicada ainda.</p>
            )}

          <Pagination nextToken={returnedNextToken} basePath="/o-projeto" />

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
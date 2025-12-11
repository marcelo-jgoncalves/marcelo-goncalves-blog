import React from 'react';

/**
 * Interface para os dados extraídos do HTML
 */
export interface Heading {
  id: string;
  text: string;
}

export interface ProcessedPost {
  modifiedHtml: string;
  headings: Heading[];
}

/**
 * 1. Processa o HTML bruto para adicionar IDs aos H2 e extrair a lista de títulos para o TOC.
 */
export function processPostContent(html: string): ProcessedPost {
  const headings: Heading[] = [];
  
  // 1. LIMPEZA DE TÍTULO (CRÍTICO): 
  // Remove qualquer tag <h1>...</h1> para evitar duplicação com o Hero.
  // O regex garante a remoção mesmo se tiver atributos ou quebras de linha.
  let cleanHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');

  // 2. Regex para encontrar H2 e capturar o texto interno
  const regex = /<h2(.*?)>(.*?)<\/h2>/g;
  
  // Aplica a lógica de IDs nos H2 sobre o HTML já limpo
  const modifiedHtml = cleanHtml.replace(regex, (match, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    const id = cleanText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({ id, text: cleanText });

    return `<h2 id="${id}"${attrs}>${text}</h2>`;
  });

  return { modifiedHtml, headings };
}

/**
 * 2. Quebra o HTML em partes e injeta componentes React (TOC Mobile, CTA, Ads)
 */
export function renderPostWithInjections(
  html: string, 
  injections: {
    TocComponent: React.ReactNode;
    ServiceComponent: React.ReactNode;
    AdSenseComponent: React.ReactNode;
  }
) {
  // Separa o HTML por parágrafos para podermos injetar entre eles
  // O delimitador é o fechamento de parágrafo </p>
  const parts = html.split('</p>');
  const contentElements: React.ReactNode[] = [];
  const totalParts = parts.length;

  // Lógica de Posição (Hardcoded conforme estratégia)
  const INSERT_TOC_AFTER = 0; // Logo após o primeiro parágrafo (Lead)
  const INSERT_SERVICE_AFTER = 2; // Após o 3º parágrafo
  const INSERT_ADS_AFTER = Math.floor(totalParts / 2); // No meio exato do texto

  parts.forEach((part, index) => {
    // Se for o último pedaço vazio (split artifact), ignora
    if (index === totalParts - 1 && part.trim() === '') return;

    // Adiciona o fechamento </p> que o split removeu
    const partHtml = part + '</p>';
    
    // Adiciona o bloco de texto atual
    contentElements.push(
      <div key={`part-${index}`} dangerouslySetInnerHTML={{ __html: partHtml }} />
    );

    // --- INJEÇÕES ---

    // 1. TOC Mobile (Apenas Mobile via CSS do componente)
    if (index === INSERT_TOC_AFTER) {
      contentElements.push(<div key="inject-toc">{injections.TocComponent}</div>);
    }

    // 2. CTA Serviços (Mobile e Desktop, mas aqui injetamos no fluxo do texto para Mobile)
    // Usamos uma div wrapper para ocultar no Desktop se quisermos que apareça SÓ no mobile,
    // mas sua regra dizia "Visualizar no meio do texto". 
    // Vamos adicionar uma classe helper se precisar esconder no desktop, 
    // mas o ServiceCallout é útil no desktop também se o artigo for longo.
    // Pelo protótipo, vamos deixar visível sempre que injetado aqui ou controlar via CSS.
    if (index === INSERT_SERVICE_AFTER) {
      contentElements.push(
        <div key="inject-service" className="my-8 md:hidden"> 
           {/* md:hidden garante que essa injeção só aparece no mobile, 
               pois no desktop já temos na sidebar */}
           {injections.ServiceComponent}
        </div>
      );
    }

    // 3. AdSense (Meio do texto)
    if (index === INSERT_ADS_AFTER) {
      contentElements.push(
        <div key="inject-ads" className="my-8">
          {injections.AdSenseComponent}
        </div>
      );
    }
  });

  return contentElements;
}
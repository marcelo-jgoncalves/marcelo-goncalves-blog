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
 * (USADO EM page.tsx)
 */
export const processPostContent = (html: string): ProcessedPost => {
  const headings: Heading[] = [];
  
  // LIMPEZA DE TÍTULO 
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
};

/**
 * 2. Quebra o HTML em partes e injeta componentes React (CTA, Ads)
 */
export function renderPostWithInjections(
  html: string, 
  injections: {
    // REMOVIDO: TocComponent não é mais injetado aqui.
    ServiceComponent: React.ReactNode;
    AdSenseComponent: React.ReactNode;
  }
) {
  // --- PASSO 1: LIMPEZA FINAL DO CONTEÚDO BRUTO (Corrige Hydration Failure) ---
  // Remove tags globais de fechamento (como </body>, </html>, </article>)
  let cleanedHtml = html.replace(/<\/?(?:html|body|article)>/gi, '');
  
  // Separa o HTML por parágrafos
  const parts = cleanedHtml.split('</p>');
  const contentElements: React.ReactNode[] = [];
  const totalParts = parts.length;

  // Lógica de Posição (Hardcoded conforme estratégia)
  // REMOVIDO: const INSERT_TOC_AFTER = 0; 
  const INSERT_SERVICE_AFTER = 2; 
  const INSERT_ADS_AFTER = Math.floor(totalParts / 2); 

  parts.forEach((part, index) => {
    
    let partHtml = part.trim();

    // Adiciona o fechamento </p> apenas se não for o último elemento
    if (index < totalParts - 1) {
        partHtml += '</p>';
    }
    
    // Se o bloco estiver vazio após a limpeza, ignora.
    if (!partHtml) return;

    // Adiciona o bloco de texto atual
    contentElements.push(
      <div key={`part-${index}`} dangerouslySetInnerHTML={{ __html: partHtml }} />
    );

    // --- INJEÇÕES ---

    // REMOVIDO: Bloco if (index === INSERT_TOC_AFTER)

    // 1. CTA Serviços (Mobile Only)
    if (index === INSERT_SERVICE_AFTER) {
      contentElements.push(
        <div key="inject-service" className="mobile-only-injection"> 
           {injections.ServiceComponent}
        </div>
      );
    }
    
    // 2. AdSense (Meio do texto)
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
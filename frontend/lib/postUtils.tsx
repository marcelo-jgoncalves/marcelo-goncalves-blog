import { createHighlighter } from 'shiki';
import * as cheerio from 'cheerio';

export interface Heading {
  id: string;
  text: string;
}

export interface ProcessedPost {
  contentHtml: string;
  headings: Heading[];
}

/**
 * Pipeline Sênior de Processamento de Post (Híbrido: Shiki + Cheerio)
 * 1. Processa Syntax Highlighting (Shiki) na string bruta.
 * 2. Processa Estrutura e Anúncios (Cheerio) no DOM.
 * Isso garante Highlighting bonito E HTML estruturalmente válido.
 */
export async function processFullPostContent(html: string): Promise<ProcessedPost> {
  const headings: Heading[] = [];

  // --- FASE 1: Syntax Highlighting (String Manipulation) ---
  
  // Inicializa o Shiki com os temas e linguagens necessárias
  const highlighter = await createHighlighter({
    themes: ['dark-plus'],
    langs: ['terraform', 'javascript', 'bash', 'json', 'yaml', 'python', 'typescript', 'go', 'sql', 'docker', 'css', 'html']
  });

  // Limpeza básica inicial (Remove H1 redundante se existir no corpo)
  let preProcessedHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '').trim();

  // Regex para encontrar blocos de código vindos do Tiptap
  const codeBlockRegex = /<pre><code class="language-([^">]+)">([\s\S]*?)<\/code><\/pre>/g;
  
  // Substitui cada bloco de código pela versão colorida do Shiki
  const matches = Array.from(preProcessedHtml.matchAll(codeBlockRegex));

  for (const match of matches) {
    const [fullMatch, lang, code] = match;
    
    // Decodifica entidades HTML básicas para que o Shiki leia o código corretamente
    // Ex: &lt; div &gt; vira < div > antes de ser processado
    const rawCode = code
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    try {
      const highlighted = highlighter.codeToHtml(rawCode, { lang, theme: 'dark-plus' });
      preProcessedHtml = preProcessedHtml.replace(fullMatch, highlighted);
    } catch (e) {
      console.error(`Erro Shiki no bloco ${lang}:`, e);
      // Se der erro, mantém o original
    }
  }

  // --- FASE 2: Sanitização e Injeção (DOM Manipulation) ---

  // Carrega o HTML (já com código colorido) no Cheerio.
  // xmlMode: false permite que o Cheerio feche tags abertas automaticamente (Auto-fix).
  // decodeEntities: false impede que ele estrague caracteres especiais dentro do código.
 const $ = cheerio.load(preProcessedHtml, { 
    xmlMode: false 
  });

  // Extração de Headings (TOC) via DOM
  $('h2').each((_, elem) => {
    const $el = $(elem);
    const text = $el.text();
    // Gera ID amigável para URL (slugify)
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    $el.attr('id', id); // Injeta o ID no HTML
    headings.push({ id, text });
  });

  // Injeção Inteligente de Anúncios
  const $body = $('body');
  const directChildren = $body.children(); // Apenas filhos diretos para manter a estrutura
  const totalChildren = directChildren.length;

  // Configuração dos pontos de injeção
  const TARGET_SERVICE_INDEX = 2; // Após o 3º elemento
  const TARGET_ADS_INDEX = Math.floor(totalChildren / 2); // Meio do post

  let serviceInjected = false;
  let adsInjected = false;

  directChildren.each((index, element) => {
    // Não injeta após o último elemento
    if (index >= totalChildren - 1) return;

    const $current = $(element);
    
    // Guardrails: Não injetar após títulos ou imagens para não quebrar fluxo de leitura
    const isHeading = $current.is('h2, h3, h4, h5, h6');
    const isImage = $current.is('figure, img') || $current.find('img').length > 0;

    // Injeção do Callout de Serviços
    if (!serviceInjected && index >= TARGET_SERVICE_INDEX && !isHeading && !isImage) {
      $current.after('\n<div id="inject-service-placeholder"></div>\n');
      serviceInjected = true;
      return; // Impede injetar ads no mesmo lugar
    }

    // Injeção do AdSense
    if (!adsInjected && index >= TARGET_ADS_INDEX && !isHeading && !isImage) {
      $current.after('\n<div id="inject-ads-placeholder"></div>\n');
      adsInjected = true;
    }
  });

  // Retorna o HTML final limpo e estruturado
  return {
    contentHtml: $('body').html() || '',
    headings
  };
}
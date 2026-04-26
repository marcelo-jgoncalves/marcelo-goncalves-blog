import { createHighlighter, type Highlighter } from 'shiki';

export interface Heading {
  id: string;
  text: string;
}

export interface ProcessedPost {
  contentHtml: string;
  headings: Heading[];
}

let highlighterInstance: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['dark-plus'],
      langs: ['terraform', 'javascript', 'bash', 'json', 'yaml', 'python'],
    });
  }
  return highlighterInstance;
}

export async function processFullPostContent(html: string): Promise<ProcessedPost> {
  const headings: Heading[] = [];

  const highlighter = await getHighlighter();

  // 2. Limpeza de H1 (SEO) e Normalização
  let processedHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '').trim();

  // 3. Processamento de Blocos de Código (Syntax Highlighting)
  const codeBlockRegex = /<pre><code class="language-([^">]+)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = Array.from(processedHtml.matchAll(codeBlockRegex));

  for (const match of matches) {
    const [fullMatch, lang, code] = match;
    // Decodifica entidades HTML básicas para o Shiki processar o código puro
    const rawCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    try {
      const highlighted = highlighter.codeToHtml(rawCode, {
        lang,
        theme: 'dark-plus'
      });
      processedHtml = processedHtml.replace(fullMatch, highlighted);
    } catch (e) {
      console.error(`Erro Shiki na linguagem ${lang}:`, e);
    }
  }

  // 4. Processamento de H2 para o TOC (Sumário)
  const h2Regex = /<h2(.*?)>(.*?)<\/h2>/g;
  processedHtml = processedHtml.replace(h2Regex, (match, attrs, text) => {
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

  // 5. Injeção de Anúncios e Serviços (Sem quebrar a string)
  // Encontramos os pontos de fechamento </p> para injetar
  const pCloseTag = '</p>';
  const pParts = processedHtml.split(pCloseTag);
  
  if (pParts.length > 3) {
    const INSERT_SERVICE_AFTER = 2; // Após 3º parágrafo (index 2)
    const INSERT_ADS_AFTER = Math.floor(pParts.length / 2);

    // Injeção de Marcadores que serão substituídos no page.tsx por componentes Reais
    // Isso evita o erro de passar JSX para dentro de strings
    pParts[INSERT_SERVICE_AFTER] += `\n<div id="inject-service-placeholder"></div>\n`;
    pParts[INSERT_ADS_AFTER] += `\n<div id="inject-ads-placeholder"></div>\n`;
  }

  processedHtml = pParts.join(pCloseTag);

  return {
    contentHtml: processedHtml,
    headings
  };
}
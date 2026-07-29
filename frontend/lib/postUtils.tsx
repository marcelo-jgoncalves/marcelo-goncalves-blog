
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

// Imagens inline antigas foram salvas com a URL "base" (sem sufixo de variante),
// que nunca existe no bucket de assets — só -480/-768/-1280 existem. Normaliza
// para a variante desktop (-1280), igual ao que o admin grava em uploads novos.
const MEDIA_IMG_RE = /^(https?:\/\/[^"'?]*\/media\/[^"'?]+?)(-(?:480|768|1280))?\.(avif|webp|jpe?g|png|gif)(\?[^"']*)?$/i;

export function normalizeMediaImageSrc(src: string): string {
  const match = src.match(MEDIA_IMG_RE);
  if (!match) return src;
  const [, base, sizeSuffix, ext, query = ''] = match;
  if (sizeSuffix) return src;
  return `${base}-1280.${ext}${query}`;
}

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
    } catch {
      // Mantém o bloco original se o Shiki não suportar a linguagem
    }
  }

 const $ = cheerio.load(preProcessedHtml, {
    xmlMode: false
  });

  // Corrige <img src> de imagens inline salvas com URL "base" sem variante
  $('img').each((_, elem) => {
    const $el = $(elem);
    const src = $el.attr('src');
    if (src) $el.attr('src', normalizeMediaImageSrc(src));
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

  // Tiptap às vezes envolve o conteúdo em múltiplos <div> aninhados.
  // Descemos até encontrar um container com mais de 1 filho.
  let $container = $body;
  let depth = 0;
  while (depth < 5) {
    const children = $container.children();
    if (children.length !== 1 || !children.first().is('div, article, section, main')) break;
    $container = children.first() as unknown as typeof $body;
    depth++;
  }

  const directChildren = $container.children();
  const totalChildren = directChildren.length;

  // Injeção do AdSense no meio do post
  const TARGET_ADS_INDEX = Math.floor(totalChildren / 2);
  let adsInjected = false;

  directChildren.each((index, element) => {
    if (index >= totalChildren - 1) return;

    const $current = $(element);
    const isHeading = $current.is('h2, h3, h4, h5, h6');
    const isImage = $current.is('figure, img') || $current.find('img').length > 0;

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
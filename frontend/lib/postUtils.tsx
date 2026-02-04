// frontend/lib/postUtils.tsx

import { createHighlighter } from 'shiki';

export interface Heading {
  id: string;
  text: string;
}

export interface ProcessedPost {
  contentHtml: string;
  headings: Heading[];
}

/**
 * Pipeline Sênior de Processamento de Post
 * Resolve: Syntax Highlighting, TOC, e Injeções BLINDADAS contra quebra de listas.
 */
export async function processFullPostContent(html: string): Promise<ProcessedPost> {
  const headings: Heading[] = [];

  // 1. Inicializa o Shiki
  const highlighter = await createHighlighter({
    themes: ['dark-plus'],
    langs: ['terraform', 'javascript', 'bash', 'json', 'yaml', 'python']
  });

  // 2. Limpeza básica
  let processedHtml = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '').trim();

  // 3. Syntax Highlighting
  const codeBlockRegex = /<pre><code class="language-([^">]+)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = Array.from(processedHtml.matchAll(codeBlockRegex));

  for (const match of matches) {
    const [fullMatch, lang, code] = match;
    const rawCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    try {
      const highlighted = highlighter.codeToHtml(rawCode, { lang, theme: 'dark-plus' });
      processedHtml = processedHtml.replace(fullMatch, highlighted);
    } catch (e) {
      console.error(`Erro Shiki:`, e);
    }
  }

  // 4. Geração do TOC
  const h2Regex = /<h2(.*?)>(.*?)<\/h2>/g;
  processedHtml = processedHtml.replace(h2Regex, (match, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '');
    const id = cleanText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text: cleanText });
    return `<h2 id="${id}"${attrs}>${text}</h2>`;
  });

  // 5. Injeção Inteligente (Correção do Problema de Listas)
  const pCloseTag = '</p>';
  const parts = processedHtml.split(pCloseTag);

  // Se o texto for muito curto, não injeta nada para não poluir
  if (parts.length <= 3) {
    return { contentHtml: processedHtml, headings };
  }

  // Definição dos pontos de injeção aproximados
  const TARGET_SERVICE_INDEX = 2; // Tenta injetar após o 3º pedaço
  const TARGET_ADS_INDEX = Math.floor(parts.length / 2); // Meio do post

  let finalHtml = '';
  let serviceInjected = false;
  let adsInjected = false;

  for (let i = 0; i < parts.length; i++) {
    const currentPart = parts[i];
    // Olha para o próximo pedaço para entender o contexto
    const nextPart = parts[i + 1]; 
    
    finalHtml += currentPart;

    // Se não é o último pedaço, precisamos recolocar o </p> que o split tirou
    if (i < parts.length - 1) {
      finalHtml += pCloseTag;
    }

    // Lógica de Segurança ("Guardrail"):
    // Só injetamos SE o próximo pedaço NÃO começar com fechamento de containers.
    // Se começar com </li>, </blockquote> ou </div>, significa que estamos DENTRO de uma estrutura.
    let isSafeToInject = true;
    
    if (nextPart) {
      const trimmedNext = nextPart.trim();
      if (
        trimmedNext.startsWith('</li>') || 
        trimmedNext.startsWith('</blockquote>') || 
        trimmedNext.startsWith('</div>') || // Callouts
        trimmedNext.startsWith('<figcaption')
      ) {
        isSafeToInject = false;
      }
    }

    // Tenta injetar SERVIÇOS se chegamos no índice ou passamos dele (pending)
    if (isSafeToInject && !serviceInjected && i >= TARGET_SERVICE_INDEX) {
      finalHtml += `\n<div id="inject-service-placeholder"></div>\n`;
      serviceInjected = true;
      // Impede que injete o Ad logo em seguida no mesmo buraco
      continue; 
    }

    // Tenta injetar ADS se chegamos no meio ou passamos dele (pending)
    if (isSafeToInject && !adsInjected && i >= TARGET_ADS_INDEX) {
      finalHtml += `\n<div id="inject-ads-placeholder"></div>\n`;
      adsInjected = true;
    }
  }

  return {
    contentHtml: finalHtml,
    headings
  };
}
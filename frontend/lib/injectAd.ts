// frontend/lib/injectAd.ts

/**
 * Injeta um placeholder de anúncio no meio do conteúdo HTML de uma postagem.
 * * O objetivo é usar classes CSS definidas globalmente para estilização,
 * garantindo boas práticas (separação de responsabilidades) e prevenção de CLS.
 * * @param htmlContent O conteúdo HTML completo da postagem.
 * @returns O conteúdo HTML com o placeholder de anúncio injetado.
 */
export function injectAdInContent(htmlContent: string): string {
  
  // Usamos as novas classes definidas no globals.css para evitar CSS inline:
  // - .ad-injected-wrapper: Centraliza o bloco e aplica margens (margin: 40px auto;)
  // - .adsense-placeholder-box: Garante o tamanho do placeholder (336x280) para prevenção de CLS
  const AD_PLACEHOLDER = `
    <div class="ad-injected-wrapper">
      <div class="adsense-placeholder-box">
        [ADSENSE IN-ARTICLE]
      </div>
    </div>
  `;
  
  // Mínimo de parágrafos para justificar a injeção
  const MIN_PARAGRAPHS = 4;

  if (!htmlContent) return '';

  // Divide o conteúdo baseando-se no fechamento de parágrafo </p>
  const parts = htmlContent.split('</p>');

  if (parts.length < MIN_PARAGRAPHS) {
    return htmlContent;
  }

  // Calcula o índice do meio
  const middleIndex = Math.floor(parts.length / 2);

  // Reconstrói o HTML:
  // 1. Pega a primeira metade
  // 2. Junta com </p> e adiciona um </p> final para o último item da metade
  const firstHalf = parts.slice(0, middleIndex).join('</p>') + '</p>';
  
  // 3. Pega a segunda metade
  const secondHalf = parts.slice(middleIndex).join('</p>');
  
  // 4. Retorna: Primeira Metade + Anúncio + Segunda Metade
  return firstHalf + AD_PLACEHOLDER + secondHalf;
}
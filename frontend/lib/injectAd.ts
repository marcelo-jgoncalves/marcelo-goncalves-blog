// frontend/lib/injectAd.ts

export function injectAdInContent(htmlContent: string): string {
  // Configuração do Bloco de Anúncio
  // Usamos as mesmas classes do globals.css para consistência
  const AD_PLACEHOLDER = `
    <div class="ad-wrapper-in-article" style="margin: 40px auto; display: flex; justify-content: center; clear: both; width: 100%;">
      <div class="adsense-placeholder-box">
        [ADSENSE IN-ARTICLE]
      </div>
    </div>
  `;
  
  // Mínimo de parágrafos para justificar a injeção (evita anúncios em textos muito curtos)
  const MIN_PARAGRAPHS = 4;

  // Se o conteúdo for vazio ou nulo, retorna vazio
  if (!htmlContent) return '';

  // Divide o conteúdo baseando-se no fechamento de parágrafo </p>
  const parts = htmlContent.split('</p>');

  // Se tiver poucos parágrafos, retorna o texto original sem tocar
  if (parts.length < MIN_PARAGRAPHS) {
    return htmlContent;
  }

  // Calcula o índice do meio
  const middleIndex = Math.floor(parts.length / 2);

  // Reconstrói o HTML:
  // 1. Pega a primeira metade
  // 2. Junta com </p> (pois o split removeu) e adiciona um </p> final para o último item da metade
  const firstHalf = parts.slice(0, middleIndex).join('</p>') + '</p>';
  
  // 3. Pega a segunda metade
  const secondHalf = parts.slice(middleIndex).join('</p>');
  
  // 4. Retorna: Primeira Metade + Anúncio + Segunda Metade
  return firstHalf + AD_PLACEHOLDER + secondHalf;
}
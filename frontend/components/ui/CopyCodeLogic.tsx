/**frontend/components/ui/CopyCodeLogic.tsx */
'use client';

import { useEffect } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

// Manipulação de DOM puro (fora da árvore React) — não dá pra usar
// <FontAwesomeIcon>. icon().html é a API vanilla-JS oficial do
// fontawesome-svg-core pra gerar a mesma <svg> em string HTML.
const CHECK_ICON_HTML = icon(faCheck).html.join('');
const COPY_ICON_HTML = icon(faCopy).html.join('');

/**
 * Componente silencioso que injeta botões de cópia nos blocos de código (Shiki).
 * Mantém a paridade visual com o protótipo v1.9.
 */
export default function CopyCodeLogic() {
  useEffect(() => {
    // Região aria-live única, compartilhada por todos os botões de cópia,
    // pra anunciar o status pra leitores de tela mesmo sem foco visual.
    let liveRegion = document.getElementById('copy-code-status');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'copy-code-status';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const copyToClipboard = async (text: string, button: HTMLButtonElement) => {
      try {
        // Limpamos possíveis espaços extras no início/fim do código ao copiar
        await navigator.clipboard.writeText(text.trim());

        const originalInner = button.innerHTML;
        // Feedback visual: Muda para ícone de check (estilizado via classe .copied no CSS)
        button.innerHTML = CHECK_ICON_HTML;
        button.classList.add('copied');
        button.setAttribute('aria-label', 'Código copiado');
        if (liveRegion) liveRegion.textContent = 'Código copiado';

        setTimeout(() => {
          button.innerHTML = originalInner;
          button.classList.remove('copied');
          button.setAttribute('aria-label', 'Copiar código');
        }, 2000);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    };

    // O Shiki gera elementos <pre class="shiki ...">
    const codeBlocks = document.querySelectorAll('pre.shiki');

    codeBlocks.forEach((pre) => {
      // Previne duplicação durante re-renderizações do React
      if (pre.querySelector('.copy-code-btn')) return;

      // Criação do botão seguindo o design do protótipo
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.setAttribute('aria-label', 'Copiar código');
      // Ícone inicial: Cópia (Regular)
      button.innerHTML = COPY_ICON_HTML;

      // Garante que o container tenha posição relativa para o botão absoluto
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(button);

      button.addEventListener('click', () => {
        // Capturamos o texto do <code> interno para ignorar os spans de cores
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          copyToClipboard(codeElement.innerText, button);
        }
      });
    });
  }, []);

  return null;
}
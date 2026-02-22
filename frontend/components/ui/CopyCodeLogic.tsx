/**frontend/components/ui/CopyCodeLogic.tsx */
'use client';

import { useEffect } from 'react';

/**
 * Componente silencioso que injeta botões de cópia nos blocos de código (Shiki).
 * Mantém a paridade visual com o protótipo v1.9.
 */
export default function CopyCodeLogic() {
  useEffect(() => {
    const copyToClipboard = async (text: string, button: HTMLButtonElement) => {
      try {
        // Limpamos possíveis espaços extras no início/fim do código ao copiar
        await navigator.clipboard.writeText(text.trim());
        
        const originalInner = button.innerHTML;
        // Feedback visual: Muda para ícone de check (estilizado via classe .copied no CSS)
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        setTimeout(() => {
          button.innerHTML = originalInner;
          button.classList.remove('copied');
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
      button.innerHTML = '<i class="far fa-copy"></i>';

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
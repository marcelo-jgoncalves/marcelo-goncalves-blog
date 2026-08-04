'use client';

import { useEffect } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

// Plain DOM manipulation (outside the React tree): can't use
// <FontAwesomeIcon> here. icon().html is fontawesome-svg-core's official
// vanilla JS API for generating the same <svg> as an HTML string.
const CHECK_ICON_HTML = icon(faCheck).html.join('');
const COPY_ICON_HTML = icon(faCopy).html.join('');

/**
 * Silent component that injects copy buttons into code blocks (Shiki).
 * Keeps visual parity with the prototype.
 */
export default function CopyCodeLogic() {
  useEffect(() => {
    // Single aria-live region, shared by all copy buttons, to announce
    // status to screen readers even without visual focus.
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
        // Trims stray leading/trailing whitespace from the code on copy
        await navigator.clipboard.writeText(text.trim());

        const originalInner = button.innerHTML;
        // Visual feedback: switches to the check icon (styled via the .copied CSS class)
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

    // Shiki generates <pre class="shiki ..."> elements
    const codeBlocks = document.querySelectorAll('pre.shiki');

    codeBlocks.forEach((pre) => {
      // Prevents duplication across React re-renders
      if (pre.querySelector('.copy-code-btn')) return;

      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.setAttribute('aria-label', 'Copiar código');
      button.innerHTML = COPY_ICON_HTML;

      // Ensures the container has relative positioning for the absolute button
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(button);

      button.addEventListener('click', () => {
        // Reads the inner <code> text to skip the syntax-highlight color spans
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          copyToClipboard(codeElement.innerText, button);
        }
      });
    });
  }, []);

  return null;
}
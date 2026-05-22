/* frontend/components/ui/CopyLinkButton.tsx */

'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Retorna o ícone ao normal após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar o link', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`share-buttons-btn share-buttons-copy ${copied ? 'copied' : ''}`}
      aria-label={copied ? "Link copiado com sucesso" : "Copiar link do artigo"}
      title={copied ? "Copiado!" : "Copiar Link"}
    >
      <i className={copied ? 'fas fa-check' : 'far fa-copy'} aria-hidden="true"></i>
    </button>
  );
}
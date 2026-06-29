/* frontend/components/ui/CopyLinkButton.tsx */

'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

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
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} aria-hidden="true" />
    </button>
  );
}
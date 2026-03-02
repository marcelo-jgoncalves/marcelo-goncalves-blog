// frontend/components/ui/ShareButtons.tsx

import React from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  
  // 🚀 ARQUITETURA LAMBDA/OPEN-NEXT: 
  // 1º Tenta a variável privada da Lambda (Run-time)
  // 2º Tenta a variável pública do Build (SSG)
  // 3º Fallback de segurança (Localhost)
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/post/${slug}`;
  
  // As URLs são geradas no servidor, garantindo SEO e carregamento instantâneo
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + postUrl)}`;

  return (
    /* 🚀 PERFORMANCE: Sem 'minHeight' inline. O CSS cuida de tudo. */
    <section className="share-section fade-in" aria-label="Botões de compartilhamento">
        <span className="share-label">Gostou? Compartilhe:</span>
        
        <div className="share-buttons-container">
          {/* Botão LinkedIn */}
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="share-btn btn-linkedin"
            aria-label="Compartilhar artigo no LinkedIn"
            title="Compartilhar no LinkedIn"
          >
            <i className="fab fa-linkedin-in" aria-hidden="true"></i>
          </a>

          {/* Botão WhatsApp */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="share-btn btn-whatsapp"
            aria-label="Compartilhar artigo no WhatsApp"
            title="Compartilhar no WhatsApp"
          >
            <i className="fab fa-whatsapp" aria-hidden="true"></i>
          </a>

          {/* Botão X (Twitter) */}
          <a 
            href={twitterUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="share-btn btn-twitter"
            aria-label="Compartilhar artigo no X (antigo Twitter)"
            title="Compartilhar no X"
          >
            <i className="fab fa-twitter" aria-hidden="true"></i>
          </a>
        </div>
    </section>
  );
}
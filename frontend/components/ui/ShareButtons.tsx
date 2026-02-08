'use client';

import React, { useEffect, useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fase 1: Renderização Server-Side e Hidratação Inicial
  // Retornamos um placeholder estático e seguro.
  // Mantemos a altura (52px) para evitar que a página "pule" quando os botões carregarem.
  if (!mounted) {
    return (
      <div 
        className="share-section-placeholder" 
        style={{ minHeight: '52px' }}
        aria-hidden="true"
      />
    );
  }

  // Fase 2: Cliente (Só executa após a hidratação estar completa e segura)
  const siteUrl = 'https://marcelogoncalves.tech'; 
  const postUrl = `${siteUrl}/post/${slug}`;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + postUrl)}`;

  return (
    <div 
      className="share-section fade-in"
      style={{ minHeight: '52px' }}
    >
        <span className="share-label">Gostou? Compartilhe:</span>
        
        {/* Botão LinkedIn */}
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn btn-linkedin"
          title="Compartilhar no LinkedIn"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>

        {/* Botão WhatsApp */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn btn-whatsapp"
          title="Compartilhar no WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>

        {/* Botão X (Twitter) */}
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-btn btn-twitter"
          title="Compartilhar no X"
        >
          <i className="fab fa-twitter"></i>
        </a>
    </div>
  );
}
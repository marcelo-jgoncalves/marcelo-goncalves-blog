/* components/ui/ShareButtons.tsx */
'use client';

import React, { useEffect, useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  // 2. ESTADO PARA CONTROLAR A RENDERIZAÇÃO
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Em produção, usaríamos a URL real do site
  const siteUrl = 'https://marcelogoncalves.tech'; 
  const postUrl = `${siteUrl}/post/${slug}`;
  
  // URLs de compartilhamento reais
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + postUrl)}`;

  // 3. PLACEHOLDER PARA EVITAR CLS (Layout Shift) E ERRO DE HIDRATAÇÃO
  // Se ainda não montou no cliente, mostramos uma div vazia com a mesma altura
  if (!mounted) {
    return (
      <div className="share-section" style={{ minHeight: '40px', visibility: 'hidden' }}>
        <span className="share-label">Gostou? Compartilhe:</span>
      </div>
    );
  }

  // 4. RENDERIZAÇÃO REAL (Só acontece no navegador)
  return (
    <div className="share-section">
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
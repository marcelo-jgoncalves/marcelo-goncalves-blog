import React from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  // Em produção, usaríamos a URL real do site
  const siteUrl = 'https://marcelogoncalves.tech'; 
  const postUrl = `${siteUrl}/post/${slug}`;
  
  // URLs de compartilhamento reais
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + postUrl)}`;

  return (
    <div className="share-section">
      <span className="share-label">Gostou? Compartilhe:</span>
      
      <a 
        href={linkedinUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="share-btn btn-linkedin" 
        title="Compartilhar no LinkedIn"
        aria-label="Compartilhar no LinkedIn"
      >
        <i className="fab fa-linkedin-in"></i>
      </a>
      
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="share-btn btn-whatsapp" 
        title="Compartilhar no WhatsApp"
        aria-label="Compartilhar no WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
      
      <a 
        href={twitterUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="share-btn btn-twitter" 
        title="Compartilhar no X (Twitter)"
        aria-label="Compartilhar no X (Twitter)"
      >
        <i className="fab fa-twitter"></i>
      </a>
    </div>
  );
}
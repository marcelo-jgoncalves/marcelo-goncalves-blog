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

  // Exemplo de como o JSX deve estar no seu componente ShareButtons.tsx
return (
  <div className="share-section">
      <span className="share-label">Gostou? Compartilhe:</span>
      
      {/* Botão LinkedIn */}
      <a 
        href={linkedinUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="share-btn btn-linkedin" // <--- CLASSES IMPORTANTES
        title="Compartilhar no LinkedIn"
      >
        <i className="fab fa-linkedin-in"></i>
      </a>

      {/* Botão WhatsApp */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="share-btn btn-whatsapp" // <--- CLASSES IMPORTANTES
        title="Compartilhar no WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Botão X (Twitter) */}
      <a 
        href={twitterUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="share-btn btn-twitter" // <--- CLASSES IMPORTANTES
        title="Compartilhar no X"
      >
        <i className="fab fa-twitter"></i>
      </a>
  </div>
);
}
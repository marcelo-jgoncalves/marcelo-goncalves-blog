/* frontend/components/ui/ShareButtons.tsx */

import './ShareButtons.css';
import CopyLinkButton from './CopyLinkButton';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/post/${slug}`;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + postUrl)}`;

  return (
    <section className="share-buttons-section fade-in" aria-label="Botões de compartilhamento">
        <span className="share-buttons-label">Gostou? Compartilhe:</span>
        
        <div className="share-buttons-group">
          {/* Botão LinkedIn */}
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="share-buttons-btn share-buttons-linkedin"
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
            className="share-buttons-btn share-buttons-whatsapp"
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
            className="share-buttons-btn share-buttons-twitter"
            aria-label="Compartilhar artigo no X (antigo Twitter)"
            title="Compartilhar no X"
          >
            <i className="fab fa-twitter" aria-hidden="true"></i>
          </a>

          {/* Novo Botão Interativo de Copiar Link */}
          <CopyLinkButton url={postUrl} />
        </div>
    </section>
  );
}
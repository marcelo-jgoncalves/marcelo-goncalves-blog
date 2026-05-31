'use client';

import { useState } from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import styles from './PostFooter.module.css';

export interface PostFooterProps {
  author: {
    name: string;
    bio: string;
    avatarInitials: string;
    profileUrl: string;
  };
  shareUrls: {
    linkedin: string;
    twitter: string;
    whatsapp: string;
    currentPageUrl: string;
  };
  showShare?: boolean;
  showAuthor?: boolean;
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export default function PostFooter({ author, shareUrls, showShare = true, showAuthor = true }: PostFooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrls.currentPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div className={styles.postFooter}>
      {/* SHARE STRIP */}
      {showShare && <div className={styles.share}>
        <Eyebrow text="Compartilhar" />
        <div className={styles.btns}>
          <a
            href={shareUrls.linkedin}
            className={styles.sbtn}
            aria-label="Compartilhar no LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
            LinkedIn
          </a>
          <a
            href={shareUrls.twitter}
            className={styles.sbtn}
            aria-label="Compartilhar no Twitter/X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-x-twitter"></i>
          </a>
          <a
            href={shareUrls.whatsapp}
            className={styles.sbtn}
            aria-label="Compartilhar no WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-whatsapp"></i>
            WhatsApp
          </a>
          <button
            className={`${styles.sbtn} ${styles.sbtnCopy}`}
            onClick={handleCopyLink}
            aria-label="Copiar link do artigo"
          >
            <i className="fas fa-link"></i>
            {copied ? 'Copiado' : 'Copiar link'}
          </button>
        </div>
      </div>}

      {/* AUTHOR SECTION */}
      {showAuthor && <section className={styles.author}>
        <div className={styles.avatar} aria-hidden="true">
          {author.avatarInitials}
        </div>
        <div className={styles.info}>
          <p>
            <strong className={styles.authorName}>{author.name}</strong>
            {' '}
            {stripHtmlTags(author.bio)}{' '}
            <a href={author.profileUrl} className={styles.profileLink}>
              Veja o perfil
            </a>
            .
          </p>
        </div>
        <div className={styles.actions}>
          <span className={styles.netLabel}>Acompanhe nas redes</span>
          <div className={styles.nets}>
            <a
              href={shareUrls.linkedin}
              className={styles.net}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#"
              className={styles.net}
              aria-label="Instagram"
              title="Em breve"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href={shareUrls.twitter}
              className={styles.net}
              aria-label="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-x-twitter"></i>
            </a>
          </div>
        </div>
      </section>}
    </div>
  );
}

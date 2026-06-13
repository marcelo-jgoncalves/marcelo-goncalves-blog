'use client';

import { useState } from 'react';
import styles from './ShareRail.module.css';

interface ShareRailProps {
  currentPageUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

export default function ShareRail({ currentPageUrl, linkedinUrl, twitterUrl }: ShareRailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPageUrl);
    } catch {
      // fallback silencioso
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <aside className={styles.share} data-audit="post-share" aria-label="Compartilhar artigo">
        <a href={linkedinUrl} className={styles.shareBtn} title="LinkedIn" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in" aria-hidden="true" />
        </a>
        <a href={twitterUrl} className={styles.shareBtn} title="X" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-x-twitter" aria-hidden="true" />
        </a>
        <button type="button" className={styles.shareBtn} title="Copiar link" onClick={handleCopy}>
          <i className={`fas ${copied ? 'fa-check' : 'fa-link'}`} aria-hidden="true" />
        </button>
      </aside>

      <div className={`${styles.toast} ${copied ? styles.show : ''}`} role="status" aria-live="polite">
        <span className={styles.toastCk}>✓</span> Link copiado
      </div>
    </>
  );
}

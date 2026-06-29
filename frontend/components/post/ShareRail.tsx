'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLink } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
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
          <FontAwesomeIcon icon={faLinkedinIn} aria-hidden="true" />
        </a>
        <a href={twitterUrl} className={styles.shareBtn} title="X" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
        </a>
        <button type="button" className={styles.shareBtn} title="Copiar link" onClick={handleCopy}>
          <FontAwesomeIcon icon={copied ? faCheck : faLink} aria-hidden="true" />
        </button>
      </aside>

      <div className={`${styles.toast} ${copied ? styles.show : ''}`} role="status" aria-live="polite">
        <span className={styles.toastCk}>✓</span> Link copiado
      </div>
    </>
  );
}

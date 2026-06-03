'use client';

import { useState, useEffect } from 'react';
import styles from './ShareRail.module.css';

interface ShareRailProps {
  currentPageUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  title: string;
}

export default function ShareRail({ currentPageUrl, linkedinUrl, twitterUrl, title }: ShareRailProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // fallback silencioso
    }
  };

  return (
    <nav
      className={`${styles.shareRail} ${visible ? styles.visible : ''}`}
      aria-label="Compartilhar artigo"
    >
      <span className={styles.cap}>Compartilhar</span>
      <div className={styles.stem} aria-hidden="true" />

      <a
        href={linkedinUrl}
        className={`${styles.rbtn} ${styles.linkedin}`}
        aria-label="Compartilhar no LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-linkedin-in" aria-hidden="true" />
        <span className={styles.tip}>LinkedIn</span>
      </a>

      <div className={styles.rsep} aria-hidden="true" />

      <a
        href={twitterUrl}
        className={`${styles.rbtn} ${styles.x}`}
        aria-label="Compartilhar no X (Twitter)"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-x-twitter" aria-hidden="true" />
        <span className={styles.tip}>X (Twitter)</span>
      </a>

      <div className={styles.rsep} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.rbtn} ${styles.copy} ${copied ? styles.copied : ''}`}
        aria-label="Copiar link do artigo"
        onClick={handleCopy}
      >
        <i className={`fas ${copied ? 'fa-check' : 'fa-link'}`} aria-hidden="true" />
        <span className={styles.tip}>{copied ? 'Copiado!' : 'Copiar link'}</span>
      </button>
    </nav>
  );
}

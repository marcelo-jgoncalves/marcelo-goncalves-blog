'use client';

import { useState } from 'react';
import { SITE_URL } from '@/lib/config';
import './ShareWidget.css';

interface ShareWidgetProps {
  title: string;
  slug: string;
}

export default function ShareWidget({ title, slug }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}/post/${slug}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="share-widget" aria-label="Compartilhar artigo">
      <div className="share-widget__eyebrow">Compartilhar</div>

      <h3 className="share-widget__title">Gostou do nosso conteúdo?</h3>

      <p className="share-widget__description">
        Compartilhe com profissionais que trabalham com IA, cloud e automação.
      </p>

      <div className="share-widget__buttons">
        <a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="share-widget__btn"
          aria-label="Compartilhar no LinkedIn"
        >
          <i className="fab fa-linkedin-in" aria-hidden="true" />
        </a>

        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className="share-widget__btn"
          aria-label="Compartilhar no X"
        >
          <i className="fab fa-x-twitter" aria-hidden="true" />
        </a>

        <button
          onClick={handleCopy}
          className={`share-widget__btn share-widget__btn--copy${copied ? ' share-widget__btn--copied' : ''}`}
          aria-label={copied ? 'Link copiado!' : 'Copiar link'}
        >
          <i className={copied ? 'fas fa-check' : 'far fa-copy'} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

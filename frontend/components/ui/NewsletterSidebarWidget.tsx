'use client';

import { useState } from 'react';
import Link from 'next/link';
import './NewsletterSidebarWidget.css';

export default function NewsletterSidebarWidget() {
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail]       = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accepted || !email) return;
    // TODO: integrar com provedor de e-mail
  }

  return (
    <section className="nl-widget" aria-labelledby="nl-widget-title">

      <span className="nl-widget__badge">Newsletter</span>

      <h3 id="nl-widget-title" className="nl-widget__title">
        Aprofunde-se em IA, AWS e DevOps.
      </h3>

      <p className="nl-widget__description">
        Receba análises exclusivas, arquitetura moderna e bastidores reais de engenharia.
      </p>

      <form className="nl-widget__form" onSubmit={handleSubmit} noValidate>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com.br"
          className="nl-widget__input"
          required
          aria-label="Endereço de e-mail"
        />

        <label className="nl-widget__label">
          <div className="nl-widget__checkbox-wrap">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="nl-widget__checkbox-input"
              aria-label="Aceitar política de privacidade"
            />
            <div className="nl-widget__checkbox-box" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor" className="nl-widget__check-icon">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <span>
            Concordo em receber comunicações por e-mail e autorizo o tratamento dos meus dados
            conforme a{' '}
            <Link href="/politica-de-privacidade" className="nl-widget__policy-link">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={!accepted}
          className={`nl-widget__btn${accepted ? ' nl-widget__btn--active' : ''}`}
        >
          Inscrever-se agora
        </button>

      </form>
    </section>
  );
}

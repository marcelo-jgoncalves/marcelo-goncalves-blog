'use client';

import { useState } from 'react';
import Link from 'next/link';
import './NewsletterCTA.css';

export default function NewsletterCTA() {
  const [email, setEmail]     = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email || status === 'loading') return;
    setStatus('loading');
    // TODO: integrar com endpoint de newsletter
    await new Promise((r) => setTimeout(r, 600));
    setStatus('success');
  };

  return (
    <section className="nl-cta">
      <div className="container">
        <div className="nl-cta__inner">

          {/* ── Coluna esquerda ── */}
          <div className="nl-cta__left">
            <div className="nl-cta__eyebrow">Newsletter semanal</div>
            <h2 className="nl-cta__title">
              Quer se aprofundar em IA,<br />Automação, Cloud Computing e <em>muito mais?</em>
            </h2>
            <p className="nl-cta__desc">
              Toda terça, uma análise sem hype sobre o que aconteceu na semana — e o que isso significa pra quem constrói com IA.
            </p>
            <div className="nl-cta__stats">
              <div className="nl-cta__stat"><b>2.4k</b> inscritos</div>
              <div className="nl-cta__stat"><b>42</b> edições</div>
              <div className="nl-cta__stat"><b>0</b> spam</div>
            </div>
          </div>

          {/* ── Coluna direita ── */}
          <div className="nl-cta__right">
            {status === 'success' ? (
              <div className="nl-cta__success" role="status" aria-live="polite">
                ✓ Obrigado! Você receberá a próxima edição na terça-feira.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="nl-cta__input-row">
                  <input
                    type="email"
                    className="nl-cta__input"
                    placeholder="seu@email.com"
                    aria-label="Endereço de e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="nl-cta__btn"
                    disabled={!consent || status === 'loading'}
                  >
                    {status === 'loading' ? 'Enviando…' : <>Inscrever-se <span className="nl-cta__arrow">→</span></>}
                  </button>
                </div>

                <label className="nl-cta__consent">
                  <input
                    type="checkbox"
                    className="nl-cta__checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span className="nl-cta__consent-label">
                    Quero receber a newsletter por e-mail e concordo com o tratamento dos meus dados, conforme a{' '}
                    <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
                  </span>
                </label>

                <div className="nl-cta__trust">
                  <span><span className="nl-cta__check">✓</span> Sem spam</span>
                  <span className="nl-cta__sep" />
                  <span><span className="nl-cta__check">✓</span> Cancele com 1 clique</span>
                  <span className="nl-cta__sep" />
                  <span>Toda terça, 9h</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

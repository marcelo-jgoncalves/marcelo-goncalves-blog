'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './NewsletterCTA.module.css';

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
    <section className={styles.nlCta} data-audit="newsletter-cta">
      <div className="container">
        <div className={styles.nlCtaInner}>

          {/* ── Coluna esquerda ── */}
          <div className={styles.nlCtaLeft}>
            <div className={styles.nlCtaEyebrow}>Newsletter semanal</div>
            <h2 className={styles.nlCtaTitle}>
              Quer se aprofundar em IA,<br />Automação, Cloud Computing e <em>muito mais?</em>
            </h2>
            <p className={styles.nlCtaDesc}>
              Toda terça, uma análise sem hype sobre o que aconteceu na semana — e o que isso significa pra quem constrói com IA.
            </p>
            <div className={styles.nlCtaStats}>
              <div className={styles.nlCtaStat}><b>2.4k</b> inscritos</div>
              <div className={styles.nlCtaStat}><b>42</b> edições</div>
              <div className={styles.nlCtaStat}><b>0</b> spam</div>
            </div>
          </div>

          {/* ── Coluna direita ── */}
          <div className={styles.nlCtaRight}>
            {status === 'success' ? (
              <div className={styles.nlCtaSuccess} role="status" aria-live="polite">
                ✓ Obrigado! Você receberá a próxima edição na terça-feira.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.nlCtaInputRow}>
                  <input
                    type="email"
                    className={styles.nlCtaInput}
                    placeholder="seu@email.com"
                    aria-label="Endereço de e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.nlCtaBtn}
                    disabled={!consent || status === 'loading'}
                  >
                    {status === 'loading' ? 'Enviando…' : <>Inscrever-se <span className={styles.nlCtaArrow}>→</span></>}
                  </button>
                </div>

                <label className={styles.nlCtaConsent}>
                  <input
                    type="checkbox"
                    className={styles.nlCtaCheckbox}
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span className={styles.nlCtaConsentLabel}>
                    Quero receber a newsletter por e-mail e concordo com o tratamento dos meus dados, conforme a{' '}
                    <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
                  </span>
                </label>

                <div className={styles.nlCtaTrust}>
                  <span><span className={styles.nlCtaCheck}>✓</span> Sem spam</span>
                  <span className={styles.nlCtaSep} />
                  <span><span className={styles.nlCtaCheck}>✓</span> Cancele com 1 clique</span>
                  <span className={styles.nlCtaSep} />
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

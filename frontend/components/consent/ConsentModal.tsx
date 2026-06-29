'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ConsentState, ConsentSettings } from '@/lib/consent';

interface ConsentModalProps {
  current: ConsentState | null;
  onSave: (settings: ConsentSettings) => void;
  onClose: () => void;
}

export default function ConsentModal({ current, onSave, onClose }: ConsentModalProps) {
  const [analytics, setAnalytics] = useState(current?.analytics ?? false);
  const [ads, setAds] = useState(current?.ads ?? false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Foca o primeiro elemento ao abrir
  useEffect(() => {
    firstFocusRef.current?.focus();
  }, []);

  // ESC fecha o modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus trap: mantém foco dentro do modal
  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <div
      className="cmp-overlay"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmp-modal-title"
        className="cmp-modal"
        onKeyDown={trapFocus}
      >
        <div className="cmp-modal__header">
          <h2 id="cmp-modal-title" className="cmp-modal__title">
            Preferências de Privacidade
          </h2>
          <button
            ref={firstFocusRef}
            className="cmp-modal__close"
            onClick={onClose}
            aria-label="Fechar preferências"
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          </button>
        </div>

        <div className="cmp-modal__body">
          <p className="cmp-modal__desc">
            Escolha quais categorias de cookies você aceita. Cookies essenciais são sempre
            ativos — são necessários para o funcionamento básico do site.
          </p>

          {/* Essential — sempre ativo */}
          <div className="cmp-row">
            <div className="cmp-row__info">
              <span className="cmp-row__label">
                Essenciais
                <span className="cmp-row__badge">Sempre ativo</span>
              </span>
              <p className="cmp-row__desc">
                Necessários para o funcionamento do site. Não podem ser desativados.
              </p>
            </div>
            <label className="cmp-toggle cmp-toggle--disabled" aria-label="Cookies essenciais (sempre ativo)">
              <input type="checkbox" checked readOnly disabled aria-checked="true" />
              <span className="cmp-toggle__track" />
            </label>
          </div>

          {/* Analytics */}
          <div className="cmp-row">
            <div className="cmp-row__info">
              <span className="cmp-row__label">Analytics</span>
              <p className="cmp-row__desc">
                Ajudam a entender como os visitantes interagem com o site. Dados coletados
                de forma anônima e agregada.
              </p>
            </div>
            <label className="cmp-toggle" aria-label="Cookies de analytics">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-checked={analytics}
              />
              <span className="cmp-toggle__track" />
            </label>
          </div>

          {/* Personalized Ads */}
          <div className="cmp-row">
            <div className="cmp-row__info">
              <span className="cmp-row__label">Anúncios Personalizados</span>
              <p className="cmp-row__desc">
                Permitem exibir anúncios relevantes com base nos seus interesses.
                Sem este consent, os anúncios exibidos serão contextuais (não personalizados).
              </p>
            </div>
            <label className="cmp-toggle" aria-label="Cookies de anúncios personalizados">
              <input
                type="checkbox"
                checked={ads}
                onChange={(e) => setAds(e.target.checked)}
                aria-checked={ads}
              />
              <span className="cmp-toggle__track" />
            </label>
          </div>
        </div>

        <div className="cmp-modal__footer">
          <button
            className="cmp-btn cmp-btn--save"
            onClick={() => onSave({ analytics, ads })}
            aria-label="Salvar preferências de cookies"
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ConsentState, ConsentSettings } from '@/lib/consent';

interface ConsentModalProps {
  current: ConsentState | null;
  onSave: (settings: ConsentSettings) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

export default function ConsentModal({ current, onSave, onAcceptAll, onRejectAll, onClose }: ConsentModalProps) {
  const [analytics, setAnalytics] = useState(current?.analytics ?? false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focuses the dialog on open (not the close button — better ergonomics)
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus trap: keeps focus inside the modal
  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, input, a[href], [tabindex]:not([tabindex="-1"])'
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
        tabIndex={-1}
        onKeyDown={trapFocus}
      >
        <div className="cmp-modal__header">
          <h2 id="cmp-modal-title" className="cmp-modal__title">
            Preferências de cookies
          </h2>
          <button
            className="cmp-modal__close"
            onClick={onClose}
            aria-label="Fechar preferências"
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          </button>
        </div>

        <div className="cmp-modal__body">
          <p className="cmp-modal__desc">
            Você pode controlar o uso de cookies analíticos neste site. Os recursos necessários
            permanecem ativos para registrar sua escolha e manter o funcionamento básico da
            plataforma.
          </p>

          {/* Necessários — sempre ativo */}
          <div className="cmp-row">
            <div className="cmp-row__info">
              <span className="cmp-row__label">
                Cookies necessários
                <span className="cmp-row__badge">Sempre ativo</span>
              </span>
              <p className="cmp-row__desc">
                Utilizados para registrar suas preferências de privacidade e permitir
                funcionalidades essenciais. Eles não são usados para publicidade.
              </p>
            </div>
            <label className="cmp-toggle cmp-toggle--disabled" aria-label="Cookies necessários (sempre ativo)">
              <input type="checkbox" checked readOnly disabled aria-checked="true" />
              <span className="cmp-toggle__track" />
            </label>
          </div>

          {/* Analíticos — opcional */}
          <div className="cmp-row">
            <div className="cmp-row__info">
              <span className="cmp-row__label">
                Cookies analíticos
                <span className="cmp-row__badge cmp-row__badge--optional">Opcionais</span>
              </span>
              <p className="cmp-row__desc">
                Com sua autorização, utilizamos o Google Analytics para produzir estatísticas
                sobre visitas, páginas acessadas, dispositivos e interações. Esses dados nos
                ajudam a melhorar o site e seus conteúdos.
              </p>
            </div>
            <label className="cmp-toggle" aria-label="Cookies analíticos (ativado ou desativado)">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span className="cmp-toggle__track" />
            </label>
          </div>
        </div>

        <div className="cmp-modal__footer">
          <button
            className="cmp-btn cmp-btn--save"
            onClick={() => onSave({ analytics, ads: false })}
            aria-label="Salvar preferências de cookies"
          >
            Salvar preferências
          </button>

          <div className="cmp-modal__quick-actions">
            <button
              className="cmp-btn cmp-btn--reject"
              onClick={onRejectAll}
              aria-label="Rejeitar cookies analíticos"
            >
              Rejeitar análise
            </button>
            <button
              className="cmp-btn cmp-btn--accept"
              onClick={onAcceptAll}
              aria-label="Aceitar cookies analíticos"
            >
              Aceitar análise
            </button>
          </div>

          <div className="cmp-modal__links">
            <a href="/politica-de-privacidade">Aviso de Privacidade</a>
            <a href="/politica-de-cookies">Política de Cookies</a>
          </div>
        </div>
      </div>
    </div>
  );
}

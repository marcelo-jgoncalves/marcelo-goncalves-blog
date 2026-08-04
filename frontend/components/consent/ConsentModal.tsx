'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { ConsentState, ConsentSettings } from '@/lib/consent';
import styles from './ConsentManager.module.css';

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

  // Focuses the dialog on open (not the close button: better ergonomics)
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
      className={styles.cmpOverlay}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmp-modal-title"
        className={styles.cmpModal}
        tabIndex={-1}
        onKeyDown={trapFocus}
      >
        <div className={styles.cmpModalHeader}>
          <h2 id="cmp-modal-title" className={styles.cmpModalTitle}>
            Preferências de cookies
          </h2>
          <button
            className={styles.cmpModalClose}
            onClick={onClose}
            aria-label="Fechar preferências"
          >
            <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.cmpModalBody}>
          <p className={styles.cmpModalDesc}>
            Você pode controlar o uso de cookies analíticos neste site. Os recursos necessários
            permanecem ativos para registrar sua escolha e manter o funcionamento básico da
            plataforma.
          </p>

          <div className={styles.cmpRow}>
            <div className={styles.cmpRowInfo}>
              <span className={styles.cmpRowLabel}>
                Cookies necessários
                <span className={styles.cmpRowBadge}>Sempre ativo</span>
              </span>
              <p className={styles.cmpRowDesc}>
                Utilizados para registrar suas preferências de privacidade e permitir
                funcionalidades essenciais. Eles não são usados para publicidade.
              </p>
            </div>
            <label className={`${styles.cmpToggle} ${styles.cmpToggleDisabled}`} aria-label="Cookies necessários (sempre ativo)">
              <input type="checkbox" checked readOnly disabled aria-checked="true" />
              <span className={styles.cmpToggleTrack} />
            </label>
          </div>

          <div className={styles.cmpRow}>
            <div className={styles.cmpRowInfo}>
              <span className={styles.cmpRowLabel}>
                Cookies analíticos
                <span className={`${styles.cmpRowBadge} ${styles.cmpRowBadgeOptional}`}>Opcionais</span>
              </span>
              <p className={styles.cmpRowDesc}>
                Com sua autorização, utilizamos o Google Analytics para produzir estatísticas
                sobre visitas, páginas acessadas, dispositivos e interações. Esses dados nos
                ajudam a melhorar o site e seus conteúdos.
              </p>
            </div>
            <label className={styles.cmpToggle} aria-label="Cookies analíticos (ativado ou desativado)">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span className={styles.cmpToggleTrack} />
            </label>
          </div>
        </div>

        <div className={styles.cmpModalFooter}>
          <button
            className={`${styles.cmpBtn} ${styles.cmpBtnSave}`}
            onClick={() => onSave({ analytics, ads: false })}
            aria-label="Salvar preferências de cookies"
          >
            Salvar preferências
          </button>

          <div className={styles.cmpModalQuickActions}>
            <button
              className={`${styles.cmpBtn} ${styles.cmpBtnReject}`}
              onClick={onRejectAll}
              aria-label="Rejeitar cookies analíticos"
            >
              Rejeitar análise
            </button>
            <button
              className={`${styles.cmpBtn} ${styles.cmpBtnAccept}`}
              onClick={onAcceptAll}
              aria-label="Aceitar cookies analíticos"
            >
              Aceitar análise
            </button>
          </div>

          <div className={styles.cmpModalLinks}>
            <a href="/politica-de-privacidade">Aviso de Privacidade</a>
            <a href="/politica-de-cookies">Política de Cookies</a>
          </div>
        </div>
      </div>
    </div>
  );
}

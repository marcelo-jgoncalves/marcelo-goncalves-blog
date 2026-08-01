'use client';

import styles from './ConsentManager.module.css';

export default function ConsentTrigger() {
  return (
    <button
      className={`${styles.cmpTrigger} cmp-trigger`}
      onClick={() => window.dispatchEvent(new CustomEvent('openConsentModal'))}
      aria-label="Abrir painel de gerenciamento de cookies"
    >
      Preferências de cookies
    </button>
  );
}

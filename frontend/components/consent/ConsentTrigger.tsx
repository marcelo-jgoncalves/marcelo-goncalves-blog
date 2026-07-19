'use client';

export default function ConsentTrigger() {
  return (
    <button
      className="cmp-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent('openConsentModal'))}
      aria-label="Abrir painel de gerenciamento de cookies"
    >
      Preferências de cookies
    </button>
  );
}

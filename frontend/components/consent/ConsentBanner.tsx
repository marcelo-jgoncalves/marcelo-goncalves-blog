'use client';

interface ConsentBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export default function ConsentBanner({ onAcceptAll, onRejectAll, onCustomize }: ConsentBannerProps) {
  return (
    <div
      className="cmp-banner"
      role="region"
      aria-label="Aviso de cookies e privacidade"
      aria-live="polite"
    >
      <div className="cmp-banner__inner">
        <p className="cmp-banner__text">
          Utilizamos cookies para melhorar sua experiência e, futuramente, exibir anúncios
          relevantes. Você pode aceitar todos, rejeitar os não essenciais ou personalizar suas
          preferências. Saiba mais em nossa{' '}
          <a href="/politica-de-cookies">Política de Cookies</a>.
        </p>

        <div className="cmp-banner__actions">
          <button
            className="cmp-btn cmp-btn--customize"
            onClick={onCustomize}
            aria-label="Personalizar preferências de cookies"
          >
            Personalizar
          </button>
          <button
            className="cmp-btn cmp-btn--reject"
            onClick={onRejectAll}
            aria-label="Rejeitar cookies não essenciais"
          >
            Rejeitar
          </button>
          <button
            className="cmp-btn cmp-btn--accept"
            onClick={onAcceptAll}
            aria-label="Aceitar todos os cookies"
          >
            Aceitar Tudo
          </button>
        </div>
      </div>
    </div>
  );
}

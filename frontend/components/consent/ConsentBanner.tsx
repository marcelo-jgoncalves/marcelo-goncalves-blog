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
        <div className="cmp-banner__copy">
          <p className="cmp-banner__title">Sua privacidade importa</p>
          <p className="cmp-banner__text">
            Utilizamos recursos necessários para o funcionamento do site e, com sua autorização,
            cookies do Google Analytics para entender como nossos conteúdos são utilizados e
            melhorar a experiência de navegação.
          </p>
        </div>

        <div className="cmp-banner__actions">
          <button
            className="cmp-btn cmp-btn--customize"
            onClick={onCustomize}
            aria-label="Ver detalhes das preferências de cookies"
          >
            Ver detalhes
          </button>
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
      </div>
    </div>
  );
}

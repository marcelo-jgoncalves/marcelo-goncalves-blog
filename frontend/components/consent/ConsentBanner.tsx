'use client';

import styles from './ConsentManager.module.css';

interface ConsentBannerProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export default function ConsentBanner({ onAcceptAll, onRejectAll, onCustomize }: ConsentBannerProps) {
  return (
    <div
      className={styles.cmpBanner}
      role="region"
      aria-label="Aviso de cookies e privacidade"
      aria-live="polite"
    >
      <div className={styles.cmpBannerInner}>
        <div className={styles.cmpBannerCopy}>
          <p className={styles.cmpBannerTitle}>Sua privacidade importa</p>
          <p className={styles.cmpBannerText}>
            Utilizamos recursos necessários para o funcionamento do site e, com sua autorização,
            cookies do Google Analytics para entender como nossos conteúdos são utilizados e
            melhorar a experiência de navegação.
          </p>
        </div>

        <div className={styles.cmpBannerActions}>
          <button
            className={`${styles.cmpBtn} ${styles.cmpBtnCustomize}`}
            onClick={onCustomize}
            aria-label="Ver detalhes das preferências de cookies"
          >
            Ver detalhes
          </button>
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
      </div>
    </div>
  );
}

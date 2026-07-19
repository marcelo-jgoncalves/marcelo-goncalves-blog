'use client';

import { useState, useEffect } from 'react';
import {
  readConsent,
  saveConsent,
  isConsentValid,
  applyConsent,
  type ConsentState,
  type ConsentSettings,
} from '@/lib/consent';
import ConsentBanner from './ConsentBanner';
import ConsentModal from './ConsentModal';
import './ConsentManager.css';

export default function ConsentManager() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hidratação única a partir do localStorage (indisponível no render do
    // servidor) — não é um anti-padrão de "estado derivado", é leitura de
    // um sistema externo síncrono que só existe no client, por isso roda
    // dentro do efeito e não no corpo do componente.
    const stored = readConsent();
    if (!stored || !isConsentValid(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    } else {
      setConsent(stored);
      applyConsent(stored);
    }

    if (typeof window !== 'undefined' && window.APP_ENV === 'dev') {
      console.log('[CONSENT INIT]', stored ?? 'no stored consent');
    }

    setReady(true);

    const openModal = () => setShowModal(true);
    window.addEventListener('openConsentModal', openModal);
    return () => window.removeEventListener('openConsentModal', openModal);
  }, []);

  const acceptAll = () => {
    // Só existe uma categoria opcional hoje (analítico) — ads fica reservado
    // para quando o AdSense for configurado (ver CLAUDE.md §10, item #5).
    const state = saveConsent({ analytics: true, ads: false });
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
  };

  const rejectAll = () => {
    const state = saveConsent({ analytics: false, ads: false });
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
  };

  const saveCustom = (settings: ConsentSettings) => {
    const state = saveConsent(settings);
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
  };

  if (!ready) return null;

  return (
    <>
      {showBanner && (
        <ConsentBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onCustomize={() => { setShowBanner(false); setShowModal(true); }}
        />
      )}
      {showModal && (
        <ConsentModal
          current={consent}
          onSave={saveCustom}
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onClose={() => {
            setShowModal(false);
            if (!consent) setShowBanner(true);
          }}
        />
      )}
    </>
  );
}

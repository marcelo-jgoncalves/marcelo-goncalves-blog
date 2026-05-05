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
    const stored = readConsent();
    if (!stored || !isConsentValid(stored)) {
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
    const state = saveConsent({ analytics: true, ads: true });
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
          onClose={() => {
            setShowModal(false);
            if (!consent) setShowBanner(true);
          }}
        />
      )}
    </>
  );
}

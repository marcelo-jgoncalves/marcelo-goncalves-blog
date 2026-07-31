'use client';

import { useState, useEffect, useRef } from 'react';
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
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openModal = () => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setShowModal(true);
  };

  const restoreFocus = () => {
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  };

  useEffect(() => {
    // One-time hydration from localStorage (unavailable during server
    // render) — this isn't a "derived state" anti-pattern, it's reading a
    // synchronous external system that only exists on the client, which is
    // why it runs inside the effect instead of the component body.
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

    window.addEventListener('openConsentModal', openModal);
    return () => window.removeEventListener('openConsentModal', openModal);
  }, []);

  const acceptAll = () => {
    // Only one optional category exists today (analytics) — ads is
    // reserved for when AdSense gets configured.
    const state = saveConsent({ analytics: true, ads: false });
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
    restoreFocus();
  };

  const rejectAll = () => {
    const state = saveConsent({ analytics: false, ads: false });
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
    restoreFocus();
  };

  const saveCustom = (settings: ConsentSettings) => {
    const state = saveConsent(settings);
    setConsent(state);
    applyConsent(state);
    setShowBanner(false);
    setShowModal(false);
    restoreFocus();
  };

  if (!ready) return null;

  return (
    <>
      {showBanner && (
        <ConsentBanner
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onCustomize={() => { setShowBanner(false); openModal(); }}
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
            restoreFocus();
          }}
        />
      )}
    </>
  );
}

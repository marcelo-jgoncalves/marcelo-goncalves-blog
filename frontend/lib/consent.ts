// frontend/lib/consent.ts

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    APP_ENV: 'dev' | 'prod';
  }
}

export const CONSENT_VERSION = 1;
export const STORAGE_KEY = 'cmp_consent_v1';

export interface ConsentState {
  essential: boolean;
  analytics: boolean;
  ads: boolean;
  timestamp: number;
  version: number;
}

export type ConsentSettings = Pick<ConsentState, 'analytics' | 'ads'>;

// ─── Storage ────────────────────────────────────────────────────────────────

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function saveConsent(settings: ConsentSettings): ConsentState {
  const state: ConsentState = {
    essential: true,
    analytics: settings.analytics,
    ads: settings.ads,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

// Invalida se a versão do schema mudou — mostra banner novamente
export function isConsentValid(state: ConsentState): boolean {
  return state.version === CONSENT_VERSION;
}

// ─── Script Loader ───────────────────────────────────────────────────────────

const loadedScripts = new Set<string>();

function loadScriptsByConsent(state: ConsentState): void {
  // AdSense — descomente e configure quando ADSENSE_CONFIGURED = true
  // Carrega mesmo sem consent: Consent Mode controla personalização
  // if (!loadedScripts.has('adsense')) {
  //   const s = document.createElement('script');
  //   s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  //   s.async = true;
  //   s.crossOrigin = 'anonymous';
  //   s.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
  //   document.head.appendChild(s);
  //   loadedScripts.add('adsense');
  // }

  // Google Analytics — apenas com consent analytics
  // if (state.analytics && !loadedScripts.has('analytics')) {
  //   const s = document.createElement('script');
  //   s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  //   s.async = true;
  //   document.head.appendChild(s);
  //   loadedScripts.add('analytics');
  // }

  if (window.APP_ENV === 'dev') {
    console.log('[SCRIPTS LOADED]', { loaded: [...loadedScripts], consent: state });
  }
}

// ─── Apply ───────────────────────────────────────────────────────────────────

export function applyConsent(state: ConsentState): void {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage:         state.ads       ? 'granted' : 'denied',
      ad_user_data:       state.ads       ? 'granted' : 'denied',
      ad_personalization: state.ads       ? 'granted' : 'denied',
      analytics_storage:  state.analytics ? 'granted' : 'denied',
    });
  }

  loadScriptsByConsent(state);

  if (window.APP_ENV === 'dev') {
    console.log('[CONSENT UPDATED]', state);
  }
}

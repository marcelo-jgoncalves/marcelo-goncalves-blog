/**
 * @jest-environment jsdom
 */
import {
  readConsent,
  saveConsent,
  isConsentValid,
  applyConsent,
  CONSENT_VERSION,
  STORAGE_KEY,
  type ConsentState,
} from '@/lib/consent';

beforeAll(() => {
  Object.defineProperty(window, 'APP_ENV', { value: 'prod', writable: true });
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ─── readConsent ─────────────────────────────────────────────────────────────

describe('readConsent', () => {
  it('retorna null quando localStorage está vazio', () => {
    expect(readConsent()).toBeNull();
  });

  it('retorna o estado armazenado quando válido', () => {
    const state: ConsentState = {
      essential: true,
      analytics: false,
      ads: true,
      timestamp: 1710000000,
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    expect(readConsent()).toEqual(state);
  });

  it('retorna null quando o JSON está corrompido', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    expect(readConsent()).toBeNull();
  });
});

// ─── saveConsent ─────────────────────────────────────────────────────────────

describe('saveConsent', () => {
  it('persiste no localStorage com a chave correta', () => {
    saveConsent({ analytics: true, ads: false });
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('sempre define essential: true independente dos settings', () => {
    const state = saveConsent({ analytics: false, ads: false });
    expect(state.essential).toBe(true);
  });

  it('persiste os valores de analytics e ads informados', () => {
    const state = saveConsent({ analytics: true, ads: false });
    expect(state.analytics).toBe(true);
    expect(state.ads).toBe(false);
  });

  it('define version igual a CONSENT_VERSION', () => {
    const state = saveConsent({ analytics: false, ads: false });
    expect(state.version).toBe(CONSENT_VERSION);
  });

  it('inclui timestamp numérico próximo a Date.now()', () => {
    const before = Date.now();
    const state = saveConsent({ analytics: false, ads: false });
    const after = Date.now();
    expect(state.timestamp).toBeGreaterThanOrEqual(before);
    expect(state.timestamp).toBeLessThanOrEqual(after);
  });

  it('o estado salvo pode ser relido do localStorage', () => {
    const saved = saveConsent({ analytics: true, ads: true });
    const read = readConsent();
    expect(read).toEqual(saved);
  });
});

// ─── isConsentValid ───────────────────────────────────────────────────────────

describe('isConsentValid', () => {
  it('retorna true quando version === CONSENT_VERSION', () => {
    const state: ConsentState = {
      essential: true, analytics: false, ads: false,
      timestamp: Date.now(), version: CONSENT_VERSION,
    };
    expect(isConsentValid(state)).toBe(true);
  });

  it('retorna false quando version difere — consent antigo é invalidado', () => {
    const outdated: ConsentState = {
      essential: true, analytics: true, ads: true,
      timestamp: Date.now(), version: CONSENT_VERSION - 1,
    };
    expect(isConsentValid(outdated)).toBe(false);
  });
});

// ─── applyConsent ─────────────────────────────────────────────────────────────

describe('applyConsent', () => {
  let gtag: jest.Mock;

  beforeEach(() => {
    gtag = jest.fn();
    window.gtag = gtag;
  });

  it('chama gtag com consent update ao ser invocado', () => {
    const state = saveConsent({ analytics: false, ads: false });
    applyConsent(state);
    expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.any(Object));
  });

  it('envia granted para todos os campos de ads quando ads = true', () => {
    const state = saveConsent({ analytics: false, ads: true });
    applyConsent(state);
    const payload = gtag.mock.calls[0][2] as Record<string, string>;
    expect(payload.ad_storage).toBe('granted');
    expect(payload.ad_user_data).toBe('granted');
    expect(payload.ad_personalization).toBe('granted');
  });

  it('envia denied para todos os campos de ads quando ads = false', () => {
    const state = saveConsent({ analytics: false, ads: false });
    applyConsent(state);
    const payload = gtag.mock.calls[0][2] as Record<string, string>;
    expect(payload.ad_storage).toBe('denied');
    expect(payload.ad_user_data).toBe('denied');
    expect(payload.ad_personalization).toBe('denied');
  });

  it('envia analytics_storage granted apenas quando analytics = true', () => {
    const stateOn = saveConsent({ analytics: true, ads: false });
    applyConsent(stateOn);
    expect((gtag.mock.calls[0][2] as Record<string, string>).analytics_storage).toBe('granted');

    gtag.mockClear();

    const stateOff = saveConsent({ analytics: false, ads: false });
    applyConsent(stateOff);
    expect((gtag.mock.calls[0][2] as Record<string, string>).analytics_storage).toBe('denied');
  });

  it('não lança exceção quando window.gtag não está definido', () => {
    // @ts-expect-error: simulates gtag being undefined
    delete window.gtag;
    const state = saveConsent({ analytics: false, ads: false });
    expect(() => applyConsent(state)).not.toThrow();
  });
});

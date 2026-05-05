# Plano de Implementação — Consent Management (CMP)
> Baseado em: `docs/consent-management.md`  
> Status: Em execução  
> Data: 2026-05-05

---

## Contexto do Projeto

- `ADSENSE_CONFIGURED = false` → AdSense desativado; infra de Consent Mode pronta para ativar
- Analytics não configurado → script loader preparado com stub comentado
- `SITE_URL.includes('cloudfront.net')` → flag de ambiente dev (padrão do projeto)
- Footer é Server Component → micro-cliente `ConsentTrigger` resolve o "Gerenciar Cookies"
- Next.js App Router com `<Script strategy="beforeInteractive">` suporta init pré-hidratação

---

## Arquitetura de Arquivos

```
frontend/
  lib/
    consent.ts                   ← types, read/write localStorage, version check, applyConsent
  components/consent/
    ConsentManager.tsx           ← orquestração: estado, handlers, event bus
    ConsentBanner.tsx            ← barra fixa no rodapé com 3 botões
    ConsentModal.tsx             ← modal de preferências com toggles + focus trap
    ConsentTrigger.tsx           ← micro-client para "Gerenciar Cookies" no Footer
    ConsentManager.css           ← todos os estilos, tokens do design system
  app/
    layout.tsx                   ← +Script beforeInteractive + <ConsentManager />
  components/layout/
    Footer.tsx                   ← +links legais + <ConsentTrigger />
```

---

## Passos de Execução

### Passo 1 — `lib/consent.ts`
- Tipo `ConsentState` com campos: `essential`, `analytics`, `ads`, `timestamp`, `version`
- `CONSENT_VERSION = 1` — incrementar invalida consents antigos
- `STORAGE_KEY = 'cmp_consent_v1'`
- `readConsent()` — lê localStorage, retorna null se ausente ou inválido
- `saveConsent(state)` — grava com timestamp e version
- `isConsentValid(state)` — verifica se version === CONSENT_VERSION
- `applyConsent(state)` — chama `gtag('consent', 'update', {...})` + script loader + dev logging
- `loadScriptsByConsent(state)` — Set de scripts já carregados, stubs para AdSense/Analytics

### Passo 2 — Script de init em `layout.tsx`
- `<Script id="consent-init" strategy="beforeInteractive">`
- Inicializa `window.dataLayer`, define `window.gtag`
- `gtag('consent', 'default', { ad_storage: 'denied', ... wait_for_update: 500 })`
- Define `window.APP_ENV` baseado em `window.location.hostname`
- Log `[CONSENT INIT]` se APP_ENV === 'dev'

### Passo 3 — `ConsentManager.tsx`
- `'use client'`
- Estado: `showBanner`, `showModal`, `consent: ConsentState | null`, `ready: boolean`
- `useEffect`: lê localStorage → showBanner se sem consent; aplica consent se existente
- Ouve evento `openConsentModal` (para Footer "Gerenciar Cookies")
- Handlers: `acceptAll()`, `rejectAll()`, `saveCustom(settings)`
- Retorna null até `ready === true` (previne SSR mismatch)

### Passo 4 — `ConsentBanner.tsx`
- Barra fixa `position: fixed; bottom: 0`
- Texto + link para Política de Cookies
- Botões: `[Personalizar]` `[Rejeitar]` `[Aceitar Tudo]`
- `aria-live="polite"`, `role="region"`, `aria-label="Aviso de cookies"`
- Non-blocking: permite scroll

### Passo 5 — `ConsentModal.tsx`
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Backdrop com `onClick` fecha modal
- Linha Essential: toggle desabilitado (sempre ativo)
- Linha Analytics: toggle controlado
- Linha Personalized Ads: toggle controlado
- Focus trap: Tab/Shift+Tab cicla dentro do modal
- ESC fecha
- Botão "Salvar preferências"

### Passo 6 — `ConsentManager.css`
- Banner: fixed bottom, branco, shadow-lg, z-index 9000
- Modal: overlay escuro + card centrado, z-index 9001
- Toggle switch CSS puro (sem JS)
- Mobile-first, tokens do design system
- Meta: < 20kb gzipped

### Passo 7 — `ConsentTrigger.tsx`
- Micro-cliente `'use client'`
- `<button>` que dispara `window.dispatchEvent(new CustomEvent('openConsentModal'))`
- Estilizado como link

### Passo 8 — `Footer.tsx`
- Adicionar coluna ou linha com links legais:
  - Política de Privacidade → `/politica-de-privacidade`
  - Política de Cookies → `/politica-de-cookies`
  - Termos de Uso → `/termos-de-uso`
  - `<ConsentTrigger />` → "Gerenciar Cookies"

---

## Decisões de Design

| Decisão | Motivo |
|---|---|
| `ready` state antes de renderizar | Previne SSR/hydration mismatch |
| `wait_for_update: 500` | Google aguarda 500ms antes de enviar hits |
| Set para scripts carregados | Previne double-inject |
| Custom event bus | Footer (Server) → ConsentManager (Client) sem prop drilling |
| `strategy="beforeInteractive"` | Consent Mode default roda antes de qualquer script de ads |
| Version check no localStorage | Schema change invalida consent antigo, mostra banner novamente |

---

## Critérios de Conclusão (conforme spec §21)

- [ ] Nenhum script não-essencial carrega antes do consent
- [ ] Ads monetizam imediatamente via contextual mode
- [ ] Sem dependência de backend
- [ ] Upgrade de consent acontece em runtime (sem reload)
- [ ] Totalmente serverless
- [ ] Overhead de performance mínimo (< 20kb)
- [ ] UX acessível (ARIA, focus trap, ESC, teclado)
- [ ] Design legalmente defensável

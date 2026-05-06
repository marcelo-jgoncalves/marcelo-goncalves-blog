# WORLD-CLASS CONSENT MANAGEMENT IMPLEMENTATION
## Serverless AWS Blog — LGPD + AdSense + Consent Mode v2
### Implementation Specification for Claude Code (HML Environment)

---

# 1. OBJECTIVE

Create a **production-grade Consent Management System (CMP)** for a serverless blog hosted on AWS that:

- complies with LGPD
- complies with Google AdSense requirements
- supports Google Consent Mode v2
- allows non-personalized ads before consent
- upgrades automatically to personalized ads after consent
- follows modern privacy-engineering standards used by large publishers

This document defines architecture, UX behavior, JavaScript lifecycle, security standards, and deployment strategy.

---

# 2. ARCHITECTURAL PRINCIPLES

The implementation MUST follow these principles:

1. Privacy by Default
2. Data Minimization
3. Script Execution Control (NOT cookie control)
4. Edge-First Architecture
5. Zero Backend Dependency for Consent Storage
6. Progressive Monetization Strategy

Consent controls **script execution**, not visual UI only.

---

# 3. TARGET AWS ARCHITECTURE

```
User Browser
      ↓
CloudFront (HTTPS)
      ↓
Static Website (S3)
      ↓
Consent Manager JS Layer
      ↓
Conditional Script Loader
      ↓
Google Ads / Analytics
```

No Lambda required for consent storage.

Consent state lives entirely in browser storage.

---

# 4. ENVIRONMENTS

Required environments:

```
dev.domain.com   → HML / staging
www.domain.com   → production
```

Rules:

- Consent banner MUST be active in HML
- AdSense should run in test mode in HML
- All consent logic identical between environments

Environment flag:

```
window.APP_ENV = "dev" | "prod";
```

---

# 5. CONSENT MODEL

Consent Categories:

| Category  | Required | Default |
| --------- | -------- | ------- |
| essential | yes      | granted |
| analytics | no       | denied  |
| ads       | no       | denied  |

Essential cookies NEVER require consent.

---

# 6. CONSENT STORAGE

Storage location:

```
localStorage
```

Key:

```
cmp_consent_v1
```

Structure:

```
{
  "essential": true,
  "analytics": false,
  "ads": false,
  "timestamp": 1710000000,
  "version": 1
}
```

Requirements:

- overwrite on every update
- include timestamp
- versioned schema

NO IP storage.
NO backend persistence.

---

# 7. INITIAL PAGE LOAD BEHAVIOR

On FIRST page render:

1. Load consent initialization script
2. Apply Consent Mode default state
3. Render banner if no consent stored
4. Allow contextual ads only

Execution order is critical.

---

# 8. GOOGLE CONSENT MODE v2 INITIALIZATION

Consent MUST start in denied mode.

Initialization MUST execute BEFORE ANY ADS SCRIPT.

```
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied'
});
```

This allows:

✔ non-personalized ads
✔ compliant monetization before consent

---

# 9. SCRIPT LOADER DESIGN (CORE COMPONENT)

Create a centralized loader:

```
loadScriptsByConsent()
```

Responsibilities:

- read consent state
- dynamically inject scripts
- prevent duplicate loading
- allow runtime upgrade

NEVER place AdSense directly in HTML markup.

---

# 10. ADSENSE LOADING STRATEGY

Phase 1 — Before Consent:

```
Consent Mode = denied
Ads allowed (contextual only)
```

Load AdSense dynamically:

```
createElement("script")
appendChild(document.head)
```

Phase 2 — After Consent:

Update consent:

```
gtag('consent','update',{ ...granted })
```

No page reload allowed.

Ads automatically upgrade.

---

# 11. CONSENT BANNER UX SPECIFICATION

Banner MUST include:

Buttons:

```
[ Accept All ]
[ Reject Non-Essential ]
[ Customize ]
```

Customize panel MUST show:

```
✓ Essential (locked)
□ Analytics
□ Personalized Ads
```

UX Rules:

- visible on first visit
- non-blocking scroll allowed
- accessible keyboard navigation
- mobile responsive
- WCAG compliant contrast

---

# 12. USER INTERACTION FLOWS

## Accept All

Actions:

1. Save consent
2. Update Consent Mode → granted
3. Load analytics
4. Enable personalized ads
5. Hide banner

---

## Reject

Actions:

1. Save minimal consent
2. Keep Consent Mode denied
3. Keep contextual ads only
4. Hide banner

---

## Customize

Opens preferences modal.

User selections applied individually.

---

# 13. CONSENT UPDATE FUNCTION

Required function:

```
updateConsent(settings)
```

Must:

- persist storage
- call Consent Mode update
- trigger script loader
- log debug event in DEV environment

---

# 14. SECURITY REQUIREMENTS

Must implement:

- HTTPS only (CloudFront + ACM)
- CSP Headers
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security

Consent scripts MUST be self-hosted.

Avoid external CMP dependencies.

---

# 15. PERFORMANCE REQUIREMENTS

Banner bundle:

< 20kb gzipped

Rules:

- no framework dependency
- vanilla JS preferred
- async loading
- avoid layout shift

CLS impact must be near zero.

---

# 16. ACCESSIBILITY REQUIREMENTS

Mandatory:

- ARIA roles
- focus trapping in modal
- ESC key closes modal
- screen reader labels
- tab navigation order

---

# 17. DEV / HML TEST PROCEDURE

Test using:

Incognito Mode OR cleared storage.

Validation checklist:

Before consent:

```
NO analytics cookies
NO personalization cookies
Ads requests allowed
```

After consent:

```
Analytics cookies appear
Ad personalization enabled
Consent Mode updated
```

Use DevTools:

Application → Storage
Network → googlesyndication

---

# 18. LOGGING (DEV ONLY)

If APP_ENV == dev:

Console logs allowed:

```
[CONSENT INIT]
[CONSENT UPDATED]
[SCRIPTS LOADED]
```

Production must remain silent.

---

# 19. LEGAL FOOTER REQUIREMENTS

Footer MUST contain links:

```
Privacy Policy
Cookie Policy
Terms of Use
Manage Cookies
```

Manage Cookies reopens preferences modal.

---

# 20. VERSIONING STRATEGY

Every consent schema change:

```
increment version
invalidate previous consent
show banner again
```

---

# 21. WORLD-CLASS QUALITY CRITERIA

Implementation is considered world-class when:

✔ No non-essential script loads pre-consent
✔ Ads monetize immediately via contextual mode
✔ No backend dependency
✔ Consent upgrade happens live
✔ Fully serverless
✔ Minimal performance overhead
✔ Accessible UX
✔ Legally defensible design

---

# 22. FINAL IMPLEMENTATION GOAL

Deliver a CMP equivalent to enterprise publisher standards while remaining:

```
Serverless
Low-cost
High-performance
Privacy-first
Monetization-optimized
```

END OF SPECIFICATION.

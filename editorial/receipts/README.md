# Publication Receipts

Traceability records linking an editorial plan (`editorial/plans/`) to what the CMS actually published. Contract: `editorial/schema/publication-receipt.schema.json`. Validator: `scripts/validate-editorial-outcomes.mjs`.

## Status: stub contract (Fase E)

This directory has no real records yet. CMS integration is design-doc-only (`docs/engineering/work-items/2026/08/2026-08-04-ajuste-15c-cms-fluxo-editorial.md`, status `blocked`) — nothing in this repo writes a receipt automatically. The schema exists so the contract is defined and enforceable before the integration is real, not to pretend the integration already exists.

## Rule of authority

The CMS remains the canonical source of the published content itself. A receipt is a pointer (CMS content ID, canonical URL, publish timestamp) plus enough metadata for feedback/outcomes — never a copy of the article, never a second canonical source.

## File convention (once real records exist)

One file per publication event: `PUB-YYYY-NNN.yml`, matching the `publication_id` field. Never invent a `platform_content_id` or `canonical_url` — those come only from a real, verified CMS response (`verification_source` records how).

## Security

Same rule as `editorial/plans/`: this repo is public. Receipts must never carry raw personal data — the schema is deliberately narrow (IDs, URLs, timestamps, enums) and the validator scans for obvious PII patterns as an auxiliary check.

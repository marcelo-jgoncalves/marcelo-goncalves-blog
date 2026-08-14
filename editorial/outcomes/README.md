# Outcomes

Post-publication results, one file per measured outcome. Contract: `editorial/schema/outcome.schema.json`. Validator: `scripts/validate-editorial-outcomes.mjs`.

## Status: stub contract (Fase E)

No real records yet, for the same reason `editorial/receipts/` is empty: no Publication Receipt exists yet to reference (`publication_id` is a required field), and CMS integration is still design-doc-only. The schema and validator exist so the contract is enforceable the moment a real publication and real metrics exist — not before.

## Ex ante vs ex post (do not violate this)

An outcome is never merged back into the plan file it measures. The plan (`editorial/plans/`) is the hypothesis, written before publication. The outcome is the result, written after. Keeping them in separate directories, cross-referenced by ID (`editorial_plan_id`), is what makes the split enforceable instead of just a convention someone can quietly erode by editing the plan file post-hoc.

## No invented data

Every field in an outcome must trace to a real, named source (`provenance`, required, at least one entry). `data_quality` states honestly whether the record is `measured`, `estimated`, `partial`, or `unavailable` — there is no field for "unknown, presented as if known." `limitations` should be non-empty in spirit: an outcome with zero acknowledged limitations is more likely an incomplete write-up than a clean result.

## Security

Same rule as `editorial/plans/` and `editorial/receipts/`: this is a public repo. `metrics` and `business_signals` are aggregate/sanitized only — no individual lead records, no raw form content, no names or contact details. `qualified_leads` is a count, never a list.

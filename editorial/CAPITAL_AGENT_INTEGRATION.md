# Capital Agent Integration

Contract for how the Editorial Platform and the Capital Agent relate, per `prompt-evolucao-subsistema-editorial.md` §21-22. **This is a contract, not a live integration** — no code in this repo calls out to a Capital Agent today, and nothing here should be read as implying one exists yet.

## Honest status of enforcement (read before trusting the "non-negotiables" below)

An independent review (codex CLI) pushed back hard on this document overselling itself, correctly: today, **no write access / no shared DB / no runtime dependency are true because nothing exists to violate them, not because anything here actively prevents a violation.** `additionalProperties: false` on the signal schema only constrains a document if and when something actually validates against that schema — no validator, CI job, IAM policy, or API boundary for Capital Agent signals exists yet (unlike `editorial/plans/`, `editorial/receipts/`, `editorial/outcomes/`, which do have a wired validator). The rules below are the agreed contract that any future implementation must satisfy, not a runtime guarantee this repo currently enforces.

**Also flagged, and accepted as a real tension rather than resolved away**: Fase B (`editorial/schema/editorial-plan.schema.json`) deliberately deferred these same optional integration fields until "a real consumer exists," specifically to avoid speculative schema surface. Reaching Fase F in the plan's own phase numbering is not the same thing as a real consumer existing — none does. Adding the fields now is a deliberate scope choice (contract-first: define the shape the integration must have before it's built, so the eventual implementation has something concrete to build against) rather than a literal satisfaction of the Fase B bar. Recorded here rather than glossed over; if a future session judges this was premature, reverting the optional fields is cheap (they're all nullable, nothing depends on them yet).

## Non-negotiables (contract for a future implementation, not a current runtime guarantee)

- No write access from the Capital Agent into this repository or the CMS.
- No shared database.
- No direct runtime dependency (this repo never calls a Capital Agent API synchronously, and vice versa).
- The existence of a Publication Package or a BusinessSignal never authorizes publication. Editorial authority (draft, review, approve, schedule, publish) stays with the human/platform side.

## What the Capital Agent may provide (as input, one-way)

- `BusinessSignal` — referenced via `business_signal_id` on a plan (`editorial/schema/editorial-plan.schema.json`), pseudonymous only.
- `OpportunityCandidate` — referenced via `opportunity_id`, same rule.
- Content Hypothesis, Publication Package — informs a plan's origin (`source_type: market-signal`), never fabricates the plan itself.
- `experiment_id` — carried through untouched, never interpreted by this repo.

All of the above are **optional reference fields** on the plan schema. Every one of them is `null` today: no real Capital Agent exists in code, so a non-null value would be fabricated data, which is explicitly forbidden (prompt §27).

## What the Editorial Platform controls

Editorial plan, drafting, approval, scheduling, CMS, publication, and the Publication Receipt. None of this is delegable to the Capital Agent per the contract.

## What the Editorial Platform may return (as output, one-way, sanitized)

Shape: `editorial/schema/capital-agent-signal.schema.json`. Three kinds of export only:

- `publication_receipt` — echoes back the relevant `editorial/receipts/` record.
- `sanitized_outcome` — aggregate metrics/attribution from an `editorial/outcomes/` record, never the raw outcome file.
- `attribution_summary` — controlled category tags plus aggregate numbers.

## Sanitization rules (prompt §22)

Every exported signal uses:

- Pseudonymous IDs (`signal_id`, `experiment_id` echoed back, plan/publication/outcome IDs — never a lead ID or session ID).
- Aggregate metrics only (`aggregate_metrics`, same shape rule as `editorial/schema/outcome.schema.json#/properties/metrics`).
- Controlled category tags (`attribution_tags`, `funnel_stage`) — never raw referrer URLs, user agents, or free text.

Never sent: name, e-mail, phone, raw message content, or any other individually-identifying data. The schema's `additionalProperties: false` is the actual enforcement mechanism, not just this document — a field not in the schema cannot be exported even by accident.

**Known limitation, not solved by this contract alone**: aggregate counts can still re-identify someone when the count is small (e.g. `qualified_leads: 1` on a niche page). No k-anonymity threshold or minimum-cell-size suppression is implemented yet. Documented as an accepted gap in the work item (`docs/engineering/work-items/2026/08/2026-08-14-evolucao-subsistema-editorial.md`) — add one if/when real outcome data with small denominators starts flowing through this contract.

## Status

Stub / contract-only, same as `editorial/receipts/` and `editorial/outcomes/`. No `editorial/schema/capital-agent-signal.schema.json` document has ever been generated for real, because no real Capital Agent, receipt, or outcome exists yet to source one from.

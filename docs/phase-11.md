# Phase 11 - Intelligence Narrative Layer

## Goals

- Add a compact top-level Intelligence Brief to the dashboard.
- Help users understand what matters now without reading every dashboard
  section.
- Summarize existing Futures Lab observations only.

## Information Sources Used

The brief uses already-shaped frontend service data:

- `marketRankings`
- `marketSummary`
- `marketSummary.freshness`
- `labDecisions`
- `setupMemory`
- `ghostTracking`

No new backend endpoints, Futures Lab changes, AI summaries, LLM calls,
forecasting systems or recommendation engines were created.

## Synthesis Rules

- Current strongest market uses the first market ranking already returned by
  Futures Lab.
- Directional bias uses the direction of that top-ranked market.
- Recent research activity uses the first recent lab decision.
- Notable setup memory uses the first setup memory record already returned.
- Notable ghost tracking uses the first ghost tracking reason record already
  returned.
- The brief formats counts and text for readability only.
- The brief does not compute new scores, rates or predictive labels.
- The brief uses observation language and avoids trade instructions.

## UX Rationale

- The dashboard now contains several dense research surfaces.
- A first-time or returning user needs a front-page summary before inspecting
  details.
- The brief appears above summary cards so the user can answer "what changed?"
  before reading tables and cards.
- Each brief item is short and tied to a specific existing data source.

## Future Opportunities

- Add a "changed since previous run" brief once previous snapshots are available.
- Add user-controlled brief density after the core dashboard stabilizes.
- Add tests for narrative synthesis rules.
- Keep alerts, notifications, predictions and LLM summaries out of scope until
  retention is proven.

# Phase 7 - Recent Decisions Intelligence

## Goals

- Surface recent Futures Lab decision activity in POC Intelligence.
- Help users answer what Futures Lab has been evaluating recently.
- Use existing Futures Lab data only.

## Data Source

The dashboard continues to consume the existing Futures Lab dashboard state
endpoint:

`the internal dashboard state endpoint`

Recent decisions are read from:

`capital_control.futures_lab.recent_decisions`

No new APIs, backend changes, database changes, scoring systems or decision
systems were created.

## Fields Exposed

The Recent Lab Decisions section uses these available fields:

- `symbol`
- `selected_side`
- `direction_hint`
- `decision_type`
- `reason`
- `reason_label`
- `signal_ok`
- `estimated_rr_ratio`
- `setup_key`
- `observed_at`

Fallback values are also read from `decision_snapshot` when present:

- `decision_snapshot.selected_side`
- `decision_snapshot.signal_ok`
- `decision_snapshot.estimated_rr_ratio`

## Unavailable Fields

The current UI does not expose:

- Raw `payload_json`
- Full nested payload
- Setup memory
- Ghost tracking
- Funnel candidates
- Execution constraints
- Oracle detail

These fields are either too verbose for the compact dashboard section or outside
the approved Phase 7 scope.

## UX Decisions

- Added one compact dashboard section named `Recent Lab Decisions`.
- Presented records as Futures Lab research activity, not advice or execution.
- Displayed symbol, selected side or direction, decision reason and timestamp as
  primary information.
- Kept setup key and estimated reward/risk ratio secondary.
- Limited the section to the first five recent records already returned by
  Futures Lab.
- Used an empty state when no recent decision rows are available.

## Future Opportunities

- Add focused transformation tests for decision records.
- Add a dedicated decision detail view only if approved later.
- Consider replacing mock opportunity panels once a stable existing data source
  is selected.
- Keep setup memory and ghost tracking as separate future phases.

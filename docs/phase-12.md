# Phase 12 - Change Awareness Layer

## Goals

- Add a compact dashboard section that answers what changed since the previous
  review window.
- Use existing Futures Lab historical tables only.
- Keep the output observational, not predictive.

## Comparison Windows

Current window:

- Last 24 hours
- `T-24h -> now`

Baseline window:

- Previous 24 hours
- `T-48h -> T-24h`

## Data Sources

The implementation reads existing Futures Lab Postgres tables:

- `futures_scanner_rankings`
- `futures_lab_decisions`
- `futures_lab_ghost_tracks`

The dashboard requires `FUTURES_LAB_DATABASE_URL` for read-only historical
comparison access.

Trace events were not used in this phase.

## Comparison Rules

- Ranking leader change compares the latest scanner batch in the current window
  with the latest scanner batch in the baseline window.
- Leader score change compares the two leader scores after applying the existing
  `0-1` to `0-100` display convention.
- Direction bias compares long-bias and short-bias scanner counts in each
  window.
- Research activity compares the most common decision type in each window.
- Ghost tracking compares settled ghost positive rate in each window.

## Rejected Ideas

- No charts or trend graphs.
- No trace-event analytics.
- No AI summaries or LLM-generated interpretation.
- No alerts, notifications or emails.
- No new scoring models or recommendations.
- No Futures Lab backend changes or new endpoints.

## UX Decisions

- Added a compact `What Changed` section directly below the Intelligence Brief.
- Used four short observation cards instead of tables.
- Kept language focused on observed changes between windows.
- Kept all aggregation and comparison logic in `src/services/api`.

## Future Extensions

- Add explicit previous-review persistence once user accounts or sessions exist.
- Add drilldowns for each change card if approved later.
- Add tests for SQL result transformation.
- Consider trace-event analytics only in a dedicated future phase.

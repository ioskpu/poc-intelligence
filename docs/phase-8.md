# Phase 8 - Setup Memory Intelligence

## Goals

- Surface existing Futures Lab setup memory in POC Intelligence.
- Help users understand recurring historical setup observations.
- Keep the integration read-only and limited to existing dashboard state data.

## Data Source

The dashboard continues to consume the existing Futures Lab dashboard state
endpoint:

`the internal dashboard state endpoint`

Setup memory is read from:

`capital_control.futures_lab.setup_rankings.by_setup_key`

No new APIs, backend changes, database changes, scoring models or analytics
engines were created.

## Fields Exposed

The Setup Memory section uses these available fields:

- `setup_key`
- `symbol`
- `last_symbol`
- `side`
- `last_side`
- `trade_count`
- `win_rate`
- `health_score`
- `health_label`
- `pnl_total`
- `avg_pnl`
- `summary_text`
- `last_observed_at`
- `last_seen`

## Unavailable Fields

The current UI does not expose:

- Ghost tracking fields
- Full setup memory internals
- Raw payload JSON
- Historical charts
- Prediction outputs
- Recommendation labels

These are outside the approved Phase 8 scope.

## Transformation Rules

- Read only `by_setup_key` records when `setup_rankings.available` is true.
- Limit the dashboard section to the first five records already returned by
  Futures Lab.
- Use `symbol` with `last_symbol` fallback.
- Use `side` with `last_side` fallback.
- Use `last_seen` with `last_observed_at` fallback.
- Keep numeric fields as existing values and only format them for display.
- Do not parse setup keys into new categories or create additional scores.

## UX Decisions

- Added one compact dashboard section named `Setup Memory`.
- Presented records as historical laboratory observations.
- Displayed setup key, symbol, side, health label, trade count, win rate, PnL
  and last seen timestamp.
- Kept long setup keys truncated to avoid overwhelming the dashboard.
- Used an empty state when setup memory is unavailable.

## Future Opportunities

- Add focused transformation tests for setup memory rows.
- Add a dedicated setup detail view only if approved later.
- Keep ghost tracking as a separate future phase.
- Consider charting only after the current compact dashboard remains stable.

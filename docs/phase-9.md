# Phase 9 - Ghost Tracking Intelligence

## Goals

- Surface Futures Lab ghost tracking intelligence already available in the
  dashboard state payload.
- Help users understand what Futures Lab has learned from rejected
  opportunities.
- Keep the integration read-only and limited to existing fields.

## Data Source

The dashboard continues to consume the existing Futures Lab dashboard state
endpoint:

`/internal/dashboard/state`

Ghost tracking is read from:

`capital_control.futures_lab.ghost_tracking`

No new APIs, backend changes, database changes, scoring systems, analytics
engines or prediction systems were created.

## Fields Exposed

The Ghost Tracking section uses these available top-level fields:

- `pending_count`
- `settled_count`
- `positive_rate`
- `avg_hypothetical_pnl_pct`
- `avg_mfe_pct`
- `avg_mae_pct`
- `last_settled_at`

The compact rejection records use:

- `reason_breakdown.gate_reason`
- `reason_breakdown.gate_reason_label`
- `reason_breakdown.total_count`
- `reason_breakdown.settled_count`
- `reason_breakdown.settled_positive_count`
- `reason_breakdown.avg_hypothetical_pnl_pct`
- `profit_factor_by_reason.profit_factor`

## Unavailable Fields

The current UI does not expose:

- Raw ghost candidates
- MAE bucket internals
- Magnitude bucket internals
- RR threshold simulation details
- Shadow RR experiment internals
- Cross-regime experiments
- Raw payload JSON

These fields are too detailed for the compact dashboard section or outside
approved Phase 9 scope.

## Transformation Rules

- Read only existing `ghost_tracking` values.
- Use `reason_breakdown` as the primary record list.
- Join an existing `profit_factor_by_reason` value by matching `gate_reason`.
- Limit the dashboard section to the first five reason records already returned
  by Futures Lab.
- Format percentages for display only.
- Do not compute new rates, scores or predictive labels.

## UX Decisions

- Added one compact dashboard section named `Ghost Tracking`.
- Presented ghost tracking as post-evaluation research feedback.
- Displayed top-level settled, pending, positive rate and average hypothetical
  PnL metrics.
- Displayed rejection reason cards instead of a large metrics table.
- Included profit factor only when already available from Futures Lab.

## Future Opportunities

- Add focused transformation tests for ghost tracking rows.
- Add a dedicated ghost tracking detail view only if approved later.
- Consider charting MAE/MFE buckets only after the compact dashboard remains
  stable.
- Keep predictive models and recommendations out of scope.

# Phase 28 - Beta Live Depth

## Goal

Expose a first internal Beta Live view using only real Futures Lab data, without auth, new routes, or mock-backed modules.

## What Was Added

- `Beta Live Mode` internal feature flag.
- `BetaLiveDepth` panel in the existing dashboard shell.
- Expanded depth for:
  - Scanner Detail
  - Decision Context
  - Setup Depth
  - Ghost Outcomes
  - Diagnostic Context

## Components Created

- `src/features/dashboard/beta-live-depth.tsx`
- `src/services/api/beta-live.ts`
- `src/lib/beta-live-copy.ts`

## Components Reused

- `DashboardShell`
- `PublicDemoBanner`
- `TopBar`
- `AppSidebar`
- existing dashboard surfaces:
  - `IntelligenceBrief`
  - `ChangeAwareness`
  - `MarketSummaryCards`
  - `FreshnessStrip`
  - `MarketRankings`
  - `RankingExplanation`
  - `RecentLabDecisions`
  - `SetupMemory`
  - `GhostTracking`

## Connected Field Inventory

### Scanner Detail

Connected from `futures_scanner_rankings`:

- `scan_batch_id`
- `last_price`
- `quote_volume`
- `range_pct`
- `long_short_balance`
- `order_valid`
- `ranking_reason`
- `price_change_pct`
- `trend_strength_pct`
- `realized_volatility_pct`
- `funding_rate`

### Decision Context

Connected from `recent_decisions` and `latest_decision`:

- `decision_type`
- `environment`
- `direction_hint`
- `selected_side`
- `signal_ok`
- `estimated_rr_ratio`
- `trend_alignment_label`
- `trend_supports_direction`
- `setup_key`
- `setup_key_version`
- `oracle_recommendation`
- `capital_profile`
- `operating_capital`
- `auto_entry_enabled`
- `auto_exit_enabled`
- `take_profit_pct`
- `stop_loss_pct`
- `take_profit_usdt`
- `stop_loss_usdt`
- `leverage`
- `scan_batch_id`

### Setup Depth

Connected from `setup_rankings.by_setup_key`:

- `trade_count`
- `win_count`
- `win_rate`
- `pnl_total`
- `avg_pnl`
- `avg_pnl_pct`
- `avg_capital_reference`
- `avg_hold_ticks`
- `avg_win_pnl`
- `avg_loss_abs`
- `health_score`
- `summary_text`
- `environment`
- `capital_profile`
- `lane`
- `last_realized_pnl`
- `last_realized_pnl_pct`
- `cooldown_multiplier`
- `suggested_take_profit_usdt`
- `suggested_stop_loss_usdt`
- `last_close_reason`
- `last_seen`
- `last_observed_at`

### Ghost Outcomes

Connected from `ghost_tracking`:

- `pending_count`
- `settled_count`
- `positive_rate`
- `avg_hypothetical_pnl_pct`
- `avg_mfe_pct`
- `avg_mae_pct`
- `last_settled_at`
- `reason_breakdown`
- `profit_factor_by_reason`
- `rr_threshold_simulation`

### Diagnostic Context

Connected from `operational_diagnostics`:

- `window_cycles`
- `window_hours`
- `total_candidates`
- `total_eligible`
- `candidate_ready_cycle_rate`
- `eligible_cycle_rate`
- `expected_candidate_ready_per_day`
- `expected_eligible_cycles_per_day`
- `opportunity_starvation`
- `filter_survival`
- `dominant_rejection_reason`
- `rejection_combinations`
- `regime_distribution`

## Missing Fields

No missing fields for the requested Beta Live MVP scope.

Additional Futures Lab fields exist, but are intentionally left out of the current beta surface to avoid turning the observatory into a technical dump.

## Visual Validation

Validated locally with Playwright on the beta-live server:

- Desktop anchored capture:
  - `/tmp/poc-beta-live-depth-desktop-final-2.png`
- Tablet anchored capture:
  - `/tmp/poc-beta-live-depth-tablet-final-2.png`
- Desktop full-page capture:
  - `/tmp/poc-beta-live-fullpage-desktop-final-2.png`
- Tablet full-page capture:
  - `/tmp/poc-beta-live-fullpage-tablet-final-2.png`

## Perceived Value For Beta Users

The added depth is useful because it answers:

- why a market ranks highly
- what decision context supported the lab action
- how a setup behaves over time
- what happens to rejected opportunities
- whether the scanner is still active and fresh

## Risks

- The beta surface is still read-only and internal only.
- Some decisions are sparse or intentionally generic when the backend does not have richer labels.
- `Setup Depth` and `Decision Context` are only useful if the user is willing to expand them.
- The beta can drift toward too much operational detail if more internal fields are exposed without framing.

## Notes

- No auth was added.
- No new routes were added.
- No mock-backed beta modules were used.
- The public dashboard remains unchanged outside the beta mode boundary.

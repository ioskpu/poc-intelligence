# Market Intelligence Surface Discovery

## Objective

Identify existing Futures Lab information that can be surfaced in POC
Intelligence with high user value and low engineering cost.

This is a documentation-only discovery phase. No frontend, backend, API or
database changes were made.

## Runtime Evidence

Live Futures Lab endpoint reviewed:

`GET /internal/dashboard/state`

Observed live dashboard state includes:

- `futures_scanner_rankings`
- `market_scanner_rankings`
- `data_freshness`
- `summary`
- `recent_trades`
- `recent_strategy_metrics`
- `orchestrator_recent_cycles`
- `frontier_coverage`
- `capital_control`
- `decision_audit`
- `risk_guardrails`

Relevant code sources reviewed:

- `packages/futures_scanner/service.py`
- `packages/futures_lab/schema.py`
- `packages/risk_adaptation/setup_memory.py`
- `packages/risk_adaptation/memory.py`
- `services/api/routes/internal_routes.py`
- `services/api/routes/futures_setup_rankings.py`
- `services/api/routes/futures_ghost_tracking.py`
- `services/api/routes/futures_ghost_sql.py`
- `services/api/routes/futures_diagnostics.py`
- `services/api/routes/futures_candidate_promoter.py`
- `services/api/routes/futures_reconciliation.py`
- `packages/validation/replay_metrics.py`
- `packages/validation/profitability.py`

## Data Source Inventory

### 1. futures_scanner_rankings

Purpose:
Rank futures markets from the Futures Lab scanner.

Existing fields:
`scan_batch_id`, `symbol`, `rank_position`, `score`, `direction_hint`,
`regime_bias`, `last_price`, `price_change_pct`, `quote_volume`, `range_pct`,
`realized_volatility_pct`, `trend_strength_pct`, `long_short_balance`,
`funding_rate`, `order_valid`, `ranking_reason`, `scanned_at`.

Refresh frequency:
Configured by `FUTURES_SCANNER_INTERVAL_SECONDS`, default `600` seconds.

Estimated user value:
HIGH

Engineering effort:
LOW

POC Intelligence suitability:
YES

Notes:
Already used by POC Intelligence. `ranking_reason`, volatility, trend strength,
price change and funding rate can be exposed without new calculations.

### 2. data_freshness

Purpose:
Expose freshness status for scanner, decisions, observations, candidate
promoter and orchestrator data.

Existing fields:
Keys observed include `spot_recent_trades`, `spot_scanner`,
`futures_scanner`, `futures_lab_decision`, `futures_lab_observation`,
`futures_candidate_promoter`, `orchestrator_cycles`.

Refresh frequency:
Rebuilt with the internal dashboard snapshot. Dashboard cache TTL is configured
in Futures Lab with `DASHBOARD_SNAPSHOT_CACHE_TTL`, default `5` seconds.

Estimated user value:
HIGH

Engineering effort:
LOW

POC Intelligence suitability:
YES

Notes:
This is a strong next surface because freshness directly answers whether the
current intelligence is timely.

### 3. futures_lab_decisions

Purpose:
Persist recent Futures Lab decision outcomes and candidate context.

Existing fields:
`decision_type`, `environment`, `symbol`, `direction_hint`, `score`,
`operating_capital`, `auto_entry_enabled`, `auto_exit_enabled`,
`take_profit_pct`, `stop_loss_pct`, `take_profit_usdt`, `stop_loss_usdt`,
`reason`, `payload_json`, `setup_key`, `setup_key_version`, `selected_side`,
`scan_batch_id`, `capital_profile`, `leverage`, `estimated_rr_ratio`,
`oracle_recommendation`, `trend_alignment_label`,
`trend_supports_direction`, `signal_ok`, `observed_at`.

Refresh frequency:
Updated when Futures Lab records decisions during lab cycles.

Estimated user value:
HIGH

Engineering effort:
MEDIUM

POC Intelligence suitability:
YES

Notes:
Can explain what Futures Lab selected or rejected. Must be presented as
research context, not trade advice.

### 4. futures_setup_rankings

Purpose:
Summarize setup-level and symbol-side setup performance from adaptive risk
memory.

Existing fields:
`setup_key`, `symbol`, `side`, `trade_count`, `win_count`, `win_rate`,
`pnl_total`, `avg_pnl`, `avg_pnl_pct`, `avg_capital_reference`,
`avg_hold_ticks`, `avg_win_pnl`, `avg_loss_abs`, `health_score`,
`health_label`, `summary_text`, plus suggested risk-control fields.

Refresh frequency:
Updates as adaptive risk events are persisted and summarized.

Estimated user value:
HIGH

Engineering effort:
MEDIUM

POC Intelligence suitability:
YES

Notes:
High differentiation potential. Suggested TP/SL fields need careful wording.

### 5. futures_lab_ghost_tracking

Purpose:
Analyze rejected or ghost-tracked candidates after hypothetical settlement.

Existing fields:
Summary counts, `positive_rate`, `avg_hypothetical_pnl_pct`, `avg_mfe_pct`,
`avg_mae_pct`, `last_settled_at`, `reason_breakdown`,
`profit_factor_by_reason`, `rr_threshold_simulation`, MAE buckets, magnitude
buckets and cross-regime slices.

Refresh frequency:
Updates as ghost tracks settle.

Estimated user value:
HIGH

Engineering effort:
MEDIUM

POC Intelligence suitability:
YES

Notes:
Best surfaced as rejected-candidate research, not direct pattern ranking.

### 6. futures_diagnostics

Purpose:
Summarize operational funnel behavior across recent Futures Lab decisions.

Existing fields:
`window_cycles`, `window_hours`, `total_candidates`, `total_eligible`,
`avg_candidates_per_cycle`, `avg_eligible_per_cycle`,
`eligible_cycle_rate`, `candidate_ready_cycle_rate`,
`expected_candidate_ready_per_day`, `opportunity_starvation`,
`filter_survival`, `funnel_incremental_survival`,
`dominant_rejection_reason`, `rejection_counts`,
`rejection_combinations`, `regime_distribution`.

Refresh frequency:
Computed from recent decision rows when dashboard diagnostics are built.

Estimated user value:
MEDIUM

Engineering effort:
LOW

POC Intelligence suitability:
YES

Notes:
Useful for explaining quiet periods, but lower priority than scanner freshness.

### 7. live_candidate_promoter_report

Purpose:
Summarize live candidate promoter plans and readiness.

Existing fields:
`generated_at`, `environment`, `hours`, `scanner_batches`, `recommendation`,
`top_plan_key`, `top_candidate_ready`, `actionable_plan_keys`, plan-level
`candidate_ready`, `ready_symbols`, `reason_counts`, `hold_reasons`,
`quality_gate`, `top_live_candidate`.

Refresh frequency:
Generated by promoter/reporting workflow when the report file is updated.

Estimated user value:
MEDIUM

Engineering effort:
LOW

POC Intelligence suitability:
LATER

Notes:
Defer until POC has stronger research-only product language.

### 8. futures_reconciliation

Purpose:
Compare Futures Lab DB open positions with Binance futures account state.

Existing fields:
`ok`, `blocked`, `environment`, `execution_backend`, `db_open_count`,
`binance_open_count`, `binance_open_orders_count`, `mismatches`, `status`,
`checked_at`.

Refresh frequency:
Computed when reconciliation snapshot is requested.

Estimated user value:
LOW

Engineering effort:
LOW

POC Intelligence suitability:
NO

Notes:
Operational safety data, not public market intelligence.

### 9. frontier_coverage

Purpose:
Track out-of-sample coverage/readiness by bucket for research validation.

Existing fields:
Observed top-level keys include `generated_at`, `scope`, `target_days_min`,
`target_days_preferred`, `target_settled_per_bucket`, `buckets`.

Refresh frequency:
Computed by research assistant coverage state when dashboard snapshot is built.

Estimated user value:
MEDIUM

Engineering effort:
MEDIUM

POC Intelligence suitability:
LATER

Notes:
Useful for methodology transparency, but requires product explanation.

### 10. recent_trades and recent_strategy_metrics

Purpose:
Expose recent paper/realistic trade and strategy metric rows.

Existing fields:
Recent trades include `strategy_id`, `cycle_id`, `entry_price`, `exit_price`,
`quantity`, `realistic_pnl`, `timestamp`. Strategy metrics include
`strategy_id`, `cycle_id`, `pnl`, `executions`, `created_at`.

Refresh frequency:
Updated as paper/orchestrator cycles persist rows.

Estimated user value:
MEDIUM

Engineering effort:
MEDIUM

POC Intelligence suitability:
LATER

Notes:
Close to performance/trading language. Needs strict framing before display.

### 11. market_scanner_rankings

Purpose:
Rank spot markets from the existing spot scanner.

Existing fields:
`scan_batch_id`, `symbol`, `rank_position`, `score`, `last_price`,
`price_change_pct`, `quote_volume`, `range_pct`, `realized_volatility_pct`,
`trend_strength_pct`, `body_follow_through_pct`, operability fields,
`consistency_score`, `regime_alignment_score`, `btc_regime`, `eth_regime`,
`market_support_score`, `ranking_reason`, `scanned_at`.

Refresh frequency:
Scanner-driven. Current dashboard state exposes latest rows.

Estimated user value:
MEDIUM

Engineering effort:
LOW

POC Intelligence suitability:
LATER

Notes:
Keep later unless product scope expands beyond Futures Lab.

### 12. research and validation reports

Purpose:
Document research state, regime drift, edge decay, OOS progress and validation
findings.

Existing fields:
Markdown report content from research assistant reports and validation docs,
including regime monitor, CTO brief, OOS progress and edge validation reports.

Refresh frequency:
Report-generation workflow dependent.

Estimated user value:
MEDIUM

Engineering effort:
HIGH

POC Intelligence suitability:
LATER

Notes:
Requires content curation, permissions and careful information architecture.

## Prioritization Matrix

| Category | Sources |
| --- | --- |
| High Value + Low Effort | `data_freshness`, expanded `futures_scanner_rankings` fields |
| High Value + Medium Effort | `futures_lab_decisions`, `futures_setup_rankings`, `futures_lab_ghost_tracking` |
| Medium Value + Low Effort | `futures_diagnostics`, `market_scanner_rankings` |
| Low Value + High Effort | research report surfaces, raw trade/strategy performance views |

## Top 5 Opportunities

| Rank | Opportunity | Value | Simplicity | Differentiation | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Scanner freshness and health strip | HIGH | HIGH | MEDIUM | Shows whether current intelligence is timely. |
| 2 | Ranking reason column or detail panel | HIGH | HIGH | MEDIUM | Explains why a market ranks highly using existing scanner fields. |
| 3 | Recent Futures Lab decision context | HIGH | MEDIUM | HIGH | Turns rankings into an understandable lab narrative. |
| 4 | Setup memory summary | HIGH | MEDIUM | HIGH | Shows whether learned setups are improving, degrading or fragile. |
| 5 | Ghost tracking summary | HIGH | MEDIUM | HIGH | Reveals rejected-candidate research outcomes without trade execution. |

## What Would Make A User Return Tomorrow?

Using only currently available Futures Lab data, the strongest return drivers
are:

1. Fresh rankings with visible freshness.
2. Ranking reasons that explain why the top market changed.
3. Setup memory health showing whether recurring setups improved or degraded.
4. Ghost tracking showing whether rejected candidates later performed well.
5. Decision context showing what Futures Lab observed in recent cycles.

The best repeat-use pattern is:

"What changed since the last scan, and did Futures Lab learn anything new?"

The currently available data that supports this pattern:

- `futures_scanner_rankings.scanned_at`
- `futures_scanner_rankings.ranking_reason`
- `futures_lab_decisions.observed_at`
- `futures_lab_decisions.reason`
- setup memory `health_score`, `win_rate`, `trade_count`
- ghost tracking `settled_count`, `positive_rate`, `profit_factor_by_reason`

## Recommended Phase 6

Phase 6 should be:

Scanner Context and Freshness Expansion

Scope:

- Add freshness indicators from existing `data_freshness`.
- Add ranking reason and scanner context fields from existing
  `futures_scanner_rankings`.
- Keep all transformations inside `src/services/api`.
- Do not add backend endpoints.
- Do not add new calculations.
- Do not surface setup memory, ghost tracking or decisions yet.

Reason:
This is the highest value and lowest engineering effort extension. It improves
user understanding of the current real ranking surface before adding new
information domains.

## Open Questions

- Should POC Intelligence remain futures-only, or may it later include
  `market_scanner_rankings` for spot markets?
- Which setup memory fields are safe to expose publicly without sounding like
  risk-management advice?
- Should ghost tracking be framed as "research outcomes" or "rejected candidate
  analysis"?
- What freshness threshold should be considered stale for the futures scanner?

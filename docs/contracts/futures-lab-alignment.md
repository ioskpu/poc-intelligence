# Futures Lab Contract Alignment

## Scope

This audit compares the Phase 2 Market Intelligence API Contract with the
current Futures Lab codebase located at:

`/Users/luiscorales/Documents/NewWeb3/ProofOfConsistency-clean`

No backend, frontend, API or database changes were made.

## Summary

Futures Lab already has useful scanner, decision, regime and performance data,
but it does not currently expose the Phase 2 contract directly. The fastest
path is a read-only adapter that transforms existing `futures_scanner_rankings`
and setup memory summaries into POC Intelligence view models.

## Market

### Market.symbol

Status:
EXISTS

Source:
`packages/futures_scanner/service.py`, `services/api/routes/internal_routes.py`

Notes:
`symbol` exists in `futures_scanner_rankings`, `futures_lab_decisions`,
`futures_lab_trace_events`, adaptive risk summaries and futures positions.
Scanner symbols are normalized uppercase Binance futures symbols such as
`BTCUSDT`.

### Market.exchange

Status:
MISSING

Proposed source:
Configuration derived from `BINANCE_FUTURES_BASE_URL` or a new static source
mapping in the adapter layer.

Complexity:
LOW

Notes:
Futures scanner currently implies Binance futures via configuration, but no
persisted `exchange` field exists in scanner ranking rows.

### Market.asset_class

Status:
MISSING

Proposed source:
Adapter constant for the Futures Lab scanner, likely `futures` or
`crypto_futures` depending on CTO-approved vocabulary.

Complexity:
LOW

Notes:
The scanner module is specifically futures-oriented, but the database row does
not store an asset class.

### Market.status

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/futures_scanner/service.py`

Notes:
`_discover_symbols()` filters Binance exchange info for symbols where
`status == TRADING`, quote asset matches the configured quote asset and
`contractType == PERPETUAL`. Persisted rows do not store `status`, but rows in
the latest scanner batch can be treated as `active`.

## Opportunity Score

### OpportunityScore.symbol

Status:
EXISTS

Source:
`packages/futures_scanner/service.py`, `packages/futures_lab/schema.py`

Notes:
Available in `futures_scanner_rankings.symbol` and
`futures_lab_decisions.symbol`.

### OpportunityScore.score

Status:
EXISTS

Source:
`packages/futures_scanner/service.py`, `packages/futures_lab/schema.py`

Notes:
`score` exists in `futures_scanner_rankings` and `futures_lab_decisions`.
The Phase 2 contract expects `0-100`; the scanner score must be confirmed to
use the same scale before it is exposed directly.

### OpportunityScore.confidence

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`services/api/routes/futures_ghost_tracking.py`,
`services/api/routes/futures_diagnostics.py`, `packages/risk_adaptation/memory.py`

Notes:
There is no direct `confidence` field for opportunity scores. Related concepts
exist as `context_confidence_label`, `health_score`, `signal_ok`,
`trend_supports_direction` and sample-backed ghost/setup summaries. A numeric
confidence value can be derived, but the formula needs CTO approval.

### OpportunityScore.sample_size

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/risk_adaptation/setup_memory.py`,
`services/api/routes/futures_ghost_sql.py`

Notes:
Setup memory exposes `trade_count`; ghost tracking exposes settled and total
counts. Neither is joined directly to scanner opportunities. The adapter must
choose whether sample size is setup-based, symbol/setup-based or ghost-based.

### OpportunityScore.updated_at

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/futures_scanner/service.py`, `packages/futures_lab/schema.py`

Notes:
Scanner rows use `scanned_at`; decisions use `observed_at`. Contract field
`updated_at` can be mapped from the selected source timestamp.

## Market Regime

### MarketRegime.symbol

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/futures_scanner/service.py`

Notes:
Futures scanner rows have `symbol` and `regime_bias`. The legacy
`market_regimes` table stores global regime rows keyed by `regime`, not by
symbol.

### MarketRegime.regime

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/futures_scanner/service.py`, `services/market_service.py`

Notes:
The contract allows `trending`, `ranging`, `volatile` and `unstable`. Futures
Lab has `regime_bias`, `direction_hint`, `realized_volatility_pct`,
`trend_strength_pct` and a legacy `market_regimes.regime`. A mapping is needed
to convert current labels and metrics into contract values.

### MarketRegime.confidence

Status:
MISSING

Proposed source:
Derived from `trend_strength_pct`, `realized_volatility_pct`,
`long_short_balance`, `funding_rate`, `order_valid` and scanner score.

Complexity:
MEDIUM

Notes:
No explicit numeric confidence exists for per-symbol regime classification.

### MarketRegime.updated_at

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/futures_scanner/service.py`, `services/market_service.py`

Notes:
Use `futures_scanner_rankings.scanned_at` for per-symbol regimes. The legacy
`market_regimes.updated_at` is available only for global regime rows.

## Pattern Ranking

### PatternRanking.pattern_id

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/risk_adaptation/setup_memory.py`, `packages/futures_lab/schema.py`

Notes:
Futures Lab uses `setup_key` and `setup_key_version`, not `pattern_id`.
`pattern_id` can be derived from `setup_key`, but stability rules must be
defined before exposing it as `PAT-0001` style identifiers.

### PatternRanking.symbol

Status:
EXISTS

Source:
`packages/risk_adaptation/setup_memory.py`, `packages/futures_lab/schema.py`

Notes:
Symbol exists in symbol/side/setup summaries and Futures Lab decisions.

### PatternRanking.profit_factor

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`services/api/routes/futures_ghost_tracking.py`,
`packages/risk_adaptation/setup_memory.py`

Notes:
Ghost tracking calculates profit factor by gate reason and contextual slices.
Setup memory exposes average win and average loss, which can derive profit
factor for setup keys. No direct persisted per-pattern field exists.

### PatternRanking.sharpe

Status:
MISSING

Proposed source:
Derived from adaptive risk event returns or existing validation modules before
exposure.

Complexity:
MEDIUM

Notes:
Sharpe exists elsewhere for strategy performance and optimization, but not for
Futures Lab setup rankings.

### PatternRanking.win_rate

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/risk_adaptation/setup_memory.py`,
`packages/risk_adaptation/memory.py`

Notes:
Setup memory returns `trade_count`, `win_count` and calculated `win_rate` via
`_recommendation_from_summary()`.

### PatternRanking.sample_size

Status:
EXISTS BUT REQUIRES TRANSFORMATION

Source:
`packages/risk_adaptation/setup_memory.py`

Notes:
`trade_count` maps cleanly to `sample_size` for setup-based patterns.

## Contract Coverage

Market:
75%

Opportunity Score:
70%

Market Regime:
50%

Pattern Ranking:
65%

Overall:
65%

## Integration Readiness

### Ready Now

- Market symbols from the latest futures scanner batch.
- Opportunity score from `futures_scanner_rankings.score`, pending scale
  confirmation.
- Market ranking order from `rank_position`.
- Scanner freshness from `scanned_at`.
- Pattern sample size and win rate from setup memory summaries.

### Requires Transformation

- Exchange and asset class constants for scanner-derived markets.
- Market status from scanner inclusion rules.
- Opportunity confidence from available scanner, decision, ghost and setup
  signals.
- Opportunity sample size from setup or ghost tracking aggregates.
- Contract regime values from `regime_bias`, volatility and trend metrics.
- Pattern IDs from `setup_key`.
- Pattern profit factor from setup memory or ghost aggregates.

### Requires New Development

- Stable `pattern_id` policy if `setup_key` is not sufficient.
- Numeric market-regime confidence calculation.
- Per-pattern Sharpe calculation for Futures Lab setup rankings.
- Contract-shaped read-only API adapter or frontend service adapter.
- Optional historical snapshot tables if POC Intelligence needs time-series
  comparisons beyond latest scanner batches.

## Risks

- `setup_key` may not be stable enough to serve as a public `pattern_id`.
- Opportunity confidence is not a first-class numeric field today.
- Market regime labels do not match the Phase 2 vocabulary directly.
- Pattern Sharpe is missing for Futures Lab setup rankings.
- `exchange` and `asset_class` are implied by scanner configuration, not stored
  per row.
- Opportunity `sample_size` can come from multiple sources, which may create
  inconsistent interpretation if not standardized.
- Historical tracking exists in scanner and decision tables, but POC contract
  semantics currently describe latest list endpoints only.
- Existing internal dashboard routes are not suitable as the public POC
  Intelligence contract because response envelopes, pagination and filters do
  not match Phase 2.

## Next Phase Recommendation

Phase 3 should be the smallest read-only real data integration:

Build a frontend service adapter that reads one existing Futures Lab dashboard
source for the latest `futures_scanner_rankings` data and transforms it into POC
Intelligence market rankings and opportunity scores.

Scope should be limited to:

- Latest markets.
- Latest opportunity scores.
- No pattern rankings.
- No historical charts.
- No database migrations.
- No backend endpoint changes unless an existing read-only route is unavailable.

This gives maximum visible value with minimum engineering effort while avoiding
the unresolved confidence, pattern ID, Sharpe and regime taxonomy gaps.

# Phase 6 - Scanner Context Expansion

## Goals

- Expand the market rankings experience with context already available in
  Futures Lab.
- Help users understand why markets are ranked highly.
- Show scanner freshness without adding backend functionality or new API calls.

## Data Source

The phase continued to use the existing Futures Lab internal dashboard state
endpoint:

`the internal dashboard state endpoint`

No new endpoints, backend changes, database changes or scoring systems were
created.

## Fields Exposed

The dashboard now surfaces these existing `futures_scanner_rankings` fields:

- `ranking_reason`
- `price_change_pct`
- `realized_volatility_pct`
- `trend_strength_pct`
- `funding_rate`
- `direction_hint`
- `regime_bias`
- `rank_position`
- `score`
- `scanned_at`
- `symbol`

The dashboard also uses existing `data_freshness` entries:

- `futures_scanner`
- `futures_lab_decision`
- `futures_lab_observation`

## Fields Rejected

The following areas remain out of scope for this phase:

- Setup memory
- Ghost tracking
- Decision explorer
- Historical charts
- New market regimes
- New ranking calculations
- New scores or derived intelligence systems

They were rejected because Phase 6 required consuming current scanner data only.

## Integration Approach

All field extraction and normalization remains isolated in
`src/services/api/market-rankings.ts`.

React dashboard components receive already-shaped data and only handle
presentation concerns such as labels, table layout and number formatting.

## UX Decisions

- Kept the existing dashboard layout and ranking table structure.
- Promoted symbol and score as the fastest visual signals.
- Added `ranking_reason` directly under the symbol so users can see why a market
  is ranked.
- Grouped supporting scanner metrics into compact chips to avoid table clutter.
- Added a freshness strip above the rankings so scanner, decision and
  observation recency are visible before reading the table.
- Displayed only fields that exist in the Futures Lab payload.

## Validation

- `npm run lint` must pass.
- `npm run build` must pass.
- Live dashboard validation should confirm scanner context text and freshness
  labels render from Futures Lab payload data.

## Limitations

- `funding_rate` is displayed as the raw scanner value because no additional
  transformation or interpretation was introduced.
- Freshness labels depend on the existing Futures Lab `data_freshness` payload.
- Opportunity rankings, pattern discovery and regime analysis remain outside
  this integration phase.

## Remaining Opportunities

- Add focused tests for scanner data transformations.
- Add contract validation once Futures Lab response shapes are finalized.
- Replace other mock dashboard panels only when their existing Futures Lab
  sources have a similarly low-risk access path.

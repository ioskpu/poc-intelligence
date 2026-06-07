# Market Ranking Contract

## Purpose

Market rankings expose the ordered universe of instruments that Futures Lab has
evaluated for statistical consistency and opportunity quality.

This contract is read-only. It does not imply a trade recommendation and does
not support execution.

## Entity: Market

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `symbol` | string | yes | Canonical market symbol used by Futures Lab and the frontend. |
| `exchange` | string | yes | Exchange, venue or data source identifier. |
| `asset_class` | string | yes | Asset category such as `crypto`, `futures`, `equity_index`, `commodity` or `fx`. |
| `status` | string | yes | Market availability state. Expected values: `active`, `inactive`, `maintenance`, `deprecated`. |

## Ranking Philosophy

Markets should be ranked by quantitative usefulness for intelligence display,
not by price movement alone.

Recommended ranking inputs:

- Consistency of historical signal behavior.
- Current data freshness.
- Minimum sample adequacy.
- Stability of recent opportunity and regime estimates.
- Operational status of the market.

## Response Shape

```json
{
  "symbol": "BTCUSDT",
  "exchange": "BINANCE",
  "asset_class": "crypto",
  "status": "active"
}
```

## Validation Rules

- `symbol` must be unique within a response page.
- `exchange` must match a known Futures Lab source identifier.
- `asset_class` should come from a controlled vocabulary.
- `status=deprecated` markets may be returned only when explicitly requested.

## Frontend Interpretation

The frontend may display active markets by default and hide inactive,
maintenance or deprecated markets unless filters request them.

The frontend must not infer trade direction from market ranking alone.

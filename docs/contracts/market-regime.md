# Market Regime Contract

## Purpose

Market regimes describe the current statistical state of a market as classified
by Futures Lab.

The regime is contextual intelligence only and does not prescribe an action.

## Regime Values

| Regime | Definition |
| --- | --- |
| `trending` | Directional behavior is persistent enough that continuation patterns may be statistically relevant. |
| `ranging` | Price behavior is bounded or mean-reverting enough that breakout assumptions may be unreliable. |
| `volatile` | Price dispersion is elevated, but the market remains analyzable with higher uncertainty. |
| `unstable` | Data or behavior is sufficiently noisy that signal interpretation should be treated with caution. |

## Interpretation

`confidence` is a decimal from `0` to `1` representing the reliability of the
regime classification.

`updated_at` is the UTC timestamp when Futures Lab generated the regime.

## Return Shape

```json
{
  "symbol": "BTCUSDT",
  "regime": "trending",
  "confidence": 0.77,
  "updated_at": "2026-06-07T20:30:00Z"
}
```

## Validation Rules

- `regime` must be one of `trending`, `ranging`, `volatile` or `unstable`.
- `confidence` must be a number between `0` and `1`.
- `updated_at` must be ISO 8601 in UTC.
- A market should have only one primary regime per evaluation snapshot.

## Frontend Interpretation

The frontend may use regime labels to group or filter markets.

The frontend should treat `unstable` as a warning state and avoid presenting it
as an opportunity by itself.

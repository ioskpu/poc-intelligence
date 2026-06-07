# Phase 3.2

## Objective

Harden the first real-data integration before expanding product scope.

No new features, endpoints, intelligence systems or UI redesigns were added.

## Normalization Rules

Futures Lab `futures_scanner_rankings.score` currently returns decimal values in
the `0.0-1.0` range.

POC Intelligence displays ranking scores in the `0-100` range.

Normalization rule:

- If backend `score` is between `0` and `1`, multiply by `100`.
- If backend `score` is greater than `1`, treat it as already `0-100`.
- Round to the nearest integer.
- Clamp the final value to `0-100`.
- Non-finite values become `0`.

Example:

`0.961401 -> 96`

This rule is implemented only in `src/services/api/market-rankings.ts`.
React components do not perform score, direction, regime or timestamp
transformations.

## Transformation Layer Review

All current ranking transformations happen in `src/services/api`.

| Backend field | Transformation | Frontend field |
| --- | --- | --- |
| `symbol` | trim string, fallback `UNKNOWN` | `MarketRanking.symbol` |
| `rank_position` | preserved by source ordering | table order |
| `score` | normalized to `0-100` | `MarketRanking.consistencyScore` |
| `direction_hint` | maps long/bull to `Bullish`, short/bear to `Bearish`, else `Neutral` | `MarketRanking.direction` |
| `regime_bias` | underscores replaced and title-cased | `MarketRanking.regime` |
| `scanned_at` | parsed as ISO timestamp for freshness fallback | snapshot timestamp |

## Environment Requirements

Required environment variables:

- `FUTURES_LAB_API_BASE_URL`
- `FUTURES_LAB_INTERNAL_API_KEY`

Optional environment variable:

- `FUTURES_LAB_REQUEST_TIMEOUT_MS`

The integration no longer silently falls back to `127.0.0.1:8000` or
`dev-secret-key`.

Current observed Futures Lab runtime:

- `FUTURES_LAB_API_BASE_URL=http://192.168.0.212:8010`
- `FUTURES_LAB_REQUEST_TIMEOUT_MS=20000`

The internal API key must be set in the runtime environment and must not be
committed.

## Error Handling Behavior

The service layer now returns explicit errors for these conditions:

- Missing `FUTURES_LAB_API_BASE_URL`.
- Missing `FUTURES_LAB_INTERNAL_API_KEY`.
- Invalid `FUTURES_LAB_API_BASE_URL`.
- Invalid `FUTURES_LAB_REQUEST_TIMEOUT_MS`.
- `401` or `403`: authentication failure.
- `404`: dashboard state endpoint not found.
- `500+`: Futures Lab dashboard state unavailable.
- Timeout: dashboard state request timed out.
- Network failure: dashboard state unreachable.
- Invalid JSON shape: dashboard state returned an invalid shape.

The dashboard error boundary displays these messages without adding UI-side
business logic.

## Live Validation Evidence

Validation used the observed Futures Lab runtime at `192.168.0.212:8010`.

Latest sampled backend row:

```json
{
  "symbol": "BSBUSDT",
  "score": 0.961401,
  "direction_hint": "short_bias",
  "regime_bias": "crowded_longs"
}
```

Expected display score:

`96`

Observed dashboard result:

- `/dashboard` returned HTTP `200`.
- HTML included live symbol `BSBUSDT`.
- HTML included live regime label `Crowded Longs`.
- HTML included display score `96`.

## Remaining Contract Gaps

- `market` is still inferred as `Binance USDT Perpetual`.
- `exchange` is not returned by `futures_scanner_rankings`.
- `asset_class` is not returned by `futures_scanner_rankings`.
- `score` is now normalized correctly, but Futures Lab still has not formally
  declared whether the source field is always `0-1`.
- Response envelope, pagination and filters still come from the internal
  dashboard endpoint, not the Phase 2 `/api/v1/markets` contract.
- `rank_position` is not stored on the frontend model, although source ordering
  is preserved.

## Files Changed

- `.env.example`
- `README.md`
- `docs/phase-3-2.md`
- `docs/roadmap.md`
- `src/features/dashboard/market-rankings.tsx`
- `src/services/api/market-rankings.ts`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed.
- Live dashboard rendering with real Futures Lab data: passed.

## Next Recommendation

Proceed only after deployment environment variables are set.

Next smallest implementation phase:

Phase 3.3 - Deployment Configuration Verification

Goal:
verify the production deployment environment uses the real Futures Lab runtime
URL and internal API key, without expanding product features.

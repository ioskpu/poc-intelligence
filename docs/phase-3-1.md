# Phase 3.1

## Objective

Verify the Phase 3 market ranking integration against live Futures Lab data.

This was a validation-only phase. No features, endpoints, backend logic or UI
redesigns were added.

## Validation Result

Result:
PARTIAL SUCCESS WITH REQUIRED FIXES

The live Futures Lab endpoint is reachable and returns usable
`futures_scanner_rankings` records. POC Intelligence can render those live
symbols on `/dashboard`.

However, validation found two issues that should be fixed in the next
implementation phase:

- POC Intelligence defaults to port `8000`, while the live Futures Lab dashboard
  API is running on port `8010`.
- Backend `score` values are decimal confidence-like values around `0.96`, but
  POC currently treats them as `0-100`, causing the UI to show `1` instead of
  approximately `96`.

## Runtime Configuration

Observed Futures Lab runtime:

- API host: `192.168.0.212`
- API port: `8010`
- Health endpoint: `GET /health`
- Dashboard state endpoint: `GET /internal/dashboard/state`
- Authentication: required
- Auth header: `X-API-KEY`

Evidence:

- `GET http://192.168.0.212:8010/health` returned HTTP `200`.
- `GET http://192.168.0.212:8010/internal/dashboard/state` with an invalid key
  returned HTTP `401`.
- `GET http://192.168.0.212:8010/internal/dashboard/state` with the runtime key
  returned HTTP `200`.

Local ports checked:

- `127.0.0.1:8000`: closed
- `127.0.0.1:8010`: closed
- `127.0.0.1:5432`: closed

Remote ports checked:

- `192.168.0.212:8010`: active uvicorn service
- `192.168.0.212:8000`: unavailable during validation

## Endpoint Verification

Endpoint:

`GET /internal/dashboard/state`

Result:

- HTTP `200` with valid `X-API-KEY`.
- Response included `futures_scanner_rankings`.
- Total records returned: `3`.
- Snapshot generated at: `2026-06-07T23:09:21.193583+00:00`.

## Example Payload

Example row from `futures_scanner_rankings`:

```json
{
  "scan_batch_id": "futures-scan-1780873256",
  "symbol": "BEATUSDT",
  "rank_position": 1,
  "score": 0.962732,
  "direction_hint": "long_bias",
  "regime_bias": "crowded_longs",
  "last_price": 3.5552,
  "realized_volatility_pct": 1.71347,
  "trend_strength_pct": 5.407548,
  "order_valid": true,
  "ranking_reason": "liquidez fuerte; rango útil; sesgo long_bias",
  "scanned_at": "2026-06-07T23:00:56.311326+00:00"
}
```

Observed live ranking symbols:

- `BEATUSDT`
- `ETHUSDT`
- `BSBUSDT`

## Mapping Verification

| Backend field | Frontend field | Status | Notes |
| --- | --- | --- | --- |
| `symbol` | `MarketRanking.symbol` | OK | Rendered live symbols on `/dashboard`. |
| `score` | `MarketRanking.consistencyScore` | ISSUE | Backend sends decimal values near `0.96`; frontend currently rounds to `1`. |
| `direction_hint` | `MarketRanking.direction` | OK | `long_bias` maps to `Bullish`; `short_bias` maps to `Bearish`. |
| `regime_bias` | `MarketRanking.regime` | OK | `crowded_longs` maps to `Crowded Longs`. |
| `scanned_at` | freshness source | OK | Can provide latest ranking timestamp. |
| `rank_position` | display order | OK BY SOURCE | Endpoint returns rows already ordered. Frontend preserves returned order. |

Missing required fields for Phase 3:

- None for minimal market ranking display.

Fields inferred rather than returned:

- `market`: currently displayed as `Binance USDT Perpetual`.
- `exchange`: not used directly in the current UI.
- `asset_class`: not used directly in the current UI.

## Frontend Rendering Evidence

POC Intelligence was run with:

- `FUTURES_LAB_API_BASE_URL=http://192.168.0.212:8010`
- `FUTURES_LAB_INTERNAL_API_KEY=<runtime key>`

Dashboard result:

- `/dashboard` returned HTTP `200`.
- HTML included live symbol `BEATUSDT`.
- HTML included live regime label `Crowded Longs`.
- HTML showed score `1`, confirming the score scaling issue.

## Error Handling Review

### Loading State

Status:
COMPILES, NOT OBSERVABLE IN LIVE REQUEST

Notes:
`src/app/dashboard/loading.tsx` is present and the route builds successfully.
The live endpoint responded fast enough that the loading state was not directly
observable through the HTTP validation.

### Empty State

Status:
NOT TRIGGERED BY LIVE DATA

Notes:
The live endpoint returned 3 usable records, so the empty state was not reached
under real conditions. The empty state remains available for a valid response
with an empty `futures_scanner_rankings` array.

### Error State

Status:
VERIFIED

Evidence:
Running POC with an invalid `FUTURES_LAB_INTERNAL_API_KEY` produced a dashboard
error message:

`Futures Lab dashboard state failed: 401`

## Discovered Issues

### Issue 1: API Port Mismatch

Root cause:
The live Futures Lab dashboard API is running on `192.168.0.212:8010`, while
POC Intelligence defaults to `http://127.0.0.1:8000`.

Required change:
Update deployment environment variables to use:

`FUTURES_LAB_API_BASE_URL=http://192.168.0.212:8010`

Implementation complexity:
LOW

### Issue 2: Score Scale Mismatch

Root cause:
Futures Lab returns `score` as a decimal value near `0.96`. POC Intelligence
currently normalizes by rounding and clamping as if the value were already on a
`0-100` scale.

Required change:
Update the frontend transformation so values in the `0-1` range are multiplied
by `100` before display.

Implementation complexity:
LOW

### Issue 3: Runtime Key Handling

Root cause:
The endpoint requires `X-API-KEY`. The key is available in the running dashboard
environment but is not documented in POC Intelligence deployment configuration.

Required change:
Set `FUTURES_LAB_INTERNAL_API_KEY` in the deployment environment and avoid
committing secrets.

Implementation complexity:
LOW

## Recommended Fixes

Do not create new Futures Lab endpoints.

Recommended next implementation phase:

Phase 3.2 - Ranking Integration Fixes

Scope:

- Set the production/default deployment target to the actual Futures Lab runtime
  host and port.
- Fix score scaling for decimal `0-1` backend values.
- Add a small transformation test or documented assertion for score mapping.
- Keep the integration read-only.

## Recommended Next Phase

After Phase 3.2 fixes, proceed to the smallest expansion of live data:

- Replace opportunity ranking mocks only if a clean existing source is verified.
- Do not add pattern rankings or regimes until their contract gaps are resolved.

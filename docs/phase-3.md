# Phase 3

## Goals

- Replace mock market ranking data with real Futures Lab ranking data.
- Keep the integration read-only and minimal.
- Consume existing Futures Lab data before considering any new backend work.

## Data Source Selected

Selected source:

`GET /internal/dashboard/state`

Futures Lab source table behind the endpoint:

`futures_scanner_rankings`

Source modules reviewed:

- `/Users/luiscorales/Documents/NewWeb3/ProofOfConsistency-clean/services/api/routes/internal_routes.py`
- `/Users/luiscorales/Documents/NewWeb3/ProofOfConsistency-clean/packages/futures_scanner/service.py`

## Integration Approach

Priority chosen:

1. Existing API endpoint

The endpoint already returns `futures_scanner_rankings` as part of the internal
dashboard state. POC Intelligence reads that endpoint server-side through
`src/services/api/market-rankings.ts`.

No new Futures Lab API endpoints were created.
No direct database reads were added.
No frontend component performs direct `fetch` calls.

## Refresh Frequency

Futures scanner refresh is configured in Futures Lab through
`FUTURES_SCANNER_INTERVAL_SECONDS`, defaulting to `600` seconds.

POC Intelligence requests the latest dashboard state on each dashboard request
with `cache: "no-store"`.

## Files Changed

- `.env.example`
- `.gitignore`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/loading.tsx`
- `src/app/dashboard/error.tsx`
- `src/features/dashboard/market-rankings.tsx`
- `src/services/api/index.ts`
- `src/services/api/market-rankings.ts`
- `src/services/api/mock-data.ts`

## Limitations

- Futures Lab was not running locally during implementation validation, so live
  data display depends on a running Futures Lab API process.
- The existing endpoint requires `X-API-KEY`.
- The integration uses the internal dashboard endpoint because it is the
  cleanest existing read-only source.
- Opportunity rankings, pattern discovery and regime analysis remain outside
  Phase 3 scope.
- Market `exchange` and `asset_class` are inferred from the scanner source, not
  persisted in `futures_scanner_rankings`.

## Future Improvements

- Configure deployment environment variables for the Futures Lab API base URL
  and internal API key.
- Add a dedicated read-only public contract endpoint only if CTO approves it in
  a later backend phase.
- Replace remaining mock non-ranking dashboard sections in separate phases.
- Add contract validation once the Futures Lab response shape is formalized.

# Phase 32 - Observatory Snapshot Client

## Objective
Make the public dashboard consume the Observatory Snapshot Gateway as the primary data source while preserving the existing UI and demo fallback.

## What changed
- Added `src/services/api/observatory-client.ts`.
- Updated `src/services/api/index.ts` so `getIntelligenceSnapshot()` resolves:
  1. Observatory Snapshot Gateway via `POC_INTELLIGENCE_API_URL`
  2. Demo snapshot fallback
- Kept `createPublicDemoSnapshot()` intact for local recovery and preview usage.
- Removed the public dashboard path from direct `FUTURES_LAB_*` dependency.

## Data resolution flow
```text
getIntelligenceSnapshot()
  -> resolveObservatorySnapshot()
     -> if POC_INTELLIGENCE_API_URL exists
        -> GET /observatory/snapshot
        -> normalize payload into IntelligenceSnapshot
        -> source = gateway
     -> else
        -> source = demo
     -> on gateway failure
        -> log fallback reason and error
        -> return demo snapshot
```

## Environment variables
Required for the public live path:
- `POC_INTELLIGENCE_API_URL`

Still retained for legacy / beta / backend workflows:
- `FUTURES_LAB_API_BASE_URL`
- `FUTURES_LAB_INTERNAL_API_KEY`
- `FUTURES_LAB_DATABASE_URL`
- `FUTURES_LAB_DASHBOARD_STATE_PATH`

## Snapshot normalization
The gateway response is normalized in the client to preserve the existing frontend contract:
- `marketRankings` -> `MarketRanking[]`
- `marketSummary` -> `MarketSummary`
- `labDecisions` / `recentLabDecisions` -> `LabDecision[]`
- `setupMemory` -> `SetupMemory[]`
- `ghostTracking` -> `GhostTracking`
- `changeAwareness` -> `ChangeAwareness`
- `betaLiveInsights` -> `BetaLiveInsights`
- `opportunityRankings` / `patternDiscovery` / `regimeAnalysis` -> typed arrays

## Source and fallback logging
The server logs now clearly record:
- snapshot source
- fallback activation
- gateway errors

This is intentionally server-side only. The dashboard UI remains unchanged.

## Example real response
Observed via the Cloudflare hostname and normalized by the frontend client:

```json
{
  "generatedAt": "2026-06-10T13:38:13.046610+00:00",
  "marketSummary": {
    "totalMarkets": 3,
    "topSymbol": "BTWUSDT",
    "topScore": 99.75,
    "lastUpdatedAt": "2026-06-10T13:31:06.085362+00:00"
  },
  "intelligenceBrief": {
    "headline": "BTWUSDT leads the current Futures Lab ranking at 99.75/100."
  },
  "betaLiveInsights": {
    "missingFields": []
  }
}
```

## Missing fields
No required fields were missing in the live gateway response.

The gateway still returns empty arrays for:
- `opportunityRankings`
- `patternDiscovery`
- `regimeAnalysis`

Those remain part of the contract for compatibility.

## Risks
- The public dashboard now depends on a single gateway request for its live path.
- If the gateway is unavailable, the UI will fall back to demo data.
- The live response still has sections that are empty by design, which may need later product decisions.

## Validation
- Lint: passed
- Build: passed
- Local dashboard: `http://localhost:4000/dashboard?lang=en`
- Local dashboard HTTP status: `200`
- Local screenshots:
  - `/Users/luiscorales/Desktop/poc-observatory-desktop.png`
  - `/Users/luiscorales/Desktop/poc-observatory-tablet.png`
- Vercel production URL: `https://poc-intelligence.vercel.app`
- Current production deployment URL: `https://poc-intelligence-jq1l7sjjg-ioskpus-projects.vercel.app`
- Observatory gateway healthcheck: `https://api.poc-engine.lat/observatory/health` -> `200`
- Production dashboard: `200`
- Production screenshots:
  - `/Users/luiscorales/Desktop/poc-observatory-prod-desktop.png`
  - `/Users/luiscorales/Desktop/poc-observatory-prod-tablet.png`
- Production deployment commit: `b0c904f`

## Recommendation
Keep the gateway as the authoritative source for the public observatory snapshot and leave demo mode as a recovery path only.

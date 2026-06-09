# Phase 26 - Public Dashboard Data Audit

## Scope

Audit of the current public dashboard data sources.
No code changes were made.

## How the dashboard gets data

`src/app/dashboard/page.tsx` calls `getIntelligenceSnapshot()`.

That snapshot has two operating modes:

- **Live mode**: uses Futures Lab data through `FUTURES_LAB_*` runtime variables.
- **Public demo mode**: uses `createPublicDemoSnapshot()` with local mock content only.

So the dashboard is not a single data model. It is a mode-driven snapshot with a mix of:

- real Futures Lab data
- mock/demo data
- static UI chrome

## View-by-view audit

| View / Component | Source of data | Real / Mock / Hybrid | Depends on Futures Lab | Apt for beta users |
| --- | --- | --- | --- | --- |
| `PublicDemoBanner` | Static copy from `src/lib/i18n.ts` | Static | No | Yes |
| `AppSidebar` | Static navigation labels from `src/lib/i18n.ts` | Static | No | Yes |
| `TopBar` | `snapshot.generatedAt` plus static badge/actions | Hybrid | Yes in live mode, no in demo mode | Yes |
| `IntelligenceBrief` | Derived from `marketRankings`, `marketSummary`, `labDecisions`, `setupMemory`, `ghostTracking` | Hybrid | Yes in live mode, no in demo mode | Yes |
| `ChangeAwareness` | Live: Futures Lab database queries in `src/services/api/change-awareness.ts`; Demo: `createPublicDemoSnapshot()` | Hybrid | Yes in live mode, no in demo mode | Yes |
| `MarketSummaryCards` | `snapshot.marketSummary` | Hybrid | Yes in live mode, no in demo mode | Yes |
| `FreshnessStrip` | `snapshot.marketSummary.freshness` | Hybrid | Yes in live mode, no in demo mode | Yes |
| `MarketRankings` | Live: `futures_scanner_rankings`; Demo: mock snapshot | Hybrid | Yes in live mode, no in demo mode | Yes |
| `RankingExplanation` | `snapshot.marketSummary.lastUpdatedAt` | Hybrid | Yes in live mode, no in demo mode | Yes |
| `RecentLabDecisions` | Live: Futures Lab dashboard state; Demo: mock snapshot | Hybrid | Yes in live mode, no in demo mode | Yes |
| `SetupMemory` | Live: Futures Lab dashboard state; Demo: mock snapshot | Hybrid | Yes in live mode, no in demo mode | Yes |
| `GhostTracking` | Live: Futures Lab dashboard state; Demo: mock snapshot | Hybrid | Yes in live mode, no in demo mode | Yes |
| `OpportunityRankings` | `mockOpportunityRankings` from `src/services/api/mock-data.ts` | Mock | No | Yes, but only as demo content |
| `PatternDiscovery` | `mockPatternDiscovery` from `src/services/api/mock-data.ts` | Mock | No | Yes, but only as demo content |
| `RegimeAnalysis` | `mockRegimeAnalysis` from `src/services/api/mock-data.ts` | Mock | No | Yes, but only as demo content |

## Component notes

### Real-data surfaces in live mode

These sections consume live Futures Lab data when the required runtime variables are present:

- `ChangeAwareness`
- `MarketRankings`
- `RecentLabDecisions`
- `SetupMemory`
- `GhostTracking`
- `IntelligenceBrief`
- `MarketSummaryCards`
- `FreshnessStrip`
- `RankingExplanation`

### Mock-only surfaces

These sections are mock in both live and demo modes:

- `OpportunityRankings`
- `PatternDiscovery`
- `RegimeAnalysis`

### Static UI surfaces

These do not consume market data:

- `PublicDemoBanner`
- `AppSidebar`

## Important distinction

The dashboard can look live while still containing mock-only sections.
That means “public dashboard” does not equal “all sections are real data”.

The current product is a mixed surface:

- core observatory sections can be real
- some lower-priority research sections remain demo content

## Beta readiness

For beta users, the current dashboard is acceptable if the positioning is clear:

- core sections show live or credible observatory data
- mock-only sections are clearly secondary
- the public demo banner sets the expectation correctly

If the product promise becomes “everything is live,” then the mock-only sections are not ready yet.

## Conclusion

The public dashboard is **hybrid**:

- real for the core observatory surfaces in live mode
- mock for the opportunity/pattern/regime sections
- static for the UI chrome

This is suitable for beta validation as long as the demo/live expectations are explicit.

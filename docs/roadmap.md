# Roadmap

## Phase 0 - Completed

- Defined the project charter.
- Confirmed the product is an intelligence platform, not a trading platform.
- Confirmed no trade execution, financial advice, authentication, billing or
  user accounts for the initial foundation.
- Established engineering principles around simplicity, incremental delivery,
  maintainability, small files and single responsibility.

## Phase 1 - Completed

- Created the Next.js App Router project foundation.
- Added TypeScript and TailwindCSS.
- Added shadcn-compatible UI primitives.
- Built the landing page.
- Built the dashboard shell.
- Added mock data for market rankings, opportunity rankings, pattern discovery
  and regime analysis.
- Added the `src/services/api` abstraction layer.
- Verified lint and production build.

## Phase 1.1 - Completed

- Created the official Gitea repository.
- Configured `origin`.
- Committed and pushed the initial repository state.
- Added README, architecture and roadmap governance documentation.

## Phase 2 - Completed

- Defined the Market Intelligence API contract.
- Added formal documentation for markets, opportunity scores, regimes and
  pattern rankings.
- Proposed versioned read-only endpoints under `/api/v1`.
- Added documentation-only TypeScript models.

## Phase 2.1 - Completed

- Added mandatory source control governance for all future phases.
- Audited Futures Lab backend capabilities against the Phase 2 contract.
- Documented contract coverage, integration readiness, risks and the smallest
  recommended implementation phase.

## Phase 3 - Completed

- Integrated real market ranking data from the existing Futures Lab internal
  dashboard state endpoint.
- Kept access isolated in `src/services/api`.
- Added minimal loading, empty and error states.
- Kept the scope limited to market rankings only.

## Phase 3.2 - Completed

- Fixed Futures Lab score normalization from decimal `0-1` values to display
  scores in the `0-100` range.
- Removed unsafe default API host and API key fallbacks.
- Added explicit environment validation and clearer error messages.
- Verified live rendering against the observed Futures Lab runtime.

## Phase 4 - Planned

- Expand read-only Futures Lab integration beyond market rankings.
- Define environment variables for API base URL and runtime configuration.
- Keep all network access inside `src/services/api`.
- Replace remaining mock non-ranking dashboard sections when contracts are
  ready.

## Phase 5 - Planned

- Add dashboard filters for market, regime and horizon.
- Add client-side refresh behavior if needed.
- Introduce React Query only if live client-side data management requires it.

## Phase 6 - Planned

- Add historical intelligence views.
- Support comparisons across snapshots, regimes and markets.
- Add charting only where it improves interpretation.
- Add focused tests for pure business logic.
- Add API contract validation when Futures Lab response shapes are stable.
- Add regression coverage for data transformation utilities.

## Phase 7 - Planned

- Evaluate account, billing or subscription capabilities only if explicitly
  approved.
- Keep commercial features separate from the intelligence dashboard.
- Avoid introducing authentication before the product need is confirmed.

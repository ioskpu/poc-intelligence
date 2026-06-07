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

## Phase 2 - Planned

- Connect the frontend to read-only Futures Lab API endpoints.
- Define environment variables for API base URL and runtime configuration.
- Keep all network access inside `src/services/api`.
- Add initial loading and error handling for live data.

## Phase 3 - Planned

- Add dashboard filters for market, regime and horizon.
- Add client-side refresh behavior if needed.
- Introduce React Query only if live client-side data management requires it.

## Phase 4 - Planned

- Add historical intelligence views.
- Support comparisons across snapshots, regimes and markets.
- Add charting only where it improves interpretation.

## Phase 5 - Planned

- Add focused tests for pure business logic.
- Add API contract validation when Futures Lab response shapes are stable.
- Add regression coverage for data transformation utilities.

## Phase 6 - Planned

- Prepare production deployment hardening.
- Document Vercel environment configuration.
- Add basic observability and deployment checks.

## Phase 7 - Planned

- Evaluate account, billing or subscription capabilities only if explicitly
  approved.
- Keep commercial features separate from the intelligence dashboard.
- Avoid introducing authentication before the product need is confirmed.

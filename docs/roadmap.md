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

## Phase 4 - Completed

- Added a compact summary section for total markets, top symbol, top score and
  latest scan timestamp.
- Added a simple ranking explanation panel.
- Improved ranking table readability with rank, direction and regime hint.
- Improved empty and error state messaging for first-time users.

## Phase 5 - Completed

- Audited existing Futures Lab sources for high-value market intelligence
  surfaces.
- Documented data source purpose, fields, refresh patterns, user value,
  engineering effort and suitability.
- Prioritized opportunities already available without new backend systems.
- Recommended scanner context expansion as the smallest next product phase.

## Phase 6 - Completed

- Exposed existing scanner context fields in the ranking table.
- Added ranking reasons and supporting metrics from `futures_scanner_rankings`.
- Added a compact freshness strip using existing `data_freshness` values.
- Kept all transformations inside `src/services/api`.

## Phase 7 - Completed

- Added a compact Recent Lab Decisions dashboard section.
- Surfaced existing `capital_control.futures_lab.recent_decisions` records.
- Kept decision language framed as research activity and lab observations.
- Avoided setup memory, ghost tracking, execution language and new backend
  functionality.

## Future Planned Work

- Add focused tests for pure business logic.
- Add API contract validation when Futures Lab response shapes are stable.
- Add regression coverage for data transformation utilities.
- Evaluate historical intelligence views only after the current scanner
  experience is stable.

## Future Considerations

- Evaluate account, billing or subscription capabilities only if explicitly
  approved.
- Keep commercial features separate from the intelligence dashboard.
- Avoid introducing authentication before the product need is confirmed.

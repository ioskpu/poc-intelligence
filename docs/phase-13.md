# Phase 13 - Observatory UX Refinement

## Objective

Improve dashboard usability, hierarchy and clarity without adding data sources,
integrations, SQL, APIs or intelligence systems.

## UX Issues Found

- The top of the dashboard was visually tall because the brief, change analysis,
  market summary and freshness indicators were all stacked as separate blocks.
- Several dense sections used identical spacing, which made the page feel flat
  and harder to scan.
- The market rankings table was not explicitly protected for narrow screens.
- Ranking guidance repeated more text than the page needed.
- Card titles were not fully standardized in title case.

## UX Improvements Implemented

- The dashboard now places `Intelligence Brief` and `What Changed` side by side
  on wide screens while keeping the same reading order on mobile.
- Market summary cards and freshness indicators are grouped more tightly.
- Large content sections now use slightly smaller gaps and padding.
- `Market Rankings` now sits inside a horizontal overflow container so the
  table remains usable on smaller viewports.
- `Ranking Guide` was shortened to reduce vertical noise.
- `Recent Lab Decisions`, `Setup Memory` and `Ghost Tracking` use tighter card
  spacing for better scanability.
- Section titles and descriptions were normalized for consistency.

## Hierarchy Decisions

The dashboard still reads in the required order:

1. Intelligence Brief
2. What Changed
3. Market Rankings
4. Scanner Context
5. Recent Decisions
6. Setup Memory
7. Ghost Tracking

The first two sections now share the widest visual priority. Summary and
freshness signals follow immediately after, so a first-time user sees the state
of the lab before moving into the detailed evidence sections.

## Technical Findings

- Duplicate calls to `the internal dashboard state endpoint` were removed by reusing a
  single dashboard snapshot inside `src/services/api/index.ts`.
- The data access boundary remains in `src/services/api`.
- No new SQL queries were added.
- No new APIs were added.
- No architecture changes were introduced.

## Responsiveness Findings

Validation was limited by missing local Futures Lab configuration.

What was verified:

- The dashboard error state renders without breaking desktop, tablet or mobile
  layouts.
- `Market Rankings` now has horizontal overflow protection for smaller screens.
- The layout remains structurally stable at desktop, tablet and mobile widths.

What could not be verified locally:

- The live data dashboard view, because `FUTURES_LAB_API_BASE_URL`,
  `FUTURES_LAB_INTERNAL_API_KEY` and `FUTURES_LAB_DATABASE_URL` are not set in
  this workspace.

## Future UX Opportunities

- Introduce a shared section header pattern if more observability surfaces are
  added later.
- Consider collapsing repeated metric chips when the live data contains more
  context.
- Revisit the top summary band after a full live-data render to see whether the
  cards and freshness strip can be merged further.
- Keep the table and evidence sections readable before adding any more product
  surfaces.

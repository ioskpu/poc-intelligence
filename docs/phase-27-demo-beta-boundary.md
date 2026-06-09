# Phase 27 - Demo / Beta Boundary

## Objective

Define the public demo boundary and keep the public product focused on the core observatory surfaces.

## Changes implemented

- Kept public:
  - Intelligence Brief
  - What Changed
  - Market Summary Cards
  - Freshness Strip
  - Market Rankings
  - Ranking Guide
  - Recent Lab Decisions
  - Setup Memory
  - Ghost Tracking
- Removed from public render and sidebar navigation:
  - Pattern Discovery
  - Regime Analysis
- Kept visible:
  - Opportunity Rankings
- Added product positioning:
  - `Experimental Research Module` badge
  - short explanatory note in ES/EN

## UX impact

- Public demo is more focused on the core observatory value.
- Experimental surfaces are still available, but clearly framed as evaluation content.
- Non-core surfaces no longer dilute the public dashboard narrative.

## Validation

- `npm run lint` passed
- `npm run build` passed
- Visual review completed on desktop and tablet using the local production build

## Future beta direction

Move the remaining experimental modules into Private Beta only once they have live data and a stable narrative.

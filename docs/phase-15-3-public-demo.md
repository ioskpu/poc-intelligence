# Phase 15.3 - Public Demo Build

## Objective

Create a deployable public-demo version of POC Intelligence that runs entirely
from local mock data when private Futures Lab configuration is absent.

No deployment was performed in this phase.

## Strategy Chosen

Environment-controlled public demo mode with a safe default:

- If private Futures Lab runtime variables are absent, the app uses public demo
  mode automatically.
- If all private runtime variables are present, the live Futures Lab path
  remains available for private use.

This keeps the public build branch-safe while preserving the existing live
integration path.

## Demo Mode Behavior

When demo mode is active:

- `getIntelligenceSnapshot()` returns a local mock snapshot.
- No Futures Lab API requests are made.
- No PostgreSQL queries are executed.
- All dashboard sections render from local mock data only.

Sections covered:

- Intelligence Brief
- What Changed
- Market Rankings
- Scanner Context
- Recent Decisions
- Setup Memory
- Ghost Tracking

## Deployment Assumptions

- Public demo deployments will not set private Futures Lab variables.
- Vercel can build and serve the dashboard without external dependencies in
  demo mode.
- The live Futures Lab integration remains available only when all private
  runtime variables are intentionally provided.

## Safety Guarantees

When demo mode is active:

- No database access occurs.
- No internal API calls occur.
- No internal network hosts are required.
- No private credentials are required.
- No runtime error state is shown to explain missing Futures Lab services.

The user sees a complete product experience rather than an infrastructure
fallback.

## Validation

The demo path is intended to pass:

- `npm install`
- `npm run lint`
- `npm run build`

without setting Futures Lab environment variables.

## Summary

The public demo build is now branch-safe and ready for the next deployment
step, while the private live path remains available for controlled use.

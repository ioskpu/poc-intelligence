# Phase 33A / 33B - Dashboard Humanization

## Goal
Reduce cognitive load on the public dashboard without changing product identity, layout, APIs, or architecture.

## What Changed
- Added a reusable tooltip component with hover support on desktop and tap support on mobile.
- Added P0 tooltips for:
  - Ghost Tracking
  - Freshness
  - Scanner
  - Ranking Reason
  - Regime
  - Funding
  - Volatility
  - Directional Bias
  - PF
  - RR
  - MFE
  - MAE
  - Health Score
- Humanized section framing for:
  - Intelligence Brief
  - What Changed
  - Market Rankings
  - Setup Memory
  - Ghost Tracking
- Kept Opportunity Rankings unchanged.
- Kept DashboardShell unchanged.

## Components Modified
- `src/components/ui/tooltip-label.tsx`
- `src/lib/dashboard-humanization.ts`
- `src/lib/i18n.ts`
- `src/features/dashboard/change-awareness.tsx`
- `src/features/dashboard/freshness-strip.tsx`
- `src/features/dashboard/ghost-tracking.tsx`
- `src/features/dashboard/market-rankings.tsx`
- `src/features/dashboard/setup-memory.tsx`
- `src/features/dashboard/beta-live-rendering.tsx`

## Validation
- `npm run lint`
- `npm run build`
- Visual smoke test on desktop and tablet in ES and EN

## Risks
- Backend strings are still partly technical in some sections because they originate from Futures Lab and are not fully humanized upstream.
- Dense cards remain dense by design; the tooltip layer reduces friction but does not remove the underlying information load.
- The public experience still relies on user curiosity to open tooltips; the core narrative was improved, but some concepts remain specialized.


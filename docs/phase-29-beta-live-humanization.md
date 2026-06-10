# Phase 29 - Beta Live Humanization

## Goal
Make the internal Beta Live panel readable for external users without adding new surfaces.

## Changes
- Hid all fields classified as hidden.
- Moved advanced fields behind `Advanced View`.
- Added bilingual tooltips for all tooltip-classified metrics.
- Humanized metric and status labels.
- Simplified `Diagnostic Context` to the two visible questions:
  - opportunity starvation
  - dominant rejection reason

## Components
- `src/features/dashboard/beta-live-depth.tsx`
- `src/features/dashboard/beta-live-rendering.tsx`
- `src/lib/beta-live-copy.ts`
- `src/lib/i18n.ts`

## Validation
- `npm run lint`
- `npm run build`
- Browser validation on desktop and tablet
- Verified the `Advanced View` toggle gates advanced fields
- Verified bilingual tooltips are attached via native `title` text

## Risks
- Some raw source strings may still appear in upstream research payloads if Futures Lab emits them directly.
- The panel still depends on live Futures Lab data and private runtime config.
- If the upstream payload changes shape, additional humanization may be required.


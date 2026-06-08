# Phase 4

## Objective

Improve the market intelligence dashboard experience using existing Futures Lab
data only.

No new backend functionality, Futures Lab functionality, endpoints or
intelligence calculations were added.

## UX Decisions

### Summary First

The first dashboard section now answers the most important user questions:

- How many markets are shown.
- Which symbol ranks highest.
- What the top score is.
- When the latest scan was updated.

These values are derived in `src/services/api` and passed to the UI as
`marketSummary`.

### Ranking Explanation

The dashboard now includes a compact explanation panel:

- Scores run from `0` to `100`.
- Higher scores indicate stronger current ranking evidence.
- Rankings come from the Futures Lab scanner.
- The dashboard is informational only and does not provide financial advice.

### Freshness Visibility

The latest scanner timestamp is visible in two places:

- Summary card: `Last updated`.
- Explanation panel: `Latest scan`.

This lets a first-time user quickly judge whether the visible rankings are
recent.

### Ranking Table Readability

The ranking table now shows:

- rank number
- symbol
- market source
- direction
- regime hint
- score

All values come from the existing `futures_scanner_rankings` payload and are
transformed in the service layer.

### Empty State

If the latest dashboard state returns no rankings, the table shows a plain
message explaining that Futures Lab may be waiting for its next scanner run.

### Error State

Technical errors are no longer shown directly to the user. The visible message
is user-friendly, while debugging detail is preserved through console logging.

## Information Hierarchy

1. Summary cards: what is ranked, strongest symbol, top score and freshness.
2. Market rankings table: detailed ranking list.
3. Explanation panel: how to interpret score and source.
4. Lower dashboard sections: existing opportunity, pattern and regime panels.

## Future Dashboard Opportunities

- Replace remaining non-ranking mock sections once clean existing sources are
  verified.
- Add a freshness badge if scanner age exceeds a CTO-approved threshold.
- Add contract-backed filters after endpoint support is formalized.
- Add historical comparisons only after snapshot semantics are agreed.

## Files Changed

- `README.md`
- `docs/phase-4.md`
- `docs/roadmap.md`
- `src/app/dashboard/error.tsx`
- `src/components/layout/top-bar.tsx`
- `src/features/dashboard/dashboard-shell.tsx`
- `src/features/dashboard/market-rankings.tsx`
- `src/features/dashboard/market-summary-cards.tsx`
- `src/features/dashboard/ranking-explanation.tsx`
- `src/services/api/index.ts`
- `src/services/api/market-rankings.ts`
- `src/types/intelligence.ts`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed.

## Scope Control

No new APIs, metrics, scoring models, authentication, billing, historical
charts, market regime engines or pattern ranking pages were added.

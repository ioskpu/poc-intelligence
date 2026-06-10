# Phase 34 - Beta Research Layer

## Objective

Create a first internal Beta Research Access experience using only existing
`betaLiveInsights` data from the Observatory Snapshot Gateway.

This phase does not add authentication, sessions, roles, new data sources, new
analytics modules, or a parallel dashboard.

## Feature Flag

Beta Research is controlled by:

```env
POC_INTELLIGENCE_BETA_RESEARCH_ENABLED=true
```

When the flag is disabled, the dashboard renders the public observatory only.
When the flag is enabled and the snapshot includes `betaLiveInsights`, the
Beta Research Layer is rendered below the public observatory core.

## Public User Experience

A public visitor sees:

- Intelligence Brief
- What Changed
- Market Summary
- Freshness
- Market Rankings
- Ranking Guide
- Recent Lab Decisions
- Setup Memory
- Ghost Tracking
- Opportunity Rankings

The public experience remains focused on understanding what changed in the
market without exposing deeper research diagnostics.

## Beta User Experience

A beta user sees the same public observatory plus a clearly separated Beta
Research Layer.

The layer reuses existing Beta Live depth capabilities:

- Scanner Detail
- Decision Context
- Setup Depth
- Ghost Outcomes
- Diagnostic Context

The section is visually framed with a Beta Research badge and explanatory copy
so it reads as additional research depth, not as a separate product.

## Reused Components

- `DashboardShell`
- `BetaLiveDepth`
- `BetaDetailsCard`
- `MetricList`
- dashboard tooltip infrastructure
- existing bilingual copy system
- existing Observatory Snapshot contract

## Components Created

- `BetaResearchLayer`
- `isBetaResearchEnabled`

## Data Sources

No new sources were added. The layer uses `snapshot.betaLiveInsights` from:

```text
Vercel -> Observatory Snapshot Gateway -> Futures Lab / PostgreSQL
```

## Visual Audit

The beta layer is rendered below the public core, after Opportunity Rankings.
This creates a clear separation:

- public observatory first
- beta research depth second

The result keeps the same navigation and dashboard shell while making the beta
area visible enough to evaluate as a differentiated experience.

## UX Risks

- The layer is dense and should remain gated for approved users.
- Diagnostic Context can still feel technical for non-research users.
- Tooltips reduce friction but do not fully replace onboarding.
- Without authentication, the flag is only an internal validation mechanism.

## Recommendation

The Beta Research Layer justifies authentication in the next phase.

It creates a visible and meaningful difference between public visitors and
approved beta users without requiring new data sources or a parallel dashboard.
The next implementation step should be access control, not more product surface.

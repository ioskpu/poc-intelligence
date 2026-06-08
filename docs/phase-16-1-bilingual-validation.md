# Phase 16.1 - Bilingual Validation Preparation

## Objective

Prepare POC Intelligence for Spanish-first validation while keeping English
available for evaluators and future users.

## Language Strategy

- Default language: Spanish.
- Supported languages: Spanish and English.
- Implementation approach: lightweight copy dictionary, not a full i18n
  framework.
- Persistence: the selected language is reflected in the URL via `?lang=...`
  and saved locally so the selection survives subsequent visits.

This keeps the implementation simple and avoids adding a heavy dependency for a
small two-language surface.

## Translation Approach

Visible UI labels were translated across:

- Landing page
- Public demo banner
- Dashboard header
- Sidebar navigation
- Intelligence Brief
- What Changed
- Market Summary
- Freshness strip
- Market Rankings
- Ranking Guide
- Recent Decisions
- Setup Memory
- Ghost Tracking
- Opportunity rankings
- Pattern discovery
- Regime analysis

Data values from Futures Lab were not modified. Only presentation text changed.

## Public Demo Banner

A persistent banner was added to both the landing page and dashboard.

Purpose:

- make the public demo nature explicit
- set expectations that sample research data is being used
- avoid confusion with the live Futures Lab environment

Design decision:

- keep it informational and non-alarming
- use a compact banner instead of a modal or alert
- keep it above the main content so it is seen immediately

## Validation Rationale

The goal was not technical sophistication. The goal was comprehension for
Spanish-speaking evaluators without losing English usability.

Validation covered:

- `npm run lint`
- `npm run build`
- local browser review of the home page in Spanish
- local browser review of the home page in English
- local browser review of the dashboard in English

Observed outcome:

- the banner is visible on both entry points
- the language selector is visible on both entry points
- the home page renders in Spanish and English
- the dashboard renders in Spanish and English
- no layout breakage was introduced by the translation layer

## Notes

- No Futures Lab integration changed.
- No APIs changed.
- No data source changed.
- No authentication, analytics or billing work was added.


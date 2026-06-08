# Phase 12.1 - Architecture Dependency Audit

## Objective

Document the current runtime dependencies between POC Intelligence, Futures Lab
and PostgreSQL after Phase 12.

This phase is documentation only. No runtime behavior was changed.

## Executive Summary

POC Intelligence is now a Research Observatory with an emerging analytics layer.
It is not only a frontend dashboard anymore.

Current runtime integration paths:

1. Futures Lab internal API for current dashboard state.
2. Direct PostgreSQL read access for historical change awareness.

The strongest architectural control is that all data access remains centralized
inside `src/services/api`. React components do not call Futures Lab or
PostgreSQL directly.

The main risk is coupling. Most dashboard surfaces depend on an internal
Futures Lab payload, and Change Awareness now depends directly on PostgreSQL
table names, fields and timestamp semantics.

## Dependency Map

```text
Browser
  -> Next.js dashboard
    -> src/services/api/getIntelligenceSnapshot()
      -> Futures Lab API: GET /internal/dashboard/state
      -> PostgreSQL: futures_scanner_rankings
      -> PostgreSQL: futures_lab_decisions
      -> PostgreSQL: futures_lab_ghost_tracks
```

## Part 1 - Integration Inventory

### Futures Lab Dashboard State

- Classification: API
- Purpose: Current Futures Lab state for dashboard surfaces.
- Primary source file: `src/services/api/market-rankings.ts`
- Shared function: `fetchFuturesDashboardState()`
- Endpoint: `GET /internal/dashboard/state`
- Dependency type: Runtime HTTP dependency.
- Data consumed:
  - `futures_scanner_rankings`
  - `data_freshness`
  - `generated_at`
  - `capital_control.futures_lab.recent_decisions`
  - `capital_control.futures_lab.latest_decision`
  - `capital_control.futures_lab.setup_rankings.by_setup_key`
  - `capital_control.futures_lab.ghost_tracking`

Consumers:

- `src/services/api/market-rankings.ts`
- `src/services/api/lab-decisions.ts`
- `src/services/api/setup-memory.ts`
- `src/services/api/ghost-tracking.ts`

Important finding:

`src/services/api/index.ts` calls market rankings, lab decisions, setup memory
and ghost tracking in parallel. Each service calls
`fetchFuturesDashboardState()` independently, so one dashboard render can make
multiple requests to the same Futures Lab endpoint.

### Change Awareness Historical Data

- Classification: Database
- Purpose: Compare the last 24 hours with the previous 24 hours.
- Connection file: `src/services/api/futures-lab-database.ts`
- Query orchestration: `src/services/api/change-awareness.ts`
- SQL definitions: `src/services/api/change-awareness-sql.ts`
- Dependency type: Runtime PostgreSQL dependency through `pg`.
- Data consumed:
  - Scanner ranking batches.
  - Futures Lab decision activity.
  - Settled ghost tracking outcomes.

The integration is read-only in the current implementation, but it couples POC
Intelligence directly to Futures Lab database schema and field semantics.

### Internal and Mock Sources

- `src/services/api/intelligence-brief.ts` synthesizes already loaded service
  outputs and does not call Futures Lab directly.
- `src/services/api/mock-data.ts` still populates legacy opportunity, pattern
  and regime sections. This is not an external dependency, but it creates
  product clarity risk because real and mock surfaces coexist.

## Part 2 - Database Audit

### Connection

- Source file: `src/services/api/futures-lab-database.ts`
- Library: `pg`
- Required variable: `FUTURES_LAB_DATABASE_URL`
- Behavior:
  - Creates a `Client`.
  - Connects.
  - Runs a query callback.
  - Closes the client in `finally`.

Read-only confirmation:

The current database integration only executes `SELECT` statements defined in
`src/services/api/change-awareness-sql.ts`. No `INSERT`, `UPDATE`, `DELETE`,
`CREATE`, `ALTER` or migration behavior was found.

### `futures_scanner_rankings`

- Source file: `src/services/api/change-awareness-sql.ts`
- Query: `SCANNER_CHANGE_SQL`
- Purpose:
  - Find current and baseline scanner batches.
  - Compare current leader against previous leader.
  - Compare leader score.
  - Compare long and short direction hint counts.
- Time windows:
  - Current: last 24 hours.
  - Baseline: previous 24 hours.
- Read-only confirmation: `SELECT` only.

### `futures_lab_decisions`

- Source file: `src/services/api/change-awareness-sql.ts`
- Query: `DECISION_CHANGE_SQL`
- Purpose:
  - Count decision types in current and baseline windows.
  - Identify the most represented decision type in each window.
- Time field: `observed_at`
- Read-only confirmation: `SELECT` only.

### `futures_lab_ghost_tracks`

- Source file: `src/services/api/change-awareness-sql.ts`
- Query: `GHOST_CHANGE_SQL`
- Purpose:
  - Count settled ghost tracks in current and baseline windows.
  - Compare positive outcome rate using `hypothetical_pnl_pct > 0`.
- Time field: `settled_at`
- Filter: `status = 'settled'`
- Read-only confirmation: `SELECT` only.

### Views and Schemas

- Views queried: none found.
- Schemas queried: SQL uses unqualified table names. The effective schema is
  the database connection search path, expected to be `public` unless the
  connection user overrides it.

## Part 3 - API Audit

### Endpoint

- Endpoint: `/internal/dashboard/state`
- Method: `GET`
- Source file: `src/services/api/market-rankings.ts`
- Base URL variable: `FUTURES_LAB_API_BASE_URL`
- Required header: `X-API-KEY`
- API key variable: `FUTURES_LAB_INTERNAL_API_KEY`
- Cache behavior: `no-store`
- Timeout: `FUTURES_LAB_REQUEST_TIMEOUT_MS`, default `60000` ms.

### Authentication

The endpoint requires an internal API key. If
`FUTURES_LAB_INTERNAL_API_KEY` is missing, the service throws before sending a
request.

### Error and Fallback Behavior

Current behavior:

- Missing API base URL: throws.
- Missing API key: throws.
- Invalid base URL or protocol: throws.
- Invalid timeout below 1000 ms: throws.
- 401 or 403: authentication error.
- 404: endpoint not found.
- 500 or higher: Futures Lab unavailable.
- Network or timeout failure: network error.
- Invalid response object shape: invalid shape error.

There is no fallback to mock ranking data in the production market ranking path.
This is correct for real-data phases, but the dashboard depends on Futures Lab
runtime availability.

## Part 4 - Configuration Audit

| Variable | Required | Purpose | Used by |
| --- | --- | --- | --- |
| `FUTURES_LAB_API_BASE_URL` | Yes | Futures Lab API host | `market-rankings.ts` |
| `FUTURES_LAB_INTERNAL_API_KEY` | Yes | `X-API-KEY` authentication | `market-rankings.ts` |
| `FUTURES_LAB_DATABASE_URL` | Yes for Change Awareness | PostgreSQL connection string | `futures-lab-database.ts` |
| `FUTURES_LAB_REQUEST_TIMEOUT_MS` | No | API timeout override | `market-rankings.ts` |

Package dependencies:

- Runtime: `pg`
- Development types: `@types/pg`

Governance note:

`FUTURES_LAB_DATABASE_URL` should use a read-only PostgreSQL credential while
direct database access remains in place.

## Part 5 - Coupling Analysis

| Dependency | Coupling | Failure impact | Recovery difficulty | Maintenance risk |
| --- | --- | --- | --- | --- |
| Futures Lab internal API | HIGH | HIGH | MEDIUM | HIGH |
| Direct PostgreSQL access | HIGH | MEDIUM to HIGH | HIGH | HIGH |
| Futures Lab API key | MEDIUM | HIGH | MEDIUM | MEDIUM |
| PostgreSQL network and credentials | HIGH | MEDIUM to HIGH | MEDIUM to HIGH | HIGH |
| Mock dashboard data | LOW | LOW | LOW | MEDIUM |

### Findings

The internal API is high coupling because most dashboard surfaces depend on one
internal payload shape. Changes to nested fields under
`capital_control.futures_lab` can affect multiple sections.

Direct PostgreSQL access is high coupling because Change Awareness depends on
table names, timestamp columns, status values and score semantics. The current
use is contained and read-only, but expanding this pattern would raise
maintenance cost.

## Part 6 - Architectural Assessment

POC Intelligence today is best classified as:

**Research Observatory with an emerging analytics layer.**

It is not merely a frontend because server-side services now perform
transformation, synthesis and historical comparison. It is not a full Research
Terminal because it does not support interactive research workflows, custom
queries, analyst notebooks or execution.

The current architecture is:

- Next.js App Router dashboard.
- Service-layer adapter around Futures Lab current state.
- Limited server-side PostgreSQL reader for temporal comparison.
- Presentation layer focused on research observations.

## Part 7 - Recommendations

### Keep

1. Keep `src/services/api` as the only data access boundary.
2. Keep the Futures Lab internal API integration for current dashboard state.
3. Keep Change Awareness PostgreSQL access only as a narrow read-only bridge.
4. Keep transformation and comparison logic outside React components.

### Avoid

1. Avoid adding more direct PostgreSQL table access from POC Intelligence.
2. Avoid trace-event analytics in the frontend runtime for now.
3. Avoid writes, migrations or database mutations from POC Intelligence.
4. Avoid adding new integration paths without ownership and failure-mode
   documentation.
5. Avoid exposing raw Futures Lab payloads directly in UI components.

### Long-Term Recommendation

1. Consolidate dashboard state fetching so `/internal/dashboard/state` is called
   once per dashboard request.
2. Move Change Awareness queries behind a Futures Lab read-only API endpoint.
3. Use a read-only PostgreSQL credential while direct DB access remains.
4. Add lightweight runtime response validation before expanding more surfaces.
5. Replace or clearly separate mock sections from real Futures Lab sections.
6. Maintain POC Intelligence as a Research Observatory, not a trading platform,
   signal engine or backend analytics system.

Direct PostgreSQL access is acceptable only as a temporary, limited and
read-only bridge. It is not the preferred long-term architecture.

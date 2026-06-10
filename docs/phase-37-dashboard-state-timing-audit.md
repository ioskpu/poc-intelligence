# Phase 37 - Dashboard State Timing Audit

Date: 2026-06-10

## Scope

Audited the internal `_build_dashboard_snapshot()` path used by:

`GET https://api.poc-engine.lat/observatory/snapshot`

This phase only identifies where time is spent. No optimization, architecture change, endpoint contract change, or UI change was made.

## Instrumentation

Nested timings were added inside `dashboard_state` and exposed through the existing `Server-Timing` header.

The public JSON response remains unchanged.

Measured categories:

- file reads
- SQL queries
- external/API snapshots
- capital control composition
- Futures Lab enrichment
- transformation blocks
- orchestrator overlay

Example evidence:

```text
dashboard_state;dur=7000.11,
dashboard.capital_control;dur=4598.08,
dashboard.capital.api.futures_account_snapshot;dur=2055.50,
dashboard.capital.futures_exchange_reconciliation;dur=2185.34,
dashboard.transform.frontier_coverage;dur=2148.07
```

## Sample

Sample size: 15 public requests through Cloudflare.

All sampled requests returned HTTP 200.

## Ranking

Top internal `dashboard_state` stages by mean response time:

| Rank | Stage | Mean ms | P50 ms | P90 ms | P95 ms | Max ms |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `dashboard.capital_control` | 4237.25 | 3934.04 | 6171.65 | 7188.98 | 9525.73 |
| 2 | `dashboard.transform.frontier_coverage` | 2486.89 | 2076.58 | 2219.33 | 3984.13 | 8062.95 |
| 3 | `dashboard.capital.futures_exchange_reconciliation` | 1737.91 | 1239.61 | 3289.01 | 3681.06 | 4115.88 |
| 4 | `dashboard.capital.api.futures_account_snapshot` | 1492.22 | 1202.53 | 2137.34 | 2712.04 | 3658.43 |
| 5 | `dashboard.capital.api.spot_account_snapshot` | 327.86 | 0.03 | 720.42 | 773.92 | 859.22 |
| 6 | `dashboard.capital.api.spot_symbol_preview` | 308.63 | 0.11 | 694.15 | 722.52 | 761.68 |
| 7 | `dashboard.query.recent_strategy_metrics` | 228.28 | 227.30 | 230.42 | 232.87 | 238.43 |
| 8 | `dashboard.capital.transform.enrich_decisions_240` | 99.53 | 92.71 | 128.15 | 152.99 | 161.64 |
| 9 | `dashboard.capital.transform.futures_operational_diagnostics` | 68.39 | 69.09 | 74.36 | 76.45 | 78.33 |
| 10 | `dashboard.capital.query.futures_lab_decisions_240` | 60.45 | 57.52 | 65.11 | 67.46 | 72.15 |

Key totals:

| Stage | Mean ms | P50 ms | P90 ms | P95 ms | Max ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| `dashboard_state` | 6983.40 | 6310.37 | 10512.96 | 12112.23 | 12713.36 |
| `dashboard.capital_control` | 4237.25 | 3934.04 | 6171.65 | 7188.98 | 9525.73 |
| `total` server snapshot | 7209.34 | 6553.54 | 10714.37 | 12329.58 | 12988.70 |
| client elapsed through Cloudflare | 11822.50 | 9787.54 | 21527.50 | 22715.48 | 23589.74 |

## Primary Bottleneck

Primary bottleneck: `dashboard.capital_control`.

It accounts for roughly 60.7% of average `dashboard_state` time:

```text
4237.25 / 6983.40 = 60.7%
```

The largest contributors inside `capital_control` are:

- `dashboard.capital.futures_exchange_reconciliation`
- `dashboard.capital.api.futures_account_snapshot`

These are operational/accounting dependencies, not core public Observatory content.

## Secondary Bottleneck

Secondary bottleneck: `dashboard.transform.frontier_coverage`.

It averages ~2.49s and showed one sampled spike above 8s.

This is also not part of the public Observatory snapshot contract.

## Low-Cost Public Observatory Inputs

The actual public Observatory fields are comparatively cheap once the broad internal dashboard state exists:

- `dashboard.query.futures_scanner_rows`: low single-digit milliseconds.
- `dashboard.capital.query.futures_lab_decisions_5`: low single-digit milliseconds.
- `dashboard.capital.query.futures_lab_decisions_240`: ~60 ms mean.
- `dashboard.capital.query.futures_ghost_tracking`: ~6 ms mean.
- `dashboard.capital.query.futures_setup_rankings`: ~12 ms mean.
- `dashboard.capital.transform.futures_operational_diagnostics`: ~68 ms mean.
- Observatory-level `change_awareness`: ~180-250 ms in recent samples.

## What Public Dashboard Actually Needs

The public dashboard needs:

- scanner rankings
- scanner freshness
- recent lab decisions
- setup rankings
- ghost tracking summary
- operational diagnostics used by Beta Live context
- change awareness
- intelligence brief synthesis

The public dashboard does not need to synchronously rebuild:

- spot account snapshot
- spot symbol preview
- Futures account balance snapshot
- Futures exchange reconciliation
- frontier coverage
- open positions
- spot trades
- strategy metrics
- spot risk summaries
- account-level period PnL

Those dependencies are useful for the internal control dashboard, but they are not required for the public Observatory experience.

## Required Update Frequency

Recommended freshness needs for the public dashboard:

| Surface | Source | Practical update frequency |
| --- | --- | --- |
| Market Rankings | latest `futures_scanner_rankings` batch | 30-60 seconds if scanner is active; acceptable up to 5 minutes |
| Freshness Strip | source timestamps | same as source data |
| Intelligence Brief | derived from rankings, decisions, setup memory, ghost tracking | 1-5 minutes |
| What Changed | 24h vs previous 24h comparison | 5-15 minutes |
| Recent Decisions | latest Futures Lab decisions | 1-5 minutes |
| Setup Memory | historical setup aggregates | 5-15 minutes |
| Ghost Tracking | ghost outcome aggregates | 5-15 minutes |
| Beta Live Context | same real Futures Lab sources | 1-5 minutes |

The public dashboard does not require per-request live account reconciliation.

## Precalculated Artifact Proposal

Recommended future architecture:

`Futures Lab / Gateway`
`-> build public observatory snapshot`
`-> store latest artifact`
`-> Vercel reads one lightweight snapshot`

Artifact options:

1. In-memory Gateway cache

- Lowest implementation complexity.
- Cache key: `observatory_snapshot:public`.
- TTL: 30-60 seconds.
- On miss, rebuild from public-only sources.
- Good first step, but lost on service restart.

2. PostgreSQL materialized artifact table

- More durable and inspectable.
- Example table: `observatory_snapshot_artifacts`.
- Columns: `id`, `snapshot_type`, `payload_json`, `source_timestamps_json`, `generated_at`, `expires_at`.
- Refreshed by background scheduler or explicit refresh job.
- Best fit for public dashboard stability.

3. Hybrid

- Store latest artifact in PostgreSQL.
- Keep short in-memory cache in Gateway.
- On request, serve memory cache first, then latest DB artifact, then rebuild only if stale.

Recommended path: hybrid, implemented in phases.

## Proposed Refresh Rules

Suggested initial rules:

- Recompute artifact every 60 seconds while the app is public.
- Allow artifact to remain usable for up to 5 minutes with visible freshness labels.
- If rebuild fails, serve the last known artifact and expose degraded health internally.
- Avoid blocking user requests on account snapshots or internal control dashboard dependencies.

## Conclusion

The 5-15 second latency is not caused by public Observatory transformations.

The delay is mostly caused by reusing the full internal dashboard state builder, especially:

1. capital control composition
2. Futures exchange reconciliation
3. Futures account snapshot
4. frontier coverage

The public dashboard should eventually consume a public Observatory artifact built only from the data it actually renders.


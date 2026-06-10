# Phase 36 - Observatory Snapshot Timing Audit

Date: 2026-06-10

## Scope

Audited `GET /observatory/snapshot` on the public backend gateway:

`https://api.poc-engine.lat/observatory/snapshot`

The goal was measurement only. No optimization, data contract change, UI change, or architecture change was made.

## Instrumentation

Passive timing instrumentation was added around the existing snapshot composition path.

Evidence is exposed through:

- `Server-Timing`
- `X-Observatory-Snapshot-Total-Ms`

The JSON response shape remains unchanged.

Measured stages:

- `dashboard_state`: existing internal dashboard snapshot composition before Observatory-specific mapping.
- `rankings`: market ranking normalization.
- `freshness`: market summary and freshness mapping.
- `decisions`: recent lab decision normalization.
- `setup_memory`: setup memory normalization.
- `ghost_tracking`: ghost tracking normalization.
- `change_awareness`: previous/current window comparison.
- `diagnostics`: Beta Live diagnostic context composition.
- `intelligence_brief`: top-level brief synthesis.
- `total`: full server-side snapshot build time.

Example header:

```text
Server-Timing: dashboard_state;dur=6943.33, rankings;dur=0.11, setup_memory;dur=0.13, decisions;dur=14.17, ghost_tracking;dur=0.25, change_awareness;dur=295.45, diagnostics;dur=0.27, freshness;dur=0.15, intelligence_brief;dur=0.06, total;dur=7253.95
```

## Sample

Sample size: 20 public requests through Cloudflare.

All sampled requests returned HTTP 200.

| Stage | Count | Mean ms | P50 ms | P75 ms | P90 ms | P95 ms | Max ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `dashboard_state` | 20 | 6774.66 | 5803.56 | 6924.38 | 8114.52 | 13797.66 | 15447.76 |
| `rankings` | 20 | 0.12 | 0.11 | 0.11 | 0.15 | 0.17 | 0.24 |
| `freshness` | 20 | 0.15 | 0.15 | 0.15 | 0.16 | 0.16 | 0.18 |
| `decisions` | 20 | 16.56 | 14.48 | 14.73 | 20.60 | 22.61 | 43.03 |
| `setup_memory` | 20 | 0.14 | 0.13 | 0.13 | 0.19 | 0.20 | 0.30 |
| `ghost_tracking` | 20 | 0.27 | 0.25 | 0.25 | 0.32 | 0.37 | 0.56 |
| `change_awareness` | 20 | 202.85 | 183.57 | 197.81 | 246.92 | 259.02 | 369.27 |
| `diagnostics` | 20 | 0.22 | 0.22 | 0.22 | 0.23 | 0.24 | 0.26 |
| `intelligence_brief` | 20 | 0.05 | 0.05 | 0.05 | 0.05 | 0.05 | 0.06 |
| `total` | 20 | 6995.05 | 6000.30 | 7123.34 | 8493.41 | 14055.89 | 15661.14 |
| `client_elapsed` | 20 | 9919.35 | 8468.32 | 11418.17 | 15840.58 | 16839.78 | 17713.82 |

## Bottleneck

Primary bottleneck: `dashboard_state`.

It accounts for roughly 96.8% of average server-side response time:

```text
dashboard_state mean / total mean = 6774.66 / 6995.05 = 96.8%
```

This means the Observatory-specific composition is not the main source of latency.

The slow path happens before the Observatory snapshot maps data into the public dashboard contract.

## Secondary Cost

Among the explicit Observatory stages, `change_awareness` is the slowest:

```text
change_awareness mean: 202.85 ms
change_awareness p95: 259.02 ms
change_awareness max: 369.27 ms
```

That is materially slower than the other mapping stages, but still small compared with `dashboard_state`.

## Fast Stages

The following stages are not meaningful latency drivers in the current sample:

- `rankings`
- `freshness`
- `setup_memory`
- `ghost_tracking`
- `diagnostics`
- `intelligence_brief`

Each averages below 1 ms, except `decisions`, which averages 16.56 ms.

## Dashboard State Detail

`dashboard_state` currently calls the historical internal dashboard composition path. That path is broad and includes work beyond the public Observatory snapshot, including:

- recent log parsing
- open positions
- recent trades
- strategy metrics
- market scanner rows
- futures scanner rows
- capital control snapshot
- Futures Lab decisions
- ghost tracking
- trace audit
- setup rankings
- operational diagnostics
- risk summaries
- period PnL
- freshness

The audit did not split those internals further because the requested scope was the Observatory snapshot endpoint stages and no architecture changes were allowed.

## Findings

1. `GET /observatory/snapshot` is functional but slow for a public dashboard endpoint.
2. Server-side total time averages ~7.0s and reaches ~15.7s in the sample.
3. Client-observed time is higher than server composition time, averaging ~9.9s through Cloudflare.
4. The main delay is the reused internal dashboard snapshot composition, not the public Observatory mapping layer.
5. `change_awareness` is the largest Observatory-specific stage, but it is not the main bottleneck.

## Recommendation

For this phase, no optimization was applied.

If optimization is approved later, the first investigation should target the internals of `_build_dashboard_snapshot()` and identify which broad internal dependencies are still required for the public Observatory contract.

The first optimization question should be:

> Can `/observatory/snapshot` build only the public Observatory fields instead of invoking the full internal dashboard state?


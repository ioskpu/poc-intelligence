# Phase 38 - Precomputed Observatory Snapshot Design and Implementation Plan

Date: 2026-06-10

## Scope

Phase 38 follows the confirmed Phase 36/37 finding: `GET /observatory/snapshot`
is slow because the public snapshot path rebuilds the broad internal dashboard
state on demand.

This phase implements the producer/serving split in the backend codebase that
owns the expensive dashboard builder:

`/Users/luiscorales/Documents/NewWeb3/ProofOfConsistency-clean`

The public Next.js consumer remains unchanged in this repository. It still calls:

`GET /observatory/snapshot`

## Mandatory Audit

Located backend execution points:

| Concern | Location | Notes |
| --- | --- | --- |
| `_build_dashboard_snapshot()` | `services/api/routes/internal_routes.py:2934` | Builds the broad internal dashboard state. |
| `dashboard.capital_control` | `services/api/routes/internal_routes.py:2946`, implementation starts at `services/api/routes/internal_routes.py:2142` | Builds account, Futures Lab, reconciliation, diagnostics, setup memory and ghost tracking state. |
| `frontier_coverage` | `services/api/routes/internal_routes.py:3006`, wrapper at `services/api/routes/internal_routes.py:3016` | Calls `frontier_coverage_dashboard_state()`. |
| Existing internal dashboard route | `services/api/routes/internal_routes.py:3996` | `GET /internal/dashboard/state` still returns the internal dashboard state. |
| Public frontend consumer | `src/services/api/observatory-client.ts:96` | Calls `/observatory/snapshot` and normalizes the public contract. |

Current update behavior before Phase 38:

- The internal dashboard cache TTL is `DASHBOARD_SNAPSHOT_CACHE_TTL`, default `5` seconds.
- The public Observatory path observed in Phase 36/37 effectively rebuilt or reused this broad dashboard path per request window.
- The expensive dependencies were therefore still request-coupled.

Dependencies:

- PostgreSQL tables: scanner rankings, realistic trades, positions, strategy metrics, Futures Lab decisions, setup memory and ghost tracking.
- Files: recent live logs, `logs/capital_control_state.json`, replay/candidate-promoter/orchestrator state.
- External/API calls: Binance account snapshots, symbol preview, Futures account snapshot and Futures exchange reconciliation.
- Transformations: capital control composition, operational diagnostics, setup enrichment, frontier coverage and public Observatory mapping.

Payload size:

- Phase 38 local synthetic public artifact: `1,685 bytes`.
- Real public payload size could not be remeasured from this shell because `https://api.poc-engine.lat` returned Cloudflare `1033` and local `127.0.0.1:8010` was not running.
- The previous live gateway examples show a small public contract compared with the full internal dashboard state.

Cache risks:

- Stale rankings if refresh stalls.
- Corrupt JSON artifact after interrupted write.
- First boot with no artifact.
- Producer failure when `DATABASE_URL` or upstream dependencies are missing.
- Public contract drift if producer mapping diverges from frontend normalization.

## Alternatives

| Option | Complexity | Resilience | Restart recovery | Operability | Cost | Assessment |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| A. Memory only | Low | Low | Poor | Simple | Zero | Fast but loses artifact on restart. |
| B. PostgreSQL artifact | Medium | High | Good | Requires schema/table management | Zero | Strong durable option, but DB outage can block reads unless memory is warm. |
| C. JSON artifact + memory | Low | Medium | Good on same host | Very simple | Zero | Best current fit because Gateway is single-host and no new infra is needed. |
| D. PostgreSQL + memory | Medium-high | High | Good | More moving parts | Zero | Best long-term if multiple Gateway instances serve the same hostname. |

Chosen implementation: **C. JSON artifact + memory**.

Justification:

- It uses existing local infrastructure only.
- It does not introduce Redis, cloud services, paid dependencies or database migrations.
- It survives process restarts on the same host.
- It can serve immediately from memory after the first read.
- It allows an atomic write path and a degraded contract if the artifact is missing.

If the Gateway becomes multi-instance, promote this to option D with PostgreSQL
as the shared artifact store.

## Implementation

Implemented in backend:

- `services/api/routes/observatory_snapshot.py`
- `services/api/main.py`
- `services/api/app/main.py`
- `services/api/routes/internal_routes.py`

New flow:

```text
Snapshot Producer
  -> every 60 seconds
  -> calls _build_dashboard_snapshot()
  -> maps only the public Observatory contract
  -> writes logs/observatory_snapshot_artifact.json atomically
  -> stores snapshot in process memory

GET /observatory/snapshot
  -> reads memory artifact first
  -> falls back to JSON artifact
  -> returns compatible JSON immediately
  -> schedules background refresh only if stale or missing
```

The public JSON contract is preserved:

- `generatedAt`
- `marketSummary`
- `marketRankings`
- `changeAwareness`
- `recentLabDecisions`
- `setupMemory`
- `ghostTracking`
- `betaLiveInsights`

Compatibility notes:

- `DashboardShell` remains unchanged.
- Beta Research Layer remains unchanged.
- Login beta remains unchanged.
- Admin panel remains unchanged.
- Existing `/internal/dashboard/state` remains available.

## Freshness Strategy

Final strategy:

- Producer refresh interval: `60` seconds.
- Maximum useful stale age: `300` seconds.
- Serve stale artifact for up to 5 minutes while generation recovers.
- If no artifact exists, return a degraded but valid empty contract and trigger generation.

Reasoning:

- Rankings need `30-60` second freshness when scanner is active.
- Brief and decision context tolerate `1-5` minutes.
- Aggregates tolerate `5-15` minutes.
- A 60 second producer interval gives the public dashboard fresh rankings without making user requests pay for account reconciliation or frontier coverage.

Environment controls:

- `OBSERVATORY_SNAPSHOT_ARTIFACT_PATH`
- `OBSERVATORY_SNAPSHOT_REFRESH_SECONDS`
- `OBSERVATORY_SNAPSHOT_MAX_STALE_SECONDS`

## Observability

Added metrics:

- `snapshot_generation_ms`
- `snapshot_age_seconds`
- `snapshot_size_bytes`

Exposed through:

- `GET /observatory/health`
- `/internal/dashboard/state` under `observatory_snapshot`

Health also exposes:

- `artifact_available`
- `artifact_stale`
- `refresh_in_progress`
- `last_generated_at`
- `last_generation_error`

## Fallback Behavior

| Condition | Behavior |
| --- | --- |
| No snapshot exists | Return HTTP `200` with a degraded compatible contract and trigger generation. |
| Snapshot JSON is corrupt | Ignore artifact, return degraded contract, record `last_generation_error`, trigger generation. |
| Snapshot is stale but under max age | Return stale artifact with status header and trigger refresh. |
| Snapshot is expired | Return artifact with degraded status instead of `500`, while refresh runs. |
| Generation fails | Keep serving last known artifact if present; otherwise serve degraded contract. |

The dashboard should not receive a `500` solely because the artifact is absent.

## Validation

Validation performed:

- `python3 -m py_compile services/api/routes/observatory_snapshot.py services/api/routes/internal_routes.py services/api/main.py services/api/app/main.py` passed.
- Direct async route call returned `200` for `/observatory/snapshot` with status `degraded-missing` when no artifact existed.
- Direct async health call returned metric keys for `/observatory/health`.
- Synthetic artifact serving benchmark, 50 reads:

| Metric | Result |
| --- | ---: |
| p50 | `0.059 ms` |
| p95 | `0.190 ms` |
| max | `0.841 ms` |
| artifact size | `1,685 bytes` |

Before benchmark from Phase 37:

| Metric | Result |
| --- | ---: |
| `dashboard_state` p50 | `6310.37 ms` |
| `dashboard_state` p95 | `12112.23 ms` |
| `dashboard_state` max | `12713.36 ms` |
| total server p50 | `6553.54 ms` |
| total server p95 | `12329.58 ms` |
| total server max | `12988.70 ms` |

Real after-deploy benchmark is still required on the production Gateway host.
This shell could not perform it because:

- Local backend was not running on `127.0.0.1:8010`.
- Local backend generation failed without `DATABASE_URL`.
- Public `https://api.poc-engine.lat` returned Cloudflare `1033` during validation.

## Residual Risks

- The JSON artifact is host-local. Multiple Gateway instances would need PostgreSQL artifact storage.
- First request after a fresh host with no artifact gets the degraded contract until producer generation succeeds.
- `changeAwareness` is currently mapped from available dashboard fields, not rebuilt with a separate historical comparison query in this new backend module.
- Real production latency improvement must be validated after deploying/restarting the Gateway.

## Deployment State

Code is implemented locally in the backend repo. Production deployment is not
confirmed from this shell because the public Cloudflare tunnel returned `1033`.

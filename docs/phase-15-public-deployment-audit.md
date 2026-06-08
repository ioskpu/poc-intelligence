# Phase 15 - GitHub Mirror & Public Deployment Preparation

## Objective

Audit the repository for public deployment readiness before mirroring to GitHub
or preparing a Vercel deployment.

This phase is documentation only. No deployment work was performed.

## Executive Summary

The repository is **not safe for public deployment as-is**.

The codebase does not appear to contain committed secrets, but it does contain
internal infrastructure references and runtime dependencies that are not
appropriate for a public repository or public Vercel deployment without cleanup.

Most importantly:

- The live dashboard depends on private Futures Lab runtime variables.
- The public-facing example environment file contains an internal IP address.
- Several phase notes document internal hosts, ports and runtime validation
  details.

Recommended public deployment model today: **Static demo mode**.

## Part 1 - Public Deployment Audit

### Hardcoded IPs and Internal URLs

Findings:

- `.env.example` contains `http://192.168.0.212:8010`.
- Multiple phase documents contain the internal Futures Lab host and port,
  including `192.168.0.212:8010`.
- Historical docs also mention `127.0.0.1:8000` as a development fallback.

Assessment:

- These are not secrets, but they are internal infrastructure references.
- They are unsuitable for a public repository if the goal is to avoid exposing
  Futures Lab details.

### Development-Only Settings

Findings:

- `README.md` documents local-only URLs such as `http://localhost:3000`.
- `.env.example` is clearly a development example file.
- `next.config.ts` contains no production-hardening or deployment-specific
  settings.

Assessment:

- Localhost references are fine in developer documentation.
- Internal IP references are not suitable for a public mirror unless they are
  replaced with neutral placeholders.

### Secrets Exposure Risk

Findings:

- No committed secret value was found in the repository scan.
- `FUTURES_LAB_INTERNAL_API_KEY` is referenced as an environment variable, but
  no actual key value was found.
- Docs use placeholder language such as `<runtime key>`, which is acceptable.

Assessment:

- Secret exposure risk is low in the current commit history based on the scan.
- Operational exposure risk is still high because the repository documents
  internal runtime dependencies and hostnames.

## Part 2 - Environment Review

### `FUTURES_LAB_API_BASE_URL`

- Classification: PRIVATE ONLY
- Purpose: Base URL for the Futures Lab dashboard state endpoint.
- Deployment impact: Required for live Futures Lab integration.
- Exposure risk: High. It can reveal internal network topology or private
  service endpoints.

### `FUTURES_LAB_INTERNAL_API_KEY`

- Classification: PRIVATE ONLY
- Purpose: Authentication header value for `/internal/dashboard/state`.
- Deployment impact: Required for live Futures Lab integration.
- Exposure risk: Critical. This is a secret and must never be public.

### `FUTURES_LAB_DATABASE_URL`

- Classification: PRIVATE ONLY
- Purpose: PostgreSQL connection string for read-only historical comparison.
- Deployment impact: Required for Change Awareness.
- Exposure risk: Critical. It can expose database credentials and connection
  details.

### `FUTURES_LAB_REQUEST_TIMEOUT_MS`

- Classification: PUBLIC SAFE
- Purpose: Optional request timeout override for the Futures Lab API call.
- Deployment impact: Optional. Adjusts runtime tolerance for slow responses.
- Exposure risk: Low. This is configuration only and does not reveal secrets.

## Part 3 - GitHub Mirror Preparation

### Repository Suitability

The repository is **not yet suitable for public GitHub publication without
cleanup**.

What is acceptable:

- `README.md` is clear and does not expose secrets.
- `.gitignore` correctly ignores `.env*` files while allowing `.env.example`.
- No secret value was discovered in the code scan.

What still needs cleanup:

- Replace the internal IP in `.env.example` with a neutral placeholder.
- Redact or rewrite public-facing docs that mention internal hosts and ports.
- Separate public product narrative from private validation notes.
- Review phase notes for operational details that do not need to be public.

### Required Cleanup Priorities

1. Remove internal IP addresses from committed examples and public-facing docs.
2. Replace environment examples with placeholders that do not point to Futures
   Lab infrastructure.
3. Keep deployment instructions focused on the public demo path, not the
   private lab path.
4. Ensure no future commit adds a real key or credential.

## Part 4 - Vercel Readiness

### Build Process

The project uses a standard Next.js build:

- `npm run build`
- `npm run start`

The repository has no custom production infrastructure baked into the build
pipeline.

### Runtime Requirements

The dashboard requires:

- `FUTURES_LAB_API_BASE_URL`
- `FUTURES_LAB_INTERNAL_API_KEY`
- `FUTURES_LAB_DATABASE_URL`

That makes the current runtime private by design.

### Deployment Assumptions

- `src/services/api` runs server-side.
- The dashboard expects to reach Futures Lab runtime services at request time.
- Change Awareness expects a PostgreSQL connection.

### Vercel Verdict

Vercel deployment is **technically feasible** for a private deployment if the
private env vars are supplied.

Vercel deployment is **not ready for public feedback collection as-is** because
it would either:

- require private Futures Lab access, or
- expose internal infrastructure assumptions in the public deployment path.

## Part 5 - Public Demo Strategy

Recommended strategy: **A) Static demo mode**

### Why static demo mode

- Zero-budget friendly.
- Avoids exposing Futures Lab runtime or database access.
- Avoids shipping private API keys to a public environment.
- Matches the current goal of collecting product feedback, not operational lab
  access.

### Why not live mode

- Live Futures Lab mode requires private runtime variables and private
  connectivity.
- It creates unnecessary exposure risk for a public validation exercise.

### Why not hybrid mode

- Hybrid mode still keeps live dependencies in the public stack.
- That increases the chance of accidental exposure and confused deployment
  assumptions.

## Part 6 - Risk Assessment

| Risk Area | Level | Reason |
| --- | --- | --- |
| Publishing the repository | MEDIUM to HIGH | Internal IPs and runtime notes are visible in docs and example config. |
| Deploying publicly | HIGH | The current app expects private Futures Lab runtime access and a database. |
| Exposing observatory functionality | MEDIUM | The content is not execution-oriented, but it does reveal research workflow and internal signals. |

## Part 7 - CTO Recommendation

Safest path from local Gitea to public feedback collection:

1. Remove or replace internal IPs and private deployment references from public
   files.
2. Keep secrets and private runtime variables out of the public repository.
3. Introduce a static demo path that uses only sanitized or mock data.
4. Mirror the cleaned repository to GitHub.
5. Deploy the static demo to Vercel.
6. Attach Cloudflare DNS only after the public demo is stable.

## Final Recommendation

Do not publish the current repository as a public deployment target yet.

The safest immediate path is to prepare a static demo variant first, then mirror
that cleaned repository to GitHub and deploy it to Vercel for feedback
collection.

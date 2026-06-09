# Phase 20 - Connectivity Validation

## Objective

Audit the full Private Beta path from the public app to PostgreSQL:

- Landing
- API routes on Vercel
- PostgreSQL on the Linux backend

## Status

This phase captured the failed direct-to-database path. It is superseded by Phase 21, which routes Vercel through the backend gateway instead of connecting directly to PostgreSQL.

## Runtime placement

### Vercel

These components run in Vercel serverless/route handlers:

- landing page
- Private Beta form
- `/api/private-beta`
- `/api/private-beta/[requestId]`
- `/api/private-beta/events`
- `/api/private-beta/health`

### Linux server

These components live on the backend Linux server:

- PostgreSQL container `poc-postgres`
- the existing Futures Lab backend services
- the private beta target database

## Connectivity path

Historical request path:

`Landing -> Vercel API route -> PostgreSQL connection string`

That path is no longer the intended production path.

## Database URL classification

The direct database variable is no longer used by the frontend.

The new production-facing variable is `POC_INTELLIGENCE_API_URL`.

## Healthcheck

Endpoint:

- `GET /api/private-beta/health`

Response:

- `database: "reachable"` when PostgreSQL can be reached
- `database: "unreachable"` when PostgreSQL cannot be reached

HTTP status:

- `200` when reachable
- `503` when unreachable

## Validation findings

- The direct-to-PostgreSQL attempt failed because the frontend had no public path to the database.
- The backend PostgreSQL service is on the Linux server and remains private.
- No firewall changes were made for PostgreSQL.
- The backend gateway is now the intended public entry point.

## Risk assessment

High risk:

- if Vercel cannot reach `POC_INTELLIGENCE_API_URL`, the waitlist flow will still fail
- the remaining problem is API gateway reachability, not database exposure

## Recommended next action

Provide a reachable backend API path for Vercel and keep PostgreSQL private behind it.

# Phase 20 - Connectivity Validation

## Objective

Audit the full Private Beta path from the public app to PostgreSQL:

- Landing
- API routes on Vercel
- PostgreSQL on the Linux backend

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

Current request path:

`Landing -> Vercel API route -> PostgreSQL connection string`

The API route uses `POC_INTELLIGENCE_DATABASE_URL` and connects directly to PostgreSQL with the `pg` client.

## Database URL classification

`POC_INTELLIGENCE_DATABASE_URL` is a private backend dependency.

It is not local to the browser, and it is not a public internet endpoint by default.

The repository does not currently contain a live production value for this variable.

Vercel project environment inspection showed no environment variables configured for the project.

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

- The API routes do attempt to connect directly to PostgreSQL.
- Vercel currently has no configured environment variables for the project.
- The backend PostgreSQL service is on the Linux server and is not exposed publicly on port `5432`.
- No firewall changes were made.
- No public PostgreSQL endpoint exists for Vercel to use in the current setup.

## Risk assessment

High risk:

- production writes from Vercel to PostgreSQL are not confirmed
- admin reads from Vercel to PostgreSQL are not confirmed
- submission flow may fail with `database unreachable` until a secure network path exists

## Recommended next action

Provide a secure, reachable PostgreSQL path for Vercel, such as:

- a private tunnel
- a proxy on the Linux server
- a managed database endpoint

Without that network path, the Private Beta API cannot be confirmed as production-ready.

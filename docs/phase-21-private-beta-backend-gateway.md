# Phase 21 - Private Beta Backend Gateway

## Goal

Move Private Beta traffic off direct database access and onto the Linux backend API.

## Target architecture

`Vercel -> POC Intelligence API -> PostgreSQL`

The frontend no longer talks to PostgreSQL directly.

## Backend API design

Minimum endpoints:

- `POST /private-beta/request`
- `GET /private-beta/requests`
- `PATCH /private-beta/{id}`
- `GET /private-beta/health`

Support endpoint used by the existing banner and admin telemetry:

- `POST /private-beta/events`

## Frontend changes

The Vercel app now uses `POC_INTELLIGENCE_API_URL` as the base URL for all Private Beta requests.

The server-side Private Beta adapter:

- submits requests to the backend gateway
- reads admin snapshots from the backend gateway
- updates request status through the backend gateway
- checks backend health through the backend gateway
- records landing and workflow events through the backend gateway

## Environment variables

Frontend:

- `POC_INTELLIGENCE_API_URL`

Backend:

- `DATABASE_URL`
- existing backend service variables remain unchanged

## Migration plan

1. Deploy the backend gateway code on the Linux server.
2. Ensure the backend service can reach PostgreSQL locally.
3. Point Vercel to the backend gateway with `POC_INTELLIGENCE_API_URL`.
4. Redeploy the frontend.
5. Validate:
   - request submission
   - admin listing
   - approve/reject workflow
   - healthcheck

## Security summary

- PostgreSQL is still private.
- Port `5432` remains closed externally.
- Vercel only talks to the backend API, not to PostgreSQL.
- The backend remains the sole database client.

## Deployment note

If the backend cannot be reached from Vercel, the remaining issue is network exposure of the API gateway, not database access.

# Phase 19 - Private Beta PostgreSQL Migration

## Goal

Move Private Beta waitlist persistence to PostgreSQL only.

## SQL schema

The migration creates two tables:

- `private_beta_requests`
  - `id`
  - `name`
  - `email`
  - `experience_level`
  - `interest_text`
  - `status`
  - `created_at`
  - `updated_at`
- `private_beta_events`
  - `id`
  - `event_name`
  - `request_id`
  - `payload`
  - `created_at`

The request table enforces the allowed statuses:

- `Pending`
- `Approved`
- `Rejected`

## Environment variables

Required:

- `POC_INTELLIGENCE_DATABASE_URL`

No filesystem fallback variables are used for this feature.

## Deployment steps

1. Apply `migrations/20260609_private_beta.sql` to the PostgreSQL instance used by the backend Linux server.
2. Point `POC_INTELLIGENCE_DATABASE_URL` to a reachable PostgreSQL endpoint from Vercel or the server-side runtime that serves the API routes.
3. Redeploy POC Intelligence.
4. Validate:
   - waitlist submission creates a `Pending` request
   - admin panel lists the request
   - approve/reject updates the status
   - events are written to `private_beta_events`

## Filesystem persistence removal

This phase removes all Private Beta dependency on:

- `.runtime`
- JSON store files
- `fs` reads
- `fs` writes
- `mkdir` based persistence setup

The feature now uses PostgreSQL exclusively.

## Network note

If the backend PostgreSQL service is not publicly reachable, the deployment needs a secure network path such as a private tunnel, proxy, or other reachable database endpoint. The application code does not include a local storage fallback.

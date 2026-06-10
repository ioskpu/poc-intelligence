# Phase 35 - Beta Access Authentication MVP

## Objective

Convert `Approved` private beta requests into real Beta Research access without
adding OAuth, passwords, external identity providers, a second dashboard, or a
parallel application.

## Architecture

```text
Visitor
  -> waitlist form
  -> Pending request

Admin
  -> magic link login
  -> HttpOnly session cookie
  -> protected /admin/private-beta
  -> Approve / Reject

Approved user
  -> magic link login
  -> HttpOnly session cookie
  -> /dashboard
  -> DashboardShell + Beta Research Layer
```

The dashboard remains the same route and shell. Beta Research is unlocked by a
valid backend session, not by a separate app.

## Backend Endpoints

- `POST /private-beta/auth/request-link`
- `POST /private-beta/auth/verify`
- `GET /private-beta/auth/session`
- `POST /private-beta/auth/logout`
- `GET /private-beta/requests` protected by admin session
- `PATCH /private-beta/{id}` protected by admin session

Existing public endpoints remain:

- `POST /private-beta/request`
- `POST /private-beta/events`
- `GET /private-beta/health`

## Frontend Routes

- `/beta/login` requests a magic link.
- `/beta/verify` validates a magic token and sets the session cookie.
- `/api/beta-auth/session` returns the current session.
- `/api/beta-auth/logout` revokes the session and clears the cookie.
- `/admin/private-beta` is protected by middleware and server-side admin guard.
- `/dashboard` stays public but renders Beta Research for valid approved sessions.

## PostgreSQL Migration

Migration:

```text
migrations/20260610_private_beta_access.sql
```

Tables added:

- `private_beta_accounts`
- `private_beta_login_tokens`
- `private_beta_sessions`

Columns added to `private_beta_requests`:

- `approved_at`
- `approved_by`
- `rejected_at`
- `invite_sent_at`

## Session Model

Sessions use opaque random tokens. The backend stores only SHA-256 hashes.

Cookies:

- name: `poc-beta-session`
- `HttpOnly`
- `SameSite=Lax`
- `Secure` in production
- max age: 14 days

Magic links expire after 20 minutes and are single-use.

## Environment Variables

Frontend:

- `POC_INTELLIGENCE_API_URL`

Backend:

- `POC_INTELLIGENCE_APP_URL`
- `POC_INTELLIGENCE_ADMIN_EMAILS`
- `POC_INTELLIGENCE_SMTP_HOST` optional
- `POC_INTELLIGENCE_SMTP_PORT` optional
- `POC_INTELLIGENCE_SMTP_USERNAME` optional
- `POC_INTELLIGENCE_SMTP_PASSWORD` optional
- `POC_INTELLIGENCE_SMTP_FROM` optional
- `POC_INTELLIGENCE_SMTP_USE_TLS` optional
- `POC_INTELLIGENCE_AUTH_EXPOSE_MAGIC_LINK` local validation only

If SMTP is not configured, the backend logs the magic link for internal
validation. Production should configure SMTP before broader beta use.

## Deployment Plan

1. Apply `migrations/20260610_private_beta_access.sql`.
2. Deploy backend gateway changes.
3. Configure backend environment variables.
4. Restart `poc-api`.
5. Deploy frontend changes.
6. Verify:
   - `/private-beta/health`
   - `/private-beta/auth/session` returns `401` without bearer token
   - `/private-beta/requests` returns `401` without admin bearer token
   - admin magic link creates an admin session
   - approved user session unlocks Beta Research on `/dashboard`

## Tests Performed

- Backend Python compile for:
  - `services/private_beta_auth.py`
  - `services/private_beta_gateway.py`
  - `services/api/routes/private_beta.py`
- PostgreSQL migration applied successfully.
- Gateway healthcheck returned reachable.
- Unauthenticated admin endpoints returned `401`.
- Admin magic link created a session.
- Admin bearer session could read `/private-beta/requests`.
- Frontend lint and build should pass before deployment.

## Risks

- Email delivery is not production-grade until SMTP is configured.
- Middleware only checks cookie presence; backend/server guards enforce role.
- Admin bootstrap depends on `POC_INTELLIGENCE_ADMIN_EMAILS`.
- Approved users get access to research depth, so copy and onboarding still
  matter to avoid interpreting observations as trade instructions.

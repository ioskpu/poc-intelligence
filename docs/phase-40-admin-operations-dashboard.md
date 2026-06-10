# Phase 40 - Admin Operations Dashboard MVP

## Scope

Phase 40 implements the existing `/admin/private-beta` route as an operational dashboard for Private Beta administration, using only the infrastructure and APIs already present in the application.

No authentication, middleware, magic link, SMTP, observatory snapshot, Futures Lab, or Beta Research Layer code was changed.

## Implemented UI

The admin page now exposes four operational sections:

1. Summary Metrics
2. Pending Requests
3. Approved Accounts
4. Active Sessions

The implementation is in:

- [src/features/private-beta/private-beta-admin-panel.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-admin-panel.tsx:36)
- [src/lib/private-beta-content.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/lib/private-beta-content.ts:48)

## Access Model

The page keeps the existing server-side access checks:

- Anonymous users are redirected to `/beta/login?next=/admin/private-beta`.
- Authenticated non-admin beta users are redirected to `/dashboard`.
- Admin users can load the page and call the admin snapshot API with their session token.

Code evidence:

- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:40) calls `getCurrentBetaSession()`.
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:41) redirects missing sessions to beta login.
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:44) redirects non-admin sessions to `/dashboard`.
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:51) fetches admin data with the current session token.

## Section 1 - Pending Requests

Implemented from the existing admin snapshot payload:

- Name
- Email
- Requested At
- Status
- Actions

Actions:

- Approve
- Reject
- View Details

Approve and Reject reuse the existing request status PATCH path. View Details is a local disclosure of data already present in the request record and does not introduce a new route or API.

Code evidence:

- [src/features/private-beta/private-beta-admin-panel.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-admin-panel.tsx:36) filters pending requests from `snapshot.requests`.
- [src/features/private-beta/private-beta-admin-panel.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-admin-panel.tsx:94) renders the pending table.
- [src/features/private-beta/private-beta-request-actions.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-request-actions.tsx:27) maps Approve/Reject to status updates.
- [src/app/api/private-beta/[requestId]/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/[requestId]/route.ts:19) reads the current session token before forwarding the update.
- [src/services/api/private-beta-backend.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/private-beta-backend.ts:103) forwards request status changes to the existing backend `PATCH /private-beta/{requestId}` API.

## Section 2 - Approved Accounts

The UI section is present with the required columns:

- Name
- Email
- Role
- Approved At
- Last Login
- Status
- Actions

Current gap:

The existing admin snapshot contains `requests`, `events`, `counts`, and `eventCounts`, but it does not expose beta accounts, roles, approval timestamps, revocation status, or last login data.

Because the required backend APIs do not exist, the UI documents the gap in place and does not invent account-management behavior.

Missing APIs:

- List approved/revoked beta accounts.
- Revoke account access.
- Promote account to admin.
- Demote admin account.

## Section 3 - Active Sessions

The UI section is present with the required columns:

- Email
- Session Created
- Last Seen
- Expires At
- Actions

Current gap:

The existing admin snapshot and frontend API client do not expose active beta sessions. The backend client exposes session verification and logout for the current session, but not admin session inventory or termination for another user session.

Missing APIs:

- List active beta sessions.
- Terminate a selected beta session by id/token.

## Section 4 - Summary Metrics

Implemented metrics:

- Pending Requests: exact count from pending request records.
- Approved Accounts: request-derived count from `snapshot.counts.approved` until an account inventory API exists.
- Active Sessions: `N/A`, with documented API gap.
- Revoked Accounts: `N/A`, with documented API gap.

Code evidence:

- [src/features/private-beta/private-beta-admin-panel.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-admin-panel.tsx:59) renders the four summary metric cards.

## API Inventory

Used APIs:

| Purpose | Frontend path | Backend path | Status |
| --- | --- | --- | --- |
| Load admin snapshot | `/admin/private-beta` server component | `GET /private-beta/requests` | Existing, admin session required |
| Approve request | `PATCH /api/private-beta/{requestId}` | `PATCH /private-beta/{requestId}` with `Approved` | Existing, admin session required |
| Reject request | `PATCH /api/private-beta/{requestId}` | `PATCH /private-beta/{requestId}` with `Rejected` | Existing, admin session required |
| View details | Local UI disclosure | None | Existing payload only |

Missing APIs:

| Need | Gap |
| --- | --- |
| Approved account inventory | No API returns account list with role, approved timestamp, last login, and status. |
| Revoke access | No admin API exists for direct account revocation from the UI. |
| Promote to admin | No admin API exists for account role promotion. |
| Demote admin | No admin API exists for account role demotion. |
| Active session inventory | No API returns active sessions for all beta users. |
| Terminate selected session | No admin API exists to terminate another user's session. |

## Validation

Static validation:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run build` | Passed |

Access validation:

| Case | Expected result | Result |
| --- | --- | --- |
| Anonymous user | Redirect to `/beta/login?next=/admin/private-beta` | Passed: HTTP `307` to `/beta/login?next=/admin/private-beta` |
| Invalid cookie | Redirect to `/beta/login?next=/admin/private-beta` | Passed: HTTP `307` to `/beta/login?next=/admin/private-beta` |
| Beta non-admin user | Redirect to `/dashboard` | Passed: HTTP `307` to `/dashboard` |
| Admin user | Can load dashboard and operate request approve/reject | Passed: HTTP `200`; created a Phase 40 validation request and moved it to `Rejected` through `PATCH /api/private-beta/{requestId}` |

Screenshots:

| Viewport | File |
| --- | --- |
| Desktop | [output/playwright/phase-40/admin-private-beta-desktop.png](/Users/luiscorales/Documents/proyectos/poc-intelligence/output/playwright/phase-40/admin-private-beta-desktop.png) |
| Tablet | [output/playwright/phase-40/admin-private-beta-tablet.png](/Users/luiscorales/Documents/proyectos/poc-intelligence/output/playwright/phase-40/admin-private-beta-tablet.png) |

## Residual Risks

- The dashboard cannot yet satisfy the complete account lifecycle without backend APIs for accounts and sessions.
- `Approved Accounts` currently uses an approved-request count as a temporary metric and clearly labels that it is request-derived.
- Account revocation, role changes, and session termination remain documented gaps, not hidden or simulated UI operations.

## Final Status

Phase 40 is implemented against current infrastructure. The admin can manage pending request approval/rejection from the UI. Full account and session operations remain blocked by missing backend APIs and are documented as gaps instead of being simulated in the frontend.

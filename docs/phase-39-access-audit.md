# Phase 39 - Access Audit and Lockdown

Date: 2026-06-10

Scope: audit only. No UX, SMTP, Observatory Snapshot, Futures Lab, production
behavior or architecture changes were made.

## Executive Answer

Is Beta Research really protected today?

**No.** Beta Research is protected when access depends on session state, but it
can also be enabled globally by `POC_INTELLIGENCE_BETA_RESEARCH_ENABLED`.

Is the admin panel really protected today?

**Yes for the rendered admin page and backend admin data/actions.** Middleware
only checks cookie presence, but the server page and backend admin endpoints
verify a real active admin session.

## Current Access Map

```text
Visitor
  -> /dashboard
     -> public dashboard renders for everyone
     -> getCurrentBetaSession()
        -> no cookie: null
        -> invalid/revoked/expired cookie: null
     -> DashboardShell
        -> Beta Research if:
           (session account status is Active OR feature flag is enabled)
           AND snapshot.betaLiveInsights exists

Approved beta user
  -> /beta/verify?token=...
     -> backend verifies magic token and account status Active
     -> sets httpOnly poc-beta-session cookie
  -> /dashboard
     -> getCurrentBetaSession() validates token through backend
     -> page passes betaResearchEnabled=true when account.status === Active
     -> DashboardShell renders Beta Research if snapshot.betaLiveInsights exists

Admin
  -> /beta/verify?token=...
     -> active admin account receives session cookie
  -> /admin/private-beta
     -> middleware checks only cookie presence
     -> page calls getCurrentBetaSession()
     -> page redirects non-admin to /dashboard
     -> page calls backend /private-beta/requests with Bearer session token
     -> backend requires active session with role admin
```

## Exact Beta Research Conditions

The dashboard page computes:

- [src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:24): `getCurrentBetaSession()`
- [src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:25): `betaResearchEnabled = betaSession?.account.status === "Active"`

The shell then computes:

- [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:30): `sessionBetaResearchEnabled || isBetaResearchEnabled()`
- [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:32): `Boolean(snapshot.betaLiveInsights)`
- [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:33): both conditions must be true
- [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:63): renders `BetaResearchLayer`

The feature flag is:

- [src/lib/feature-flags.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/lib/feature-flags.ts:1): `POC_INTELLIGENCE_BETA_RESEARCH_ENABLED`
- [src/lib/feature-flags.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/lib/feature-flags.ts:4): true for `true`, `1`, or `yes`

`BetaResearchLayer` and `BetaLiveDepth` do not perform auth checks:

- [src/features/dashboard/beta-research-layer.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/beta-research-layer.tsx:14): only returns null if `betaLive` is missing
- [src/features/dashboard/beta-live-depth.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/beta-live-depth.tsx:32): only returns null if `betaLive` is missing

Therefore the exact current condition is:

```text
((backend-validated session exists and account.status === "Active")
 OR POC_INTELLIGENCE_BETA_RESEARCH_ENABLED is true/1/yes)
AND snapshot.betaLiveInsights is present
```

## Beta Research A-E Validation

| Case | Result today | Evidence |
| --- | --- | --- |
| A. No session | Renders only if feature flag is enabled and snapshot has `betaLiveInsights`. Otherwise no. | `getCurrentBetaSession()` returns null without cookie at [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:40); feature flag OR occurs at [dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:30). |
| B. Invalid session | Same as no session. Invalid backend session is caught and returned as null. | [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:47) catches backend errors and returns null. |
| C. Revoked session | Same as no session. Backend rejects revoked sessions; frontend converts that to null. | Backend checks `revoked_at` and account status in `require_private_beta_session()` on production backend `services/private_beta_auth.py:197-202`; frontend catches at [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:47). |
| D. Approved active session | Renders if snapshot has `betaLiveInsights`. | [src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:25) checks `status === "Active"`; [dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:32) requires `betaLiveInsights`. |
| E. Feature flag only | Yes, if snapshot has `betaLiveInsights`, even without session. | [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:30) ORs session with `isBetaResearchEnabled()`. |

## Exact Admin Conditions

Middleware:

- [middleware.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/middleware.ts:7): only matches `/admin/private-beta`
- [middleware.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/middleware.ts:8): checks only whether `poc-beta-session` cookie exists
- [middleware.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/middleware.ts:10): redirects to login if absent

Admin page:

- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:40): calls `getCurrentBetaSession()`
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:41): redirects to login if no valid session
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:44): redirects to dashboard if `session.account.role !== "admin"`
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:47): reads session token
- [src/app/admin/private-beta/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:51): fetches admin data with session token

Next API admin mutation:

- [src/app/api/private-beta/[requestId]/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/[requestId]/route.ts:19): reads current session token
- [src/app/api/private-beta/[requestId]/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/[requestId]/route.ts:20): forwards token to backend status update

Backend admin enforcement:

- Production backend `services/api/routes/private_beta.py:78-83`: `/private-beta/requests` requires bearer token and returns 401 on `PrivateBetaAuthError`.
- Production backend `services/api/routes/private_beta.py:86-95`: `/private-beta/{request_id}` requires bearer token and returns 401 on auth failure.
- Production backend `services/private_beta_gateway.py:42-44`: admin snapshot calls `require_private_beta_session(..., required_role="admin")`.
- Production backend `services/private_beta_gateway.py:125-133`: status updates call `require_private_beta_session(..., required_role="admin")`.
- Production backend `services/private_beta_auth.py:195-204`: rejects missing, invalid, revoked, expired, non-active and non-admin sessions.

Admin outcome today:

| Question | Answer |
| --- | --- |
| Can any authenticated user enter `/admin/private-beta`? | No. Middleware lets a cookie-holder through, but the page redirects non-admin users at [page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/admin/private-beta/page.tsx:44). |
| Can only admin enter? | Yes for rendered admin content. |
| Is there privilege escalation in the Next page? | No direct page escalation found; role comes from backend-validated session. |
| Are admin backend endpoints accessible without session? | No for admin list/update; backend requires bearer admin session. |

## Bypass Inventory

| Severity | Bypass / Weakness | File | Impact |
| --- | --- | --- | --- |
| P0 | Feature flag bypass for Beta Research. `POC_INTELLIGENCE_BETA_RESEARCH_ENABLED` can expose Beta Research without a valid session. | [src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:30), [src/lib/feature-flags.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/lib/feature-flags.ts:1) | Beta Research is not strictly gated by approved session. |
| P1 | Middleware admin guard checks only cookie presence, not token validity or role. | [middleware.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/middleware.ts:7) | Invalid/non-admin cookie reaches page execution before server page redirects. Not an admin data leak because page/backend revalidate. |
| P1 | `BetaResearchLayer` and `BetaLiveDepth` have no internal auth guard. | [beta-research-layer.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/beta-research-layer.tsx:11), [beta-live-depth.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/beta-live-depth.tsx:27) | Any caller that passes `betaLive` can render the layer. Current caller has a guard, but component is not self-protecting. |
| P2 | `GET /api/beta-auth/session` returns full session object to any holder of a valid cookie. | [src/app/api/beta-auth/session/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/beta-auth/session/route.ts:11) | Low impact; useful for client state, but exposes account role/status to browser. |
| P2 | Public request/event/health endpoints are intentionally unauthenticated. | [src/app/api/private-beta/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/route.ts:7), [events/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/events/route.ts:7), [health/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/private-beta/health/route.ts:6) | Expected for landing/telemetry/health. Not an admin bypass, but should be rate-limited separately. |
| P2 | Request-link endpoint is unauthenticated by design. | [src/app/api/beta-auth/request-link/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/api/beta-auth/request-link/route.ts:4) | Backend only sends/returns link for active account/admin email; abuse risk is request volume, not access bypass. |

No query-param bypass was found for Beta Research or admin. Query params observed are language selection and safe magic-link `next` redirect:

- [src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:19): `lang`
- [src/app/beta/verify/route.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/beta/verify/route.ts:32): `next` must start with `/` and not `//`

No localStorage/sessionStorage bypass was found for access control. Existing browser storage is not used as auth:

- `sessionStorage` only suppresses duplicate landing visit tracking in [private-beta-section.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/private-beta/private-beta-section.tsx:51).
- `localStorage` only stores locale in [language-switcher.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/components/layout/language-switcher.tsx:30).

No `AccessGate` or `SessionGuard` components were found.

## Risk Evaluation

The main access-control gap is Beta Research, not admin.

Beta Research currently has two authorization sources:

1. Backend-validated active beta session.
2. Deployment-wide feature flag.

Because source 2 does not depend on identity, Beta Research cannot be described
as strictly protected for approved users only.

Admin has layered checks:

1. Middleware cookie presence gate.
2. Server page session validation.
3. Server page role validation.
4. Backend bearer-token admin-role validation.

The middleware layer is weak, but the effective admin controls happen server-side
and backend-side.

## Recommended Lockdown Plan

Do not implement in this phase.

Target final rule for Beta Research:

```text
session.account.status === "Active"
```

Equivalent product wording:

```text
session.approved == true
```

Recommended simplification:

- Remove `isBetaResearchEnabled()` from the Beta Research render path.
- Keep `snapshot.betaLiveInsights` as data availability, not authorization.
- Pass only the backend-validated session decision from `DashboardPage`.
- Optionally rename `betaResearchEnabled` to `hasActiveBetaSession` to avoid mixing feature flags with auth.

Target final rule for Admin:

```text
session.account.role === "admin"
```

Recommended simplification:

- Make middleware either a light redirect-only optimization or remove it.
- Keep the admin page server-side role check.
- Keep backend `/private-beta/requests` and `/private-beta/{id}` role checks.
- Prefer using `requireCurrentAdminSession()` in the page/API code for one canonical admin check.

## Prioritized Remediation

P0:

- Remove feature-flag authorization from Beta Research rendering. Beta Research should require active backend-validated session only.

P1:

- Replace middleware cookie-presence gate with no-op/redirect-only language, or make it call a real validation path if supported safely.
- Use `requireCurrentAdminSession()` in `/admin/private-beta` and admin API handlers to centralize role checks.

P2:

- Add explicit comments/tests documenting that request/event/health endpoints are intentionally public.
- Rate-limit unauthenticated public beta request and event endpoints at the Gateway or edge.
- Minimize `/api/beta-auth/session` response if client code does not need full account details.


# Phase 39B - Beta Access Lockdown

Date: 2026-06-10

Scope: authorization hardening only. No UX, SMTP, Observatory Snapshot, Futures
Lab, infrastructure or route changes were made.

## Objective

Remove the bypass that allowed Beta Research Layer to render from a feature flag
without a valid approved beta session.

Final rule:

```text
Beta Research Layer requires a backend-validated active beta session.
```

In the current data model, approved beta access is represented by:

```text
session.account.status === "Active"
```

Revoked, expired, invalid or missing sessions resolve to no session.

## Code Change

Changed:

[src/features/dashboard/dashboard-shell.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/features/dashboard/dashboard-shell.tsx:1)

Before:

```text
showBetaResearchLayer =
  (sessionBetaResearchEnabled || isBetaResearchEnabled())
  && Boolean(snapshot.betaLiveInsights)
```

After:

```text
showBetaResearchLayer =
  sessionBetaResearchEnabled
  && Boolean(snapshot.betaLiveInsights)
```

The feature flag import was removed from `DashboardShell`.

## Source of Truth

The only authorization input for Beta Research now comes from:

[src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:24)

```text
getCurrentBetaSession()
```

Then:

[src/app/dashboard/page.tsx](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/app/dashboard/page.tsx:25)

```text
betaResearchEnabled = betaSession?.account.status === "Active"
```

Session helper behavior:

- [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:40): reads `poc-beta-session` cookie.
- [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:47): validates token through backend.
- [src/services/api/beta-auth.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/services/api/beta-auth.ts:49): invalid/revoked/expired backend errors become `null`.

Backend behavior verified in Phase 39:

- Missing token is rejected.
- Invalid token is rejected.
- Revoked session is rejected.
- Expired session is rejected.
- Non-active account is rejected.

## Feature Flag Bypass Removal

The previous bypass was:

```text
sessionBetaResearchEnabled || isBetaResearchEnabled()
```

That no longer exists in the production render path.

`POC_INTELLIGENCE_BETA_RESEARCH_ENABLED` remains defined in
[src/lib/feature-flags.ts](/Users/luiscorales/Documents/proyectos/poc-intelligence/src/lib/feature-flags.ts:1),
but it is no longer imported by `DashboardShell` and no longer authorizes Beta
Research Layer.

Static verification:

```text
src/features/dashboard/dashboard-shell.tsx no longer imports isBetaResearchEnabled
src/features/dashboard/dashboard-shell.tsx no longer contains an OR condition with a feature flag
```

## Final Access Table

| Case | Dashboard | Beta Research Layer | Admin |
| --- | --- | --- | --- |
| A. No cookie | Yes, public dashboard | No | No; middleware redirects to login |
| B. Invalid cookie/session | Yes, public dashboard | No; backend validation returns null | No; page redirects after session validation |
| C. Revoked session | Yes, public dashboard | No; backend rejects revoked session and frontend treats it as null | No; backend/page reject session |
| D. Approved active user | Yes, public dashboard | Yes, if `snapshot.betaLiveInsights` exists | No, unless role is `admin` |
| E. Admin active session | Yes, public dashboard | Yes, same as approved user | Yes |
| Feature flag only | Yes, public dashboard | No | No |

## Required Case Validation

### A. No Cookie

Dashboard:

- `/dashboard` is public and renders.
- `getCurrentBetaSession()` returns `null` when there is no cookie.

Beta:

- `sessionBetaResearchEnabled` is false.
- `showBetaResearchLayer` is false.

Admin:

- Middleware checks for `poc-beta-session`.
- Missing cookie redirects to `/beta/login?next=/admin/private-beta`.

### B. Invalid Cookie

Dashboard:

- `/dashboard` renders public content.
- `getCurrentBetaSession()` calls backend session validation and catches errors.

Beta:

- Invalid session resolves to `null`.
- `sessionBetaResearchEnabled` is false.
- Feature flag no longer overrides that.

Admin:

- Middleware may let a cookie-holder through, but the server page calls
  `getCurrentBetaSession()` and redirects if the backend rejects the session.

### C. Revoked Session

Dashboard:

- `/dashboard` renders public content.
- Backend rejects revoked sessions.

Beta:

- Revoked session resolves to `null`.
- Beta Research does not render.

Admin:

- Backend rejects revoked sessions before admin data or mutations.

### D. Approved Active User

Dashboard:

- `/dashboard` renders public content.

Beta:

- Backend returns session with `account.status === "Active"`.
- `DashboardPage` passes `betaResearchEnabled=true`.
- `DashboardShell` renders Beta Research when `snapshot.betaLiveInsights` exists.

Admin:

- User role is not sufficient unless `session.account.role === "admin"`.

### E. Admin

Dashboard:

- `/dashboard` renders public content.

Beta:

- Admin accounts are active beta accounts, so they pass the same active-session
  gate as approved users.

Admin:

- `/admin/private-beta` page checks `session.account.role === "admin"`.
- Backend admin list/update endpoints also require bearer token with role admin.

## Evidence Commands

Commands run locally:

```text
rg -n "isBetaResearchEnabled|betaResearchEnabled|showBetaResearchLayer|POC_INTELLIGENCE_BETA_RESEARCH_ENABLED" src middleware.ts docs/phase-39-access-audit.md
npm run lint
npm run build
```

Observed static result after the change:

```text
DashboardShell does not import isBetaResearchEnabled.
DashboardShell computes showBetaResearchLayer from sessionBetaResearchEnabled && betaLiveEnabled.
No supported render path remains where feature flag alone can display Beta Research.
```

Validation results:

```text
npm run lint: passed
npm run build: passed
```

## Acceptance Statement

Beta Research Layer requires sesión aprobada válida.

No existe ningún camino soportado para visualizar Beta Research Layer mediante
feature flags únicamente.

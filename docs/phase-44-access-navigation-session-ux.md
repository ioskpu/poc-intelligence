# Phase 44 - Access Navigation & Session UX

## Summary

Phase 44 added visible access and session navigation without changing authorization rules, the magic-link flow, backend data contracts, the Observatory Snapshot Gateway, Beta Research Layer behavior, or PostgreSQL schema.

The implementation makes sign-in, account state, admin entry, and sign-out discoverable from the public landing page, public dashboard, authenticated dashboard state, and the private beta admin page.

## Navigation Inventory

| Surface | Before | After |
| --- | --- | --- |
| Landing page | Primary observatory CTA existed, but no explicit sign-in entry point. | Anonymous users see `Observatory` and `Sign In`; authenticated users see session navigation. |
| Dashboard top bar | Public observatory status existed; logout appeared only inside the beta-live condition. | Anonymous users see `Observatory` and `Sign In`; authenticated users see status, `Account`, and `Sign Out`; admins also see `Administration`. |
| Login page | Magic-link form existed with limited context. | Login explains approved email access, secure magic link delivery, and passwordless access; includes `Open Observatory`. |
| Admin page | Direct route worked for admins but normal navigation entry was hidden. | Admins see `Administration` in authenticated navigation and retain the existing server-side role guard. |
| Account | No minimal account surface existed. | `/account` shows email, name, role, access status, session expiry, and relevant actions. |

## Session State Matrix

| State | Landing | Dashboard | Beta Research | Account | Admin Navigation | Sign Out |
| --- | --- | --- | --- | --- | --- | --- |
| Anonymous | `Observatory`, `Sign In` | Public observatory, `Sign In` | Hidden | Redirects to `/beta/login?next=/account` | Hidden | Hidden |
| Invalid session | Treated as anonymous by `getCurrentBetaSession()` | Public observatory, `Sign In` | Hidden | Redirects to login | Hidden | Hidden |
| Revoked session | Treated as anonymous after session validation fails | Public observatory, `Sign In` | Hidden | Redirects to login | Hidden | Hidden |
| Approved beta user | `Beta Access Active`, `Account`, `Sign Out` | Public observatory plus existing Beta Research Layer eligibility | Visible only through existing approved-session rules | Visible | Hidden | Visible |
| Admin | `Admin Access`, `Administration`, `Account`, `Sign Out` | Public observatory plus existing Beta Research Layer eligibility | Same beta eligibility as approved users | Visible | Visible | Visible |

## Routing Audit

| Flow | Result |
| --- | --- |
| Anonymous: Landing -> Sign In -> Login | `Sign In` routes to `/beta/login`. |
| Anonymous: Landing -> Observatory | `Observatory` routes to `/dashboard`. |
| Approved user: Login -> Dashboard -> Beta Research | Existing magic-link verification and dashboard session handling remain unchanged. |
| Admin: Login -> Admin Dashboard | Existing `/admin/private-beta` redirect and server-side admin guard remain unchanged. |
| Non-admin: Admin URL | Existing admin page redirects non-admin sessions to `/dashboard`. |
| Logout: Authenticated page -> Sign Out | `Sign Out` calls the existing POST `/api/beta-auth/logout` and then routes to `/dashboard`. |

## Implementation Notes

- `SessionNavigation` centralizes the visible navigation rules.
- The admin link is rendered only when `session.account.role === "admin"`.
- Feature flags are not used as authorization.
- The dashboard still delegates Beta Research visibility to the existing approved-session and beta-live logic.
- `/account` is intentionally minimal and reads only the current session.
- Last login is not shown on `/account` because the current session object does not include `last_login_at`; adding that would require API/session contract work outside this phase.

## Screenshots

Desktop and tablet captures were generated for:

- `output/playwright/phase-44-anonymous-landing-desktop.png`
- `output/playwright/phase-44-anonymous-landing-tablet.png`
- `output/playwright/phase-44-anonymous-dashboard-desktop.png`
- `output/playwright/phase-44-anonymous-dashboard-tablet.png`
- `output/playwright/phase-44-login-desktop.png`
- `output/playwright/phase-44-login-tablet.png`
- `output/playwright/phase-44-beta-dashboard-desktop.png`
- `output/playwright/phase-44-beta-dashboard-tablet.png`
- `output/playwright/phase-44-beta-account-desktop.png`
- `output/playwright/phase-44-beta-account-tablet.png`
- `output/playwright/phase-44-admin-dashboard-desktop.png`
- `output/playwright/phase-44-admin-dashboard-tablet.png`
- `output/playwright/phase-44-admin-account-desktop.png`
- `output/playwright/phase-44-admin-account-tablet.png`

## Risk Assessment

| Risk | Level | Notes |
| --- | --- | --- |
| Header density on smaller widths | Low | Navigation uses wrapping and compact badges for constrained space. |
| Account surface is intentionally minimal | Low | It avoids profile-system scope and does not require new APIs. |
| Logout depends on client-side navigation after POST | Low | The existing GET logout endpoint remains available; visible UX uses POST then redirects to the public observatory. |
| Admin route remains directly addressable | Low | Existing server-side admin guard remains the enforcement point; navigation only controls discoverability. |

## Validation

Commands:

- `npm run lint`
- `npm run build`

Validation scenarios covered by browser screenshots:

- Anonymous landing navigation.
- Anonymous dashboard navigation.
- Login guidance.
- Approved beta dashboard and account surfaces.
- Admin dashboard and account surfaces.

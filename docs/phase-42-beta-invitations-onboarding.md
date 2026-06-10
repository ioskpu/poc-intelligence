# Phase 42 - Beta Invitations & Onboarding

## Summary

Phase 42 converts approval into an invitation lifecycle without changing `DashboardShell`, Observatory Snapshot, Beta Research Layer, Futures Lab, or the snapshot producer.

Implemented:

- Backend invitation delivery abstraction with Resend first, SMTP fallback, and `log_only` graceful fallback.
- Invitation records on approved beta accounts and login tokens.
- Automatic invitation generation when an admin approves a request.
- Admin resend invitation action.
- Invitation open tracking pixel.
- Invitation used and first-login tracking.
- First-login onboarding banner rendered around the existing dashboard shell.
- Admin metrics for invitations sent, invitations used, first logins completed, pending approvals, and approved accounts.
- Audit events for `invitation_sent`, `invitation_resent`, `invitation_opened`, and `invitation_used`.

## Backend Design

Email delivery lives in `services/private_beta_email.py`.

Provider resolution:

1. `POC_INTELLIGENCE_EMAIL_PROVIDER=resend|smtp|log_only`
2. `RESEND_API_KEY` present -> Resend HTTPS API
3. `POC_INTELLIGENCE_SMTP_HOST` present -> SMTP relay
4. Otherwise -> `log_only`

The implementation does not store plaintext magic tokens. Tokens are generated once, hashed into `private_beta_login_tokens`, and only the generated link is passed to the delivery provider or fallback log line.

## Migration

Applied migration:

`migrations/20260610_private_beta_invitations.sql`

Adds account fields:

- `invitation_sent_at`
- `invitation_opened_at`
- `invitation_used_at`
- `first_login_completed_at`
- `invitation_delivery`
- `invitation_message_id`
- `invitation_fallback_reason`

Adds login token fields:

- `invitation_id`
- `invitation_sent_at`
- `invitation_opened_at`

Adds index:

- `private_beta_login_tokens_invitation_idx`

## Admin UI

Updated `/admin/private-beta`:

- Summary metrics now show pending approvals, approved accounts, invitations sent, invitations used, and first logins completed.
- Approved accounts table now includes invitation status.
- Account action menu now supports resend invitation.
- Existing admin auth remains unchanged; backend still enforces admin role.

Screenshots:

- `output/playwright/phase-42-admin-desktop.png`
- `output/playwright/phase-42-admin-tablet.png`
- `output/playwright/phase-42-onboarding-desktop.png`
- `output/playwright/phase-42-onboarding-tablet.png`

## First Login

`/beta/verify` now reads `firstLogin` from the backend response. On first login it sets a short-lived `poc-beta-onboarding` cookie scoped to `/dashboard`.

`/dashboard/page.tsx` reads that cookie and renders a concise onboarding banner above the existing `DashboardShell`.

The banner explains:

- what Observatory is
- what Beta Research adds
- that the beta layer remains experimental

## Validation

Backend production validation against `https://api.poc-engine.lat`:

```text
test_email=phase42-validation-1781131775@example.com
admin_verify=ok
request_id=7a0ecf0e-c851-4207-a59c-2b3e3deeccb3
approve_status=Approved
account_id=4a207a55-4cc7-44ca-8c56-c9bf9e040e32
account_invitation_status=Sent
account_invitation_delivery=log_only
account_invitation_sent=true
invitation_generated=yes
resend_delivery=log_only
resend_invitation_id=abf1f656-2ed4-487f-86c7-66c1a233c4c7
open_pixel_http=200
user_verify=ok
first_login=true
role=user
audit_invitation_sent=true
audit_invitation_resent=true
audit_invitation_opened=true
audit_invitation_used=true
```

Frontend validation:

```text
npm run lint  -> passed
npm run build -> passed
```

Playwright validation:

- Admin page loaded through real admin magic link.
- Admin metrics show invitations sent, invitations used, and first logins.
- Approved accounts table shows `Invitacion` column with `Sent`/`Used` statuses.
- First login dashboard shows onboarding banner and Beta Research access.

## Delivery Status

Production currently has no `RESEND_API_KEY`, `POC_INTELLIGENCE_SMTP_HOST`, or `POC_INTELLIGENCE_EMAIL_PROVIDER` configured.

Observed behavior:

- Invitation email payload is generated.
- Magic link is generated.
- Delivery falls back to `log_only`.
- Real external email delivery to a test inbox was not verified because no provider credentials are configured in production.

Operational step required for real delivery:

Set one of:

- `RESEND_API_KEY` and optionally `POC_INTELLIGENCE_INVITATION_FROM`
- or `POC_INTELLIGENCE_SMTP_HOST`, `POC_INTELLIGENCE_SMTP_PORT`, `POC_INTELLIGENCE_SMTP_USERNAME`, `POC_INTELLIGENCE_SMTP_PASSWORD`, `POC_INTELLIGENCE_SMTP_FROM`

Then restart `poc-api`.

## Deployment Status

Backend:

- Commit: `4d847bfdd68da9fd4682163dd7268f1c454821fe`
- Message: `feat: add private beta invitations`
- Pushed to Gitea: yes
- Production service: `poc-api` active
- Production HEAD: `4d847bfdd68da9fd4682163dd7268f1c454821fe`

Frontend:

- Message: `feat: add beta invitations onboarding UI`
- Commit and push status are reported in the phase delivery response.

## Residual Risks

- External email delivery remains pending until provider credentials are configured.
- Open tracking depends on email clients loading remote images; this is best-effort only.
- `log_only` remains useful for recovery but should not be considered real delivery.

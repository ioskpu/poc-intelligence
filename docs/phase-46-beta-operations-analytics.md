# Phase 46 - Beta Operations Analytics

## Summary

Phase 46 adds read-only operational analytics for Private Beta management.

Implemented:

- Admin-only Gateway endpoints:
  - `GET /private-beta/analytics/overview`
  - `GET /private-beta/analytics/activity`
  - `GET /private-beta/analytics/adoption`
- `/admin/private-beta` now shows:
  - Beta Health
  - Adoption Funnel
  - Recent Activity
  - Account Growth
- No authentication, session, invitation delivery, beta authorization, Observatory Snapshot, or research module logic was changed.

## Metrics

Overview metrics:

| Metric | Definition |
| --- | --- |
| `totalAccounts` | Count of rows in `private_beta_accounts`. |
| `activeAccounts` | Accounts where `status = Active`. |
| `revokedAccounts` | Accounts where `status = Revoked`. |
| `adminAccounts` | Accounts where `role = admin`. |
| `pendingRequests` | Requests where `status = Pending`. |
| `approvedRequests` | Requests where `status = Approved`. |
| `rejectedRequests` | Requests where `status = Rejected`. |
| `invitationsSent` | Accounts with `invitation_sent_at IS NOT NULL`. |
| `invitationsOpened` | Accounts with `invitation_opened_at IS NOT NULL`. |
| `invitationsUsed` | Accounts with `invitation_used_at IS NOT NULL`. |
| `firstLogins` | Accounts with `first_login_completed_at IS NOT NULL`. |
| `activeSessions` | Sessions with `revoked_at IS NULL AND expires_at > now()`. |
| `accountsCreatedLast7Days` | Accounts created in the last 7 days. |
| `accountsCreatedLast30Days` | Accounts created in the last 30 days. |
| `loginsLast24Hours` | Audit events where `event_type = login` in the last 24 hours. |
| `loginsLast7Days` | Audit events where `event_type = login` in the last 7 days. |
| `loginsLast30Days` | Audit events where `event_type = login` in the last 30 days. |

Activity timeline:

- Source: `private_beta_audit_events`
- Order: newest first
- Limit: 50 by default, capped at 100
- Fields: `timestamp`, `eventType`, `actorEmail`, `targetEmail`, `metadata`

## Formulas

| Metric | Formula |
| --- | --- |
| `invitationOpenRate` | `invitationsOpened / invitationsSent` |
| `invitationUseRate` | `invitationsUsed / invitationsSent` |
| `activationRate` | `firstLogins / invitationsSent` |
| `activeUserRate` | distinct accounts with active sessions / `activeAccounts` |
| `adminRatio` | `adminAccounts / totalAccounts` |

Rates return `0` when the denominator is zero.

## Validation

Frontend:

```text
npm run lint  -> passed
npm run build -> passed
```

Gateway authorization:

```text
anonymous GET /private-beta/analytics/overview -> HTTP 401
beta user GET /private-beta/analytics/overview -> HTTP 403
admin GET /private-beta/analytics/overview -> HTTP 200
admin GET /private-beta/analytics/activity -> HTTP 200
admin GET /private-beta/analytics/adoption -> HTTP 200
```

Sample production overview:

```json
{
  "totalAccounts": 10,
  "activeAccounts": 10,
  "revokedAccounts": 0,
  "adminAccounts": 2,
  "pendingRequests": 3,
  "approvedRequests": 10,
  "rejectedRequests": 1,
  "invitationsSent": 7,
  "invitationsOpened": 3,
  "invitationsUsed": 6,
  "firstLogins": 6,
  "activeSessions": 29,
  "accountsCreatedLast7Days": 10,
  "accountsCreatedLast30Days": 10,
  "loginsLast24Hours": 29,
  "loginsLast7Days": 29,
  "loginsLast30Days": 29
}
```

Sample production adoption:

```json
{
  "invitationOpenRate": 0.4286,
  "invitationUseRate": 0.8571,
  "activationRate": 0.8571,
  "activeUserRate": 0.7,
  "adminRatio": 0.2
}
```

## Screenshots

Generated:

- `output/playwright/phase-46-admin-analytics-desktop.png`
- `output/playwright/phase-46-admin-analytics-tablet.png`

## Notes

- Analytics are read-only and derived from existing tables.
- No migration was required.
- The frontend loads analytics server-side with the existing admin session token.
- Backend authorization is enforced by `require_private_beta_session(..., required_role="admin")`.

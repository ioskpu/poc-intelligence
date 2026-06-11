# Phase 47B Audit - Real Product Analytics

## Scope

Phase 47B targets `poc-intelligence` only. Phase 47 in the Gateway FastAPI dashboard is explicitly out of scope and should not be extended for this work.

No changes are allowed to Hermes, Observatory Snapshot, trading, Futures Lab, authentication, roles, sessions, invitations, or middleware.

## Existing Identity Source

The current beta identity is resolved server-side from the existing Private Beta session flow:

- Cookie name: `poc-beta-session`
- Cookie constant: `src/lib/beta-auth.ts`
- Session reader: `getCurrentBetaSessionToken()` in `src/services/api/beta-auth.ts`
- Full session loader: `getCurrentBetaSession()` in `src/services/api/beta-auth.ts`
- Required authenticated session helper: `requireCurrentBetaSession()` in `src/services/api/beta-auth.ts`
- Required admin helper: `requireCurrentAdminSession()` in `src/services/api/beta-auth.ts`

The session object exposes:

- `account.id`
- `account.email`
- `account.name`
- `account.role`
- `account.status`
- `expiresAt`

The account shape is defined by `BetaAccount` in `src/lib/beta-auth.ts`:

```ts
type BetaAccount = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  status: "Active" | "Revoked";
};
```

## Existing Backend and Storage

`poc-intelligence` does not write directly to PostgreSQL for Private Beta identity. It calls the existing Private Beta backend configured by:

- `POC_INTELLIGENCE_API_URL`
- client: `src/services/api/private-beta-backend.ts`

Existing backend endpoints already used by the frontend include:

- `GET /private-beta/auth/session`
- `POST /private-beta/auth/request-link`
- `POST /private-beta/auth/verify`
- `POST /private-beta/auth/logout`
- `GET /private-beta/requests`
- `GET /private-beta/analytics/overview`
- `GET /private-beta/analytics/activity`
- `GET /private-beta/analytics/adoption`

Existing documented backend storage:

- `private_beta_accounts`
- `private_beta_sessions`
- `private_beta_events`
- `private_beta_audit_events`

`private_beta_audit_events` is the correct existing persistence mechanism for authenticated product analytics because it already stores actor account identity, target fields, payload JSON, and timestamp, and is already the source for admin activity analytics in Phase 46.

No new analytics table should be created for Phase 47B unless the backend rejects product events and cannot store them in `private_beta_audit_events`.

## Endpoint of Ingestion

Preferred ingestion endpoint:

- `POST /private-beta/product-events`

Reasoning:

- It belongs to the existing Private Beta backend, not Gateway `/internal`.
- It can authenticate by the existing bearer beta session token.
- It can derive `accountId`, `email`, `role`, and `status` server-side from the bearer token.
- It can persist to existing `private_beta_audit_events`.
- It avoids trusting client-supplied identity fields.

Frontend proxy endpoint in `poc-intelligence`:

- `POST /api/private-beta/product-events`

The Next.js route should:

1. Read the current beta session token with `getCurrentBetaSessionToken()`.
2. Reject anonymous requests before forwarding.
3. Forward only `eventType` and `metadata` to the backend.
4. Not accept `accountId`, `email`, `role`, or `status` from the browser.

## Event Schema

Browser-to-Next.js payload:

```json
{
  "eventType": "dashboard_view",
  "metadata": {}
}
```

Next.js-to-backend payload:

```json
{
  "eventType": "dashboard_view",
  "accountId": "private_beta_account_id",
  "email": "user@example.com",
  "role": "user",
  "status": "Active",
  "timestamp": "2026-06-11T00:00:00.000Z",
  "metadata": {}
}
```

Canonical event persisted by the backend:

```json
{
  "eventType": "dashboard_view",
  "accountId": "private_beta_account_id",
  "role": "user",
  "timestamp": "2026-06-11T00:00:00.000Z",
  "metadata": {}
}
```

Allowed events:

- `session_started`
- `dashboard_view`
- `ranking_view`
- `ranking_symbol_clicked`
- `awareness_view`
- `ghost_tracking_view`
- `setup_memory_view`
- `beta_research_view`
- `admin_dashboard_view`

## Privacy Considerations

- Do not use `localStorage` user ids, anonymous ids, random browser ids, or sessionStorage ids.
- Do not trust browser-supplied identity.
- The browser should never submit `accountId`, `email`, `role`, or `status`.
- The backend should derive identity from the authenticated bearer session.
- Admin analytics may display email where the Private Beta admin already displays account emails.
- If long-term product analytics needs lower PII exposure, hash email backend-side and keep `account_id` as the stable join key.
- Metadata should remain product-level only: module names, symbols, ranking identifiers, report ids. It should not include API keys, session tokens, raw dashboard payloads, exchange credentials, or trading decisions.

## Decision

Reuse existing Private Beta backend identity and audit persistence.

Do not create a new storage platform or a new analytics table from `poc-intelligence`.

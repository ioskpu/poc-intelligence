# Phase 18 - Private Beta Infrastructure

## Goal

Build the minimal private beta flow required to capture interest, review requests manually, and track the smallest useful set of events.

## Technical Summary

- Added a private beta waitlist form on the landing page.
- Added status handling for `Pending`, `Approved`, and `Rejected`.
- Added a minimal admin panel at `/admin/private-beta`.
- Added API routes for:
  - request submission
  - request status updates
  - landing visit events
- Added analytics events:
  - `landing_visit`
  - `beta_request_submitted`
  - `beta_approved`
  - `beta_rejected`
- Kept all integration points inside `src/services/api`.
- Kept the beta copy separate from the main `i18n` file so shared copy stays under the file-size limit.

## Data Storage

- Primary persistence uses `POC_INTELLIGENCE_DATABASE_URL` when it is configured.
- For local development without a database, the beta store falls back to `.runtime/private-beta-store.json`.
- The runtime file is ignored by Git.

## UX Summary

- The landing page now explains the private beta in plain language.
- The form asks for:
  - name
  - email
  - experience level
  - optional market question
- After submission, the user sees a clear pending confirmation message in ES/EN.
- The admin panel keeps the workflow simple:
  - view requests
  - approve
  - reject
- The admin view also shows basic counts for requests and events.

## Validation

- `npm run lint` passed.
- `npm run build` passed.
- Browser validation confirmed:
  - landing form submission works
  - pending confirmation is visible
  - admin panel lists the request
  - approve action updates the status to `Approved`

## Notes

- The implementation is intentionally minimal and manual.
- No authentication, billing, or role system was added.
- The public demo path remains separate from the private beta workflow.

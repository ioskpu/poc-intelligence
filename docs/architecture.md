# Architecture

## Frontend Architecture

POC Intelligence is a Next.js App Router application using TypeScript,
TailwindCSS and shadcn-compatible UI primitives.

The frontend is dashboard-first, desktop-first and dark mode by default. It is
designed to display quantitative intelligence only. It does not execute trades
and does not provide financial advice.

## Feature Structure

Source code is organized under `src`:

- `app`: Route-level files for the App Router.
- `components`: Shared UI and layout components.
- `features`: Domain-oriented feature modules.
- `services`: External service and API access boundaries.
- `hooks`: Future shared React hooks.
- `lib`: Shared utility functions.
- `types`: Shared TypeScript types.

Current feature modules:

- `features/landing`: Product overview and landing page composition.
- `features/dashboard`: Dashboard shell and intelligence display panels.

## API Layer Design

All API access must go through `src/services/api`.

Pages and components must not call `fetch` directly. They consume service
functions that return typed data contracts from `src/types`.

Phase 1 uses mock data through:

```ts
getIntelligenceSnapshot()
```

This keeps mock data behind the same boundary that future live API calls will
use.

## Future Futures Lab Integration

The existing Futures Lab backend remains the source of truth. The frontend will
consume read-only endpoints and should not rewrite backend behavior.

Expected integration path:

- Add environment-based API configuration.
- Replace mock service implementations with Futures Lab HTTP clients.
- Validate response shapes at the service boundary.
- Transform backend responses into stable frontend view models.
- Keep feature components unaware of transport details.

The integration must preserve the rule that POC Intelligence is an intelligence
product only, not a trading or advisory system.

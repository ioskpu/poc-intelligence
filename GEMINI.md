# POC Intelligence - Project Guidelines

This file provides foundational mandates and architectural guidance for the POC Intelligence project.

## Tech Stack
- **Framework:** Next.js 16.2+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4, shadcn/ui
- **Database:** PostgreSQL (via `pg`)
- **State/Data:** API access boundary in `src/services/api`

## Architecture
The project follows a domain-driven feature structure:
- `src/app`: App Router pages and layouts.
- `src/components`: Shared UI components (shadcn-compatible).
- `src/features`: Business logic and components grouped by domain.
- `src/services/api`: ALL data access must go through this boundary. Use typed contracts.
- `src/types`: Shared TypeScript interfaces and types.
- `src/lib`: Shared utility functions.

## Development Workflows
- **Surgical Edits:** Prefer minimal, precise changes to existing files.
- **Mock First:** For new features, implement typed mock data behind the API boundary first.
- **Testing:** Ensure behavioral correctness through validation.
- **Linting:** Run `npm run lint` before completing tasks.
- **Source Control:** Follow the Governance policy in `docs/governance.md`. Every phase must end with a clean build and a detailed commit report.

## Conventions
- Use functional components and React Hooks.
- Prefer Vanilla CSS/Tailwind 4 primitives.
- Maintain type safety across the entire data flow.
- Follow the established directory structure for new features.

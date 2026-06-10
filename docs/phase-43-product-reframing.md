# Phase 43 - Product Reframing

## Summary

The public experience was reframed from legacy demo positioning to public observatory positioning.

Scope was limited to user-facing copy, labels, badges, banners, descriptions, CTAs, and messaging. No architecture, auth, API, backend, data contract, feature flag, Beta Research Layer, admin, middleware, session, or snapshot generation code was changed.

## Before / After Copy Matrix

| File | Current Copy | Proposed Copy | User Surface |
| --- | --- | --- | --- |
| `src/lib/i18n.ts` | `Demostración pública` | `Observatorio público` | Public banner badge |
| `src/lib/i18n.ts` | `Esta es una demostración pública que utiliza datos de ejemplo para evaluación del producto.` | `Vista pública del observatorio de investigación. Los datos se actualizan periódicamente desde el pipeline del observatorio; algunas capacidades avanzadas están disponibles únicamente para participantes Beta.` | Public banner message |
| `src/lib/i18n.ts` | `Demostración pública` | `Observatorio público` | Dashboard top bar badge |
| `src/lib/i18n.ts` | `Entrar a la demo` | `Abrir observatorio` | Landing primary CTA |
| `src/lib/i18n.ts` | `Esta sección aparece en la demo pública como superficie de evaluación y puede cambiar antes de la beta.` | `Esta sección es parte de la vista pública del observatorio y puede cambiar mientras se valida la capa de investigación.` | Opportunity Rankings note |
| `src/lib/i18n.ts` | `Este panel agrega profundidad real de investigación para validar la experiencia con usuarios aprobados.` | `Este panel agrega mayor profundidad de investigación para usuarios aprobados.` | Beta banner message |
| `src/lib/i18n.ts` | `Public demo` | `Public Observatory` | Public banner badge |
| `src/lib/i18n.ts` | `This public demonstration uses sample research data for product evaluation.` | `Public view of the research observatory. Data is refreshed periodically from the observatory pipeline; advanced research capabilities are available to approved Beta participants.` | Public banner message |
| `src/lib/i18n.ts` | `Public demo` | `Public Observatory` | Dashboard top bar badge |
| `src/lib/i18n.ts` | `Enter the demo` | `Open Observatory` | Landing primary CTA |
| `src/lib/i18n.ts` | `This section remains visible in the public demo as an evaluation surface and may change before beta release.` | `This section is part of the public observatory view and may change while the research layer is validated.` | Opportunity Rankings note |
| `src/lib/i18n.ts` | `This panel adds real research depth to validate the approved user experience.` | `This panel adds deeper research context for approved users.` | Beta banner message |
| `src/lib/private-beta-content.ts` | `Limited access keeps the product evaluation focused.` | `Limited access keeps feedback focused and direct.` | Private Beta process copy |

## Remaining Demo References

No user-visible `src` strings remain for:

- `Demostración pública`
- `Public demo`
- `datos de ejemplo`
- `sample data`
- `public demonstration`
- `Enter the demo`
- `demo pública`
- `evaluation surface`
- `product evaluation`

Remaining demo references are internal or historical:

- `src/services/api/public-demo-snapshot.ts` retains the fallback snapshot implementation.
- `src/services/api/observatory-client.ts` retains `source: "demo"` as a recovery/fallback state.
- `src/services/api/index.ts` retains fallback logging.
- Older docs still describe earlier demo phases and were not rewritten.
- Component/key names such as `PublicDemoBanner` and `publicDemo` remain internal identifiers only; their visible copy now says `Public Observatory` / `Observatorio público`.

## Beta Positioning

Public users are framed as using the public observatory.

Approved users are framed as receiving additional depth through Beta Research. The copy avoids presenting Beta as the "real", "full", or "actual" version; the distinction is depth and access to advanced research context.

## Risk Assessment

| Risk | Level | Notes |
| --- | --- | --- |
| Internal identifiers still include `demo` | Low | Not user-visible. Renaming them would be a refactor outside this phase. |
| Fallback demo snapshot remains | Low | Required recovery behavior from prior architecture; not exposed as normal production positioning. |
| Historical docs still reference public demo | Low | They document prior phases and are not product UI. |
| Long banner text on small screens | Low | Existing banner layout wraps text; screenshots were generated for desktop and tablet. |

## Validation

Commands:

- `npm run lint`
- `npm run build`

Screenshots:

- `output/playwright/phase-43-dashboard-es-desktop.png`
- `output/playwright/phase-43-dashboard-es-tablet.png`
- `output/playwright/phase-43-dashboard-en-desktop.png`
- `output/playwright/phase-43-dashboard-en-tablet.png`
- `output/playwright/phase-43-landing-es-desktop.png`
- `output/playwright/phase-43-landing-es-tablet.png`
- `output/playwright/phase-43-landing-en-desktop.png`
- `output/playwright/phase-43-landing-en-tablet.png`

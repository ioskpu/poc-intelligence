# Phase 15.1 - Public Repository Sanitization

## Objective

Prepare the repository for public visibility by removing or redacting internal
deployment details, private network references and operational notes that should
not appear in a public mirror.

This phase is repository sanitization only. No product behavior or deployment
infrastructure was added.

## Findings

### Internal References Found

The initial audit found internal references in:

- `.env.example`
- `README.md`
- multiple `docs/phase-*` notes
- `docs/architecture-dependency-audit.md`
- `docs/market-intelligence-discovery.md`
- `docs/phase-15-public-deployment-audit.md`
- `src/services/api/market-rankings.ts`

The main issues were:

- private IP and port examples
- local fallback references that read like infrastructure defaults
- explicit internal dashboard route text in public documentation
- example environment values that pointed at private runtime details

### Secret Review

No committed secret value was found during the scan.

The repository still documents private runtime variables, but they now use
neutral placeholders instead of real infrastructure values.

## Changes Made

### Environment Sanitization

- Replaced the example Futures Lab API base URL with a neutral placeholder.
- Added a placeholder read-only database URL example.
- Added a placeholder private dashboard state path example.
- Kept the timeout override as a public-safe configuration example.

### Documentation Sanitization

- Rewrote public-facing phase notes to remove literal private IP addresses.
- Replaced internal route strings with descriptive language.
- Redacted local fallback references that looked like operational deployment
  notes.
- Updated deployment-readiness notes to describe risk without exposing private
  host values.

### README Update

- Clarified that live integration variables are private.
- Added a short contributing section for public repository use.

### Runtime Integration Sanitization

- Moved the dashboard state path out of source code and into configuration.
- Kept the runtime behavior the same when the private deployment provides the
  correct value.

## Items Removed or Redacted

- Real private IP addresses
- Real private port values
- Literal internal route text in public docs
- Development fallback values that pointed to internal infrastructure
- Placeholder wording that looked like a runtime secret

## Readiness Assessment

Final classification:

**READY FOR GITHUB MIRROR**

Reasoning:

- No private IPs remain in the repository scan.
- No internal hostnames remain in the repository scan.
- No internal route string remains in the repository scan.
- No committed secrets were found.
- Public documentation now uses placeholders instead of real infrastructure
  values.

Residual note:

The private live integration still exists in code and documentation as a
feature, but it is now represented through neutral placeholders and private
configuration rather than hardcoded infrastructure values.

## Summary

The repository is sanitized for public visibility and can now be mirrored to
GitHub without exposing private network details or operational secrets.

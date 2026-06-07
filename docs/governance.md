# Project Governance

## Source Control Policy

Every completed phase must end with:

1. Git status verification.
2. Commit creation.
3. Push to Gitea.
4. Reporting:
   - branch
   - commit hash
   - commit message
   - push status

A phase is not considered completed until:

- documentation exists
- validation passes
- commit exists
- push succeeds

No local-only completed phases are allowed.

## Commit Conventions

- `docs`: documentation changes
- `feat`: new functionality
- `fix`: bug fixes
- `refactor`: internal improvements
- `chore`: maintenance and governance tasks

## Delivery Requirement

At the end of every phase:

- commit changes
- push to Gitea
- report commit hash
- report repository URL

This requirement applies unless the user explicitly instructs otherwise.

## Validation Expectations

Documentation-only phases must validate that the expected files exist and that
no runtime files were unintentionally changed.

Implementation phases must run the relevant checks for the scope, normally
including lint and build for frontend work.

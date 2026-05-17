# Spec-Driven Development Pattern

## Purpose

Use specs to keep product intent, architecture, constraints, and acceptance
checks visible before implementation. Specs should reduce ambiguity, not become
process for its own sake.

## Feature Spec Shape

```text
Feature:
User outcome:
Primary route or surface:
Data/contracts:
States:
Out of scope:
Acceptance checks:
Verification:
```

## Minimum Spec Requirements

- User outcome in one sentence.
- Scope and non-scope.
- Data source and ownership.
- UI states: loading, empty, error, success, and responsive behavior when
  relevant.
- Contract decisions: Zod schemas, tRPC procedures, route params, or typed
  content models.
- Verification commands and manual checks.

## When To Update Specs

- A feature changes the user's flow.
- A new tRPC router or shared contract is added.
- A styling rule or design-system convention changes.
- A new content model is introduced.
- A decision previously left implicit becomes important.

## Spec Hygiene

- Keep project-wide rules in `AGENT.md` or `.ai/context/*`.
- Keep repeatable implementation recipes in `.ai/patterns/*`.
- Keep visual guidance in `.ai/styles/*`.
- Keep task execution guidance in `.ai/skills/*`.
- Do not duplicate long rules across files. Link or point to the source.

## Implementation Loop

1. Read relevant context.
2. Draft or update the spec.
3. Implement against the spec.
4. Verify.
5. Adjust the spec only when the implementation intentionally changes the plan.

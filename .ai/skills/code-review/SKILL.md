---
name: code-review
description: "Review portfolio changes for architecture, type safety, shadcn consistency, tRPC contracts, motion accessibility, and content quality."
---

# Code Review

## Review Focus

Lead with bugs and risks. Prefer concrete file/line findings over broad advice.

## Checklist

### Architecture

- Pages are thin.
- tRPC routers are registered in `server/root.ts`.
- Procedure logic delegates to server modules.
- Browser-only helpers are not imported into server-only modules.
- Generated files are not edited unnecessarily.

### Types

- No `any`, `@ts-ignore`, `@ts-expect-error`, or unsafe double casts.
- External inputs are validated with Zod.
- Exported utilities have explicit return types.
- Content models are typed when reused.

### UI And UX

- shadcn primitives are used for controls and common surfaces.
- Global radius, border, and theme tokens are not locally overridden.
- Loading, error, empty, and success states are covered.
- UI mutations include success and error feedback.
- Text fits on mobile and desktop.

### Motion

- Animation is purposeful.
- Reduced motion is respected.
- Motion does not create layout shift or hide essential content.

### Content

- Claims are specific and supportable.
- Private or sensitive details are not exposed accidentally.
- Project summaries include evidence, not only adjectives.

## Severity

- Blocker: broken route, data loss, security/privacy issue, inaccessible primary
  interaction.
- High: type safety escape, missing validation, missing mutation error handling,
  broken architecture boundary.
- Medium: inconsistent state, avoidable duplication, fragile styling, poor
  responsive behavior.
- Low: naming, formatting, minor readability.

## Output Format

```text
[SEVERITY] file:line - Finding title
Problem: concrete issue and impact.
Fix: concrete correction.
```

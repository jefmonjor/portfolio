# Coding Standards

## Language And Copy

- Code identifiers, filenames, and comments are English.
- User-facing portfolio copy can be English unless a spec explicitly chooses
  Spanish or bilingual content.
- Comments should explain constraints or intent, not restate code.

## TypeScript

- Keep `strict` clean.
- Prefer Zod-inferred types for data from forms, URLs, route params, API calls,
  storage, or external services.
- Avoid `any`, `@ts-ignore`, `@ts-expect-error`, and `as unknown as T`.
- Prefer small explicit interfaces for component props.
- Use `import type` for type-only imports.
- Exported utilities and server functions should include explicit return types.
- Keep discriminated unions for variant data such as project status, link type,
  technology category, or timeline item type.

## React

- Use `"use client"` only for files that use hooks, browser APIs, event
  handlers, or client-only libraries.
- Keep pages thin and move substantive UI to feature components.
- Keep components focused. Extract subcomponents when responsibilities diverge.
- Use `useMemo` and `useCallback` only for stable props, expensive derivations,
  effect dependencies, or memoized children.
- Model loading, empty, error, and success states explicitly.

## Styling

- Use shadcn/ui primitives for controls and common surfaces.
- Do not override shadcn core radius, border, color, or theme tokens in local
  component classes.
- Theme variables belong in `app/globals.css`.
- Use semantic tokens and variants before hardcoded colors.
- Prefer `gap-*` over `space-*`.
- Prefer `size-*` when width and height match.
- Avoid nested cards and page sections styled as floating cards.
- Keep text readable and non-overlapping at mobile and desktop widths.

## Server And Validation

- Procedure inputs must be validated.
- Procedure bodies should delegate to server modules.
- Convert unknown errors to concise user-safe messages before displaying.
- Do not leak stack traces, environment values, or private personal information
  to the client.

## Clean Code

- No dead code, unused exports, or commented-out branches.
- No broad abstractions before the second real consumer.
- Keep helpers near consumers until shared usage is real.
- Do not reformat unrelated files.
- Do not edit generated files unless the generator output itself is the target.

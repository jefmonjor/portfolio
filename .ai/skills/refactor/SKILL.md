---
name: refactor
description: "Refactor the portfolio without changing behavior. Use for splitting components, extracting content models, tightening types, or improving maintainability."
---

# Refactor

## Golden Rule

Refactoring must preserve behavior. If behavior changes, it is a feature or bug
fix and should be treated as such.

## Good Refactor Targets

- Content hardcoded in several components.
- Components with multiple distinct responsibilities.
- Repeated UI state handling.
- Unsafe or overly wide types.
- Server logic embedded in route handlers or React components.

## Process

1. Read the current behavior and identify the invariant to preserve.
2. Make the smallest structural change that improves clarity.
3. Keep helpers near consumers until a second real consumer appears.
4. Run typecheck and relevant manual checks.

## Avoid

- Moving everything into generic shared folders preemptively.
- Adding wrappers around tRPC without repeated need.
- Hiding TypeScript problems with casts.
- Reformatting unrelated files.
- Changing copy or layout while claiming a pure refactor.

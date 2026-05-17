---
name: feature-implementation
description: "Implement portfolio features. Use for adding pages, CV/project sections, tRPC procedures, typed content models, contact flows, or user-facing workflows."
---

# Feature Implementation

## Start Here

Read:

- `AGENT.md`
- `.ai/context/product.md`
- `.ai/context/architecture.md`
- `.ai/context/design-system.md` for UI work
- `.ai/patterns/spec-driven-development.md` for larger features

## Implementation Flow

1. Define the user outcome in one paragraph.
2. Identify the data boundary: static typed content, browser-only state,
   tRPC/server, persisted local state, or external service.
3. Add or update Zod contracts in `types/` when data crosses a trust boundary.
4. Implement server/domain logic outside React.
5. Wire tRPC if server work is needed.
6. Build UI with shadcn primitives and semantic Tailwind tokens.
7. Add loading, empty, error, success, and responsive states.
8. Use `motion` only when it improves clarity and passes reduced-motion checks.
9. Verify with the narrowest useful commands and manual checks.

## Done Criteria

- Types pass.
- UI states are covered.
- shadcn global tokens are preserved.
- Specs are updated when the feature changes project rules.

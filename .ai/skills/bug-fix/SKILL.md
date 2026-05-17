---
name: bug-fix
description: "Diagnose and fix bugs in the portfolio. Use for broken routes, tRPC errors, hydration issues, theme regressions, invalid content rendering, and UI state bugs."
---

# Bug Fix

## Investigation Checklist

1. Reproduce or infer the failing flow.
2. Read the whole component/module involved.
3. Trace the relevant path:

```text
UI -> tRPC client -> route handler -> router -> server logic -> Zod contract
```

4. Identify whether the bug belongs to rendering, state, contracts, routing,
   styling, animation, or server logic.
5. Fix the root cause rather than widening types or hiding the error.

## Fix Rules

- No `any` or unsafe casts to get past TypeScript.
- Add a narrower Zod schema or type if the contract is missing.
- Preserve shadcn primitives and global tokens.
- Keep user-recoverable errors visible.
- Do not edit generated shadcn files unless the primitive itself is the target.

## Verification

- Run `pnpm run typecheck` for logic/type fixes.
- Run `pnpm run lint` for React/UI changes.
- Manually check the failed path and one adjacent happy path when practical.

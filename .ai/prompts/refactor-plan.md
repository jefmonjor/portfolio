# Refactor Plan Prompt

Use this before a larger cleanup.

```text
Plan and execute a behavior-preserving refactor for:
- [area/files]

Goals:
- [clarity/type safety/splitting/etc.]

Constraints:
- Do not change behavior or user-facing copy unless required.
- Do not reformat unrelated files.
- Keep helpers near consumers unless there is shared usage.
- Preserve shadcn styling rules.
- Preserve strict TypeScript.
- Run typecheck and report verification.

Before editing, summarize the invariant you will preserve.
```

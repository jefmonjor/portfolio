# Bug Report Prompt

Use this to ask an agent to diagnose and fix a bug.

```text
Fix this bug in the portfolio:

Observed behavior:
- [what happens]

Expected behavior:
- [what should happen]

Reproduction:
1. [step]
2. [step]

Known context:
- Route/component:
- Browser/server notes:
- Data or content involved:

Constraints:
- Find the root cause before editing.
- Preserve shadcn primitives and global design tokens.
- Keep TypeScript strict.
- Do not hide failures with unsafe casts.
- Run the relevant verification commands and report anything not run.
```

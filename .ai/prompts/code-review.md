# Code Review Prompt

Use this to ask an agent to review a diff.

```text
Review the current diff in the portfolio.

Focus on:
- Runtime bugs and regressions.
- Type safety and Zod contract coverage.
- tRPC/React Query boundaries.
- shadcn usage and token preservation.
- UI loading/error/empty/success states.
- Motion accessibility and layout stability.
- CV/project content clarity and public-safety concerns.
- Clean architecture boundaries.

Output findings first, ordered by severity, with file and line references.
If there are no findings, say that clearly and list any unverified risks.
```

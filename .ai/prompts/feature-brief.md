# Feature Brief Prompt

Use this to ask an agent to implement a portfolio feature.

```text
Implement [feature name] in the portfolio.

User outcome:
- [what the visitor or maintainer can do]

Scope:
- [routes/components/server/contracts likely involved]
- [what is explicitly out of scope]

Spec requirements:
- Update relevant `.ai/` docs if the feature changes product, architecture,
  styling, or workflow rules.
- Keep pages thin.
- Use shadcn/ui primitives.
- Do not override shadcn global radius, border, or theme tokens in component
  code.
- Use `motion` only where it improves interaction clarity.
- Use tRPC/React Query for server interactions.
- Validate external or server-bound data with Zod.

States:
- Loading:
- Empty:
- Error:
- Success:
- Responsive behavior:

Acceptance checks:
- [happy path]
- [empty/error path]
- `pnpm run typecheck`
- `pnpm run lint`
```

# tRPC And React Query Pattern

## Router Pattern

```ts
// server/routers/example.ts
import { exampleInputSchema } from "@/types/example"
import { publicProcedure, router } from "@/server/trpc"

export const exampleRouter = router({
  get: publicProcedure
    .input(exampleInputSchema)
    .query(({ input }) => getExample(input)),
})
```

Rules:

- Keep procedure bodies thin.
- Validate inputs with Zod.
- Prefer explicit output schemas when returning data from external services,
  user submissions, storage, or AI output.
- Register routers in `server/root.ts`.

## Server Module Pattern

```ts
// server/example.ts
import type { ExampleInput, ExampleResult } from "@/types/example"

export async function getExample(input: ExampleInput): Promise<ExampleResult> {
  return { id: input.id }
}
```

Rules:

- Exported server functions should have explicit return types.
- Keep environment reads and secrets server-side.
- Convert low-level failures to domain errors at the boundary.

## Client Consumption Pattern

```tsx
"use client"

import { trpc } from "@/lib/trpc/client"

export function ExampleView() {
  const query = trpc.example.get.useQuery({ id: "example" })

  if (query.isLoading) return null
  if (query.error) return null
  if (!query.data) return null

  return <div>{query.data.id}</div>
}
```

Rules:

- Handle loading, error, empty, and success states intentionally.
- Use `enabled` for queries that depend on optional input.
- Use React Query invalidation after successful mutations when cached data is
  affected.
- Every mutation needs success and error feedback.

## Current Base

The app starts with `health.status` as a small typed endpoint to prove the
runtime wiring. Replace or extend it when real portfolio server behavior is
introduced.

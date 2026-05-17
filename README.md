# Portfolio

Personal portfolio and CV application built with Next.js, TypeScript, shadcn/ui,
motion, TanStack React Query, and tRPC.

The project follows a spec-driven workflow. Start with `AGENT.md`, then use the
task-specific docs in `.ai/`.

## Commands

```bash
pnpm dev
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Spec-Driven Structure

```text
AGENT.md              Project rules and agent entry point
.ai/context/         Product, architecture, coding, and design context
.ai/patterns/        Repeatable implementation patterns
.ai/styles/          UI, motion, and content guidance
.ai/prompts/         Reusable task prompts
.ai/skills/          Procedural task workflows
```

## Runtime Structure

```text
app/                 Next.js routes, layouts, and route handlers
components/ui/       shadcn/ui primitives
components/          Feature components
lib/trpc/            Typed tRPC React client and provider
server/              Server-only tRPC routers and domain logic
types/               Zod schemas and inferred TypeScript contracts
```

## Core Rules

- Use shadcn/ui primitives for common controls and surfaces.
- Do not override shadcn core radius, border, or theme tokens in component code;
  global tokens live in `app/globals.css`.
- Use `motion` from `motion/react` for purposeful animation.
- Use tRPC and React Query for server interactions.
- Validate external or server-bound data with Zod.
- Keep pages thin and TypeScript strict.

## Adding components

To add shadcn components:

```bash
pnpm dlx shadcn@latest add button
```

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

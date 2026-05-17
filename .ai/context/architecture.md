# Architecture Context

## Runtime Shape

The app is a Next.js App Router application with locale-prefixed routing
(`/en/...`, `/es/...`).

- `app/[locale]/layout.tsx` wires fonts, theme support, the tRPC/React Query
  provider, and `NextIntlClientProvider`. It also generates localized
  `<Metadata>` per locale.
- `app/[locale]/page.tsx` is the initial route and should remain thin.
- `app/api/trpc/[trpc]/route.ts` exposes the tRPC endpoint and stays outside
  the `[locale]` segment.
- `proxy.ts` (Next 16's successor to `middleware.ts`) delegates to
  `createMiddleware(routing)` from `next-intl` to detect and prefix locales.
- `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts` configure
  `next-intl`. The plugin is wired in `next.config.mjs`.
- `messages/<locale>.json` holds translatable strings.
- `server/root.ts` registers domain routers.
- `server/trpc.ts` owns shared tRPC initialization.
- `lib/trpc/client.ts` exports the typed React client.
- `lib/trpc/provider.tsx` owns QueryClient and tRPC client creation.

## Data Flow

```text
React route/page
  -> feature component
  -> trpc.<domain>.<procedure>.useQuery/useMutation
  -> app/api/trpc/[trpc]/route.ts
  -> server/root.ts
  -> server/routers/<domain>.ts
  -> server/<domain>.ts
  -> types/<domain>.ts Zod contracts
```

## Boundaries

- React components own rendering, events, and local interaction state.
- `app/` owns routes, metadata, layouts, and route handlers.
- `components/ui/` contains generated shadcn primitives.
- `components/<feature>/` contains composed feature UI.
- `lib/` contains browser-safe shared helpers, clients, and config.
- `server/` contains server-only domain logic and tRPC routers.
- `types/` contains Zod schemas and inferred TypeScript contracts.
- `.ai/` contains agent-facing specs, prompts, styles, and workflow rules.

## tRPC Rules

1. Define or reuse a Zod input/output contract in `types/` when data crosses a
   trust boundary.
2. Put server domain logic in `server/<domain>.ts`.
3. Keep router procedures thin in `server/routers/<domain>.ts`.
4. Register new routers in `server/root.ts`.
5. Consume through `lib/trpc/client.ts`.
6. Surface loading, error, empty, and success states in UI.

## State Rules

- Use React state for local-only interaction state.
- Use React Query/tRPC for server state.
- Add a client store only when state must survive route changes or reloads.
- Persisted state must be versionable and validated on hydration.
- Do not duplicate server state in client stores unless there is a clear offline
  or draft requirement.

## File Placement Rules

- New route: `app/[locale]/<route>/page.tsx` (locale-prefixed). Non-localized
  endpoints (e.g., API/webhooks) live under `app/<route>/` outside the
  `[locale]` segment.
- New route-only UI: colocate under the route when it has no reuse.
- New reusable feature UI: `components/<feature>/`.
- New primitive: add through shadcn into `components/ui/`.
- New server capability: `server/<domain>.ts` plus
  `server/routers/<domain>.ts`.
- New contract: `types/<domain>.ts`.
- New shared constant/config: `lib/<name>.ts`.
- New translatable string: add the key/value to every `messages/<locale>.json`.
  See `.ai/skills/i18n/SKILL.md`.

## Verification Matrix

- Contract/schema changes: `pnpm run typecheck`.
- tRPC/router changes: `pnpm run typecheck` and usually `pnpm run build`.
- UI changes: `pnpm run lint`, `pnpm run typecheck`, and browser checks.
- Styling/theme changes: browser checks across desktop and mobile.
- Animation changes: browser checks for reduced motion, layout shift, and
  responsiveness.

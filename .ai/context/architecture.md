# Architecture Context

## Runtime Shape

The app is a Next.js App Router application with `next-intl` routing in
`as-needed` mode: English has no prefix, Spanish is `/es`, Catalan is `/ca`.

- `app/[locale]/layout.tsx` owns `<html>`, fonts and the theme provider.
- `app/[locale]/(site)/` is the commercial site (EN/ES only): home,
  `services`, `work`, `work/[slug]`, `experience`, `contact`. Every page is
  statically generated, reads typed copy from `content/site/` and renders
  server components from `components/site/`. Catalan returns 404 here.
- `app/[locale]/cv/` is the full portfolio and CV. Its layout mounts the
  `NextIntlClientProvider`, background, tooltip and toaster providers that
  only the CV needs.
- `app/og/[locale]/[...page]/route.tsx` renders one static Open Graph card
  per page; metadata points to it explicitly.
- `app/api/assistant`, `app/api/cv-tailor` and `app/cv.pdf` are the only
  expensive routes: body caps, shared rate limits, cross-site rejection.
- `app/api/health` answers the Docker healthcheck.
- `proxy.ts` (Next 16's successor to `middleware.ts`) delegates to
  `createMiddleware(routing)` from `next-intl`.
- `next.config.mjs` holds the 301s from the old URLs, the `/cv-xx.pdf`
  aliases and the security headers.

## Data Flow

```text
Commercial page (server component, SSG)
  -> content/site/{en,es}.ts (typed copy) + messages/*.json (experience facts)
  -> components/site/*

CV interactions (client)
  -> fetch("/api/assistant" | "/api/cv-tailor" | "/cv.pdf")
  -> route handler -> Zod contract (types/) -> server/ and lib/assistant/
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

## State Rules

- Use React state for local-only interaction state.
- Use React Query/tRPC for server state.
- Add a client store only when state must survive route changes or reloads.
- Persisted state must be versionable and validated on hydration.
- Do not duplicate server state in client stores unless there is a clear offline
  or draft requirement.

## File Placement Rules

- New commercial page: `app/[locale]/(site)/<route>/page.tsx`, its copy in
  `content/site/types.ts` plus both languages, and its path in
  `indexableSitePaths` so the sitemap and OG cards pick it up.
- New CV feature: `app/[locale]/cv/` and `components/portfolio/`.
- Non-localized endpoints live under `app/<route>/` outside `[locale]`.
- New route-only UI: colocate under the route when it has no reuse.
- New reusable feature UI: `components/<feature>/`.
- New primitive: add through shadcn into `components/ui/`.
- New server capability: `server/<domain>.ts` behind a route handler.
- New contract: `types/<domain>.ts`.
- New shared constant/config: `lib/<name>.ts`.
- New translatable string: add the key/value to every `messages/<locale>.json`.
  See `.ai/skills/i18n/SKILL.md`.

## Verification Matrix

- Contract/schema changes: `pnpm run typecheck`.
- Route handler changes: `pnpm test` and `pnpm run build`.
- UI changes: `pnpm run lint`, `pnpm run typecheck`, and browser checks.
- Styling/theme changes: browser checks across desktop and mobile.
- Animation changes: browser checks for reduced motion, layout shift, and
  responsiveness.

# Skill — Internationalization (i18n)

Use this skill when adding, updating, or auditing localized content and
locale-aware routing in the portfolio. The project ships in English (default)
and Spanish, exposed via a path prefix: `/en/...` and `/es/...`.

## Stack

- `next-intl` for App Router routing, message loading, and translation hooks.
- Routing config in `i18n/routing.ts` (`locales`, `defaultLocale`,
  `localePrefix: "always"`).
- Locale-aware navigation helpers in `i18n/navigation.ts` (`Link`, `useRouter`,
  `usePathname`, `redirect`).
- Per-request message loading in `i18n/request.ts`.
- Proxy at `proxy.ts` (Next 16's replacement for the `middleware.ts`
  convention) that delegates to `createMiddleware(routing)` from `next-intl`
  and matches everything except `/api`, Next internals, and static files.
- The `next-intl` plugin is applied in `next.config.mjs`.
- Translations live in `messages/<locale>.json` (currently `en.json` and
  `es.json`).
- The whole tree is rendered under `app/[locale]/`; the root layout sets
  `<html lang={locale}>` and wraps children in `NextIntlClientProvider`.

## Source of Truth

- `lib/profile.ts` holds only locale-independent structural data: stable IDs,
  brand names, URLs, technology lists, dates that are numeric only, and the
  user's home location.
- Every human-readable string that differs per locale lives in
  `messages/<locale>.json` and is read via `useTranslations` /
  `getTranslations` from `next-intl`.
- Experience and education entries are joined by ID:
  `profile.experience[i].id` matches a key under
  `experience.entries.<id>` in messages.
- The `"present"` sentinel in profile data is intentional: components compare
  `profile.experience[i].endISO` against `"present"` and render
  `common.present` ("Present" / "Actualidad") when matched. Do not rely on a
  translated message value to decide whether a role is ongoing.
- The `skills.practice` group's items are sourced from
  `messages.skills.practiceItems` instead of `profile.skills[…].items`.

## Adding a New Locale

1. Add the code to `routing.locales` in `i18n/routing.ts`.
2. Add an `openGraphLocale` entry in `app/[locale]/layout.tsx`.
3. Create `messages/<locale>.json` by copying `en.json` and translating values.
   Keep keys identical — `next-intl` will type-check structural drift.
4. Add an option label under `localeSwitcher.options.<locale>` in every
   message file.
5. No proxy or route changes are needed — the locale is picked up
   automatically.

## Adding a New Translatable String

1. Pick the right namespace in the messages JSON (`hero`, `about`,
   `experience`, …). Create a new namespace only when the string does not fit
   any existing section.
2. Add the key + value to **every** `messages/<locale>.json` file at the same
   path. Keep keys identical across locales.
3. In the component, prefer `useTranslations("namespace")` and read keys with
   `t("key")`. For ICU placeholders, pass the values as the second argument.
4. For arrays (e.g., `experience.entries.<id>.highlights`,
   `skills.practiceItems`), use `t.raw("key")` and cast to
   `ReadonlyArray<string>`.
5. For inline markup (e.g., `<kbd>` in `footer.pressForDarkMode`), use
   `t.rich("key", { kbd: (chunks) => <kbd>{chunks}</kbd> })`.

## Adding a New Profile Entry (Experience, Education, Skill Group, Language)

1. Append the entry to `lib/profile.ts` with a stable, kebab-case `id` that
   describes the role/title and year. Include only locale-independent fields
   (organization, stack, etc.).
2. Add the matching translation block under the right namespace in **every**
   `messages/<locale>.json`. The component will throw if a key is missing for
   the active locale, so add both at the same time.
3. If the entry is ongoing, set `end: "present"` in the message file. The
   component renders `common.present`.

## Server vs Client

- Server components: call `useTranslations(namespace)` directly. For metadata
  and other async paths, use `getTranslations({ locale, namespace })`.
- The root layout calls `setRequestLocale(locale)` so descendants in the same
  request can use `useTranslations` synchronously. Page-level server components
  should also call `setRequestLocale(locale)` near the top when they read
  translations — this is already the case in `app/[locale]/page.tsx`.
- Client components: `useTranslations` works because the layout wraps the tree
  in `NextIntlClientProvider`. Do not pass translation functions across the
  server/client boundary; pass already-resolved strings, or call the hook in
  the client component itself.

## Locale-Aware Links and Redirects

- Import `Link`, `useRouter`, `usePathname`, `redirect` from
  `@/i18n/navigation`, not from `next/link` or `next/navigation`. They preserve
  the active locale.
- The `LocaleSwitcher` (in `components/portfolio/locale-switcher.tsx`) uses
  `router.replace(pathname, { locale: next })` to swap locale while keeping
  the path.

## Metadata

`generateMetadata` in `app/[locale]/layout.tsx` reads from the `metadata`
namespace. When adding new metadata fields (e.g., `alternates`,
`canonical`), keep the values inside the message files where they vary by
locale, and pass them through `getTranslations`.

## Acceptance Checks

- Every visible string on `/en` has a Spanish counterpart on `/es`.
- Switching locale with the switcher preserves the current section anchor
  hash where possible (`router.replace(pathname, { locale })`).
- `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build` all pass.
- Unknown locales (e.g., `/fr`) trigger `notFound()` via the layout guard.
- Metadata `<title>`, `og:title`, and `og:locale` differ between `/en` and
  `/es` (verify with View Source).

## Out of Scope For This Skill

- Detecting the user's preferred locale via `Accept-Language`. The current
  middleware redirects unknown locales to the default; auto-detection is a
  separate decision.
- Persisting locale choice in a cookie. `next-intl`'s middleware can do this;
  if enabled, document the cookie name here.
- Translating runtime tRPC payloads. tRPC procedures currently return
  locale-independent data; localize only at the UI layer.

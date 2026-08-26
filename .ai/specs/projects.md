# Projects Section

Feature: selected project entries on the portfolio, project detail dialog, and CV.
User outcome: visitors can scan real project evidence quickly, distinguish delivery stage from link visibility, and open a focused detail view for deeper context.
Primary route or surface: `/en`, `/es`, `/ca`, the generated `/cv.pdf` project section, and the project detail dialog opened from the project grid.
Data/contracts: locale-independent project IDs, delivery stage (`live` or `development`), visibility (`public` or `private`), URLs, optional repository URLs, optional years, and stack badges live in `lib/profile.ts`; localized names, roles, summaries, highlights, and status labels live under `messages/<locale>.json`.
States: public live projects render their external host and status; private development projects render an explicit private/development status; empty stack arrays omit badges; every card exposes its first evidence highlight in the initial HTML; the detail dialog only opens for a selected project.
Out of scope: dedicated project detail routes, unsupported metrics, private client data, and claims that every project uses AI or is in production.
Acceptance checks: every project ID has matching English, Spanish, and Catalan message entries; each entry includes name, role, summary, and at least one highlight; public URLs are production-safe; summaries stay short enough for the project grid and CV; statuses are derived from typed data rather than URL presence; detail text remains readable on mobile and desktop.
Verification: run `pnpm run test`, `pnpm run typecheck`, and `pnpm run lint`; manually check the project grid and dialog in all locales on mobile and desktop.

# Projects Section

Feature: selected project entries on the portfolio and CV.
User outcome: visitors can scan public and private work with enough context to understand the problem space, delivery role, stack, and link availability.
Primary route or surface: `/en`, `/es`, and generated `/cv.pdf` project section.
Data/contracts: locale-independent project IDs, URLs, and stack badges live in `lib/profile.ts`; localized names and summaries live under `messages/<locale>.json` at `projects.entries.<id>`.
States: public projects render an external host link, private projects render the private label, and empty stack arrays omit badges.
Out of scope: detail routes, richer case studies, screenshots, metrics, or private client data.
Acceptance checks: every `profile.projects` ID has matching English and Spanish message entries; public URLs are production-safe; summaries stay short enough for the project grid and CV.
Verification: run `pnpm run typecheck` for content key usage and `pnpm run lint` for React/UI regressions when the project section changes.

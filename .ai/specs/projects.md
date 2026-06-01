# Projects Section

Feature: selected project entries on the portfolio, project detail dialog, and CV.
User outcome: visitors can scan public and private work quickly, then open a focused detail view for role, evidence, stack, and link availability.
Primary route or surface: `/en`, `/es`, the generated `/cv.pdf` project section, and the project detail dialog opened from the project grid.
Data/contracts: locale-independent project IDs, URLs, optional repository URLs, optional years, and stack badges live in `lib/profile.ts`; localized names, roles, summaries, and highlights live under `messages/<locale>.json` at `projects.entries.<id>`.
States: public projects render an external host link, private projects render the private label, empty stack arrays omit badges, and the detail dialog only opens for a selected project.
Out of scope: dedicated project detail routes, screenshots, metrics, or private client data.
Acceptance checks: every `profile.projects` ID has matching English and Spanish message entries; each project message entry includes name, role, summary, and highlights; public URLs are production-safe; summaries stay short enough for the project grid and CV; detail text remains readable on mobile and desktop.
Verification: run `pnpm run typecheck` for content key usage and `pnpm run lint` for React/UI regressions when the project section changes; use a manual browser check for the project dialog.

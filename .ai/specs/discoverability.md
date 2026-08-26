# Profile Discoverability

Feature: an evidence-led portfolio surface for recruiters, search engines, and AI-assisted sourcing tools.
User outcome: a visitor or crawler can understand Jefferson's current work, target positioning, project evidence, and contact status without executing heavy client-side features or inferring unsupported claims.
Primary route or surface: `/en`, `/es`, `/ca`, `/llms.txt`, localized metadata, JSON-LD, sitemap, robots, GitHub-facing repository documentation, CVs, and the assistant dossier.
Data/contracts: localized positioning and evidence live in `messages/<locale>.json`; stable professional facts and project visibility live in `lib/profile.ts`; JSON-LD only emits visible, public facts; `/llms.txt` exposes a static Markdown summary and public links.
States: the hero always renders a static identity card; optional 3D loads only after explicit interaction on a capable desktop device; unsupported WebGL and reduced motion retain the static card; private projects never enter public structured-data links.
Out of scope: project detail routes, a new AI evaluation harness, `llms-full.txt`, private contact data, salary or availability dates, and guarantees of inclusion in any recruiting database.
Acceptance checks: target positioning is Product Engineer focused on AI and backend while the structured current job title remains Solutions Architect / Technical PM; availability is selective; no fixed product count is published; all three locales remain equivalent; visible content, CV, assistant dossier, metadata, JSON-LD, README, and `/llms.txt` agree; no horizontal overflow occurs from 320px upward.
Verification: run `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; check all locales at 320, 375, 414, 768, 1280, and 1440px; test reduced motion and disabled WebGL; inspect raw HTML, JSON-LD, sitemap, robots, and `/llms.txt`; repeat Lighthouse against the same mobile configuration.

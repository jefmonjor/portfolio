# Portfolio Agent Guide

This repository is a personal portfolio and CV application built with a
spec-driven workflow. Agents must treat this file as the first project context
file, then load only the `.ai/` files that match the current task.

## Product Intent

jefmonjor.dev is the commercial site of an independent Software Architect &
Senior Backend Engineer who builds custom software, connects systems,
automates processes and applies AI for businesses, with banking-grade
experience as proof. A business owner or a CTO must understand in ten seconds
what he does, why to trust him and how to hire him.

- `/` (EN) and `/es` (ES): home, services, case studies, experience, contact.
- `/cv`, `/es/cv`, `/ca/cv`: the full portfolio and CV, with PDFs, the AI
  assistant and the terminal.
- Old URLs (`/en`, `/ca`) answer 301 to their `/cv` equivalent.

## Current Stack

- Next.js App Router with React and TypeScript.
- Tailwind CSS v4 and shadcn/ui generated primitives.
- CSS-first animation (`tw-animate-css`, keyframes in `app/globals.css`).
- Route handlers with Zod contracts at every trust boundary.
- `next-themes` for theme support.
- `next-intl` with `localePrefix: "as-needed"` and no locale detection:
  English without prefix, `/es`, and `/ca` (Catalan exists only under `/cv`).
- Commercial site copy as typed TypeScript in `content/site/{en,es}.ts`;
  CV copy in `messages/*.json`.

## Non-Negotiable Rules

- Keep TypeScript strict and avoid `any`, `@ts-ignore`, unsafe double casts, and
  unvalidated external inputs.
- Use shadcn/ui for primitives and common controls. Add components through the
  shadcn CLI when a primitive is missing.
- Do not override core shadcn design tokens in component code. Radius, colors,
  borders, and theme variables belong in `app/globals.css`.
- Two design systems, never mixed (see `docs/DESIGN.md`): the commercial
  site (`components/site/`) uses only Underlay tokens (`bg-bg-white-0`,
  `text-text-sub-600`, `ring-stroke-soft-200`, `bg-primary-base`,
  `text-title-h4`, `shadow-elevation-card`…); `/cv` uses the shadcn tokens
  (`bg-background`, `text-foreground`, `text-muted-foreground`,
  `border-border`). Both share the brand: burnt amber and Fraunces headlines.
- Keep pages thin. Site UI lives in `components/site/`, CV UI in
  `components/portfolio/`, server logic in `server/`, shared helpers in
  `lib/`, and runtime contracts in `types/`.
- Server interactions go through route handlers. Inputs that cross a trust
  boundary are validated with Zod, bodies are size-limited, and AI routes
  reject cross-site requests.
- Commercial pages are static (SSG), work without JavaScript, and ship only
  the client components they need: theme, language, menu, email, the project
  brief (it prepares an email; nothing is sent to the server) and the pointer
  tilt that feeds CSS variables to the 3D pieces.
- Code speaks for itself: names, small functions and types instead of
  comments. A comment is only for a constraint the code cannot express.
- Animate only for interaction clarity, transition quality, and controlled
  reveals, with CSS before JavaScript. Animations must not hide content, block
  navigation, or create layout shift.
- Keep the first-load bundle lean: heavy or interaction-only UI (3D, terminal,
  celebrations) loads with `next/dynamic` or `import()` on demand.
- Every UI-triggered mutation must include success and error feedback.
- Do not store secrets or private contact data in `.ai/` files.

## Spec-Driven Workflow

1. Start with this file.
2. Load `.ai/README.md` to choose the relevant context, skill, prompt, pattern,
   or style file.
3. For a feature, write or update the spec first: user outcome, scope,
   contracts, states, acceptance checks, and out-of-scope decisions.
4. Implement the smallest code path that satisfies the spec.
5. Run the narrowest useful verification commands and report what was not run.
6. Update specs when implementation changes the product, architecture, or
   coding rules.

## Skills Index

- `.ai/skills/feature-implementation/SKILL.md`: adding user-facing features.
- `.ai/skills/bug-fix/SKILL.md`: diagnosing and fixing broken behavior.
- `.ai/skills/code-review/SKILL.md`: reviewing diffs for risk and quality.
- `.ai/skills/refactor/SKILL.md`: behavior-preserving cleanup.
- `.ai/skills/shadcn-ui/SKILL.md`: working with shadcn/ui and Tailwind tokens.
- `.ai/skills/portfolio-content/SKILL.md`: CV, project, and profile content.
- `.ai/skills/motion-interactions/SKILL.md`: animation and transition work.
- `.ai/skills/i18n/SKILL.md`: locales, translations, and locale-aware routing.

## Verification Baseline

- `pnpm run typecheck` for contracts and TypeScript changes.
- `pnpm run lint` for React/UI changes.
- `pnpm run build` for route boundary, metadata, or server/runtime changes.
- Manual browser checks for visual, responsive, and animation changes.
- Node 24 LTS (`.nvmrc`, `engines`) and pnpm from `packageManager`.

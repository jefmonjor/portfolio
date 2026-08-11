# Portfolio Agent Guide

This repository is a personal portfolio and CV application built with a
spec-driven workflow. Agents must treat this file as the first project context
file, then load only the `.ai/` files that match the current task.

## Product Intent

The app presents Jefferson's professional profile, CV information, selected
projects, technical strengths, and contact paths. It should feel like a usable
portfolio product, not a generic landing page template.

## Current Stack

- Next.js App Router with React and TypeScript.
- Tailwind CSS v4 and shadcn/ui generated primitives.
- `motion` for purposeful UI animation.
- TanStack React Query and tRPC for typed client/server data flows.
- Zod for runtime contracts.
- `superjson` for tRPC serialization.
- `next-themes` for theme support.
- `next-intl` for App Router internationalization (English + Spanish, path
  prefix `/en`, `/es`).

## Non-Negotiable Rules

- Keep TypeScript strict and avoid `any`, `@ts-ignore`, unsafe double casts, and
  unvalidated external inputs.
- Use shadcn/ui for primitives and common controls. Add components through the
  shadcn CLI when a primitive is missing.
- Do not override core shadcn design tokens in component code. Radius, colors,
  borders, and theme variables belong in `app/globals.css`.
- Use semantic Tailwind tokens such as `bg-background`, `text-foreground`,
  `text-muted-foreground`, `border-border`, and component variants before
  custom styling.
- Keep pages thin. Move feature UI to `components/`, server logic to `server/`,
  shared browser-safe helpers to `lib/`, and runtime contracts to `types/`.
- Use tRPC plus React Query for server interactions. Procedure inputs and
  outputs that cross trust boundaries must be backed by Zod schemas.
- Use `motion` only for interaction clarity, transition quality, and controlled
  reveals. Animations must not hide content, block navigation, or create layout
  shift.
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

- `pnpm run typecheck` for contracts, tRPC, and TypeScript changes.
- `pnpm run lint` for React/UI changes.
- `pnpm run build` for route boundary, metadata, or server/runtime changes.
- Manual browser checks for visual, responsive, and animation changes.

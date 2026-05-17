---
name: shadcn-ui
description: "Work with shadcn/ui in the portfolio. Use for adding components, composing controls, changing Tailwind v4 theme tokens, and preserving the project's component system."
---

# shadcn/ui

## Project Context

`components.json` declares:

- style: `radix-lyra`
- RSC: `true`
- Tailwind CSS through `app/globals.css`
- UI alias: `@/components/ui`
- icon library: `hugeicons`

Use Hugeicons from `@hugeicons/react` when an icon is needed.

## Rules

- Prefer installed `components/ui/*` primitives.
- Add new primitives with the shadcn CLI only when needed.
- Check existing installed components before adding new ones.
- Theme changes belong in `app/globals.css`.
- Do not locally override border radius, border style, or core color tokens.
- Use semantic tokens and component variants before custom colors.

## Composition

- Use `Button` for actions.
- Use tabs for peer content modes.
- Use dialogs or sheets for focused secondary tasks.
- Use badges for status and metadata.
- Use cards only for repeated items, modals, or genuinely framed tools.
- Avoid nested cards.

## Verification

- Run `pnpm run lint` and `pnpm run typecheck`.
- Browser-check desktop and mobile layouts.

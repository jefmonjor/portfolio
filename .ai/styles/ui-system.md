# UI System Style Guide

## Visual Intent

The interface should be calm, sharp, and easy to scan. The content is the
portfolio; the UI should make the work legible and memorable without competing
with it.

## shadcn Rules

- Use `components/ui/*` primitives for interactive controls and common UI.
- Do not override global radius, border, or core color tokens in feature code.
- Add missing primitives through shadcn instead of hand-building equivalents.
- Use component variants before custom class combinations.

## Tailwind Rules

- Prefer semantic tokens:
  - `bg-background`
  - `text-foreground`
  - `text-muted-foreground`
  - `border-border`
  - `bg-card`
  - `text-card-foreground`
- Prefer `gap-*` over `space-*`.
- Prefer `size-*` for square controls and icons.
- Avoid hardcoded one-off colors unless a spec defines a project-specific
  accent system.

## Layout Rules

- Avoid nested cards.
- Do not turn every section into a floating card.
- Use constrained inner containers inside full-width sections.
- Keep dense information structured with headings, lists, tables, tabs, or
  accordions when appropriate.
- Ensure text does not overlap or overflow at mobile widths.

## Icons

- Use Hugeicons from `@hugeicons/react` because `components.json` selects
  `hugeicons`.
- Icon-only controls need accessible labels and tooltips when meaning is not
  obvious.

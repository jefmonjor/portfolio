# Design System Context

## Foundation

The project uses shadcn/ui with Tailwind CSS v4 and the configuration in
`components.json`.

- shadcn style: `radix-lyra`
- RSC: enabled
- UI alias: `@/components/ui`
- Utility alias: `@/lib/utils`
- Icon library: Hugeicons
- Theme variables: `app/globals.css`

## Design Direction

The portfolio should be precise, professional, and content-forward. It should
feel designed for repeated scanning by technical and hiring audiences rather
than like a decorative template.

## UI Rules

- Use installed shadcn primitives first.
- Add missing primitives with `pnpm dlx shadcn@latest add <component>` or the
  repo's installed shadcn CLI.
- Do not rewrite generated shadcn primitives unless the change is deliberate and
  documented.
- Do not locally override the global radius scale.
- Keep interactive elements predictable: buttons for commands, links for
  navigation, tabs for peer views, dialogs/sheets for focused secondary tasks.
- Use Hugeicons from `@hugeicons/react` when an icon is needed.
- Avoid decorative UI that does not support content comprehension.

## Portfolio Content Surfaces

- Hero/introduction: clear identity, role, current focus, and primary actions.
- CV sections: compact, structured, and easy to skim.
- Project cards: concise summary plus evidence markers.
- Project detail: problem, role, constraints, decisions, stack, result, and
  links.
- Contact: clear availability and preferred channels.

## Accessibility

- Preserve semantic heading order.
- Use accessible labels for icon-only buttons.
- Maintain visible focus states.
- Support keyboard navigation for interactive controls.
- Respect reduced motion preferences.

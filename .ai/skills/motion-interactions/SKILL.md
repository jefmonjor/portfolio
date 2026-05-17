---
name: motion-interactions
description: "Add or review animations and transitions in the portfolio using motion."
---

# Motion Interactions

## Required Context

Read:

- `.ai/styles/motion.md`
- `.ai/context/design-system.md`

## Workflow

1. Identify what the animation clarifies: hierarchy, continuity, focus, or
   feedback.
2. Use `motion` from `motion/react`.
3. Keep content visible and stable before animation begins.
4. Respect `prefers-reduced-motion`.
5. Avoid animating layout in ways that cause text overlap or shift.
6. Verify desktop, mobile, keyboard access, and reduced motion.

## Preferred Uses

- Section reveal after content is already laid out.
- Button or card hover feedback.
- Dialog/sheet entrance and exit when not already handled by shadcn/Radix.
- Project detail transitions where continuity helps orientation.

## Avoid

- Long intro animations.
- Scroll-jacking.
- Animations required to understand content.
- Motion that delays first interaction.

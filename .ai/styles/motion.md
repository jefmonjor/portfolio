# Motion Style Guide

## Library

Use `motion` for animation work.

```tsx
import { motion } from "motion/react"
```

## Principles

- Animation should clarify hierarchy, focus, and continuity.
- Avoid motion that delays reading or hides important content.
- Prefer short, restrained transitions over decorative movement.
- Respect `prefers-reduced-motion`.
- Avoid layout shift. Animate opacity, transform, and discrete transitions when
  possible.

## Common Durations

- Micro interaction: 120ms to 180ms.
- Section reveal: 180ms to 320ms.
- Page transition: 220ms to 400ms.

## Default Easing

Use natural easing:

```ts
const easeOut = [0.16, 1, 0.3, 1] as const
```

## Reduced Motion Pattern

```tsx
import { useReducedMotion } from "motion/react"

const shouldReduceMotion = useReducedMotion()
```

When reduced motion is enabled, keep content visible and remove non-essential
movement.

## Verification

- Check desktop and mobile.
- Check reduced motion.
- Confirm no text overlap or layout shift.
- Confirm animated elements remain keyboard accessible.

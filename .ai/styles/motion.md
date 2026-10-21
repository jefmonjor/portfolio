# Motion Style Guide

## Library

CSS first. Entrances use `tw-animate-css` utilities (`animate-in fade-in-0
slide-in-from-bottom-2`), loops use keyframes in `app/globals.css` (see
`animate-marquee`), and scroll-linked effects use scroll-driven animations
(`.scroll-progress`). None of them costs JavaScript on first load.

`motion` was removed from the first-load path in October 2026: it shipped
~45 KB gzip to every visitor for a few fades. Reach for it again only for what
CSS cannot express (gestures, springs, shared-layout transitions), and load
the component that uses it with `next/dynamic`.

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

Use natural easing: `ease-[cubic-bezier(0.16,1,0.3,1)]` (ease-out-expo) for
entrances, `ease-out` for hover and press feedback. Never `linear` for UI
transitions; it is reserved for continuous loops.

## Reduced Motion Pattern

In CSS, pair every animation with `motion-reduce:animate-none` (or
`motion-reduce:transition-none`). In effects, check
`window.matchMedia("(prefers-reduced-motion: reduce)")` before starting
JavaScript-driven animation.

When reduced motion is enabled, keep content visible and remove non-essential
movement.

## Verification

- Check desktop and mobile.
- Check reduced motion.
- Confirm no text overlap or layout shift.
- Confirm animated elements remain keyboard accessible.

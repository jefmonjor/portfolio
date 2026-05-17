# Component Structure Pattern

## Pages

Pages should be thin:

```tsx
import { HomeScreen } from "@/components/home/home-screen"

export default function Page() {
  return <HomeScreen />
}
```

## Feature Components

Use `components/<feature>/` for reusable feature UI.

```text
components/home/
├── home-screen.tsx
├── hero-section.tsx
├── project-strip.tsx
└── contact-panel.tsx
```

## Props

Prefer explicit interfaces:

```ts
interface ProjectCardProps {
  project: FeaturedProject
}
```

## Content Models

Portfolio facts should move toward typed data:

```text
types/profile.ts
lib/content/profile.ts
lib/content/projects.ts
```

Keep content data separate from rendering when it will be reused by multiple
surfaces, metadata, or exports.

## Promotion Rules

- Keep route-only components colocated until reused.
- Promote a component to `components/<feature>/` when reused by routes or
  multiple sections.
- Promote data to `lib/content/` when it feeds more than one view.
- Promote types to `types/` when they cross files, routes, or server/client
  boundaries.

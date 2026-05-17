# Product Context

## What This Portfolio Is

This app is Enrique's personal portfolio and CV surface. It should make his
professional story easy to scan, verify, and contact from.

## Primary Audiences

- Recruiters and hiring managers who need a fast CV-level overview.
- Engineering leads who want concrete project evidence and technical depth.
- Collaborators or clients who need credibility, availability, and contact
  paths.
- Enrique, as the maintainer, who needs a system that is easy to update as his
  experience grows.

## Core User Outcomes

- Understand who Enrique is professionally in the first viewport.
- Inspect CV facts: roles, timeline, education, skills, languages, and contact
  information.
- Browse selected projects with problem, role, stack, decisions, impact, and
  links.
- Download or view a CV when that feature is added.
- Contact Enrique through intentional, low-friction paths.

## Product Principles

- Evidence over adjectives: prove skill through projects, decisions, outcomes,
  and artifacts.
- Fast scanning first, depth second: use progressive disclosure for detail.
- Personal but professional: the design should feel distinctive without
  sacrificing clarity.
- Maintainable content: project and CV data should move toward typed content
  models rather than being scattered through JSX.
- Real app before marketing: build the actual portfolio experience, not generic
  teaser sections.

## Current Scope

The repository currently contains the initial Next.js/shadcn template plus the
base tRPC and React Query infrastructure. Portfolio content models and pages
will be added incrementally through specs.

## Likely Roadmap Areas

- Typed profile and CV data.
- Project case-study model and project detail pages.
- Home page with professional summary, featured work, skills, and contact CTA.
- CV route or downloadable CV artifact.
- SEO metadata, Open Graph images, sitemap, and structured data.
- Contact flow if server-side submission is required.
- Admin/content workflow only if maintenance becomes painful.

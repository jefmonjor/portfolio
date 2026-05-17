# Shared AI Assets

This folder is the shared home for spec-driven project knowledge. Agents should
start at `../AGENT.md`, then load only the files here that match the current
task.

## Layout

```text
.ai/
├── README.md
├── context/
│   ├── product.md
│   ├── architecture.md
│   ├── coding-standards.md
│   └── design-system.md
├── patterns/
│   ├── spec-driven-development.md
│   ├── trpc-react-query.md
│   └── component-structure.md
├── styles/
│   ├── ui-system.md
│   ├── motion.md
│   └── content.md
├── prompts/
│   ├── feature-brief.md
│   ├── bug-report.md
│   ├── code-review.md
│   ├── refactor-plan.md
│   └── spec-update.md
└── skills/
    ├── feature-implementation/SKILL.md
    ├── bug-fix/SKILL.md
    ├── code-review/SKILL.md
    ├── refactor/SKILL.md
    ├── shadcn-ui/SKILL.md
    ├── portfolio-content/SKILL.md
    ├── motion-interactions/SKILL.md
    └── i18n/SKILL.md
```

## Loading Strategy

- Always read `../AGENT.md` first.
- Read `.ai/context/product.md` when changing IA, CV content, project content,
  page copy, or roadmap decisions.
- Read `.ai/context/architecture.md` when changing providers, routing, tRPC,
  data contracts, state, or file placement.
- Read `.ai/context/coding-standards.md` when touching broad patterns,
  TypeScript, React conventions, validation, or error handling.
- Read `.ai/context/design-system.md` and `.ai/styles/ui-system.md` for visual
  work.
- Read `.ai/styles/motion.md` before adding animation.
- Read `.ai/patterns/spec-driven-development.md` before starting a larger
  feature or changing specs.
- Read `.ai/skills/i18n/SKILL.md` when adding strings, adjusting the language
  switcher, or touching the `app/[locale]/` route group, `messages/`, or
  `i18n/` files.
- Read exactly one task skill when possible; combine skills only when the task
  genuinely spans workflows.

## Maintenance

- Keep `AGENT.md` short enough to stay useful.
- Put durable detail in context, pattern, style, or skill files.
- Update this README and `AGENT.md` when a skill is added or renamed.
- Keep prompts reusable and task-focused; prompts are not rules.
- Do not store secrets, tokens, private client information, or local-only
  machine settings here.

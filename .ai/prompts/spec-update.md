# Spec Update Prompt

Use this when the specs need to evolve before or after implementation.

```text
Update the portfolio specs for:
- [feature/architecture/style/content decision]

Reason:
- [why the current specs are incomplete or wrong]

Expected changes:
- [AGENT.md, context, pattern, style, prompt, or skill files]

Constraints:
- Keep rules deduplicated.
- Keep `AGENT.md` concise.
- Put durable detail in `.ai/context`, `.ai/patterns`, or `.ai/styles`.
- Put task workflow in `.ai/skills`.
- Do not include secrets or private personal details.
```

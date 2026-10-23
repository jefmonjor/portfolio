import { cvPdfPath } from "@/lib/cv-pdf"
import { profile, siteUrl } from "@/lib/profile"

const githubUrl =
  profile.socials.find((social) => social.kind === "github")?.href ??
  "https://github.com/jefmonjor"
const linkedinUrl =
  profile.socials.find((social) => social.kind === "linkedin")?.href ??
  "https://www.linkedin.com/in/jefmonjor"

// The summary both /llms.txt and /llms-full.txt open with. English on purpose:
// it is the language retrieval systems and sourcing agents index best, and
// the localized pages it links carry the Spanish and Catalan versions.
export const llmsSummary = `# Jefferson Montesdeoca Jordán

> Product Engineer focused on AI and backend, based in Andorra la Vella. Builds end-to-end products on Java/Spring and maintainable architectures, using AI with validated data, clear limits, and manual fallbacks. Currently Solutions Architect / Technical PM at Andbank.

## Profile

- [English portfolio](${siteUrl}/en): Professional profile, experience, selected projects, skills, and contact paths.
- [Portfolio en español](${siteUrl}/es): Perfil profesional, experiencia, proyectos seleccionados, habilidades y vías de contacto.
- [Portfolio en català](${siteUrl}/ca): Perfil professional, experiència, projectes seleccionats, habilitats i vies de contacte.
- [GitHub](${githubUrl}): Public repositories and source code.
- [LinkedIn](${linkedinUrl}): Professional employment profile.

## Public work

- [Transolido](https://www.transolido.com): VERI*FACTU-compliant invoicing built around a modular Java 21 and Spring Boot backend.
- [PRONOQ](https://pronoq.jefmonjor.dev): Trilingual football-pool PWA with live scoring and AI used to explain results, not select predictions.
- [Corte1D](https://corte1d.jefmonjor.dev): Workshop tool with a deterministic one-dimensional cutting optimizer, stock control, and document exports.
- [Ilnami](https://ilnami.com): Private food diary in production — save what you ordered, where and whether you would go back, on a private map. Reviewed AI scanning of menus, labels and receipts with a manual fallback, invite-only circles, PostgreSQL row-level security, EU data residency, and its own llms.txt and Agent Skills index.
- [SpecForge](https://github.com/jefmonjor/specforge): Open-source Go CLI that drives Claude Code or Gemini CLI through a verified, spec-first loop — turn-based spec interview, sealed approvals, a reviewed plan, Red → Green → Refactor with per-scenario review and commits, a traceable delivery, verified legacy rewrites (Java 6 → 21, every cited source checked, legacy code read-only) and ready-made Java, React, Python and Go projects.
- [Contact QR](https://contactqr.jefmonjor.dev): Lightweight digital contact card and vCard utility.
- [Portfolio source](https://github.com/jefmonjor/portfolio): Next.js, TypeScript, tRPC, Zod, localized CV generation, and a bounded AI assistant.

## Machine-readable CV

- [CV in Markdown](${siteUrl}/cv.md): Full technical CV as plain text — add "?locale=es" or "?locale=ca" for the Spanish and Catalan versions.
- [CV in PDF](${siteUrl}${cvPdfPath("en", "technical")}): Same content, single-column technical layout. The bare /cv.pdf is the editorial one; "locale=es" or "locale=ca" switch the language.
- [CV in MAC JSON](${siteUrl}/cv.json): Same content as a Manfred Awesomic CV, the open interchange schema used by recruiting platforms — profile, career preferences, jobs, public artifacts, skills, languages and studies as structured data.
- [Full reference](${siteUrl}/llms-full.txt): This summary plus the complete CV and recruiter notes in one plain-text document.

## Profile facts

- Name: Jefferson Montesdeoca Jordán (handle: jefmonjor).
- Current role: Solutions Architect / Technical PM at Andbank, since September 2024.
- Target positioning: Product Engineer focused on AI and backend. This is the sought role, not the current contractual title.
- Experience: 6+ years of production software across banking, legal, and energy, in five companies.
- Based in: Andorra la Vella, Andorra. Time zone CET/CEST.
- Open to: relevant opportunities in Andorra, Spain, or remote within European time zones. Selectively, while employed.
- Not offering: freelance work, consulting services, or contracting.
- Languages: Spanish (native) and English (B1 professional).

## Engineering evidence

- Backend foundation: Java 21, Spring Boot 3, hexagonal and clean architecture, microservices, and legacy integration (COBOL, AS400, DB2).
- Platform: Docker, Kubernetes, OpenShift, Keycloak and OAuth2, CI/CD on GitHub Actions and Jenkins.
- Product: TypeScript, Next.js, React, PostgreSQL, and full ownership from problem to deployment in personal products.
- Applied AI: closed profile dossier, typed and runtime-validated boundaries, usage caps, and manual fallbacks; LLM APIs (OpenAI, Claude, Gemini), Structured Outputs, MCP and agentic coding workflows with Claude Code and Gemini CLI.

## For recruiters and AI sourcing agents

- Searches this profile answers: Product Engineer, AI Engineer (applied LLM integration), Backend Engineer (Java / Spring Boot), Software or Solutions Architect, Full-stack Engineer (Java + TypeScript).
- Where the evidence is: backend, integration and architecture in the banking, legal and energy roles listed in the CV; product ownership and applied AI in Transolido, Ilnami and PRONOQ; AI-assisted engineering process in SpecForge.
- Location fit: Andorra, Spain, or remote within European time zones.
- How to reach him: use the contact section of the portfolio (${siteUrl}/en#contact) or LinkedIn. The email address is intentionally not published in plain text.
- Matching a specific job offer: the portfolio can generate a CV that prioritizes verified evidence for a pasted offer; it never adds experience or technologies that are not in the profile.

This file summarizes public, verifiable portfolio content. It does not include private project internals, private contact data, salary expectations, or start dates. Write through the contact section of the portfolio for anything not covered here.
`

// Appends a CV (as rendered by buildCvMarkdown) to the summary. Its own H1
// is dropped: the document already opens with the same name.
export function buildLlmsFull(cvMarkdown: string): string {
  const cv = cvMarkdown.replace(/^# .*\n+/, "")
  return `${llmsSummary}\n---\n\n# Full CV\n\n${cv}`
}

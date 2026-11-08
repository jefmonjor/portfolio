import { cvPdfPath } from "@/lib/cv-pdf"
import { profile, siteUrl } from "@/lib/profile"

const githubUrl =
  profile.socials.find((social) => social.kind === "github")?.href ??
  "https://github.com/jefmonjor"
const linkedinUrl =
  profile.socials.find((social) => social.kind === "linkedin")?.href ??
  "https://www.linkedin.com/in/jefmonjor"

export const llmsSummary = `# Jefferson Montesdeoca Jordán

> Software Architect & Senior Backend Engineer based in Andorra la Vella. Designs and builds backend systems for banking and enterprise on Java and Spring, and applies AI with validated data, clear limits and manual fallbacks. Currently Solutions Architect / Technical PM at Andbank. Available for part-time engagements from January 2027, remote, CET.

## Site

- [Home](${siteUrl}): Positioning, selected work, services, experience and contact.
- [Services](${siteUrl}/services): Technical Advisory, Engineering Delivery and Fractional Architecture — who each one is for, what it includes and its format.
- [Case studies](${siteUrl}/work): Modernising a private bank's Java platform without stopping delivery; Ilnami, a private-by-design app built alone; SpecForge, AI-written code held to engineering standards.
- [Experience](${siteUrl}/experience): Responsibilities at Andbank, elAbogado and in consulting for Vodafone and Endesa.
- [Contact](${siteUrl}/contact): Availability, time zone and how to start an engagement.
- [Sitio en español](${siteUrl}/es): La misma web en español.
- [Full CV](${siteUrl}/cv): The complete CV with projects, skills and downloadable PDFs, also in Spanish (${siteUrl}/es/cv) and Catalan (${siteUrl}/ca/cv).
- [GitHub](${githubUrl}): Public repositories and source code.
- [LinkedIn](${linkedinUrl}): Professional employment profile.

## Public work

- [Transolido](https://www.transolido.com): VERI*FACTU-compliant invoicing built around a modular Java 21 and Spring Boot backend.
- [Other Twist](https://othertwist.com): All-in-one platform for writers in production — offline-first Flutter app on a Java 21 / Spring Boot hexagonal backend, sign-in at app.othertwist.com.
- [PRONOQ](https://pronoq.jefmonjor.dev): Trilingual football-pool PWA with live scoring and AI used to explain results, not select predictions.
- [Corte1D](https://corte1d.jefmonjor.dev): Workshop tool with a deterministic one-dimensional cutting optimizer, stock control, and document exports.
- [Ilnami](https://ilnami.com): Private food diary in production — save what you ordered, where and whether you would go back, on a private map. Reviewed AI scanning of menus, labels and receipts with a manual fallback, invite-only circles, PostgreSQL row-level security, an EU-hosted database, and its own llms.txt and Agent Skills index.
- [SpecForge](https://github.com/jefmonjor/specforge): Open-source Go CLI that drives Claude Code or Gemini CLI through a verified, spec-first loop — turn-based spec interview, sealed approvals, a reviewed plan, Red → Green → Refactor with per-scenario review and commits, a traceable delivery, verified legacy rewrites (Java 6 → 21, every cited source checked, legacy code read-only) and ready-made Java, React, Python and Go projects.
- [Contact QR](https://contactqr.jefmonjor.dev): Lightweight digital contact card and vCard utility.
- [Portfolio source](https://github.com/jefmonjor/portfolio): Next.js, TypeScript, Zod, localized CV generation, and a bounded AI assistant.

## Machine-readable CV

- [CV in Markdown](${siteUrl}/cv.md): Full technical CV as plain text — add "?locale=es" or "?locale=ca" for the Spanish and Catalan versions.
- [CV in PDF](${siteUrl}${cvPdfPath("en", "technical")}): Same content, single-column technical layout. The bare /cv.pdf is the editorial one; "locale=es" or "locale=ca" switch the language.
- [CV in MAC JSON](${siteUrl}/cv.json): Same content as a Manfred Awesomic CV, the open interchange schema used by recruiting platforms — profile, career preferences, jobs, public artifacts, skills, languages and studies as structured data.
- [Full reference](${siteUrl}/llms-full.txt): This summary plus the complete CV and recruiter notes in one plain-text document.

## Profile facts

- Name: Jefferson Montesdeoca Jordán (handle: jefmonjor).
- Current role: Solutions Architect / Technical PM at Andbank, since September 2024.
- Positioning: Software Architect & Senior Backend Engineer. This is the professional positioning, not the current contractual title.
- Experience: seven years of production software (since 2019) across banking, legal, energy and telecom, in five companies.
- Based in: Andorra la Vella, Andorra. Time zone CET/CEST. Works remotely.
- Availability: part-time engagements from January 2027.
- Offering: Technical Advisory (1 to 5 days, written report), Engineering Delivery (Java and Spring backends, integrations, migrations; 10 to 15 hours per week) and Fractional Architecture (4 to 8 hours per week, monthly). Every engagement starts with a 30-minute call and a one-page written proposal. Rates are given in the proposal, not published.
- Languages: Spanish (native) and English (B1 professional).

## Engineering evidence

- Backend foundation: Java 21, Spring Boot 3, hexagonal and clean architecture, microservices, and legacy integration (COBOL, AS400, DB2).
- Platform: Docker, Kubernetes, OpenShift, Keycloak and OAuth2, CI/CD on GitHub Actions and Jenkins.
- Product: TypeScript, Next.js, React, PostgreSQL, and full ownership from problem to deployment in personal products.
- Applied AI: closed profile dossier, typed and runtime-validated boundaries, usage caps, and manual fallbacks; LLM APIs (OpenAI, Claude, Gemini), Structured Outputs, MCP and agentic coding workflows with Claude Code and Gemini CLI.

## For clients, recruiters and AI sourcing agents

- Searches this profile answers: custom software and system integration for businesses, process automation, applied AI engineer (LLM integration), Software Architect, Senior Backend Engineer (Java / Spring Boot), Solutions Architect, technical advisor for banking and fintech.
- Where the evidence is: backend, integration and architecture in the banking, legal and energy roles listed in the CV; product ownership and applied AI in Transolido, Other Twist, Ilnami and PRONOQ; AI-assisted engineering process in SpecForge.
- Location fit: Andorra, Spain, or remote within European time zones.
- How to reach him: the contact page (${siteUrl}/contact) or LinkedIn. The email address is shown on the contact page and is not written in this file.
- Matching a specific job offer: the portfolio can generate a CV that prioritizes verified evidence for a pasted offer; it never adds experience or technologies that are not in the profile.

This file summarizes public, verifiable portfolio content. It does not include private project internals, private contact data or salary expectations. Write through the contact section of the portfolio for anything not covered here.
`

export function buildLlmsFull(cvMarkdown: string): string {
  const cv = cvMarkdown.replace(/^# .*\n+/, "")
  return `${llmsSummary}\n---\n\n# Full CV\n\n${cv}`
}

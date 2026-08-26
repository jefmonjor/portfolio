import { profile, siteUrl } from "@/lib/profile"

export const dynamic = "force-static"

const githubUrl =
  profile.socials.find((social) => social.kind === "github")?.href ??
  "https://github.com/jefmonjor"
const linkedinUrl =
  profile.socials.find((social) => social.kind === "linkedin")?.href ??
  "https://www.linkedin.com/in/jefmonjor"

const content = `# Jefferson Montesdeoca Jordán

> Product Engineer focused on AI and backend, based in Andorra la Vella. Builds end-to-end products on Java/Spring and maintainable architectures, using AI with validated data, clear limits, and manual fallbacks.

## Profile

- [English portfolio](${siteUrl}/en): Professional profile, experience, selected projects, skills, and contact paths.
- [Portfolio en español](${siteUrl}/es): Perfil profesional, experiencia, proyectos seleccionados, habilidades y vías de contacto.
- [Portfolio en català](${siteUrl}/ca): Perfil professional, experiència, projectes seleccionats, habilitats i vies de contacte.
- [GitHub](${githubUrl}): Public repositories and source code.
- [LinkedIn](${linkedinUrl}): Professional employment profile.

## Public work

- [Transolido](https://transolido.com): VERI*FACTU-compliant invoicing built around a modular Java 21 and Spring Boot backend.
- [PRONOQ](https://pronoq.jefmonjor.dev): Trilingual football-pool PWA with live scoring and AI used to explain results, not select predictions.
- [Corte1D](https://corte1d.jefmonjor.dev): Workshop tool with a deterministic one-dimensional cutting optimizer, stock control, and document exports.
- [Contact QR](https://contactqr.jefmonjor.dev): Lightweight digital contact card and vCard utility.
- [Portfolio source](https://github.com/jefmonjor/portfolio): Next.js, TypeScript, tRPC, Zod, localized CV generation, and a bounded AI assistant.

## Machine-readable CV

- [CV in Markdown](${siteUrl}/cv.md): Full technical CV as plain text — add "?locale=es" or "?locale=ca" for the Spanish and Catalan versions.
- [CV in PDF](${siteUrl}/cv.pdf?variant=technical): Same content, single-column technical layout. "variant=general" returns the editorial one.
- [CV in MAC JSON](${siteUrl}/cv.json): Same content as a Manfred Awesomic CV, the open interchange schema used by recruiting platforms — profile, career preferences, jobs, public artifacts, skills, languages and studies as structured data.

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
- Applied AI: closed profile dossier, typed and runtime-validated boundaries, usage caps, and manual fallbacks.

This file summarizes public, verifiable portfolio content. It does not include private project internals, private contact data, salary expectations, or start dates. Write through the contact section of the portfolio for anything not covered here.
`

export function GET(): Response {
  return new Response(content, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}

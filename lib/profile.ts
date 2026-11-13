import type {
  MacSchemaLanguageProficiency,
  Profile,
  SocialKind,
} from "@/types/profile"

export const portfolioUpdatedAt = "2026-10-21"

export const siteUrl = "https://www.jefmonjor.dev"

export const siteUrlShort = "https://jefmonjor.dev"

export function absoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`
}

export const profileTimeZone = "Europe/Andorra"

const EMAIL_ASSEMBLED_IN_BROWSER_NOT_IN_STATIC_HTML = ""
const CEFR_B1: MacSchemaLanguageProficiency = "Limited working proficiency"

export const profile: Profile = {
  name: "Jefferson Montesdeoca Jordán",
  shortName: "Jefferson Montesdeoca",
  location: "Andorra la Vella, Andorra",
  timezone: "CET / CEST",
  since: "2019",
  focus: [
    "Java 21",
    "Spring Boot 3",
    "Hexagonal Architecture",
    "Microservices",
    "Next.js",
    "Claude API",
    "AI agents",
  ],
  socials: [
    {
      kind: "email",
      href: "#contact",
      handle: EMAIL_ASSEMBLED_IN_BROWSER_NOT_IN_STATIC_HTML,
    },
    {
      kind: "linkedin",
      href: "https://www.linkedin.com/in/jefmonjor",
      handle: "jefmonjor",
    },
    {
      kind: "github",
      href: "https://github.com/jefmonjor",
      handle: "jefmonjor",
    },
  ],
  experience: [
    {
      id: "andbank-2024",
      organization: "Andbank",
      organizationType: "bigCorp",
      location: "Andorra la Vella, Andorra",
      startISO: "2024-09",
      endISO: "present",
      stack: [
        "Java 21",
        "Spring Boot 3",
        "Clean Architecture",
        "OpenShift",
        "Keycloak",
        "DB2",
        "COBOL/AS400",
        "SonarQube",
        "Gemini Code Assist",
      ],
    },
    {
      id: "elabogado-2022",
      organization: "elAbogado",
      organizationType: "SME",
      location: "Barcelona, Spain",
      startISO: "2022-03",
      endISO: "2024-09",
      stack: [
        "Java",
        "Spring Boot",
        "React",
        "MySQL",
        "REST APIs",
        "WordPress",
      ],
    },
    {
      id: "zemsania-2021",
      organization: "Zemsania",
      organizationType: "bigCorp",
      location: "Madrid, Spain",
      startISO: "2021-07",
      endISO: "2022-04",
      stack: [
        "Java",
        "Spring Boot",
        "Microservices",
        "OpenAPI",
        "Jira · Confluence",
      ],
    },
    {
      id: "endesa-2019",
      organization: "Ayesa · Keapps (Atos)",
      organizationType: "bigCorp",
      location: "Seville, Spain",
      startISO: "2019-08",
      endISO: "2021-07",
      stack: [
        "Java",
        "Hadoop",
        "Spark",
        "Cassandra",
        "MapReduce",
        "HDFS · YARN",
        "S3",
        "SQL",
        "JSP · PrimeFaces",
        "SOAP/XML",
      ],
    },
  ],
  skills: [
    {
      id: "languages",
      items: [
        "Java (8 → 21)",
        "TypeScript",
        "JavaScript",
        "Go",
        "Python",
        "SQL",
      ],
    },
    {
      id: "backend",
      items: [
        "Spring Boot 3",
        "Hibernate",
        "JPA",
        "REST / SOAP",
        "Node.js",
        "FastAPI",
        "Hexagonal Architecture",
        "Clean Architecture",
        "Microservices",
      ],
    },
    {
      id: "frontend",
      items: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "Bootstrap",
        "JSP · PrimeFaces",
        "WordPress",
      ],
    },
    {
      id: "data",
      items: [
        "Oracle · PL/SQL",
        "DB2",
        "PostgreSQL",
        "MySQL",
        "Supabase",
        "Neon",
        "Redis · Upstash",
        "Backblaze B2",
        "Cassandra",
        "Hadoop · HDFS · YARN",
        "Spark · MapReduce",
        "S3",
      ],
    },
    {
      id: "cloud",
      items: [
        "Docker",
        "Kubernetes",
        "OpenShift (OCP4)",
        "Self-hosted VPS · Docker",
        "Vercel",
        "Google Cloud Run",
        "Cloud Build",
        "GitHub Actions",
        "Brevo",
        "Twilio",
        "Serverless",
        "Jenkins",
        "CI/CD",
        "Keycloak",
        "OAuth2",
        "Azure",
      ],
    },
    {
      id: "ai",
      items: [
        "Claude · Claude API",
        "Claude Code",
        "Gemini Code Assist",
        "Gemini",
        "Codex",
        "ChatGPT",
        "Vercel AI SDK",
        "MCP workflows",
        "AI agents",
        "SDD · spec-kit",
        "Antigravity IDE",
        "Orca",
      ],
    },
    {
      id: "practice",
      items: ["architecture", "vendor-management", "ai-augmented", "scrum"],
    },
  ],
  projects: [
    {
      id: "othertwist",
      stage: "live",
      visibility: "public",
      url: "https://othertwist.com",
      stack: [
        "Flutter",
        "Riverpod",
        "Java 21",
        "Spring Boot 3",
        "PostgreSQL",
        "Docker",
      ],
    },
    {
      id: "transolido",
      stage: "live",
      visibility: "public",
      url: "https://www.transolido.com",
      stack: [
        "Java 21",
        "Spring Boot 3",
        "Neon",
        "Upstash Redis",
        "Claude API",
        "VERI*FACTU",
        "Cloud Run",
        "Vercel",
      ],
    },
    {
      id: "porrix",
      stage: "live",
      visibility: "public",
      url: "https://pronoq.jefmonjor.dev",
      stack: [
        "Next.js",
        "PostgreSQL",
        "PWA",
        "Docker",
        "Self-hosted VPS",
        "ES · EN · CA",
      ],
    },
    {
      id: "corte1d",
      stage: "live",
      visibility: "public",
      url: "https://corte1d.jefmonjor.dev",
      stack: [
        "Next.js",
        "Neon",
        "PWA",
        "ExcelJS",
        "PDFKit",
        "Backblaze B2",
        "AI agents",
      ],
    },
    {
      id: "ilnami",
      stage: "live",
      visibility: "public",
      url: "https://ilnami.com",
      stack: [
        "Next.js 16",
        "Supabase",
        "PostgreSQL RLS",
        "PostGIS",
        "Mapbox",
        "OpenAI Vision",
        "PWA",
        "Sentry",
      ],
    },
    {
      id: "specforge",
      stage: "live",
      visibility: "public",
      url: "https://github.com/jefmonjor/specforge/releases",
      repo: "https://github.com/jefmonjor/specforge",
      stack: [
        "Go",
        "Cobra",
        "Hexagonal Architecture",
        "Claude Code",
        "Gemini CLI",
        "chromedp",
        "TDD · BDD",
        "Legacy → Java 21",
      ],
    },
    {
      id: "contactqr",
      stage: "live",
      visibility: "public",
      url: "https://contactqr.jefmonjor.dev",
      stack: ["Astro", "QR · vCard"],
    },
    {
      id: "portfolio",
      stage: "live",
      visibility: "public",
      url: siteUrl,
      repo: "https://github.com/jefmonjor/portfolio",
      images: [
        "/projects/portfolio/01.webp",
        "/projects/portfolio/02.webp",
        "/projects/portfolio/03.webp",
      ],
      stack: [
        "Next.js",
        "TypeScript",
        "Zod",
        "Tailwind CSS",
        "shadcn/ui",
        "next-intl",
      ],
    },
  ],
  education: [
    {
      id: "smpc-cert",
      organization: "SCRUMstudy",
      dates: "2023",
      kind: "certification",
      completed: true,
      startISO: "2023",
      credentialUrl:
        "https://campus.eigp.net/badges/0ec04cb3912c4f08874dd03716f80df1/367486863b932a9c259baf556c40f653/beb04c41b45927cf7e9f8fd4bb519e86",
    },
    {
      id: "beng-software",
      organization: "Universidad de Sevilla",
      dates: "2014 — 2018",
      kind: "degree",
      completed: false,
      startISO: "2014",
      endISO: "2018",
    },
  ],
  languages: [
    { id: "es", code: "ES", level: "Native or bilingual proficiency" },
    { id: "en", code: "EN", level: CEFR_B1 },
  ],
}

const publicProfileNames: Record<Exclude<SocialKind, "email">, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
}

export const publicProfiles = profile.socials.flatMap((social) =>
  social.kind === "email"
    ? []
    : [{ name: publicProfileNames[social.kind], href: social.href }]
)

export const caseStudySlugs = [
  "private-bank-modernization",
  "ilnami-private-by-design",
  "specforge-verified-ai-delivery",
] as const

export type CaseStudySlug = (typeof caseStudySlugs)[number]

export type SitePath =
  | "/"
  | "/services"
  | "/work"
  | "/experience"
  | "/contact"
  | "/cv"
  | "/privacy"
  | `/work/${CaseStudySlug}`

export type InlineLink = {
  text: string
  href: SitePath
}

export type RichText = ReadonlyArray<string | InlineLink>

export type Emphasis = { emphasis: string }

export type Headline = ReadonlyArray<string | Emphasis>

export function headlineText(headline: Headline): string {
  return headline
    .map((part) => (typeof part === "string" ? part : part.emphasis))
    .join("")
}

export type PageMeta = {
  title: string
  description: string
}

export type DiagramNode = {
  label: string
  detail: string
}

export type Decision = {
  choice: string
  reason: string
  rejected: string
}

export type ExternalLink = {
  label: string
  href: string
}

export type CaseStudy = {
  slug: CaseStudySlug
  sector: string
  title: string
  outcome: string
  tags: readonly [string, string, string]
  meta: PageMeta
  summary: {
    sector: string
    role: string
    result: string
  }
  context: ReadonlyArray<string>
  responsibility: {
    owned: ReadonlyArray<string>
    notOwned: ReadonlyArray<string>
  }
  decisions: ReadonlyArray<Decision>
  implementation: ReadonlyArray<string>
  result: ReadonlyArray<string>
  stack: ReadonlyArray<string>
  diagram: ReadonlyArray<DiagramNode>
  links: ReadonlyArray<ExternalLink>
}

export type ServiceId = "advisory" | "delivery" | "fractional"

export type Service = {
  id: ServiceId
  name: string
  summary: string
  audience: string
  includes: ReadonlyArray<string>
  format: string
}

export type ExperienceEntryId =
  | "andbank-2024"
  | "elabogado-2022"
  | "zemsania-2021"
  | "keapps-2020"
  | "ayesa-2019"

export type ExperienceGroup = {
  id: string
  period: string
  organization: string
  role: string
  summary: string
  entries: ReadonlyArray<ExperienceEntryId>
}

export type SiteContent = {
  siteName: string
  meta: Record<
    "home" | "services" | "work" | "experience" | "contact" | "privacy",
    PageMeta
  >
  nav: {
    label: string
    home: string
    services: string
    work: string
    experience: string
    contact: string
    menu: string
    skipToContent: string
    toggleTheme: string
    language: string
    breadcrumb: string
  }
  cta: string
  hero: {
    name: string
    role: string
    eyebrow: string
    headline: Headline
    subtitle: string
    availability: string
    proof: ReadonlyArray<string>
    seeWork: string
  }
  about: {
    title: string
    paragraphs: readonly [RichText, RichText]
  }
  selectedWork: {
    title: string
    readCase: string
    allCases: string
  }
  services: {
    title: string
    homeTitle: string
    intro: string
    items: readonly [Service, Service, Service]
    audienceLabel: string
    includesLabel: string
    formatLabel: string
    details: string
    startTitle: string
    startSteps: readonly [string, string, string]
    rates: string
    closing: string
  }
  experience: {
    title: string
    intro: string
    groups: readonly [ExperienceGroup, ExperienceGroup, ExperienceGroup]
    fullHistory: string
    present: string
    cvLead: string
    cvLink: string
  }
  work: {
    title: string
    intro: string
    labels: {
      sector: string
      role: string
      outcome: string
      context: string
      responsibility: string
      owned: string
      notOwned: string
      decisions: string
      reason: string
      rejected: string
      implementation: string
      results: string
      stack: string
      architecture: string
      links: string
      next: string
    }
    cases: readonly [CaseStudy, CaseStudy, CaseStudy]
  }
  contact: {
    title: string
    homeTitle: string
    intro: string
    facts: ReadonlyArray<{ label: string; value: string }>
    includeTitle: string
    include: ReadonlyArray<string>
    email: {
      label: string
      write: string
      copy: string
      copied: string
      copyFailed: string
      withoutJavaScript: string
      subject: string
      noMailApp: string
    }
    elsewhere: string
  }
  footer: {
    location: string
    fullCv: string
    privacy: string
    languages: string
  }
  privacy: {
    title: string
    updated: string
    sections: ReadonlyArray<{
      title: string
      paragraphs: ReadonlyArray<RichText>
    }>
  }
}

import type { TerminalStrings } from "@/lib/site-terminal"

export const caseStudySlugs = [
  "private-bank-modernization",
  "transolido-verifactu-invoicing",
  "othertwist-offline-writing",
  "ilnami-private-by-design",
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

/** The hero headline is one sentence per line, so its lines join with a space. */
export function headlineLines(headline: Headline): string[] {
  return headline.map((part) =>
    typeof part === "string" ? part : part.emphasis
  )
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
  /** Set when a public screenshot of the live product exists. */
  screenshotAlt?: string
  links: ReadonlyArray<ExternalLink>
}

export type TitledText = {
  title: string
  body: string
}

/** One kind of work he takes on, proven by one case study. */
export type Capability = TitledText & {
  points: readonly [string, string, string]
  caseSlug: CaseStudySlug
  caseName: string
}

export type StartStep = { step: string; deliverable: string }

export type ProjectBrief = {
  title: string
  intro: string
  fields: {
    name: string
    email: string
    company: string
    problem: string
    problemHint: string
    type: string
    budget: string
    timeline: string
  }
  projectTypes: ReadonlyArray<string>
  budgets: ReadonlyArray<string>
  timelines: ReadonlyArray<string>
  submit: string
  copy: string
  copied: string
  copyFailed: string
  required: string
  invalidEmail: string
  sending: string
  sent: string
  /** Shown when the site could not send it and the visitor's mail app opens instead. */
  fallback: string
  emailLabels: {
    name: string
    email: string
    company: string
    type: string
    budget: string
    timeline: string
    problem: string
  }
  subject: string
}

export type AssistantFailure =
  "rate_limited" | "unconfigured" | "upstream" | "bad_request" | "network"

export type SiteConsoleCopy = {
  assistant: {
    open: string
    title: string
    intro: string
    placeholder: string
    send: string
    close: string
    suggestions: readonly [string, string, string]
    thinking: string
    errors: Record<AssistantFailure, string>
    email: string
    brief: string
    disclaimer: string
  }
  terminal: TerminalStrings & {
    open: string
    title: string
    close: string
    prompt: string
    banner: readonly [string, string]
    thinking: string
  }
}

export type ServiceId = "advisory" | "delivery" | "fractional"

export type Service = {
  id: ServiceId
  name: string
  summary: string
  audience: string
  includes: ReadonlyArray<string>
  deliverable: string
  format: string
}

export type LiveProduct = {
  name: string
  slug: CaseStudySlug
  what: string
  href: string
}

export type PipelineStep = {
  step: string
  by: string
  /** The step where a person, not the AI, decides. */
  human?: boolean
}

export type ExperienceEntryId =
  "andbank-2024" | "elabogado-2022" | "zemsania-2021" | "endesa-2019"

export type ExperienceGroup = {
  id: string
  period: string
  organization: string
  role: string
  summary: string
  /** Site wording, kept plain; the full CV detail stays on /cv. */
  highlights: ReadonlyArray<string>
  entries: ReadonlyArray<ExperienceEntryId>
}

export type SiteContent = {
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
    cv: string
    contact: string
    menu: string
    skipToContent: string
    toggleTheme: string
    breadcrumb: string
  }
  cta: string
  hero: {
    role: string
    headline: Headline
    subtitle: string
    /** The hero's call to action: says what happens next, unlike the header's short label. */
    cta: string
    availability: { status: string }
    /** The core stack, one line under the call to action. */
    stack: string
    /** Remote, time zone and the ways to work together. */
    engagement: string
    seeWork: string
    terminalHint: string
    tools: { label: string; center: string; caption: string }
    live: {
      title: string
      items: readonly [LiveProduct, LiveProduct, LiveProduct]
    }
  }
  display: {
    capabilities: Headline
    approach: Headline
    work: Headline
    services: Headline
    about: Headline
    contact: Headline
  }
  approach: {
    intro: string
    pipeline: readonly [
      PipelineStep,
      PipelineStep,
      PipelineStep,
      PipelineStep,
      PipelineStep,
    ]
    principles: readonly [TitledText, TitledText, TitledText, TitledText]
  }
  capabilities: {
    intro: string
    items: readonly [Capability, Capability, Capability]
    caseLabel: string
  }
  hiring: {
    title: string
    body: string
    cvLink: string
  }
  credentials: {
    label: string
    companies: ReadonlyArray<string>
  }
  about: {
    title: string
    lead: string
    paragraphs: readonly [RichText, RichText]
    principle: string
    signature: string
    facts: ReadonlyArray<{ label: string; value: string }>
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
    /** The home's one-line case for the three services. */
    statement: string
    items: readonly [Service, Service, Service]
    audienceLabel: string
    includesLabel: string
    deliverableLabel: string
    formatLabel: string
    details: string
    startTitle: string
    startSteps: readonly [StartStep, StartStep, StartStep]
    rates: string
    closing: string
  }
  experience: {
    title: string
    intro: string
    groups: readonly [ExperienceGroup, ExperienceGroup, ExperienceGroup]
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
      next: string
    }
    cases: readonly [CaseStudy, CaseStudy, CaseStudy, CaseStudy]
  }
  contact: {
    title: string
    homeTitle: string
    intro: string
    facts: ReadonlyArray<{ label: string; value: string }>
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
    brief: ProjectBrief
    direct: string
    elsewhere: string
  }
  footer: {
    location: string
    privacy: string
    backToTop: string
  }
  console: SiteConsoleCopy
  privacy: {
    title: string
    updated: string
    sections: ReadonlyArray<{
      title: string
      paragraphs: ReadonlyArray<RichText>
    }>
  }
}

export const caseStudySlugs = [
  "transolido-verifactu-invoicing",
  "othertwist-offline-writing",
  "ilnami-private-by-design",
  "private-bank-modernization",
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
  /** Set when a public screenshot of the live product exists. */
  screenshotAlt?: string
  links: ReadonlyArray<ExternalLink>
}

export type ConnectStep = {
  title: string
  body: string
}

/** A stage of the work and what the client holds at the end of it. */
export type ConnectStage = ConnectStep & { deliverable: string }

export type StartStep = { step: string; deliverable: string }

export type ProjectBrief = {
  title: string
  intro: string
  fields: {
    name: string
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
  opened: string
  emailLabels: {
    name: string
    company: string
    type: string
    budget: string
    timeline: string
    problem: string
  }
  subject: string
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
    breadcrumb: string
  }
  cta: string
  hero: {
    role: string
    headline: Headline
    subtitle: string
    availability: { status: string }
    direct: string
    seeWork: string
    tools: { label: string; center: string }
    live: {
      title: string
      items: readonly [LiveProduct, LiveProduct, LiveProduct]
    }
  }
  display: {
    connect: Headline
    approach: Headline
    work: Headline
    services: Headline
    about: Headline
    experience: Headline
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
    principlesTitle: string
    /** The first principle leads the list and spans the full width. */
    principles: readonly [ConnectStep, ...ConnectStep[]]
  }
  connect: {
    intro: string
    steps: readonly [ConnectStage, ConnectStage, ConnectStage, ConnectStage]
    deliverableLabel: string
    nodes: {
      sources: readonly [string, string, string, string]
      core: string
      coreDetail: string
      ai: string
      outputs: readonly [string, string, string]
    }
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
    fullCv: string
    privacy: string
    backToTop: string
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

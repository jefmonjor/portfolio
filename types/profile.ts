export type SocialKind = "linkedin" | "github" | "email"

export type Social = {
  kind: SocialKind
  href: string
  handle?: string
}

export type ExperienceEntry = {
  id: string
  organization: string
  location: string
  startISO: string
  endISO: string | "present"
  stack?: ReadonlyArray<string>
}

export type EducationEntry = {
  id: string
  organization: string
  dates: string
  location?: string
  /** Academic degrees back `alumniOf`; certifications never do. */
  kind: "degree" | "certification"
}

export type SkillGroup = {
  id: string
  items: ReadonlyArray<string>
}

export type LanguageEntry = {
  id: string
}

export type ProjectStage = "live" | "development"

export type ProjectVisibility = "public" | "private"

export type ProjectEntry = {
  id: string
  stage: ProjectStage
  visibility: ProjectVisibility
  url?: string
  repo?: string
  year?: string
  stack?: ReadonlyArray<string>
  /** Screenshot paths under /public — shown as a looping preview. */
  images?: ReadonlyArray<string>
}

export type Profile = {
  name: string
  shortName: string
  location: string
  timezone: string
  since: string
  focus: ReadonlyArray<string>
  marquee: ReadonlyArray<string>
  socials: ReadonlyArray<Social>
  experience: ReadonlyArray<ExperienceEntry>
  skills: ReadonlyArray<SkillGroup>
  projects: ReadonlyArray<ProjectEntry>
  education: ReadonlyArray<EducationEntry>
  languages: ReadonlyArray<LanguageEntry>
}

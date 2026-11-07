export type SocialKind = "linkedin" | "github" | "email"

export type Social = {
  kind: SocialKind
  href: string
  handle?: string
}

export type MacSchemaOrganizationType =
  | "startup"
  | "SME"
  | "bigCorp"
  | "publicAdministration"
  | "NGO"
  | "academicalInstitution"
  | "other"

export type ExperienceEntry = {
  id: string
  organization: string
  organizationType: MacSchemaOrganizationType
  location: string
  startISO: string
  endISO: string | "present"
  stack?: ReadonlyArray<string>
}

type YearOrYearMonth = string

export type EducationEntry = {
  id: string
  organization: string
  dates: string
  location?: string
  kind: "degree" | "certification"
  completed: boolean
  startISO: YearOrYearMonth
  endISO?: YearOrYearMonth
  credentialUrl?: string
}

export type SkillGroup = {
  id: string
  items: ReadonlyArray<string>
}

export type MacSchemaLanguageProficiency =
  | "Elementary proficiency"
  | "Limited working proficiency"
  | "Professional working proficiency"
  | "Full professional proficiency"
  | "Native or bilingual proficiency"

type Iso6391LanguageCode = string

export type LanguageEntry = {
  id: string
  code: Iso6391LanguageCode
  level: MacSchemaLanguageProficiency
}

export type ProjectStage = "live" | "development"

export type ProjectVisibility = "public" | "private"

type ScreenshotPathUnderPublic = string

export type ProjectEntry = {
  id: string
  stage: ProjectStage
  visibility: ProjectVisibility
  url?: string
  repo?: string
  year?: string
  stack?: ReadonlyArray<string>
  images?: ReadonlyArray<ScreenshotPathUnderPublic>
}

export type Profile = {
  name: string
  shortName: string
  location: string
  timezone: string
  since: string
  focus: ReadonlyArray<string>
  socials: ReadonlyArray<Social>
  experience: ReadonlyArray<ExperienceEntry>
  skills: ReadonlyArray<SkillGroup>
  projects: ReadonlyArray<ProjectEntry>
  education: ReadonlyArray<EducationEntry>
  languages: ReadonlyArray<LanguageEntry>
}

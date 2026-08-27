export type SocialKind = "linkedin" | "github" | "email"

export type Social = {
  kind: SocialKind
  href: string
  handle?: string
}

/** Organization sizes as the MAC (Manfred Awesomic CV) schema names them. */
export type OrganizationType =
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
  organizationType: OrganizationType
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
  /**
   * False for studies attended without obtaining the qualification. Only a
   * completed degree may claim `alumniOf` or MAC's `degreeAchieved`.
   */
  completed: boolean
  /** Year or year-month. Exports that need a full date anchor it to day one. */
  startISO: string
  endISO?: string
}

export type SkillGroup = {
  id: string
  items: ReadonlyArray<string>
}

/** Proficiency wording taken verbatim from the MAC schema enumeration. */
export type LanguageProficiency =
  | "Elementary proficiency"
  | "Limited working proficiency"
  | "Professional working proficiency"
  | "Full professional proficiency"
  | "Native or bilingual proficiency"

export type LanguageEntry = {
  id: string
  /** ISO 639-1 code, as machine-readable exports require. */
  code: string
  level: LanguageProficiency
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

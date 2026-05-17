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
  start: string
  end: string | "present"
  stack?: ReadonlyArray<string>
}

export type EducationEntry = {
  id: string
  organization: string
  dates: string
  location?: string
}

export type SkillGroup = {
  id: string
  items: ReadonlyArray<string>
}

export type LanguageEntry = {
  id: string
}

export type Profile = {
  name: string
  shortName: string
  initials: string
  location: string
  timezone: string
  since: string
  focus: ReadonlyArray<string>
  marquee: ReadonlyArray<string>
  socials: ReadonlyArray<Social>
  experience: ReadonlyArray<ExperienceEntry>
  skills: ReadonlyArray<SkillGroup>
  education: ReadonlyArray<EducationEntry>
  languages: ReadonlyArray<LanguageEntry>
}

import { profile } from "@/lib/profile"

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "")
}

const TRAILING_VERSION_NOTE = /\s*\(.*\)\s*$/
const TECHNOLOGY_SEPARATOR = /\s*[·/→+]\s*/
const MIN_SKILL_CHARS_FOUND_INSIDE_EVIDENCE = 3
const MIN_EVIDENCE_CHARS_FOUND_INSIDE_SKILL = 7

function technologiesNamedIn(item: string): string[] {
  const base = item.replace(TRAILING_VERSION_NOTE, "")
  return base
    .split(TECHNOLOGY_SEPARATOR)
    .map(fold)
    .filter((term) => term.length > 0)
}

function matches(skill: string, evidence: string): boolean {
  if (skill === evidence) return true
  if (
    skill.length >= MIN_SKILL_CHARS_FOUND_INSIDE_EVIDENCE &&
    evidence.includes(skill)
  ) {
    return true
  }
  return (
    evidence.length >= MIN_EVIDENCE_CHARS_FOUND_INSIDE_SKILL &&
    skill.includes(evidence)
  )
}

export function evidencedSkillGroups(
  projectIds: ReadonlyArray<string>
): ReadonlyArray<{ id: string; items: ReadonlyArray<string> }> {
  const evidence = new Set(
    [
      ...profile.experience.flatMap((entry) => entry.stack ?? []),
      ...profile.projects
        .filter((project) => projectIds.includes(project.id))
        .flatMap((project) => project.stack ?? []),
    ].flatMap(technologiesNamedIn)
  )

  return profile.skills
    .filter((group) => group.id !== "practice")
    .map((group) => ({
      id: group.id,
      items: group.items.filter((item) =>
        technologiesNamedIn(item).some((skill) =>
          Array.from(evidence).some((token) => matches(skill, token))
        )
      ),
    }))
    .filter((group) => group.items.length > 0)
}

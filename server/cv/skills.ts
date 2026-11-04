import { profile } from "@/lib/profile"

// The general CV lists only the technologies the rest of the document backs:
// what the jobs' stacks and the named products were built with. The website
// keeps the full catalogue; on paper a long list dilutes the work.

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "")
}

// "COBOL/AS400" is two technologies; "Java (8 → 21)" is one, named "Java".
function terms(item: string): string[] {
  const base = item.replace(/\s*\(.*\)\s*$/, "")
  return base
    .split(/\s*[·/→+]\s*/)
    .map(fold)
    .filter((term) => term.length > 0)
}

function matches(skill: string, evidence: string): boolean {
  if (skill === evidence) return true
  // "java" in "java21", "redis" in "upstashredis"; the reverse only for long
  // tokens so "cloudrun" backs "Google Cloud Run" but "vercel" does not back
  // "Vercel AI SDK".
  if (skill.length >= 3 && evidence.includes(skill)) return true
  return evidence.length >= 7 && skill.includes(evidence)
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
    ].flatMap(terms)
  )

  return profile.skills
    .filter((group) => group.id !== "practice")
    .map((group) => ({
      id: group.id,
      items: group.items.filter((item) =>
        terms(item).some((skill) =>
          Array.from(evidence).some((token) => matches(skill, token))
        )
      ),
    }))
    .filter((group) => group.items.length > 0)
}

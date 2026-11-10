import type { ProjectBrief } from "@/content/site/types"

export type BriefAnswers = {
  name: string
  email: string
  company: string
  type: string
  budget: string
  timeline: string
  problem: string
}

/** The plain-text email the brief becomes, whether it is sent or opened. */
export function composeBriefBody(
  labels: ProjectBrief["emailLabels"],
  answers: BriefAnswers
): string {
  return [
    [labels.name, answers.name],
    [labels.email, answers.email],
    [labels.company, answers.company],
    [labels.type, answers.type],
    [labels.budget, answers.budget],
    [labels.timeline, answers.timeline],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .concat(["", `${labels.problem}:`, answers.problem])
    .join("\n")
}

export function briefSubject(brief: ProjectBrief, name: string): string {
  return `${brief.subject} · ${name}`
}

/** A choice must be one the brief offered, or left empty. */
export function isOfferedChoice(
  options: ReadonlyArray<string>,
  value: string
): boolean {
  return value === "" || options.includes(value)
}

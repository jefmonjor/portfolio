import type { Locale } from "@/i18n/routing"
import { cvProjects, profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { CV_HEADINGS } from "@/server/cv/headings"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"

const CONTACT_LABEL: Record<Locale, string> = {
  es: "Contacto",
  ca: "Contacte",
  en: "Contact",
}

const CONTACT_HINT: Record<Locale, string> = {
  es: `Formas de contacto en ${siteUrlShort}/es/contact`,
  ca: `Vies de contacte a ${siteUrlShort}/es/contact`,
  en: `Contact paths at ${siteUrlShort}/contact`,
}

const STACK_LABEL: Record<Locale, string> = {
  es: "Stack",
  ca: "Stack",
  en: "Stack",
}

export function buildCvMarkdown(labels: CvLabels, locale: Locale): string {
  const headings = CV_HEADINGS[locale]
  const linkedin = profile.socials.find((s) => s.kind === "linkedin")
  const github = profile.socials.find((s) => s.kind === "github")

  const lines: string[] = [
    `# ${profile.name}`,
    "",
    `**${labels.role}** — ${profile.location} · ${profile.timezone}`,
    "",
    labels.availability,
    "",
    `- ${siteUrlShort}`,
    ...(linkedin ? [`- linkedin.com/in/${linkedin.handle ?? ""}`] : []),
    ...(github ? [`- github.com/${github.handle ?? ""}`] : []),
    `- ${CONTACT_LABEL[locale]}: ${CONTACT_HINT[locale]}`,
    "",
    `## ${headings.profile}`,
    "",
    labels.summary,
    "",
    `## ${headings.skills}`,
    "",
  ]

  for (const group of profile.skills) {
    if (group.id === "practice") continue
    lines.push(
      `- **${labels.skillGroupName(group.id)}**: ${group.items.join(", ")}`
    )
  }

  lines.push("", `## ${headings.practices}`, "")
  for (const item of labels.practiceItems) lines.push(`- ${item}`)

  lines.push("", `## ${headings.experience}`, "")
  for (const entry of profile.experience) {
    const data = labels.experienceEntry(entry.id)
    lines.push(`### ${data.role} — ${entry.organization}`, "")
    lines.push(`${data.start} — ${data.end} · ${data.location}`, "")
    if (data.summary) lines.push(data.summary, "")
    for (const highlight of data.highlights) lines.push(`- ${highlight}`)
    if (entry.stack && entry.stack.length > 0) {
      lines.push("", `${STACK_LABEL[locale]}: ${entry.stack.join(", ")}`)
    }
    lines.push("")
  }

  lines.push(`## ${headings.projects}`, "")
  for (const entry of cvProjects()) {
    const data = labels.projectEntry(entry.id)
    const url = entry.url ? ` — ${cvLinkHref(entry.url)}` : ""
    lines.push(`### ${data.name}${url}`, "")
    lines.push(`${data.status}`, "")
    lines.push(data.summary, "")
    if (entry.stack && entry.stack.length > 0) {
      lines.push(`${STACK_LABEL[locale]}: ${entry.stack.join(", ")}`, "")
    }
  }

  lines.push(`## ${headings.education}`, "")
  for (const entry of profile.education) {
    const data = labels.educationEntry(entry.id)
    const credential = entry.credentialUrl
      ? ` · [${labels.credential}](${entry.credentialUrl})`
      : ""
    lines.push(
      `- **${data.title}** — ${entry.organization} · ${data.dates}${credential}`
    )
  }

  lines.push("", `## ${headings.languages}`, "")
  for (const language of profile.languages) {
    const data = labels.languageEntry(language.id)
    lines.push(`- ${data.name}: ${data.level}`)
  }

  lines.push("", `_${labels.footer} · ${cvLinkLabel(siteUrlShort)}_`, "")

  return lines.join("\n")
}

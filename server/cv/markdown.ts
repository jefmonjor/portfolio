import type { Locale } from "@/i18n/routing"
import { profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { CV_HEADINGS } from "@/server/cv/headings"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"

// A Markdown twin of the technical PDF, from the same labels. Sourcing agents
// and CV analyzers parse plain text far more reliably than a PDF, and this is
// the one CV surface a crawler can read without downloading a binary.
//
// The email is deliberately absent: unlike the PDFs, this endpoint is plain
// text on a public URL, which is exactly what lib/email.ts keeps it out of.

const CONTACT_LABEL: Record<Locale, string> = {
  es: "Contacto",
  ca: "Contacte",
  en: "Contact",
}

const CONTACT_HINT: Record<Locale, string> = {
  es: `Formulario y dirección en ${siteUrlShort}/es#contact`,
  ca: `Formulari i adreça a ${siteUrlShort}/ca#contact`,
  en: `Contact paths at ${siteUrlShort}/en#contact`,
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
  for (const entry of profile.projects) {
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
    lines.push(`- **${data.title}** — ${entry.organization} · ${data.dates}`)
  }

  lines.push("", `## ${headings.languages}`, "")
  for (const language of profile.languages) {
    const data = labels.languageEntry(language.id)
    lines.push(`- ${data.name}: ${data.level}`)
  }

  lines.push("", `_${labels.footer} · ${cvLinkLabel(siteUrlShort)}_`, "")

  return lines.join("\n")
}

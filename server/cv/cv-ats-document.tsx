import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { contactEmail } from "@/lib/email"
import { profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { CV_HEADINGS } from "@/server/cv/headings"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"
import { prioritizeItems } from "@/server/cv/tailoring"
import type { CvTailoredContent } from "@/types/cv-tailor"

// Technical variant: single column, standard headings and no decorative
// layers. It is ATS-readable without claiming a guaranteed ATS score.

const ink = "#000000"
const body = "#1a1a1a"
const muted = "#4a4a4a"
const rule = "#d4d4d4"

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontSize: 9.5,
    color: body,
    backgroundColor: "#ffffff",
    lineHeight: 1.45,
    fontFamily: "Figtree",
    fontWeight: 400,
  },
  name: {
    fontFamily: "Figtree",
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 1.2,
    color: ink,
    letterSpacing: -0.4,
  },
  roleLine: {
    marginTop: 5,
    fontSize: 10.5,
    fontWeight: 500,
    color: body,
  },
  contactLine: {
    marginTop: 4,
    fontSize: 9,
    color: muted,
  },
  contactLink: {
    color: muted,
    textDecoration: "none",
  },
  sectionTitle: {
    fontFamily: "Figtree",
    fontWeight: 700,
    fontSize: 11,
    color: ink,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: rule,
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.5,
  },
  keywordLine: {
    marginTop: 4,
    fontSize: 9,
    color: muted,
    lineHeight: 1.5,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  },
  entryRole: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 10.5,
    color: ink,
    flexShrink: 1,
  },
  entryDates: {
    fontSize: 9,
    color: muted,
    flexShrink: 0,
  },
  entryUrl: {
    fontSize: 9,
    color: muted,
    textDecoration: "none",
    flexShrink: 0,
  },
  entryOrg: {
    fontSize: 9.5,
    fontWeight: 500,
    color: body,
    marginTop: 1,
  },
  bullet: {
    flexDirection: "row",
    gap: 6,
    marginTop: 1.5,
  },
  bulletMark: {
    fontSize: 9.5,
    width: 7,
    color: body,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.45,
  },
  stackLine: {
    marginTop: 2,
    fontSize: 8.5,
    color: muted,
  },
  skillLine: {
    marginBottom: 2.5,
    fontSize: 9.5,
    lineHeight: 1.45,
  },
  skillLabel: {
    fontWeight: 600,
    color: ink,
  },
})

type CvTechnicalDocumentProps = {
  readonly labels: CvLabels
  readonly locale: "es" | "en" | "ca"
  readonly tailored?: CvTailoredContent
}

// Every personal product, ordered by weight. The two private ones carry no
// URL; the rest are open in one click, which is the point of listing them.
const TECHNICAL_PROJECT_IDS = [
  "transolido",
  "othertales",
  "porrix",
  "corte1d",
  "tavory",
  "contactqr",
  "portfolio",
] as const

function CvTechnicalDocument({
  labels,
  locale,
  tailored,
}: CvTechnicalDocumentProps) {
  const headings = CV_HEADINGS[locale]
  // Server-rendered on demand, so the plain address never reaches the
  // static HTML — safe to print it in the downloadable document.
  const email = contactEmail()
  const linkedin = profile.socials.find((s) => s.kind === "linkedin")
  const github = profile.socials.find((s) => s.kind === "github")

  const summary = tailored?.summary?.trim() || labels.summary
  // Tailoring reorders, it never truncates: a CV written for one offer should
  // still carry everything the technical variant carries, with the relevant
  // work first. The portfolio closes the list in every variant — it is where a
  // reader can verify the rest of the document.
  const projectIds = prioritizeItems(
    TECHNICAL_PROJECT_IDS.filter((id) => id !== "portfolio"),
    tailored?.projectIds ?? []
  ).concat("portfolio")
  const projects = projectIds
    .map((id) => {
      const entry = profile.projects.find((p) => p.id === id)
      if (!entry) return null
      return { entry, data: labels.projectEntry(id) }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <Document
      title={`${profile.shortName} — ${labels.role} (${tailored ? "Tailored" : "Technical"})`}
      author={profile.name}
      subject={labels.role}
      creator="portfolio"
      producer="portfolio"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.roleLine}>
          {labels.role} · {profile.location} · {profile.timezone}
        </Text>
        <Text style={styles.contactLine}>
          {`${email} · `}
          {linkedin ? (
            // One string per link: split children extract as
            // "linkedin.com/in/ jefmonjor" and break the parsed URL.
            <Link src={linkedin.href} style={styles.contactLink}>
              {`linkedin.com/in/${linkedin.handle ?? ""}`}
            </Link>
          ) : null}
          {github ? (
            <>
              {" · "}
              <Link src={github.href} style={styles.contactLink}>
                {`github.com/${github.handle ?? ""}`}
              </Link>
            </>
          ) : null}
          {" · "}
          <Link src={siteUrlShort} style={styles.contactLink}>
            {cvLinkLabel(siteUrlShort)}
          </Link>
        </Text>
        <Text style={styles.contactLine}>{labels.availability}</Text>

        <Text style={styles.sectionTitle}>{headings.profile}</Text>
        <Text style={styles.paragraph}>{summary}</Text>
        {tailored && tailored.keywords.length > 0 ? (
          <Text style={styles.keywordLine}>
            <Text style={styles.skillLabel}>{headings.evidence}: </Text>
            {tailored.keywords.join(" · ")}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>{headings.skills}</Text>
        {profile.skills
          .filter((group) => group.id !== "practice")
          .map((group) => (
            <Text key={group.id} style={styles.skillLine}>
              <Text style={styles.skillLabel}>
                {labels.skillGroupName(group.id)}:{" "}
              </Text>
              {prioritizeItems(group.items, tailored?.keywords ?? []).join(
                ", "
              )}
            </Text>
          ))}

        <Text style={styles.sectionTitle}>{headings.practices}</Text>
        {labels.practiceItems.map((item) => (
          <View key={item} style={styles.bullet} wrap={false}>
            <Text style={styles.bulletMark}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{headings.experience}</Text>
        {profile.experience.map((entry) => {
          const data = labels.experienceEntry(entry.id)
          return (
            <View key={entry.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryRole}>{data.role}</Text>
                <Text style={styles.entryDates}>
                  {data.start} — {data.end}
                </Text>
              </View>
              <Text style={styles.entryOrg}>
                {entry.organization} · {data.location}
              </Text>
              {data.summary ? (
                <Text style={styles.paragraph}>{data.summary}</Text>
              ) : null}
              {data.highlights.map((hl, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.bulletText}>{hl}</Text>
                </View>
              ))}
              {entry.stack && entry.stack.length > 0 ? (
                <Text style={styles.stackLine}>{entry.stack.join(" · ")}</Text>
              ) : null}
            </View>
          )
        })}

        <Text style={styles.sectionTitle}>{headings.projects}</Text>
        {projects.map(({ entry, data }) => (
          <View key={entry.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryRole}>{data.name}</Text>
              {entry.url ? (
                <Link src={cvLinkHref(entry.url)} style={styles.entryUrl}>
                  {cvLinkLabel(entry.url)}
                </Link>
              ) : null}
            </View>
            <Text style={styles.stackLine}>{data.status}</Text>
            <Text style={styles.paragraph}>{data.summary}</Text>
            {entry.stack && entry.stack.length > 0 ? (
              <Text style={styles.stackLine}>{entry.stack.join(" · ")}</Text>
            ) : null}
          </View>
        ))}

        <Text style={styles.sectionTitle}>{headings.education}</Text>
        {profile.education.map((entry) => {
          const data = labels.educationEntry(entry.id)
          return (
            <View key={entry.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryRole}>{data.title}</Text>
                <Text style={styles.entryDates}>{data.dates}</Text>
              </View>
              <Text style={styles.entryOrg}>{entry.organization}</Text>
            </View>
          )
        })}

        <Text style={styles.sectionTitle}>{headings.languages}</Text>
        {profile.languages.map((lang) => {
          const data = labels.languageEntry(lang.id)
          return (
            <Text key={lang.id} style={styles.skillLine}>
              <Text style={styles.skillLabel}>{data.name}: </Text>
              {data.level}
            </Text>
          )
        })}
      </Page>
    </Document>
  )
}

export { CvTechnicalDocument, TECHNICAL_PROJECT_IDS }

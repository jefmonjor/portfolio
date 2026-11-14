import { Fragment } from "react"
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { contactEmail } from "@/lib/email"
import { contactPhones } from "@/lib/phone"
import { cvProjectIds, profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { CV_HEADINGS } from "@/server/cv/headings"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"
import { prioritizeItems } from "@/server/cv/tailoring"
import type { CvTailoredContent } from "@/types/cv-tailor"

const ink = "#000000"
const body = "#1a1a1a"
const muted = "#4a4a4a"
const rule = "#d4d4d4"

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 34,
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
    marginTop: 9,
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
    marginBottom: 5,
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

function Highlight({ text }: { text: string }) {
  return (
    <View style={styles.bullet} wrap={false}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  )
}

function CvTechnicalDocument({
  labels,
  locale,
  tailored,
}: CvTechnicalDocumentProps) {
  const headings = CV_HEADINGS[locale]
  const email = contactEmail()
  const linkedin = profile.socials.find((s) => s.kind === "linkedin")
  const github = profile.socials.find((s) => s.kind === "github")

  const summary = tailored?.summary?.trim() || labels.summary
  const projectIds = prioritizeItems(cvProjectIds, tailored?.projectIds ?? [])
  const projects = projectIds
    .map((id) => {
      const entry = profile.projects.find((p) => p.id === id)
      if (!entry) return null
      return { entry, data: labels.projectEntry(id) }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <Document
      title={`${profile.shortName} — ${labels.role}${tailored ? "" : " (Technical)"}`}
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
          {contactPhones()
            .map((phone) => phone.display)
            .join(" · ")}
          {" · "}
          {linkedin ? (
            // PDF text extraction splits child strings ("linkedin.com/in/ handle").
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

        {profile.experience.map((entry, index) => {
          const data = labels.experienceEntry(entry.id)
          const [firstHighlight, ...otherHighlights] = data.highlights
          return (
            <Fragment key={entry.id}>
              {/* A job never opens with its heading alone at the foot of a
                  page: the heading, the summary and the first highlight stay
                  together, and the rest flows onto the next page. The pieces
                  are direct children of the page because the PDF engine only
                  breaks reliably between those. */}
              <View wrap={false}>
                {index === 0 ? (
                  <Text style={styles.sectionTitle}>{headings.experience}</Text>
                ) : null}
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
                {firstHighlight ? <Highlight text={firstHighlight} /> : null}
              </View>
              {otherHighlights.map((highlight, i) => (
                <Highlight key={i} text={highlight} />
              ))}
              <Text style={[styles.stackLine, styles.entry]}>
                {(entry.stack ?? []).join(" · ")}
              </Text>
            </Fragment>
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
              <Text style={styles.entryOrg}>
                {entry.organization}
                {entry.credentialUrl ? (
                  <>
                    {" · "}
                    <Link src={entry.credentialUrl} style={styles.contactLink}>
                      {`${labels.credential}: ${cvLinkLabel(entry.credentialUrl).split("/")[0]}`}
                    </Link>
                  </>
                ) : null}
              </Text>
            </View>
          )
        })}

        <View wrap={false}>
          <Text style={styles.sectionTitle}>{headings.languages}</Text>
          <Text style={styles.skillLine}>
            {profile.languages.map((lang, index) => {
              const data = labels.languageEntry(lang.id)
              return (
                <Text key={lang.id}>
                  {index > 0 ? "  ·  " : ""}
                  <Text style={styles.skillLabel}>{data.name}: </Text>
                  {data.level}
                </Text>
              )
            })}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export { CvTechnicalDocument }

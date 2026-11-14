import path from "node:path"

import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { contactEmail, contactMailto } from "@/lib/email"
import { contactPhones } from "@/lib/phone"
import { profile, siteUrlShort } from "@/lib/profile"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"
import { evidencedSkillGroups } from "@/server/cv/skills"

const FONT_DIR = path.join(process.cwd(), "public/fonts/cv")

Font.register({
  family: "Figtree",
  fonts: [
    { src: path.join(FONT_DIR, "Figtree-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "Figtree-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONT_DIR, "Figtree-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONT_DIR, "Figtree-Bold.ttf"), fontWeight: 700 },
  ],
})

Font.registerHyphenationCallback((word) => [word])

type CvLabels = {
  readonly role: string
  readonly present: string
  readonly headline: string
  readonly summary: string
  readonly availability: string
  readonly contactSubject: string
  readonly otherProjects: string
  readonly credential: string
  readonly sections: {
    readonly profile: string
    readonly experience: string
    readonly skills: string
    readonly projects: string
    readonly education: string
    readonly contact: string
    readonly languages: string
  }
  readonly skillGroupName: (id: string) => string
  readonly experienceEntry: (id: string) => CvExperienceEntry
  readonly projectEntry: (id: string) => CvProjectEntry
  readonly educationEntry: (id: string) => CvEducationEntry
  readonly languageEntry: (id: string) => CvLanguageEntry
  readonly practiceItems: ReadonlyArray<string>
  readonly footer: string
}

export type CvExperienceEntry = {
  readonly role: string
  readonly location: string
  readonly start: string
  readonly end: string
  readonly summary: string
  readonly highlights: ReadonlyArray<string>
}

export type CvProjectEntry = {
  readonly name: string
  readonly summary: string
  readonly status: string
}

export type CvEducationEntry = {
  readonly title: string
  readonly dates: string
  readonly location?: string
}

export type CvLanguageEntry = {
  readonly name: string
  readonly level: string
}

const FEATURED_PROJECT_IDS: ReadonlyArray<string> = [
  "transolido",
  "ilnami",
  "specforge",
]

const palette = {
  ink: "#111111",
  body: "#222222",
  muted: "#555555",
  rule: "#999999",
} as const

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 44,
    paddingHorizontal: 46,
    fontFamily: "Figtree",
    fontWeight: 400,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontWeight: 700,
    fontSize: 19,
    lineHeight: 1.15,
    color: palette.ink,
    textAlign: "center",
  },
  role: {
    marginTop: 3,
    fontWeight: 600,
    fontSize: 10.5,
    color: palette.ink,
    textAlign: "center",
  },
  contactLine: {
    marginTop: 3,
    fontSize: 9,
    color: palette.body,
    textAlign: "center",
  },
  availability: {
    marginTop: 2,
    fontSize: 8.5,
    color: palette.muted,
    textAlign: "center",
  },
  link: {
    color: palette.body,
    textDecoration: "none",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 10,
    textTransform: "uppercase",
    color: palette.ink,
    paddingBottom: 2,
    marginBottom: 5,
    borderBottomWidth: 0.6,
    borderBottomColor: palette.rule,
  },
  headline: {
    fontWeight: 600,
    fontSize: 9.5,
    color: palette.ink,
    marginBottom: 2,
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
  },
  job: {
    marginBottom: 7,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },
  jobTitle: {
    flex: 1,
    fontSize: 10,
    fontWeight: 700,
    color: palette.ink,
  },
  jobDates: {
    fontSize: 9,
    color: palette.muted,
    flexShrink: 0,
  },
  jobLocation: {
    fontSize: 9,
    color: palette.body,
    marginBottom: 2,
  },
  jobSummary: {
    fontSize: 9.5,
    color: palette.body,
    marginBottom: 1,
  },
  bullet: {
    flexDirection: "row",
    gap: 5,
    paddingLeft: 6,
  },
  bulletMark: {
    width: 6,
    fontSize: 9.5,
    color: palette.body,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
  },
  skillLine: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
    marginBottom: 1,
  },
  skillName: {
    fontWeight: 700,
    color: palette.ink,
  },
  project: {
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 9.5,
    color: palette.ink,
  },
  projectName: {
    fontWeight: 700,
  },
  projectUrl: {
    color: palette.muted,
  },
  projectSummary: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
  },
  line: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: palette.body,
    marginBottom: 1,
  },
  lineStrong: {
    fontWeight: 600,
    color: palette.ink,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: palette.muted,
  },
})

type CvDocumentProps = {
  readonly labels: CvLabels
}

function findSocial(kind: string) {
  return profile.socials.find((s) => s.kind === kind)
}

function CvDocument({ labels }: CvDocumentProps) {
  const email = contactEmail()
  const emailHref = contactMailto(labels.contactSubject)
  const linkedin = findSocial("linkedin")
  const github = findSocial("github")

  const contactsWrittenInFull: ReadonlyArray<{
    href: string
    label: string
    prefix?: string
  }> = [
    ...(email && emailHref ? [{ href: emailHref, label: email }] : []),
    ...contactPhones().map((phone) => ({
      href: `tel:${phone.tel}`,
      label: phone.display,
    })),
    ...(linkedin
      ? [
          {
            href: linkedin.href,
            label: cvLinkLabel(linkedin.href),
            prefix: "LinkedIn",
          },
        ]
      : []),
    ...(github
      ? [
          {
            href: github.href,
            label: cvLinkLabel(github.href),
            prefix: "GitHub",
          },
        ]
      : []),
    {
      href: siteUrlShort,
      label: cvLinkLabel(siteUrlShort),
      prefix: "Portfolio",
    },
  ]

  const featured = FEATURED_PROJECT_IDS.flatMap((id) => {
    const entry = profile.projects.find((p) => p.id === id)
    return entry ? [{ entry, data: labels.projectEntry(id) }] : []
  })
  const others = profile.projects
    .filter(
      (p) =>
        !FEATURED_PROJECT_IDS.includes(p.id) &&
        p.visibility === "public" &&
        p.url
    )
    .map((p) => `${labels.projectEntry(p.id).name} (${cvLinkLabel(p.url!)})`)

  return (
    <Document
      title={`${profile.shortName} — ${labels.role}`}
      author={profile.name}
      subject={labels.role}
      creator="portfolio"
      producer="portfolio"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>
            {labels.role} · {profile.location}
          </Text>
          <Text style={styles.contactLine}>
            {contactsWrittenInFull.map((contact, index) => (
              <Text key={contact.href}>
                {index > 0 ? "  ·  " : ""}
                {contact.prefix ? `${contact.prefix}: ` : ""}
                <Link src={contact.href} style={styles.link}>
                  {contact.label}
                </Link>
              </Text>
            ))}
          </Text>
          <Text style={styles.availability}>{labels.availability}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.profile}</Text>
          <Text style={styles.headline}>{labels.headline}</Text>
          <Text style={styles.paragraph}>{labels.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.experience}</Text>
          {profile.experience.map((entry) => {
            const data = labels.experienceEntry(entry.id)
            return (
              <View key={entry.id} style={styles.job}>
                <View style={styles.jobHeader} minPresenceAhead={60}>
                  <Text style={styles.jobTitle}>{data.role}</Text>
                  <Text style={styles.jobDates}>
                    {data.start} – {data.end}
                  </Text>
                </View>
                <Text style={styles.jobLocation}>
                  {entry.organization} · {data.location}
                </Text>
                {data.summary ? (
                  <Text style={styles.jobSummary}>{data.summary}</Text>
                ) : null}
                {data.highlights.map((highlight, index) => (
                  <View key={index} style={styles.bullet}>
                    <Text style={styles.bulletMark}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.projects}</Text>
          {featured.map(({ entry, data }) => (
            <View key={entry.id} style={styles.project}>
              <Text style={styles.projectTitle}>
                <Text style={styles.projectName}>{data.name}</Text>
                {entry.url ? (
                  <Text style={styles.projectUrl}>
                    {"  ·  "}
                    <Link src={cvLinkHref(entry.url)} style={styles.link}>
                      {cvLinkLabel(entry.url)}
                    </Link>
                  </Text>
                ) : null}
              </Text>
              <Text style={styles.projectSummary}>{data.summary}</Text>
            </View>
          ))}
          {others.length > 0 ? (
            <Text style={styles.line}>
              <Text style={styles.lineStrong}>{labels.otherProjects}: </Text>
              {others.join(" · ")}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.skills}</Text>
          {evidencedSkillGroups(
            profile.projects
              .filter((project) => project.stage === "live")
              .map((project) => project.id)
          ).map((group) => {
            const chipTermsAsSeparateKeywords = Array.from(
              new Set(group.items.flatMap((item) => item.split(" · ")))
            )
            return (
              <Text key={group.id} style={styles.skillLine}>
                <Text style={styles.skillName}>
                  {labels.skillGroupName(group.id)}:{" "}
                </Text>
                {chipTermsAsSeparateKeywords.join(", ")}
              </Text>
            )
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.education}</Text>
          {profile.education.map((entry) => {
            const data = labels.educationEntry(entry.id)
            return (
              <Text key={entry.id} style={styles.line}>
                <Text style={styles.lineStrong}>{data.title}</Text>
                {" — "}
                {entry.organization}
                {data.location ? `, ${data.location}` : ""}
                {" · "}
                {data.dates}
                {entry.credentialUrl ? (
                  <Text style={styles.projectUrl}>
                    {" · "}
                    <Link src={entry.credentialUrl} style={styles.link}>
                      {labels.credential}:{" "}
                      {cvLinkLabel(entry.credentialUrl).split("/")[0]}
                    </Link>
                  </Text>
                ) : null}
              </Text>
            )
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.sections.languages}</Text>
          <Text style={styles.line}>
            {profile.languages
              .map((lang) => {
                const data = labels.languageEntry(lang.id)
                return `${data.name} (${data.level})`
              })
              .join(" · ")}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>{labels.footer}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${profile.shortName} · ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

export { CvDocument }
export type { CvLabels, CvDocumentProps }

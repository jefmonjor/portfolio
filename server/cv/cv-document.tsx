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
import { profile, siteUrl } from "@/lib/profile"

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

Font.register({
  family: "GeistMono",
  fonts: [
    { src: path.join(FONT_DIR, "GeistMono-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "GeistMono-Medium.ttf"), fontWeight: 500 },
  ],
})

Font.registerHyphenationCallback((word) => [word])

type CvLabels = {
  readonly role: string
  readonly present: string
  readonly tagline: string
  readonly manifesto: string
  readonly availability: string
  readonly metrics: ReadonlyArray<{ value: string; label: string }>
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

const palette = {
  background: "#ffffff",
  ink: "#0a0a0a",
  body: "#27272a",
  muted: "#71717a",
  faint: "#a1a1aa",
  rule: "#e4e4e7",
  hairline: "#f4f4f5",
  // Print-friendly terracotta matching the website's --brand token.
  brand: "#b5691e",
} as const

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 42,
    paddingHorizontal: 46,
    fontSize: 9.5,
    color: palette.body,
    backgroundColor: palette.background,
    lineHeight: 1.5,
    fontFamily: "Figtree",
    fontWeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    marginBottom: 14,
    borderBottomWidth: 0.75,
    borderBottomColor: palette.ink,
  },
  runningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  runningName: {
    fontFamily: "GeistMono",
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: palette.muted,
  },
  runningMeta: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: palette.faint,
  },
  headerLeft: {
    flexDirection: "column",
    maxWidth: "65%",
  },
  eyebrow: {
    fontFamily: "GeistMono",
    fontSize: 7,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: palette.brand,
    marginBottom: 8,
  },
  availability: {
    marginTop: 3,
    fontFamily: "GeistMono",
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: palette.brand,
  },
  metricsRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: palette.rule,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.rule,
    paddingVertical: 7,
    marginBottom: 12,
  },
  metricCell: {
    flex: 1,
    flexDirection: "column",
    gap: 1,
  },
  metricValue: {
    fontFamily: "GeistMono",
    fontWeight: 500,
    fontSize: 11,
    color: palette.ink,
  },
  metricLabel: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 6,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: palette.muted,
  },
  name: {
    fontFamily: "Figtree",
    fontWeight: 700,
    fontSize: 24,
    color: palette.ink,
    letterSpacing: -0.6,
    lineHeight: 1.1,
  },
  roleLine: {
    marginTop: 6,
    fontSize: 9.5,
    color: palette.muted,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 3,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactLabel: {
    fontFamily: "GeistMono",
    fontSize: 7,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: palette.faint,
    width: 42,
    textAlign: "right",
  },
  contactValue: {
    fontFamily: "Figtree",
    fontWeight: 500,
    fontSize: 9,
    color: palette.ink,
    textDecoration: "none",
  },
  intro: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 12,
  },
  tagline: {
    fontFamily: "Figtree",
    fontWeight: 500,
    fontSize: 11,
    color: palette.ink,
    lineHeight: 1.45,
  },
  manifesto: {
    fontSize: 9.5,
    color: palette.muted,
    lineHeight: 1.55,
  },
  section: {
    marginTop: 2,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 8,
  },
  sectionIndex: {
    fontFamily: "GeistMono",
    fontWeight: 500,
    fontSize: 8,
    letterSpacing: 1.4,
    color: palette.brand,
  },
  sectionTitle: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 13,
    color: palette.ink,
    letterSpacing: -0.2,
  },
  sectionRule: {
    flexGrow: 1,
    height: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.rule,
    transform: "translateY(-3px)",
  },
  experienceItem: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 9,
  },
  experienceTimeline: {
    width: 72,
    flexShrink: 0,
    flexDirection: "column",
    gap: 1,
  },
  experienceDate: {
    fontFamily: "GeistMono",
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.ink,
  },
  experienceDateEnd: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.faint,
  },
  experienceBody: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 6,
  },
  experienceRole: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 11,
    color: palette.ink,
    letterSpacing: -0.1,
  },
  experienceOrg: {
    fontFamily: "Figtree",
    fontWeight: 500,
    fontSize: 9,
    color: palette.body,
  },
  experienceMeta: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.muted,
    marginTop: 1,
  },
  experienceSummary: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.5,
    marginTop: 3,
  },
  bullet: {
    flexDirection: "row",
    gap: 7,
    marginTop: 1,
  },
  bulletMark: {
    fontSize: 9.5,
    color: palette.brand,
    width: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.5,
  },
  stackRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  stackItem: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    letterSpacing: 0.3,
    color: palette.body,
    backgroundColor: palette.hairline,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    marginRight: 4,
    marginBottom: 3,
    borderRadius: 2,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 22,
  },
  columnHalf: {
    flex: 1,
    flexDirection: "column",
  },
  skillGroup: {
    flexDirection: "column",
    marginBottom: 10,
  },
  skillGroupHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  skillGroupName: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 9,
    color: palette.ink,
    letterSpacing: 0.2,
  },
  skillGroupCount: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7,
    letterSpacing: 1,
    color: palette.faint,
  },
  skillGroupItems: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.55,
  },
  projectItem: {
    flexDirection: "column",
    marginBottom: 9,
    paddingBottom: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.hairline,
  },
  projectItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 3,
  },
  projectName: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 11,
    color: palette.ink,
  },
  projectUrl: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 8,
    color: palette.muted,
    textDecoration: "none",
    letterSpacing: 0.2,
  },
  projectSummary: {
    fontSize: 9.5,
    color: palette.body,
    lineHeight: 1.55,
  },
  projectStatus: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    color: palette.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  educationItem: {
    flexDirection: "column",
    marginBottom: 8,
  },
  educationTitle: {
    fontFamily: "Figtree",
    fontWeight: 600,
    fontSize: 10,
    color: palette.ink,
  },
  educationOrg: {
    fontFamily: "Figtree",
    fontWeight: 500,
    fontSize: 9,
    color: palette.body,
    marginTop: 1,
  },
  educationMeta: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.muted,
    marginTop: 2,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.hairline,
  },
  languageName: {
    fontFamily: "Figtree",
    fontWeight: 500,
    fontSize: 10,
    color: palette.ink,
  },
  languageLevel: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7.5,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: palette.muted,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: palette.rule,
    height: 22,
  },
  footerText: {
    fontFamily: "GeistMono",
    fontWeight: 400,
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: palette.muted,
  },
})

type CvDocumentProps = {
  readonly labels: CvLabels
}

function findSocialHref(kind: string): string | undefined {
  return profile.socials.find((s) => s.kind === kind)?.href
}

function findSocialHandle(kind: string): string | undefined {
  return profile.socials.find((s) => s.kind === kind)?.handle
}

function CvDocument({ labels }: CvDocumentProps) {
  // Server-rendered on demand, so the plain address never reaches the
  // static HTML — safe to print it in the downloadable document.
  const email = contactEmail()
  const emailHref = contactMailto()
  const linkedinHref = findSocialHref("linkedin")
  const linkedinHandle = findSocialHandle("linkedin")
  const githubHref = findSocialHref("github")
  const githubHandle = findSocialHandle("github")

  return (
    <Document
      title={`${profile.shortName} — ${labels.role}`}
      author={profile.name}
      subject={labels.role}
      creator="portfolio"
      producer="portfolio"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.runningHeader} fixed>
          <Text style={styles.runningName}>{profile.name}</Text>
          <Text style={styles.runningMeta}>
            {labels.role} · {profile.location}
          </Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>{labels.sections.profile}</Text>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.roleLine}>
              {labels.role} · {profile.timezone}
            </Text>
            <Text style={styles.availability}>{labels.availability}</Text>
          </View>
          <View style={styles.headerRight}>
            {email && emailHref ? (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Email</Text>
                <Link src={emailHref} style={styles.contactValue}>
                  {email}
                </Link>
              </View>
            ) : null}
            {linkedinHref ? (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>LinkedIn</Text>
                <Link src={linkedinHref} style={styles.contactValue}>
                  {linkedinHandle ?? "linkedin"}
                </Link>
              </View>
            ) : null}
            {githubHref ? (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>GitHub</Text>
                <Link src={githubHref} style={styles.contactValue}>
                  {githubHandle ?? "github"}
                </Link>
              </View>
            ) : null}
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Web</Text>
              <Link src={siteUrl} style={styles.contactValue}>
                Portfolio online
              </Link>
            </View>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.tagline}>{labels.tagline}</Text>
          <Text style={styles.manifesto}>{labels.manifesto}</Text>
        </View>

        {labels.metrics.length > 0 ? (
          <View style={styles.metricsRow}>
            {labels.metrics.map((metric) => (
              <View key={metric.label} style={styles.metricCell}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionTitle index="02" title={labels.sections.experience} />
          {profile.experience.map((entry) => {
            const data = labels.experienceEntry(entry.id)
            return (
              <View key={entry.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.experienceTimeline}>
                  <Text style={styles.experienceDate}>{data.start}</Text>
                  <Text style={styles.experienceDateEnd}>→ {data.end}</Text>
                </View>
                <View style={styles.experienceBody}>
                  <View style={styles.roleHeader}>
                    <Text style={styles.experienceRole}>{data.role}</Text>
                    <Text style={styles.experienceOrg}>
                      · {entry.organization}
                    </Text>
                  </View>
                  <Text style={styles.experienceMeta}>{data.location}</Text>
                  {data.summary ? (
                    <Text style={styles.experienceSummary}>{data.summary}</Text>
                  ) : null}
                  {data.highlights.map((hl, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletMark}>—</Text>
                      <Text style={styles.bulletText}>{hl}</Text>
                    </View>
                  ))}
                  {entry.stack && entry.stack.length > 0 ? (
                    <View style={styles.stackRow}>
                      {entry.stack.map((tech) => (
                        <Text key={tech} style={styles.stackItem}>
                          {tech}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            )
          })}
        </View>

        <View style={styles.section} wrap={false}>
          <SectionTitle index="03" title={labels.sections.skills} />
          <View style={styles.twoColumn}>
            <View style={styles.columnHalf}>
              {profile.skills
                .filter((_, i) => i % 2 === 0)
                .map((group) => (
                  <SkillGroup
                    key={group.id}
                    title={labels.skillGroupName(group.id)}
                    items={
                      group.id === "practice"
                        ? labels.practiceItems
                        : group.items
                    }
                  />
                ))}
            </View>
            <View style={styles.columnHalf}>
              {profile.skills
                .filter((_, i) => i % 2 === 1)
                .map((group) => (
                  <SkillGroup
                    key={group.id}
                    title={labels.skillGroupName(group.id)}
                    items={
                      group.id === "practice"
                        ? labels.practiceItems
                        : group.items
                    }
                  />
                ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle index="04" title={labels.sections.projects} />
          {profile.projects.map((entry, idx) => {
            const data = labels.projectEntry(entry.id)
            const isLast = idx === profile.projects.length - 1
            return (
              <View
                key={entry.id}
                style={
                  isLast
                    ? [styles.projectItem, styles.projectItemLast]
                    : styles.projectItem
                }
                wrap={false}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{data.name}</Text>
                  {entry.url ? (
                    <Link src={entry.url} style={styles.projectUrl}>
                      {entry.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </Link>
                  ) : null}
                </View>
                <Text style={styles.projectStatus}>{data.status}</Text>
                <Text style={styles.projectSummary}>{data.summary}</Text>
                {entry.stack && entry.stack.length > 0 ? (
                  <View style={styles.stackRow}>
                    {entry.stack.map((tech) => (
                      <Text key={tech} style={styles.stackItem}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>

        <View style={styles.section} wrap={false}>
          <View style={styles.twoColumn}>
            <View style={styles.columnHalf}>
              <SectionTitle index="05" title={labels.sections.education} />
              {profile.education.map((entry) => {
                const data = labels.educationEntry(entry.id)
                return (
                  <View
                    key={entry.id}
                    style={styles.educationItem}
                    wrap={false}
                  >
                    <Text style={styles.educationTitle}>{data.title}</Text>
                    <Text style={styles.educationOrg}>
                      {entry.organization}
                    </Text>
                    <Text style={styles.educationMeta}>
                      {data.dates}
                      {data.location ? ` · ${data.location}` : ""}
                    </Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.columnHalf}>
              <SectionTitle index="06" title={labels.sections.languages} />
              {profile.languages.map((lang) => {
                const data = labels.languageEntry(lang.id)
                return (
                  <View key={lang.id} style={styles.languageItem}>
                    <Text style={styles.languageName}>{data.name}</Text>
                    <Text style={styles.languageLevel}>{data.level}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{labels.footer}</Text>
          <Text style={styles.footerText}>{profile.shortName}</Text>
        </View>
      </Page>
    </Document>
  )
}

function SectionTitle({
  index,
  title,
}: {
  readonly index: string
  readonly title: string
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIndex}>{index}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionRule} />
    </View>
  )
}

function SkillGroup({
  title,
  items,
}: {
  readonly title: string
  readonly items: ReadonlyArray<string>
}) {
  return (
    <View style={styles.skillGroup} wrap={false}>
      <View style={styles.skillGroupHeader}>
        <Text style={styles.skillGroupName}>{title}</Text>
        <Text style={styles.skillGroupCount}>
          {items.length.toString().padStart(2, "0")}
        </Text>
      </View>
      <Text style={styles.skillGroupItems}>{items.join("  ·  ")}</Text>
    </View>
  )
}

export { CvDocument }
export type { CvLabels, CvDocumentProps }

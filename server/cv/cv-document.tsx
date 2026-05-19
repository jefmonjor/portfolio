import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { profile } from "@/lib/profile"

type CvLabels = {
  readonly role: string
  readonly present: string
  readonly tagline: string
  readonly manifesto: string
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
  foreground: "#0a0a0a",
  muted: "#52525b",
  border: "#d4d4d8",
  borderSoft: "#e4e4e7",
} as const

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 44,
    fontSize: 9.5,
    color: palette.foreground,
    backgroundColor: palette.background,
    lineHeight: 1.45,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: palette.foreground,
    paddingBottom: 14,
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: "column",
    gap: 4,
  },
  monoLabel: {
    fontSize: 7.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: palette.muted,
    fontFamily: "Courier",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.4,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  small: {
    fontSize: 8.5,
    color: palette.muted,
  },
  link: {
    fontSize: 8.5,
    color: palette.foreground,
    textDecoration: "none",
  },
  section: {
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionIndex: {
    fontSize: 7.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: palette.muted,
    fontFamily: "Courier",
  },
  sectionRule: {
    flexGrow: 1,
    height: 0,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSoft,
    borderBottomStyle: "dashed",
  },
  paragraph: {
    fontSize: 9.5,
    marginBottom: 4,
  },
  experienceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  experienceDates: {
    width: 78,
    flexShrink: 0,
  },
  experienceDateLine: {
    fontSize: 7.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: palette.muted,
    fontFamily: "Courier",
  },
  experienceBody: {
    flex: 1,
    flexDirection: "column",
    gap: 3,
  },
  experienceRole: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
  },
  experienceOrg: {
    fontSize: 8.5,
    color: palette.muted,
    fontFamily: "Courier",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  bullet: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 9,
    color: palette.muted,
    width: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  badge: {
    fontSize: 7.5,
    fontFamily: "Courier",
    letterSpacing: 0.4,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderWidth: 0.5,
    borderColor: palette.border,
    color: palette.foreground,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 14,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: 8,
  },
  skillBlock: {
    flexDirection: "column",
    gap: 4,
    borderWidth: 0.5,
    borderColor: palette.borderSoft,
    borderStyle: "dashed",
    padding: 8,
  },
  skillGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectBlock: {
    flexDirection: "column",
    gap: 3,
    marginBottom: 8,
  },
  projectName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  educationRow: {
    flexDirection: "column",
    gap: 2,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: palette.muted,
    fontFamily: "Courier",
    letterSpacing: 1,
    textTransform: "uppercase",
    borderTopWidth: 0.5,
    borderTopColor: palette.borderSoft,
    paddingTop: 6,
  },
})

type CvDocumentProps = {
  readonly labels: CvLabels
  readonly generatedOnISO: string
}

function findSocialHref(kind: string): string | undefined {
  return profile.socials.find((s) => s.kind === kind)?.href
}

function findSocialHandle(kind: string): string | undefined {
  return profile.socials.find((s) => s.kind === kind)?.handle
}

function CvDocument({ labels, generatedOnISO }: CvDocumentProps) {
  const email = findSocialHandle("email")
  const emailHref = findSocialHref("email")
  const linkedinHref = findSocialHref("linkedin")

  return (
    <Document
      title={`${profile.shortName} — ${labels.role}`}
      author={profile.name}
      creator="portfolio"
      producer="portfolio"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.monoLabel}>{labels.sections.profile}</Text>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.small}>
              {labels.role} · {profile.location}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {email && emailHref ? (
              <Link src={emailHref} style={styles.link}>
                {email}
              </Link>
            ) : null}
            {linkedinHref ? (
              <Link src={linkedinHref} style={styles.link}>
                linkedin.com/in/{linkedinHref.split("/").pop()}
              </Link>
            ) : null}
            <Text style={styles.small}>{profile.timezone}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>{labels.tagline}</Text>
        <Text style={[styles.paragraph, { color: palette.muted }]}>
          {labels.manifesto}
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIndex}>02 · {labels.sections.experience}</Text>
            <View style={styles.sectionRule} />
          </View>
          {profile.experience.map((entry) => {
            const data = labels.experienceEntry(entry.id)
            return (
              <View key={entry.id} style={styles.experienceRow} wrap={false}>
                <View style={styles.experienceDates}>
                  <Text style={styles.experienceDateLine}>{data.start}</Text>
                  <Text style={styles.experienceDateLine}>→ {data.end}</Text>
                </View>
                <View style={styles.experienceBody}>
                  <Text style={styles.experienceRole}>{data.role}</Text>
                  <Text style={styles.experienceOrg}>
                    {entry.organization} · {data.location}
                  </Text>
                  {data.summary ? (
                    <Text style={styles.paragraph}>{data.summary}</Text>
                  ) : null}
                  {data.highlights.map((hl, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>—</Text>
                      <Text style={styles.bulletText}>{hl}</Text>
                    </View>
                  ))}
                  {entry.stack && entry.stack.length > 0 ? (
                    <View style={styles.badgesRow}>
                      {entry.stack.map((tech) => (
                        <Text key={tech} style={styles.badge}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIndex}>03 · {labels.sections.skills}</Text>
            <View style={styles.sectionRule} />
          </View>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {profile.skills
                .filter((_, i) => i % 2 === 0)
                .map((group) => (
                  <SkillBlock
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
            <View style={styles.column}>
              {profile.skills
                .filter((_, i) => i % 2 === 1)
                .map((group) => (
                  <SkillBlock
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIndex}>04 · {labels.sections.projects}</Text>
            <View style={styles.sectionRule} />
          </View>
          {profile.projects.map((entry) => {
            const data = labels.projectEntry(entry.id)
            return (
              <View key={entry.id} style={styles.projectBlock} wrap={false}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 6,
                  }}
                >
                  <Text style={styles.projectName}>{data.name}</Text>
                  {entry.url ? (
                    <Link src={entry.url} style={styles.experienceOrg}>
                      {entry.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </Link>
                  ) : null}
                </View>
                <Text style={styles.paragraph}>{data.summary}</Text>
                {entry.stack && entry.stack.length > 0 ? (
                  <View style={styles.badgesRow}>
                    {entry.stack.map((tech) => (
                      <Text key={tech} style={styles.badge}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIndex}>
                  05 · {labels.sections.education}
                </Text>
                <View style={styles.sectionRule} />
              </View>
              {profile.education.map((entry) => {
                const data = labels.educationEntry(entry.id)
                return (
                  <View key={entry.id} style={styles.educationRow} wrap={false}>
                    <Text style={styles.experienceRole}>{data.title}</Text>
                    <Text style={styles.experienceOrg}>
                      {entry.organization}
                    </Text>
                    <Text style={styles.small}>
                      {data.dates}
                      {data.location ? ` · ${data.location}` : ""}
                    </Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.column}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIndex}>
                  06 · {labels.sections.languages}
                </Text>
                <View style={styles.sectionRule} />
              </View>
              {profile.languages.map((lang) => {
                const data = labels.languageEntry(lang.id)
                return (
                  <View key={lang.id} style={styles.educationRow}>
                    <Text style={styles.experienceRole}>{data.name}</Text>
                    <Text style={styles.experienceOrg}>{data.level}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{profile.name}</Text>
          <Text>{labels.footer.replace("{date}", generatedOnISO)}</Text>
        </View>
      </Page>
    </Document>
  )
}

function SkillBlock({
  title,
  items,
}: {
  readonly title: string
  readonly items: ReadonlyArray<string>
}) {
  return (
    <View style={styles.skillBlock} wrap={false}>
      <View style={styles.skillGroupHeader}>
        <Text style={styles.monoLabel}>{title}</Text>
        <Text style={styles.monoLabel}>
          {items.length.toString().padStart(2, "0")}
        </Text>
      </View>
      <View style={styles.badgesRow}>
        {items.map((item) => (
          <Text key={item} style={styles.badge}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  )
}

export { CvDocument }
export type { CvLabels, CvDocumentProps }

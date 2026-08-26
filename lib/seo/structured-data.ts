import { routing, type Locale } from "@/i18n/routing"
import { portfolioUpdatedAt, profile, siteUrl } from "@/lib/profile"

type ProfileStructuredDataInput = {
  locale: Locale
  title: string
  description: string
  currentJobTitle: string
  publicProjects: ReadonlyArray<{
    id: string
    name: string
    description: string
    url: string
    keywords: ReadonlyArray<string>
    codeRepository?: string
  }>
}

export function buildProfileStructuredData({
  locale,
  title,
  description,
  currentJobTitle,
  publicProjects,
}: ProfileStructuredDataInput) {
  const canonicalUrl = `${siteUrl}/${locale}`
  const personId = `${siteUrl}/#person`
  const websiteId = `${siteUrl}/#website`
  const imageUrl = `${siteUrl}/me.webp`
  const sameAs = profile.socials
    .filter((social) => social.kind !== "email")
    .map((social) => social.href)
  const knowsAbout = Array.from(
    new Set([
      ...profile.focus,
      ...profile.skills
        .filter((group) => group.id !== "practice")
        .flatMap((group) => group.items),
    ])
  )
  const currentOrganization = profile.experience.find(
    (entry) => entry.endISO === "present"
  )?.organization
  const projectNodes = publicProjects.map((project) => ({
    "@type": "CreativeWork",
    "@id": `${siteUrl}/#project-${project.id}`,
    name: project.name,
    description: project.description,
    url: project.url,
    creator: { "@id": personId },
    keywords: project.keywords,
    ...(project.codeRepository
      ? { codeRepository: project.codeRepository }
      : {}),
  }))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: `${profile.shortName} — Portfolio`,
        inLanguage: routing.locales,
        author: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#profile-page`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: locale,
        dateModified: portfolioUpdatedAt,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        hasPart: projectNodes.map((project) => ({ "@id": project["@id"] })),
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: "jefmonjor",
        url: canonicalUrl,
        mainEntityOfPage: { "@id": `${canonicalUrl}#profile-page` },
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 940,
          height: 1175,
        },
        description,
        jobTitle: currentJobTitle,
        homeLocation: {
          "@type": "Place",
          name: profile.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Andorra la Vella",
            addressCountry: "AD",
          },
        },
        ...(currentOrganization
          ? {
              worksFor: {
                "@type": "Organization",
                name: currentOrganization,
              },
            }
          : {}),
        knowsAbout,
        // Spells out the professional role for agents that read the graph
        // instead of the prose: what he does, under which standard category.
        hasOccupation: {
          "@type": "Occupation",
          name: currentJobTitle,
          occupationalCategory: "15-1252.00 Software Developers",
          skills: profile.focus.join(", "),
          occupationLocation: {
            "@type": "Place",
            name: profile.location,
          },
        },
        knowsLanguage: [
          {
            "@type": "Language",
            name: "Spanish",
            alternateName: "es",
          },
          {
            "@type": "Language",
            name: "English",
            alternateName: "en",
          },
        ],
        // Only academic institutions belong here: the SMPC certification body
        // is published as a credential, not as an alma mater.
        alumniOf: profile.education
          .filter((entry) => entry.kind === "degree")
          .map((entry) => ({
            "@type": "EducationalOrganization",
            name: entry.organization,
          })),
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: "Scrum Master Professional Certified (SMPC)",
          credentialCategory: "certification",
        },
        sameAs,
      },
      ...projectNodes,
    ],
  }
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c")
}

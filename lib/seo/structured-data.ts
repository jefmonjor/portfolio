import { routing, type Locale } from "@/i18n/routing"
import {
  portfolioUpdatedAt,
  profile,
  publicProfiles,
  siteUrl,
} from "@/lib/profile"

export const personId = `${siteUrl}/#person`
const websiteId = `${siteUrl}/#website`

type PersonInput = {
  positioning: string
  currentJobTitle: string
  description: string
}

type PublicProject = {
  id: string
  name: string
  description: string
  url: string
  keywords: ReadonlyArray<string>
  codeRepository?: string
}

type CvStructuredDataInput = PersonInput & {
  locale: Locale
  pageUrl: string
  title: string
  publicProjects: ReadonlyArray<PublicProject>
}

export type Breadcrumb = {
  name: string
  url: string
}

function topicsKnown(): string[] {
  const practiced = profile.skills
    .filter((group) => group.id !== "practice")
    .flatMap((group) => group.items)
  return Array.from(new Set([...profile.focus, ...practiced]))
}

function completedDegrees() {
  return profile.education
    .filter((entry) => entry.kind === "degree" && entry.completed)
    .map((entry) => ({
      "@type": "EducationalOrganization",
      name: entry.organization,
    }))
}

function currentEmployer() {
  const organization = profile.experience.find(
    (entry) => entry.endISO === "present"
  )?.organization
  return organization
    ? { worksFor: { "@type": "Organization", name: organization } }
    : {}
}

function personNode({
  positioning,
  currentJobTitle,
  description,
}: PersonInput) {
  const alumniOf = completedDegrees()

  return {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    alternateName: "jefmonjor",
    url: siteUrl,
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/me.webp`,
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
    ...currentEmployer(),
    knowsAbout: topicsKnown(),
    hasOccupation: {
      "@type": "Occupation",
      name: positioning,
      occupationalCategory: "15-1252.00 Software Developers",
      skills: profile.focus.join(", "),
      occupationLocation: { "@type": "Place", name: profile.location },
    },
    knowsLanguage: [
      { "@type": "Language", name: "Spanish", alternateName: "es" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    ...(alumniOf.length > 0 ? { alumniOf } : {}),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "Scrum Master Professional Certified (SMPC)",
      credentialCategory: "certification",
    },
    sameAs: publicProfiles.map((link) => link.href),
  }
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: profile.shortName,
    inLanguage: routing.locales,
    author: { "@id": personId },
  }
}

export function buildBreadcrumbList(trail: ReadonlyArray<Breadcrumb>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function buildSiteStructuredData(person: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(), personNode(person)],
  }
}

export function buildCvStructuredData({
  locale,
  pageUrl,
  title,
  publicProjects,
  ...person
}: CvStructuredDataInput) {
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
      websiteNode(),
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile-page`,
        url: pageUrl,
        name: title,
        description: person.description,
        inLanguage: locale,
        dateModified: portfolioUpdatedAt,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
        hasPart: projectNodes.map((project) => ({ "@id": project["@id"] })),
      },
      personNode(person),
      ...projectNodes,
    ],
  }
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(" ", "\\u2028")
    .replaceAll(" ", "\\u2029")
}

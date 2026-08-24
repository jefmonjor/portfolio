import { routing, type Locale } from "@/i18n/routing"
import { portfolioUpdatedAt, profile, siteUrl } from "@/lib/profile"

type ProfileStructuredDataInput = {
  locale: Locale
  title: string
  description: string
  role: string
}

export function buildProfileStructuredData({
  locale,
  title,
  description,
  role,
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
        jobTitle: role,
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
        sameAs,
      },
    ],
  }
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c")
}

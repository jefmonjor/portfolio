import Link from "next/link"

import type { SiteContent } from "@/content/site/types"
import { BrandLink } from "@/components/site/brand-link"
import { LanguageLink } from "@/components/site/language-link"
import { primaryNavigation } from "@/components/site/site-nav"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import type { SocialKind } from "@/types/profile"

const profileNames: Record<Exclude<SocialKind, "email">, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
}

const publicProfiles = profile.socials.flatMap((social) =>
  social.kind === "email"
    ? []
    : [{ href: social.href, name: profileNames[social.kind] }]
)

type SiteFooterProps = {
  locale: SiteLocale
  content: SiteContent
}

function SiteFooter({ locale, content }: SiteFooterProps) {
  const footerLinks = [
    ...primaryNavigation(content.nav),
    { path: "/cv" as const, label: content.footer.fullCv },
  ]

  return (
    <footer className="mt-24 border-t border-border">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <BrandLink
            href={localizedPath(locale, "/")}
            name={content.siteName}
          />
          <p className="text-[0.9375rem] text-muted-foreground">
            {content.hero.role}
          </p>
          <p className="text-[0.9375rem] text-muted-foreground">
            {content.footer.location}
          </p>
        </div>

        <nav aria-label={content.nav.label}>
          <ul className="flex flex-col">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={localizedPath(locale, link.path)}
                  className="inline-flex min-h-11 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col">
          {publicProfiles.map((social) => (
            <a
              key={social.href}
              href={social.href}
              rel="me noopener noreferrer"
              target="_blank"
              className="inline-flex min-h-11 items-center text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {social.name}
            </a>
          ))}
          <LanguageLink current={locale} className="text-[0.9375rem]" />
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }

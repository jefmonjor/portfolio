import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import type { SiteContent } from "@/content/site/types"
import { LanguageLink } from "@/components/site/language-link"
import { StatusBadge } from "@/components/site/status-badge"
import { primaryNavigation } from "@/components/site/site-nav"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile, publicProfiles } from "@/lib/profile"

type SiteFooterProps = {
  locale: SiteLocale
  content: SiteContent
}

function SiteFooter({ locale, content }: SiteFooterProps) {
  const footerLinks = [
    ...primaryNavigation(content.nav),
    { path: "/cv" as const, label: content.footer.fullCv },
    { path: "/privacy" as const, label: content.footer.privacy },
  ]

  return (
    <footer className="mt-24 border-t border-stroke-soft-200">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-2">
          <p className="text-paragraph-sm text-text-strong-950">
            {content.hero.role}
          </p>
          <p className="text-paragraph-sm text-text-sub-600">
            {content.footer.location}
          </p>
          <div className="mt-3">
            <StatusBadge>{content.hero.availability.status}</StatusBadge>
          </div>
        </div>

        <nav aria-label={content.nav.label}>
          <ul className="flex flex-col">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={localizedPath(locale, link.path)}
                  prefetch={link.path === "/cv" ? false : undefined}
                  className="inline-flex min-h-11 items-center text-paragraph-sm text-text-sub-600 transition-colors hover:text-text-strong-950"
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
              className="inline-flex min-h-11 items-center text-paragraph-sm text-text-sub-600 transition-colors hover:text-text-strong-950"
            >
              {social.name}
            </a>
          ))}
          <LanguageLink current={locale} variant="footer" />
        </div>
      </div>
      <div className="site-container">
        <Link
          href={localizedPath(locale, "/")}
          className="footer-wordmark block font-heading text-text-strong-950"
        >
          {profile.shortName}
        </Link>
      </div>
      <div className="site-container flex flex-wrap items-center justify-between gap-4 border-t border-stroke-soft-200 py-6 text-paragraph-sm text-text-sub-600">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a
          href="#main"
          className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-text-strong-950"
        >
          {content.footer.backToTop}
          <HugeiconsIcon
            icon={ArrowUp02Icon}
            aria-hidden
            className="size-4"
            strokeWidth={1.75}
          />
        </a>
      </div>
    </footer>
  )
}

export { SiteFooter }

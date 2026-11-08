import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import type { SiteContent } from "@/content/site/types"
import { LanguageLink } from "@/components/site/language-link"
import { primaryNavigation } from "@/components/site/site-nav"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile, publicProfiles } from "@/lib/profile"

type SiteFooterProps = {
  locale: SiteLocale
  content: SiteContent
}

const linkClass =
  "inline-flex min-h-11 items-center text-paragraph-sm text-text-sub-600 transition-colors hover:text-text-strong-950"

function SiteFooter({ locale, content }: SiteFooterProps) {
  const footerLinks = [
    ...primaryNavigation(content.nav),
    { path: "/privacy" as const, label: content.footer.privacy },
  ]

  return (
    <footer className="mt-8 border-t border-stroke-soft-200">
      <div className="site-container grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        <div className="flex flex-col gap-1">
          <Link
            href={localizedPath(locale, "/")}
            className="self-start font-heading text-title-h5 text-text-strong-950"
          >
            {profile.shortName}
          </Link>
          <p className="text-paragraph-sm text-text-sub-600">
            {content.hero.role}
          </p>
          <p className="text-paragraph-sm text-text-sub-600">
            {content.footer.location}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label={content.nav.label}>
            <ul className="grid grid-cols-3 gap-x-6 sm:flex sm:flex-wrap sm:gap-x-6 md:justify-end">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={localizedPath(locale, link.path)}
                    prefetch={link.path === "/cv" ? false : undefined}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap items-center gap-x-6">
            {publicProfiles.map((social) => (
              <a
                key={social.href}
                href={social.href}
                rel="me noopener noreferrer"
                target="_blank"
                className={linkClass}
              >
                {social.name}
              </a>
            ))}
            <LanguageLink current={locale} variant="footer" />
          </div>
        </div>
      </div>

      {/* The floating assistant button sits bottom-right, so this row keeps
          to the left and, on phones, leaves room below it. */}
      <div className="site-container flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-stroke-soft-200 pt-4 pb-24 text-paragraph-sm text-text-sub-600 sm:pb-4">
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

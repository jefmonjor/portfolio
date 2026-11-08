import Link from "next/link"

import type { SiteContent } from "@/content/site/types"
import { SkipToContent } from "@/components/skip-to-content"
import { BrandLink } from "@/components/site/brand-link"
import { LanguageLink } from "@/components/site/language-link"
import { MobileMenu } from "@/components/site/mobile-menu"
import { NavLink } from "@/components/site/nav-link"
import { primaryNavigation } from "@/components/site/site-nav"
import { ThemeSwitch } from "@/components/site/theme-switch"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

type SiteHeaderProps = {
  locale: SiteLocale
  content: SiteContent
}

function SiteHeader({ locale, content }: SiteHeaderProps) {
  const links = primaryNavigation(content.nav).map((item) => ({
    ...item,
    href: localizedPath(locale, item.path),
  }))
  const contactHref = localizedPath(locale, "/contact")

  return (
    <header className="site-header sticky top-0 z-40">
      <SkipToContent label={content.nav.skipToContent} />
      <div className="site-container relative flex h-16 items-center justify-between gap-6">
        <BrandLink href={localizedPath(locale, "/")} name={profile.shortName} />

        <nav aria-label={content.nav.label} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <LanguageLink current={locale} />
          <ThemeSwitch label={content.nav.toggleTheme} />
          <Link
            href={contactHref}
            className="site-button ml-2 hidden min-h-9 px-3.5 text-label-sm wide:inline-flex"
          >
            {content.cta}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageLink current={locale} variant="short" />
          <MobileMenu label={content.nav.menu}>
            <nav aria-label={content.nav.label} className="site-container py-6">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li
                    key={link.path}
                    className="border-b border-stroke-soft-200 last:border-b-0"
                  >
                    <NavLink href={link.href} variant="menu">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link
                href={contactHref}
                className="site-button mt-8 min-h-12 w-full"
              >
                {content.cta}
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <LanguageLink current={locale} />
                <ThemeSwitch label={content.nav.toggleTheme} />
              </div>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }

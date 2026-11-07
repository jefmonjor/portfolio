import Link from "next/link"

import type { SiteContent } from "@/content/site/types"
import { BrandLink } from "@/components/site/brand-link"
import { LanguageLink } from "@/components/site/language-link"
import { MobileMenu } from "@/components/site/mobile-menu"
import { NavLink } from "@/components/site/nav-link"
import { primaryNavigation } from "@/components/site/site-nav"
import { ThemeSwitch } from "@/components/site/theme-switch"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

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
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
      <a href="#main" className="site-skip-link">
        {content.nav.skipToContent}
      </a>
      <div className="site-container relative flex h-16 items-center justify-between gap-6">
        <BrandLink href={localizedPath(locale, "/")} name={content.siteName} />

        <nav aria-label={content.nav.label} className="hidden md:block">
          <ul className="flex items-center gap-6 text-[0.9375rem]">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageLink current={locale} />
          <ThemeSwitch label={content.nav.toggleTheme} />
          <Link
            href={contactHref}
            className="site-button hidden min-h-10 px-4 text-[0.9375rem] wide:inline-flex"
          >
            {content.cta}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageLink current={locale} short />
          <MobileMenu label={content.nav.menu}>
            <nav aria-label={content.nav.label} className="site-container py-3">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li
                    key={link.path}
                    className="border-b border-border last:border-b-0"
                  >
                    <NavLink
                      href={link.href}
                      className="min-h-12 w-full text-lg"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link href={contactHref} className="site-button mt-4 w-full">
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

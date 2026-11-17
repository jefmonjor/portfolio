import {
  Briefcase01Icon,
  File02Icon,
  Home01Icon,
  Layers01Icon,
  Mail01Icon,
  WorkHistoryIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Link from "next/link"

import { SkipToContent } from "@/components/skip-to-content"
import { ArrowLabel } from "@/components/site/arrow-label"
import { BrandLink } from "@/components/site/brand-link"
import { LanguageLink } from "@/components/site/language-link"
import { NavLink } from "@/components/site/nav-link"
import { primaryNavigation } from "@/components/site/site-nav"
import { TerminalButton } from "@/components/site/terminal-button"
import { ThemeSwitch } from "@/components/site/theme-switch"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

type SiteRailProps = {
  locale: SiteLocale
  content: SiteContent
  homeHref: string
}

const railIcons: Record<string, IconSvgElement> = {
  "/services": Layers01Icon,
  "/work": Briefcase01Icon,
  "/experience": WorkHistoryIcon,
  "/cv": File02Icon,
  "/contact": Mail01Icon,
}

/** Wide screens only: name, navigation, the one action and availability, always in view. */
function SiteRail({ locale, content, homeHref }: SiteRailProps) {
  const links = [
    { href: homeHref, label: content.nav.home, icon: Home01Icon },
    ...primaryNavigation(content.nav).map((item) => ({
      href: localizedPath(locale, item.path),
      label: item.label,
      icon: railIcons[item.path],
      prefetch: item.path === "/cv" ? (false as const) : undefined,
    })),
  ]

  return (
    <header className="site-rail">
      <SkipToContent label={content.nav.skipToContent} />
      <BrandLink href={homeHref} name={profile.shortName} />
      <p className="pl-[1.125rem] text-paragraph-sm text-text-sub-600">
        {content.hero.role}
      </p>

      <nav aria-label={content.nav.label} className="mt-8">
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                href={link.href}
                variant="rail"
                prefetch={"prefetch" in link ? link.prefetch : undefined}
              >
                {link.icon ? (
                  <HugeiconsIcon
                    icon={link.icon}
                    aria-hidden
                    className="size-[18px] shrink-0"
                    strokeWidth={1.5}
                  />
                ) : null}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 flex flex-col gap-4 border-t border-stroke-soft-200 pt-6">
        <Link
          href={localizedPath(locale, "/contact")}
          className="group/arrow site-button min-h-11 w-full"
        >
          <ArrowLabel>{content.cta}</ArrowLabel>
        </Link>
        <p className="status-line text-paragraph-sm text-text-sub-600">
          {content.hero.engagement}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-5 pt-8">
        <div className="-ml-2 flex items-center gap-1">
          <LanguageLink current={locale} />
          <TerminalButton label={content.console.terminal.open} />
          <ThemeSwitch label={content.nav.toggleTheme} />
        </div>
        <div className="border-t border-stroke-soft-200 pt-5">
          <p className="text-paragraph-sm text-text-sub-600">
            {content.credentials.label}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
            {content.credentials.companies.map((company) => (
              <li
                key={company}
                className="font-heading text-label-md text-text-strong-950"
              >
                {company}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}

export { SiteRail }

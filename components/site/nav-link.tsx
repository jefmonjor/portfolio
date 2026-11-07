"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { withoutLocalePrefix } from "@/i18n/locales"

const variantClasses = {
  bar: "relative h-9 rounded-10 px-3 text-label-sm text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950 aria-[current=page]:text-text-strong-950 after:absolute after:inset-x-3 after:-bottom-3.5 after:h-0.5 after:rounded-full after:bg-primary-stroke after:opacity-0 aria-[current=page]:after:opacity-100",
  menu: "min-h-16 w-full gap-3 text-title-h5 text-text-sub-600 aria-[current=page]:text-text-strong-950 before:size-1.5 before:rounded-full before:bg-primary-stroke before:opacity-0 aria-[current=page]:before:opacity-100",
} as const

type NavLinkProps = {
  href: string
  children: React.ReactNode
  variant?: keyof typeof variantClasses
}

function isWithinSection(pathname: string, href: string): boolean {
  const current = withoutLocalePrefix(pathname)
  const section = withoutLocalePrefix(href)
  return current === section || current.startsWith(`${section}/`)
}

function NavLink({ href, children, variant = "bar" }: NavLinkProps) {
  const isCurrent = isWithinSection(usePathname(), href)

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={`inline-flex items-center transition-colors ${variantClasses[variant]}`}
    >
      {children}
    </Link>
  )
}

export { NavLink }

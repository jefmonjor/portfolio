"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { withoutLocalePrefix } from "@/i18n/locales"

const variantClasses = {
  bar: "min-h-11 text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground",
  menu: "min-h-16 w-full font-heading text-[1.75rem] tracking-[-0.01em] text-foreground",
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

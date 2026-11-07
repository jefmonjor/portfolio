"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { withoutLocalePrefix } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

function isWithinSection(pathname: string, href: string): boolean {
  const current = withoutLocalePrefix(pathname)
  const section = withoutLocalePrefix(href)
  return current === section || current.startsWith(`${section}/`)
}

function NavLink({ href, children, className }: NavLinkProps) {
  const isCurrent = isWithinSection(usePathname(), href)

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  )
}

export { NavLink }

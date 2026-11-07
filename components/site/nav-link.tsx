"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

function isWithinSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
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

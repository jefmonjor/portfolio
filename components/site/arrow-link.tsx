import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"

type ArrowLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: false
}

function ArrowLink({
  href,
  children,
  className = "",
  prefetch,
}: ArrowLinkProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`group/arrow site-link inline-flex min-h-11 items-center text-label-md ${className}`}
    >
      <ArrowLabel>{children}</ArrowLabel>
    </Link>
  )
}

export { ArrowLink }

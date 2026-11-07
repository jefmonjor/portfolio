import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type ContactButtonProps = {
  locale: SiteLocale
  label: string
  className?: string
}

function ContactButton({ locale, label, className = "" }: ContactButtonProps) {
  return (
    <Link
      href={localizedPath(locale, "/contact")}
      className={`group/arrow site-button w-full sm:w-auto ${className}`}
    >
      <ArrowLabel>{label}</ArrowLabel>
    </Link>
  )
}

export { ContactButton }

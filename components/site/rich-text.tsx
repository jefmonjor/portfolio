import Link from "next/link"

import type { RichText as RichTextContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type RichTextProps = {
  locale: SiteLocale
  content: RichTextContent
}

function RichText({ locale, content }: RichTextProps) {
  return content.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <Link
        key={index}
        href={localizedPath(locale, part.href)}
        className="site-link"
      >
        {part.text}
      </Link>
    )
  )
}

export { RichText }

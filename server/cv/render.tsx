import { renderToBuffer } from "@react-pdf/renderer"

import type { Locale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import { CvTechnicalDocument } from "@/server/cv/cv-ats-document"
import { CvDocument, type CvLabels } from "@/server/cv/cv-document"
import type { CvTailoredContent } from "@/types/cv-tailor"

type CvRenderOptions =
  | {
      readonly variant: "general"
      readonly labels: CvLabels
    }
  | {
      readonly variant: "technical"
      readonly labels: CvLabels
      readonly locale: Locale
      readonly tailored?: CvTailoredContent
    }

export async function renderCvPdf(options: CvRenderOptions): Promise<Buffer> {
  return renderToBuffer(
    options.variant === "general" ? (
      <CvDocument labels={options.labels} />
    ) : (
      <CvTechnicalDocument
        labels={options.labels}
        locale={options.locale}
        tailored={options.tailored}
      />
    )
  )
}

// The tailored CV is the one that gets sent to the company behind the offer,
// so it travels as a plain CV: nothing in the file name — or in the document
// title — announces that it was generated for their posting. The other two
// are downloaded by hand and keep their variant to tell them apart.
export function cvFilename(
  variant: "General" | "Technical" | "Tailored",
  locale: Locale
): string {
  const suffix = variant === "Tailored" ? "" : `_${variant}`
  return `${profile.shortName.replace(/\s+/g, "_")}_CV${suffix}_${locale.toUpperCase()}.pdf`
}

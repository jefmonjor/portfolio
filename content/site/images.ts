import type { StaticImageData } from "next/image"

import type { CaseStudySlug } from "@/content/site/types"
import portrait from "@/public/images/site/portrait.jpg"
import ilnami from "@/public/images/work/ilnami.jpg"
import othertwist from "@/public/images/work/othertwist.jpg"
import transolido from "@/public/images/work/transolido.jpg"

type Screenshot = { image: StaticImageData; host: string }

export const portraitPhoto = portrait

/** Public pages of the products as they are live today; the bank case has none. */
export const caseScreenshots: Partial<Record<CaseStudySlug, Screenshot>> = {
  "transolido-verifactu-invoicing": {
    image: transolido,
    host: "transolido.com",
  },
  "othertwist-offline-writing": { image: othertwist, host: "othertwist.com" },
  "ilnami-private-by-design": { image: ilnami, host: "ilnami.com" },
}

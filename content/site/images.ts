import type { StaticImageData } from "next/image"

import type { CaseStudySlug } from "@/content/site/types"
import contactqr from "@/public/images/work/contactqr.jpg"
import corte1d from "@/public/images/work/corte1d.jpg"
import ilnami from "@/public/images/work/ilnami.jpg"
import othertwist from "@/public/images/work/othertwist.jpg"
import pronoq from "@/public/images/work/pronoq.jpg"
import transolido from "@/public/images/work/transolido.jpg"

type Screenshot = { image: StaticImageData; host: string }

/** Public pages of the products as they are live today; the bank case has none. */
export const caseScreenshots: Partial<Record<CaseStudySlug, Screenshot>> = {
  "transolido-verifactu-invoicing": {
    image: transolido,
    host: "transolido.com",
  },
  "othertwist-offline-writing": { image: othertwist, host: "othertwist.com" },
  "ilnami-private-by-design": { image: ilnami, host: "ilnami.com" },
}

/** Public pages of the smaller live products, keyed by their id in `siteProducts`. */
export const productScreenshots: Readonly<Record<string, StaticImageData>> = {
  pronoq,
  corte1d,
  contactqr,
}

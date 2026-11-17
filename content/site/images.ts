import type { StaticImageData } from "next/image"

import type { CaseStudySlug } from "@/content/site/types"
import contactqr from "@/public/images/work/contactqr.jpg"
import corte1d from "@/public/images/work/corte1d.jpg"
import ilnami from "@/public/images/work/ilnami.jpg"
import othertwist from "@/public/images/work/othertwist.jpg"
import pronoq from "@/public/images/work/pronoq.jpg"
import specforge from "@/public/images/work/specforge.jpg"
import transolido from "@/public/images/work/transolido.jpg"
import transolidoSignIn from "@/public/images/work/transolido-sign-in.jpg"

export type Screenshot = {
  image: StaticImageData
  host: string
  /** Rows from the top to show, when the capture's last rows cut a section in half. */
  visibleHeight?: number
}

/** Public pages of the products as they are live today; the bank case has none. */
export const caseScreenshots: Partial<Record<CaseStudySlug, Screenshot>> = {
  "transolido-verifactu-invoicing": {
    image: transolido,
    host: "transolido.com",
  },
  "othertwist-offline-writing": { image: othertwist, host: "othertwist.com" },
  "ilnami-private-by-design": { image: ilnami, host: "ilnami.com" },
}

/**
 * Public pages of the smaller live products, keyed by their id in
 * `siteProducts`, in the order the home lists them: SpecForge first, because
 * it is the proof of AI work with verification.
 */
export const productScreenshots: Readonly<Record<string, StaticImageData>> = {
  specforge,
  pronoq,
  corte1d,
  contactqr,
}

/** The wall frames two captures its own way: Transolido's sign-in from closer, Ilnami down to the end of its first section. */
export const wallScreenshots: Partial<Record<CaseStudySlug, Screenshot>> = {
  "transolido-verifactu-invoicing": {
    image: transolidoSignIn,
    host: "transolido.com",
  },
  "ilnami-private-by-design": {
    image: ilnami,
    host: "ilnami.com",
    visibleHeight: 756,
  },
}

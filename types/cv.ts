import { z } from "zod"

import { CV_PDF_VARIANTS } from "@/lib/cv-pdf"

export const cvPdfVariantSchema = z.preprocess(
  (value) =>
    value === "technical" || value === "ats" ? "technical" : "general",
  z.enum(CV_PDF_VARIANTS)
)

export type CvPdfVariant = z.infer<typeof cvPdfVariantSchema>

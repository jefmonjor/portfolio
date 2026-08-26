import { z } from "zod"

export const cvPdfVariantSchema = z.preprocess(
  (value) => {
    if (value === "technical" || value === "ats") return "technical"
    if (value === "general" || value === "full" || value == null)
      return "general"
    return "general"
  },
  z.enum(["general", "technical"])
)

export type CvPdfVariant = z.infer<typeof cvPdfVariantSchema>

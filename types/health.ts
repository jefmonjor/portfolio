import { z } from "zod"

export const healthStatusSchema = z.object({
  ok: z.literal(true),
  service: z.literal("portfolio"),
})

export type HealthStatus = z.infer<typeof healthStatusSchema>

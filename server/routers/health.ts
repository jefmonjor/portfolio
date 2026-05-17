import { publicProcedure, router } from "@/server/trpc"
import { healthStatusSchema } from "@/types/health"

export const healthRouter = router({
  status: publicProcedure.output(healthStatusSchema).query(() => ({
    ok: true,
    service: "portfolio",
  })),
})

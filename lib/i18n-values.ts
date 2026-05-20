import { z } from "zod"

const stringArraySchema = z.array(z.string())

export function parseStringArray(value: unknown): ReadonlyArray<string> {
  return stringArraySchema.parse(value)
}

import { z } from "zod"

const stringSchema = z.string()
const stringArraySchema = z.array(z.string())

export function parseString(value: unknown): string {
  return stringSchema.parse(value)
}

export function parseStringArray(value: unknown): ReadonlyArray<string> {
  return stringArraySchema.parse(value)
}

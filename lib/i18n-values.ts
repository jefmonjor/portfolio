export function parseString(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Expected a translated string")
  }
  return value
}

export function parseStringArray(value: unknown): ReadonlyArray<string> {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new TypeError("Expected a list of translated strings")
  }
  return value
}

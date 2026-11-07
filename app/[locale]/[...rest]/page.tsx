import { notFound } from "next/navigation"

export default function LocalizedNotFoundForUnknownPaths(): never {
  notFound()
}

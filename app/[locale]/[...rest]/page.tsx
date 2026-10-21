import { notFound } from "next/navigation"

// Unknown paths under a locale ("/es/nope") would otherwise fall through to
// Next's generic English 404. Matching them here renders the localized
// not-found page inside the locale layout, with a real 404 status.
export default function CatchAllPage(): never {
  notFound()
}

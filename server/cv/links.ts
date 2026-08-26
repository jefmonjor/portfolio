import { siteUrl, siteUrlShort } from "@/lib/profile"

// Printed documents are read on paper and pasted by hand, so links use the
// short apex form (it redirects to the canonical host) and drop the scheme,
// the `www.` prefix and any trailing slash from the visible label.

export function cvLinkHref(url: string): string {
  return url.startsWith(siteUrl)
    ? `${siteUrlShort}${url.slice(siteUrl.length)}`
    : url
}

export function cvLinkLabel(url: string): string {
  return cvLinkHref(url)
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "")
}

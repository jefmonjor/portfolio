import { siteUrl, siteUrlShort } from "@/lib/profile"

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

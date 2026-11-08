import type { SiteContent, SitePath } from "@/content/site/types"

type NavItem = {
  path: SitePath
  label: string
}

export function primaryNavigation(
  nav: SiteContent["nav"]
): ReadonlyArray<NavItem> {
  return [
    { path: "/services", label: nav.services },
    { path: "/work", label: nav.work },
    { path: "/experience", label: nav.experience },
    { path: "/cv", label: nav.cv },
    { path: "/contact", label: nav.contact },
  ]
}

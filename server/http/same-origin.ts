const trustedFetchSites = new Set(["same-origin", "none"])

function originHost(origin: string): string | null {
  try {
    return new URL(origin).host
  } catch {
    return null
  }
}

export function isCrossSiteRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite) return !trustedFetchSites.has(fetchSite)

  const origin = request.headers.get("origin")
  if (!origin) return false
  return originHost(origin) !== request.headers.get("host")
}

export function isJsonRequest(request: Request): boolean {
  return (
    request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json") ?? false
  )
}

export function rejectForeignRequest(request: Request): Response | null {
  if (isCrossSiteRequest(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }
  if (!isJsonRequest(request)) {
    return Response.json({ error: "unsupported_media_type" }, { status: 415 })
  }
  return null
}

import type { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

const handleI18nRouting = createMiddleware(routing)

export default function proxy(request: NextRequest): NextResponse {
  const response = handleI18nRouting(request)

  // `/` resolves a locale from the visitor's headers and cookie, so the answer
  // differs per visitor. Without these a shared cache can pin one language's
  // redirect for everyone, crawlers included. Appended, never set: next-intl
  // already varies on the RSC headers the router depends on.
  response.headers.append("Vary", "Accept-Language")
  response.headers.append("Vary", "Cookie")
  if (response.status >= 300 && response.status < 400) {
    response.headers.set("Cache-Control", "no-store")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}

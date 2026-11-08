export const dynamic = "force-dynamic"

export function GET(): Response {
  return Response.json(
    { ok: true, service: "portfolio" },
    { headers: { "Cache-Control": "no-store" } }
  )
}

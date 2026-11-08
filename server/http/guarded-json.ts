import { readJsonBody } from "@/server/http/read-json-body"
import { rejectForeignRequest } from "@/server/http/same-origin"

export type GuardedJson =
  { ok: true; value: unknown } | { ok: false; response: Response }

export async function readGuardedJson(
  request: Request,
  maxBytes: number
): Promise<GuardedJson> {
  const foreign = rejectForeignRequest(request)
  if (foreign) return { ok: false, response: foreign }

  const body = await readJsonBody(request, maxBytes)
  if (body.ok) return body
  return {
    ok: false,
    response: Response.json(
      { error: body.status === 413 ? "too_large" : "bad_request" },
      { status: body.status }
    ),
  }
}

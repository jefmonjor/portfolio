export type JsonBody =
  { ok: true; value: unknown } | { ok: false; status: 400 | 413 }

export async function readJsonBody(
  request: Request,
  maxBytes: number
): Promise<JsonBody> {
  const declared = request.headers.get("content-length")
  if (declared !== null) {
    const length = Number(declared)
    if (!Number.isSafeInteger(length) || length < 0) {
      return { ok: false, status: 400 }
    }
    if (length > maxBytes) return { ok: false, status: 413 }
  }

  if (!request.body) return { ok: false, status: 400 }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined)
      return { ok: false, status: 413 }
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  const utf8WithoutBom = new TextDecoder()
  try {
    return { ok: true, value: JSON.parse(utf8WithoutBom.decode(bytes)) }
  } catch {
    return { ok: false, status: 400 }
  }
}

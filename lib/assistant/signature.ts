import { createHmac, hkdfSync, timingSafeEqual } from "node:crypto"

const KEY_LABEL = "jefmonjor.dev/assistant-reply-signature/v1"
const SIGNATURE_PATTERN = /^[A-Za-z0-9_-]{43}$/

let cached: { secret: string; key: Buffer } | null = null

function signingKey(): Buffer | null {
  const secret =
    process.env.ASSISTANT_SIGNING_SECRET?.trim() ||
    process.env.OPENAI_API_KEY?.trim()
  if (!secret) return null
  if (cached?.secret !== secret) {
    cached = {
      secret,
      key: Buffer.from(hkdfSync("sha256", secret, "", KEY_LABEL, 32)),
    }
  }
  return cached.key
}

function mac(key: Buffer, content: string): Buffer {
  return createHmac("sha256", key).update(content, "utf8").digest()
}

export function signReply(content: string): string {
  const key = signingKey()
  if (!key) throw new Error("No key to sign assistant replies with")
  return mac(key, content).toString("base64url")
}

export function signatureFor(content: string): { signature?: string } {
  return signingKey() ? { signature: signReply(content) } : {}
}

export function isSignedReply(
  content: string,
  signature: string | undefined
): boolean {
  const key = signingKey()
  if (!key || !signature || !SIGNATURE_PATTERN.test(signature)) return false
  return timingSafeEqual(mac(key, content), Buffer.from(signature, "base64url"))
}

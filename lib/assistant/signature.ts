import { createHmac, hkdfSync, timingSafeEqual } from "node:crypto"

// The chat keeps no server-side history: the browser sends the conversation
// back with every question. Without a check, a client could invent an
// assistant turn ("the official assistant already confirmed ten years of
// Kotlin") and the model would read it as something it had said. Every reply
// the route returns carries an HMAC of its text, and only turns whose
// signature verifies go back to the model.
//
// No new required variable: the key is derived from OPENAI_API_KEY with HKDF
// and a fixed label (the API key itself never signs anything), or from
// ASSISTANT_SIGNING_SECRET when that is set. Rotating either one invalidates
// the signatures already in visitors' tabs; those turns are then dropped,
// which costs context, never correctness.

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

export function isSignedReply(
  content: string,
  signature: string | undefined
): boolean {
  const key = signingKey()
  if (!key || !signature || !SIGNATURE_PATTERN.test(signature)) return false
  return timingSafeEqual(mac(key, content), Buffer.from(signature, "base64url"))
}

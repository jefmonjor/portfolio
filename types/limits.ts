// Plain numbers shared by browser components and the Zod contracts. They live
// apart from the schemas so a client component can read a limit without
// pulling Zod into the page bundle.

// Big enough for a full job offer pasted into the chat. Only the latest
// message is read at this size; older turns are cut to ASSISTANT_MAX_CHARS.
export const ASSISTANT_MESSAGE_INPUT_CHARS = 8000
// Odd on purpose: a client history alternates user/assistant and ends on a
// user turn, so an odd-sized tail always starts on a user turn too.
export const ASSISTANT_HISTORY_INPUT_MESSAGES = 17
export const ASSISTANT_REPLY_MAX_CHARS = 4000

// Roughly 4.000 palabras: full postings run long, and truncating one mid-way
// hides the requirements that usually sit at the end. At ~6 characters per
// word this is ~7k input tokens, a fraction of a cent on the selection model.
export const CV_TAILOR_OFFER_MAX_CHARS = 24000
export const CV_TAILOR_OFFER_MIN_CHARS = 40

// Request bodies are capped before they are parsed. Each cap is the largest
// body its Zod contract can accept, so no valid request is ever refused: a
// string character costs at most 3 bytes as UTF-8 inside JSON (only control
// characters escaped as \u00XX cost more), plus room for keys and
// punctuation. Without it a route read whatever arrived — no limit at all
// behind the Docker image, 4.5 MB on Vercel.
const JSON_BYTES_PER_CHAR = 3
const JSON_ENVELOPE_BYTES = 1024

// ≈ 400 KiB: 17 turns of up to 8.000 characters.
export const ASSISTANT_BODY_MAX_BYTES =
  ASSISTANT_HISTORY_INPUT_MESSAGES *
    (ASSISTANT_MESSAGE_INPUT_CHARS * JSON_BYTES_PER_CHAR + 64) +
  JSON_ENVELOPE_BYTES

// ≈ 71 KiB: one offer of up to 24.000 characters.
export const CV_TAILOR_BODY_MAX_BYTES =
  CV_TAILOR_OFFER_MAX_CHARS * JSON_BYTES_PER_CHAR + JSON_ENVELOPE_BYTES

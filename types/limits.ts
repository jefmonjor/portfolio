// Plain numbers shared by browser components and the Zod contracts. They live
// apart from the schemas so a client component can read a limit without
// pulling Zod into the page bundle.

export const ASSISTANT_MESSAGE_INPUT_CHARS = 1500
// Odd on purpose: a client history alternates user/assistant and ends on a
// user turn, so an odd-sized tail always starts on a user turn too.
export const ASSISTANT_HISTORY_INPUT_MESSAGES = 17
export const ASSISTANT_REPLY_MAX_CHARS = 4000

// Roughly 4.000 palabras: full postings run long, and truncating one mid-way
// hides the requirements that usually sit at the end. At ~6 characters per
// word this is ~7k input tokens, a fraction of a cent on the selection model.
export const CV_TAILOR_OFFER_MAX_CHARS = 24000
export const CV_TAILOR_OFFER_MIN_CHARS = 40

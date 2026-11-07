import type { Locale } from "@/i18n/routing"
import { looksLikeJobOffer } from "@/lib/assistant/offer"
import type { AssistantAction, ChatMessage } from "@/types/assistant"

// Asking for the CV is the one request the assistant answers without the
// model: the three variants are fixed, the files come from the CV routes,
// and the reply only has to say which is which. The actions travel with the
// reply so the client can call those routes from the chat itself.

const CV_WORDS =
  /(?<!\p{L})(?:cv|curr[ií]cul[uo]m|résumé|résume|resumé|(?:his|her|your|the|a|my|their|full)\s+resume)(?!\p{L})/iu
// Longer messages are questions (or offers) that mention the CV in passing.
const CV_REQUEST_MAX_CHARS = 400

export function asksForCv(text: string): boolean {
  const trimmed = text.trim()
  return (
    trimmed.length > 0 &&
    trimmed.length <= CV_REQUEST_MAX_CHARS &&
    CV_WORDS.test(trimmed)
  )
}

// The most recent pasted offer in the conversation, if any: "¿me pasas el CV
// para esta oferta?" after pasting it should not require pasting it again.
export function lastOffer(messages: ReadonlyArray<ChatMessage>): string | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.role === "user" && looksLikeJobOffer(message.content)) {
      return message.content
    }
  }
  return null
}

export function cvActions(offer: string | null): AssistantAction[] {
  return [
    { type: "cv", variant: "general" },
    { type: "cv", variant: "technical" },
    ...(offer ? [{ type: "cv-tailor" as const, offer }] : []),
  ]
}

const CV_REPLY: Record<Locale, { base: string; withOffer: string }> = {
  es: {
    base: `Hay tres versiones del CV de Jefferson, todas generadas desde el mismo perfil:
• General: resumen, experiencia y proyectos en texto plano, para leer de una pasada.
• Técnico: una columna, lectura ATS y más peso para stack, prácticas y proyectos técnicos.
• Según oferta: pega aquí la oferta completa y la IA prioriza evidencia ya verificada; no añade experiencia, tecnologías ni logros.
Descárgalos con los botones de abajo.`,
    withOffer: `Hay tres versiones del CV de Jefferson, todas generadas desde el mismo perfil:
• General: resumen, experiencia y proyectos en texto plano, para leer de una pasada.
• Técnico: una columna, lectura ATS y más peso para stack, prácticas y proyectos técnicos.
• Según oferta: ya tengo la oferta que pegaste; el tercer botón genera el CV adaptado a ella priorizando evidencia verificada, sin añadir nada.
Descárgalos con los botones de abajo.`,
  },
  en: {
    base: `There are three versions of Jefferson's CV, all generated from the same profile:
• General: summary, experience and projects in plain text, to read in one pass.
• Technical: one column, ATS-readable, more weight on stack, practices and technical projects.
• Tailored: paste the full job offer here and the AI prioritizes verified evidence; it adds no experience, technologies or achievements.
Download them with the buttons below.`,
    withOffer: `There are three versions of Jefferson's CV, all generated from the same profile:
• General: summary, experience and projects in plain text, to read in one pass.
• Technical: one column, ATS-readable, more weight on stack, practices and technical projects.
• Tailored: I already have the offer you pasted; the third button builds the CV for it from verified evidence only, adding nothing.
Download them with the buttons below.`,
  },
  ca: {
    base: `Hi ha tres versions del CV de Jefferson, totes generades des del mateix perfil:
• General: resum, experiència i projectes en text pla, per llegir d'una passada.
• Tècnic: una columna, lectura ATS i més pes per a stack, pràctiques i projectes tècnics.
• Segons oferta: enganxa aquí l'oferta completa i la IA prioritza evidència ja verificada; no afegeix experiència, tecnologies ni fites.
Descarrega'ls amb els botons de sota.`,
    withOffer: `Hi ha tres versions del CV de Jefferson, totes generades des del mateix perfil:
• General: resum, experiència i projectes en text pla, per llegir d'una passada.
• Tècnic: una columna, lectura ATS i més pes per a stack, pràctiques i projectes tècnics.
• Segons oferta: ja tinc l'oferta que has enganxat; el tercer botó genera el CV adaptat a ella prioritzant evidència verificada, sense afegir res.
Descarrega'ls amb els botons de sota.`,
  },
}

export function cvReply(locale: Locale, hasOffer: boolean): string {
  const copy = CV_REPLY[locale]
  return hasOffer ? copy.withOffer : copy.base
}

const OFFER_CV_HINT: Record<Locale, string> = {
  es: "Si quieres el CV adaptado a esta oferta, el botón de abajo lo genera: solo reordena evidencia ya verificada, no añade nada.",
  en: "If you want the CV tailored to this offer, the button below builds it: it only reorders verified evidence and adds nothing.",
  ca: "Si vols el CV adaptat a aquesta oferta, el botó de sota el genera: només reordena evidència ja verificada, no afegeix res.",
}

export function offerCvHint(locale: Locale): string {
  return OFFER_CV_HINT[locale]
}

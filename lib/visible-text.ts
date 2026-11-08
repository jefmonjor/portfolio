import { CV_TAILOR_OFFER_MIN_CHARS } from "@/types/limits"

const INVISIBLE = /[\p{Default_Ignorable_Code_Point}⠀]/gu
const VISIBLE = /[^\p{Default_Ignorable_Code_Point}\p{White_Space}⠀]/u

export function visibleLength(text: string): number {
  return text.replace(INVISIBLE, "").trim().length
}

export function hasVisibleText(text: string): boolean {
  return VISIBLE.test(text)
}

export function isTailorableOffer(text: string): boolean {
  return visibleLength(text) >= CV_TAILOR_OFFER_MIN_CHARS
}

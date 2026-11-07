const INVISIBLE_OR_BLANK =
  /[\p{Default_Ignorable_Code_Point}\p{White_Space}⠀]/gu

export function visibleLength(text: string): number {
  return text.replace(INVISIBLE_OR_BLANK, "").length
}

export function hasVisibleText(text: string): boolean {
  return visibleLength(text) > 0
}

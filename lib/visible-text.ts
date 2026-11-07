const INVISIBLE_CHARACTERS = /[​-‍⁠﻿]/g

export function hasVisibleText(text: string): boolean {
  return text.replace(INVISIBLE_CHARACTERS, "").trim().length > 0
}

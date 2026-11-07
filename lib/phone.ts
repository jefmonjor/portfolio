const CODES: ReadonlyArray<{
  readonly region: "ES" | "AD"
  readonly codes: ReadonlyArray<number>
}> = [
  { region: "ES", codes: [43, 51, 52, 54, 49, 53, 48, 53, 57, 55, 52, 51] },
  { region: "AD", codes: [43, 51, 55, 54, 51, 56, 56, 55, 51, 55] },
]

export type ContactPhone = {
  readonly region: "ES" | "AD"
  /** E.164, for tel: links. */
  readonly tel: string
  /** Grouped in threes for reading, after the country code. */
  readonly display: string
}

function group(tel: string): string {
  if (tel.startsWith("+34")) {
    return `+34 ${tel.slice(3, 6)} ${tel.slice(6, 9)} ${tel.slice(9)}`
  }
  return `+376 ${tel.slice(4, 7)} ${tel.slice(7)}`
}

export function contactPhones(): ReadonlyArray<ContactPhone> {
  return CODES.map(({ region, codes }) => {
    const tel = String.fromCharCode(...codes)
    return { region, tel, display: group(tel) }
  })
}

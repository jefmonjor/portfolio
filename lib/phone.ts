// Contact phones assembled at call time, like the email: the numbers go only
// into the downloadable CVs (server-rendered on demand) and must never appear
// as literals in the static HTML, the JS bundle or the crawlable exports.
// Built from char codes because the minifier constant-folds string joins.
const CODES: ReadonlyArray<{
  readonly region: "ES" | "AD"
  readonly codes: ReadonlyArray<number>
}> = [
  // +34 615 059 743
  { region: "ES", codes: [43, 51, 52, 54, 49, 53, 48, 53, 57, 55, 52, 51] },
  // +376 388 737
  { region: "AD", codes: [43, 51, 55, 54, 51, 56, 56, 55, 51, 55] },
]

export type ContactPhone = {
  readonly region: "ES" | "AD"
  /** E.164, for tel: links. */
  readonly tel: string
  /** Grouped for reading: "+34 615 059 743". */
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

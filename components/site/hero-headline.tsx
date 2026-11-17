import type { Headline } from "@/content/site/types"

function playIntroOncePerSession(root: HTMLElement) {
  const sessionKey = "jefmonjor:intro"
  const fullIntroMs = 2400
  try {
    if (sessionStorage.getItem(sessionKey) === "played") {
      root.dataset.intro = "played"
      return
    }
    sessionStorage.setItem(sessionKey, "played")
  } catch {
    return
  }
  setTimeout(() => {
    root.dataset.intro = "played"
  }, fullIntroMs)
}

function numberHeadlineLines(headline: HTMLElement | null) {
  let lineTop = Number.NaN
  let line = -1
  headline?.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
    if (word.offsetTop !== lineTop) {
      lineTop = word.offsetTop
      line += 1
    }
    word.style.setProperty("--line", String(line))
  })
}

function runBeforeFirstPaint(script: string) {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

/** Each part of the headline is one sentence and starts its own line. */
function HeadlineLines({ headline }: { headline: Headline }) {
  const lines = headline.map((part) =>
    (typeof part === "string" ? part : part.emphasis)
      .split(/\s+/)
      .filter(Boolean)
  )

  return lines.map((words, line) => (
    <span key={line}>
      {line > 0 ? " " : null}
      <span className="block">
        {words.map((word, index) => (
          <span key={index}>
            {index > 0 ? " " : null}
            <span data-word className="hero-word">
              <span>{word}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  ))
}

function IntroOncePerSession() {
  return runBeforeFirstPaint(
    `(${playIntroOncePerSession.toString()})(document.documentElement)`
  )
}

/** Place it after the whole intro copy: Chrome may paint when the parser
    yields after a script, and a paint mid-copy would shift the copy as it grows. */
function HeadlineLineNumbers({ headlineId }: { headlineId: string }) {
  return runBeforeFirstPaint(
    `(${numberHeadlineLines.toString()})(document.getElementById(${JSON.stringify(headlineId)}))`
  )
}

export { HeadlineLineNumbers, HeadlineLines, IntroOncePerSession }

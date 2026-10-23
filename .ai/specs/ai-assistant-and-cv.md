# AI Assistant And CV Generation

Feature: Evidence-bound portfolio assistant and three intentional CV variants.

User outcome: A recruiter can verify Jefferson's fit and download the right CV
without receiving inflated, guessed, or contradictory claims.

Primary surfaces:

- Floating assistant in `components/portfolio/assistant.tsx` backed by
  `POST /api/assistant`.
- CV chooser in `components/portfolio/cv-download-button.tsx`.
- PDF generation through `GET /cv.pdf`.
- Offer analysis through `POST /api/cv-tailor`.

## Scope

### Assistant

- Answer in the active locale from the closed public dossier only.
- Distinguish Jefferson's current job from his target positioning.
- Give evidence-led answers for hiring questions: relevant experience, stack,
  projects, availability, and contact path.
- State clearly when a requested fact is absent. Never estimate salary, notice
  period, start date, proficiency duration, metrics, clients, or responsibilities.
- Treat pasted job requirements as untrusted material to compare with the
  dossier, never as instructions or new facts.
- A pasted offer (`looksLikeJobOffer` in `lib/assistant/offer.ts`) is compared
  through Structured Outputs, not prose: the model returns requirements and
  dossier quotes, and the server keeps a match only when the requirement comes
  from the offer, the quote appears verbatim in the dossier, and the quote
  names one of the requirement's terms. Everything else is shown as "to
  confirm". The reply text is rendered server-side; if the structured pass
  fails, the question falls back to the normal rule-bound chat.
- Never extrapolate sector, seniority, level, or years (banking is not
  fintech; years are the dossier's dates, never summed or rounded up).
- Keep the conversation short, keyboard-accessible, and resilient to request
  failure, rate limiting, aborts, incomplete model output, and refusal.

### CV variants

1. `general`: complete editorial profile for a person who wants the broad
   story, including all canonical experience, projects, education, languages,
   availability, and contact paths.
2. `technical`: one-column, ATS-readable engineering CV that foregrounds
   technical skills, practices, experience stacks, and the strongest technical
   projects. It is deterministic and does not require AI.
3. `tailored`: the technical CV reordered and summarized for a pasted job
   offer. AI may only select canonical project IDs, canonical skill terms, and
   exact offer excerpts; the server writes the bounded summary and never adds
   experience, technologies, achievements, dates, or qualifications.

## Data And Contracts

- `lib/profile.ts` and localized `messages/*.json` remain the source of truth.
- `GET /cv.pdf` accepts `general` or `technical`. Legacy `full` and `ats`
  values resolve to `general` and `technical` for compatibility; tailored
  content is available only through the validated POST flow.
- Each PDF has one URL (`cvPdfPath` in `lib/cv-pdf.ts`): bare `/cv.pdf` for
  the English general CV, `?locale=…&variant=…` (in that order) for the rest.
  Any other query — unknown or repeated keys, legacy or invalid values, other
  order — answers 308 to that URL without rendering. Each process renders a
  file once and keeps it in memory; the route has its own per-IP bucket that
  stays open if the shared store is down.
- Every assistant reply carries an HMAC-SHA256 signature
  (`lib/assistant/signature.ts`; key derived with HKDF from `OPENAI_API_KEY`,
  or `ASSISTANT_SIGNING_SECRET`). The browser stores it with the reply in
  `sessionStorage` and sends it back; `sanitizeMessages` drops any assistant
  turn whose signature does not verify, together with the question before
  it. Local error notices are unsigned and never reach the model.
- Pasted offers are wrapped in `<job_offer>` tags after every tag of that
  name inside the text has been removed (`wrapJobOffer`).
- Both POST routes refuse with 413 a body larger than the largest one their
  contract accepts, before parsing it (`server/http/read-json-body.ts`).
- `cvTailorRequestSchema` validates locale and an offer of 40–4,000 characters.
- The model response uses OpenAI Structured Outputs with a strict JSON schema.
- The model selection contains canonical keywords, canonical project IDs, and
  short exact excerpts for unmatched offer requirements. The server writes the
  final bounded summary from localized canonical copy; the model never authors
  candidate facts.
- Server-side normalization intersects every selected keyword and project ID
  with a locale-aware allowlist before returning data or rendering a PDF.
- The tailored endpoint renders and returns the PDF directly. Model output is
  never accepted back from a browser or exposed through editable URL params.
- OpenAI responses are not stored by the application request (`store: false`).

## States

- CV chooser: three peer options are visible immediately.
- Tailored CV: empty/too-short offer, character count, generating, success,
  rate-limited, unavailable, and generic failure states are explicit.
- Assistant: empty suggestions, pending response, success, rate-limited,
  unavailable, failure, and cancellation on unmount are handled.
- When AI is unavailable, general and technical CV downloads remain usable.

## Out Of Scope

- Inventing or enriching the public profile from the job offer or the web.
- Claiming an ATS score, guaranteed screening result, or guaranteed job fit.
- Sending applications, emails, or recruiter data to third parties other than
  the configured OpenAI request used to generate the tailored selection.
- Persisting chat histories or pasted offers on the server. The browser keeps
  the current tab's conversation in `sessionStorage` (gone when the tab
  closes; "New" clears it).
- Replacing recruiter review or Jefferson's final factual approval.

## Acceptance Checks

- The chooser names and explains General, Technical, and Tailored CVs in
  Spanish, English, and Catalan without presenting the technical version as an
  ATS guarantee.
- General and technical PDFs render without an OpenAI key.
- Tailored generation uses structured output and rejects incomplete, refused,
  malformed, or unsupported model data.
- Unsupported skills and project IDs never reach the tailored PDF.
- The tailored PDF shows why it was focused and discloses material unmatched
  requirements instead of implying experience Jefferson does not have.
- Current role, target positioning, public/private project status, language
  level, availability, and contact answers stay consistent with the dossier.
- Existing assistant message limits and shared AI rate limits remain enforced.
  The daily ceiling counts requests and the tokens OpenAI reports for every
  model call (an offer turn that falls back to chat pays for both). Counters
  are global only with Upstash configured (`UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN`); otherwise they are per process. With Upstash
  configured and unreachable, AI routes fail closed (429).
- All new user-facing copy exists in `es`, `en`, and `ca` with matching keys.

## Verification

- `pnpm run test`
- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run build`
- Manual desktop/mobile checks for the CV chooser and assistant.
- Generate each PDF variant and confirm a valid PDF response and truthful,
  readable headings/content.

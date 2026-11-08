# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Business owners, operations leads and CTOs of small and mid-size companies (roughly 10–200 people) who have a problem that software can solve: manual processes, spreadsheets that run the business, tools that do not talk to each other, an old application that needs modernising, or an idea that needs to reach production. They arrive from LinkedIn, a referral or a search, on a laptop at work or a phone, and decide in seconds whether this person can be trusted with their system.

Secondary: recruiters and CTOs reading the full CV at `/cv`.

## Product Purpose

jefmonjor.dev is the commercial site of Jefferson Montesdeoca, an independent senior software engineer and software architect working as a freelancer, AI-native from spec to production. It must make the offer understood, earn trust with real evidence, and turn a visitor into a project conversation through the contact brief. Success is a qualified enquiry from a business with a real problem.

## Positioning

A senior software engineer who designs, connects and ships the systems a business runs on — custom software, system integration, process automation and applied AI — using AI across the whole development cycle while he reviews and signs off every change, and who builds and runs his own products in production. Seven years of engineering across banking (Andbank since 2024), legal (elAbogado), energy (Endesa) and telecom (Vodafone). The client works directly with him from diagnosis to production; it is not an agency.

## Operating Context

- Offer: Diagnosis (1–5 days, written report), Build and integrate (fixed scope or daily rate), Engineering partner (monthly, 4–8 h/week).
- Availability: part-time from January 2027; remote from Andorra (CET).
- Contact: a six-question project brief that prepares an email in the visitor's own mail app; nothing is stored by the site. Email address shown only after hydration: hola@jefmonjor.dev on the site (`siteContactEmail()` in `lib/email.ts`); `/cv` keeps its own address.
- English at `/`, Spanish at `/es`. The CV lives at `/cv` (EN, ES, CA).

## Capabilities and Constraints

- Static (SSG) Next.js site; every page works without JavaScript and respects reduced motion.
- No public rates. Budget ranges in the brief are the visitor's budget, not prices.
- No analytics or third-party requests from pages; images and fonts are self-hosted.
- Andbank internal details and figures stay confidential; the bank case is anonymised.

## Brand Commitments

- Name: Jefferson Montesdeoca (short name in the header).
- Pine green accent on the site (#0F6B4F light, #5FD1A0 dark); `/cv` keeps its burnt amber. The owner rejected cream, terracotta and italic-serif looks as "AI".
- References pinned by the owner (November 2026): personal senior-consultant sites — happycoders.eu, vladmihalcea.com/consulting, alexedwards.net/work-with-me, lea.verou.me/consulting, jxnl.co/services. First person, one sentence of what he solves and for whom, named services, proof, one call to action. No stock photography: an animated orbit of the real tools he builds with and real screenshots of his products.
- One primary call to action: "Let's discuss your project" / "Hablemos de tu proyecto".

## Evidence on Hand

- Live products: Transolido (transolido.com, VERI*FACTU invoicing), Other Twist (othertwist.com, offline-first writing platform), Ilnami (ilnami.com, private food diary), plus PRONOQ, Corte1D and Contact QR.
- Experience: Andbank (2024–present), elAbogado (2022–2024), Zemsania (Vodafone), Keapps, Ayesa (Endesa) — see `lib/profile.ts`.
- Portrait: `public/me.webp`, **only on `/cv`**. The owner does not want his photo anywhere on the commercial site (pages or its structured data), and `/cv` is not to be touched.
- Screenshots of the public pages of Transolido, Other Twist and Ilnami (`public/images/work/`), captured from the live sites on 2026-11-08. Transolido's public face is its sign-in page.
- English level is B1 (CV): say "Spanish (native) and English", never "native English".
- Absent and never to be fabricated: client testimonials, client logos used with permission, revenue or performance figures, prices, a calendar link, screenshots of logged-in product areas.

## Product Principles

1. Prove, don't claim: every statement traces to the CV or a live product.
2. The problem before the technology: speak in business outcomes, then show the engineering.
3. Built to last and to be handed over: documentation, tests and handover are part of the work.
4. Direct and senior: one person, accountable from diagnosis to production.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥4.5:1, visible focus, 44 px touch targets on mobile, status shown with icon and text, full function without JavaScript and with reduced motion.

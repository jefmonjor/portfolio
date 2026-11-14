# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone deciding whether to work with a versatile senior engineer: CTOs, founders and technical leads with a product to build, a system to modernize or AI to integrate, and recruiters or hiring managers filling a senior role. The site sells a person who clearly knows how to build things, with varied work as proof, not a sector. Banking (a private bank's architecture team) is the proof of level, not the market.

They arrive from LinkedIn, a referral or a search, on a laptop at work or a phone, and decide in seconds whether this profile fits.

The full CV at `/cv` serves the same audiences in depth; the home links to it from the header and from the "Also open to the right full-time role" note.

## Product Purpose

jefmonjor.dev is the commercial site of Jefferson Montesdeoca, an independent solutions architect and senior backend engineer working as a freelancer, AI-native from spec to production. It must make the offer understood, earn trust with real evidence, and turn a visitor into a project conversation through the contact brief. Success is a qualified enquiry from a business with a real problem.

## Positioning

Solutions Architect & Senior Backend Engineer (the same title everywhere, in line with his role at Andbank) who builds the backend systems companies run on and the products on top of them, modernizes existing systems and puts AI to work inside them, with whatever stack the project needs (backend-first; Java, TypeScript, Dart, Go and Python). Open to projects and to the right full-time role. Uses AI across the whole development cycle while he reviews and answers for every change, and builds and runs his own products in production. Seven years of engineering across banking (Andbank since 2024), legal (elAbogado), energy (Endesa) and telecom (Vodafone).

## Operating Context

- Offer: Diagnosis (1–5 days, written report), Build and integrate (fixed scope or daily rate), Engineering partner (monthly, 4–8 h/week).
- Availability: freelance first. Available now for projects at 10–15 h/week, and also open to the right full-time role; remote from Andorra (CET). The site, the CV, the PDFs, `cv.json`, `llms.txt` and the assistants all say "available now"; no future date is shown anywhere.
- Contact: a six-question project brief plus the visitor's email, sent from the site to hola@jefmonjor.dev through Brevo (transactional email, EU) with the visitor as reply-to; nothing is stored by the site. When Brevo is not configured or fails, the brief opens in the visitor's own mail app instead. Email address shown only after hydration: hola@jefmonjor.dev on the site (`siteContactEmail()` in `lib/email.ts`); `/cv` keeps its own address.
- English at `/`, Spanish at `/es`. The CV lives at `/cv` (EN, ES, CA).

## Capabilities and Constraints

- Static (SSG) Next.js site; every page works without JavaScript and respects reduced motion.
- No public rates. Budget ranges in the brief are the visitor's budget, not prices.
- No analytics or third-party requests from pages; images and fonts are self-hosted.
- Andbank internal details stay confidential and the bank case is anonymised, without figures. The only Andbank figures the site may show are the three the CV already publishes (15+ components in the new online banking, 40+ VMs migrated, 12,000+ COBOL files analysed), and only where Andbank is named as in the CV: the experience page and the "Hi, I'm Jefferson" block.

## Brand Commitments

- Name: Jefferson Montesdeoca (short name in the header).
- Pine green accent on the site (#0F6B4F light, #5FD1A0 dark); `/cv` keeps its burnt amber. The owner rejected cream, terracotta and italic-serif looks as "AI".
- References pinned by the owner (November 2026): personal senior-consultant sites — happycoders.eu, vladmihalcea.com/consulting, alexedwards.net/work-with-me, lea.verou.me/consulting, jxnl.co/services. First person, one sentence of what he solves and for whom, named services, proof, one call to action. No stock photography: an animated orbit of the real tools he builds with and real screenshots of his products.
- One primary call to action, always to the contact page: "Tell me about your project" / "Cuéntame tu proyecto" (the header uses the short form "Let's talk" / "Hablemos").

## Evidence on Hand

- Live products: Transolido (transolido.com, VERI*FACTU invoicing), Other Twist (othertwist.com, offline-first writing platform), Ilnami (ilnami.com, private food diary), plus PRONOQ, Corte1D and Contact QR.
- Experience: Andbank (2024–present), elAbogado (2022–2024), Zemsania (Vodafone), Ayesa and Keapps (Atos) for Endesa (2019–2021, one continuous engagement) — see `lib/profile.ts`.
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

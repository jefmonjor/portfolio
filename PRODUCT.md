# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone deciding whether to work with a versatile senior engineer: CTOs, founders and technical leads with a product to build, a system to modernize or AI to integrate, and recruiters or hiring managers filling a senior role. The site sells a person who clearly knows how to build things, with varied work as proof, not a sector. Banking (a private bank's architecture team) is the proof of level, not the market.

They arrive from LinkedIn, a referral or a search, on a laptop at work or a phone, and decide in seconds whether this profile fits.

The full CV at `/cv` serves the same audiences in depth; the home links to it from the rail (the menu on phones) and from the "Also open to the right full-time role" note.

## Product Purpose

jefmonjor.dev is the commercial site of Jefferson Montesdeoca, an independent solutions architect and senior backend engineer working as a freelancer, AI-native from spec to production. It must make the offer understood, earn trust with real evidence, and turn a visitor into a project conversation through the contact brief. Success is a qualified enquiry from a business with a real problem.

## Positioning

Senior Software Engineer · Backend, Product & AI on the commercial site. The CV, its PDFs, `cv.json`, `llms.txt` and LinkedIn keep "Solutions Architect & Senior Backend Engineer": the keywords recruiters search for and the title of his role at Andbank. He builds the systems companies run on, the products on top of them and the AI that works inside both, with the stack the problem needs (Java, TypeScript, Python, Dart and Go). Actively looking now, for freelance projects and for full-time roles alike. Uses AI across the whole development cycle while he reviews and answers for every change, and builds and runs his own products in production. Seven years of engineering across banking (Andbank since 2024), legal (elAbogado), energy (Endesa) and telecom (Vodafone).

### Identity and proof

- **Identity is generic.** The site's role line names three capabilities (backend, product and AI) and the headline names what he builds: the systems companies run on, the products on top of them and the AI that works inside both. Under the headline the three pillars are links, each to the tile that proves it.
- **Proof is specific.** Technologies such as Java 21, Spring Boot or Keycloak never define him; they stay inside the cases, the experience page and the CV, where they show the work was real. The CV is more concrete than the home: its title and skills keep the keywords recruiters search for.
- **Each pillar points to its proof:** backend and architecture → the bank case and the Java backends of Transolido and Other Twist; product → six products live in production; applied AI → Transolido (Claude API, it never issues an invoice), Ilnami (OpenAI Vision, it never saves) and SpecForge (AI coding agents behind tests and review).
- **No technology or language without his own code behind it.** Python's lives in two private repositories; making one public would let a visitor verify it.
- **Nothing is frozen.** He is applying now, to freelance projects and companies alike; the positioning moves when the applications say so, never on one more opinion.

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
- Structure pinned by the owner later that month, from geronimo.design: a fixed rail with the name, the navigation and the one action; one sentence; a two-column wall of work; a short page. Not taken from it: the cream ground, its paid fonts, the client-logo row (employers and clients appear as text: "I have worked for…") or any of its copy and imagery. The owner delegated the choice between the old home and this one and it was adopted for the site and, as a rail, for `/cv`.
- One primary call to action, always to the contact page: "Tell me about your project" / "Cuéntame tu proyecto" (the rail and the phone menu use the short form "Let's talk" / "Hablemos").

## Evidence on Hand

- Live products: Transolido (transolido.com, VERI*FACTU invoicing), Other Twist (othertwist.com, offline-first writing platform), Ilnami (ilnami.com, private food diary), plus PRONOQ, Corte1D and Contact QR.
- Experience: Andbank (2024–present), elAbogado (2022–2024), Zemsania (Vodafone), Ayesa and Keapps (Atos) for Endesa (2019–2021, one continuous engagement) — see `lib/profile.ts`.
- Portrait: `public/me.webp`, **only on `/cv`**. The owner does not want his photo anywhere on the commercial site (pages or its structured data). `/cv` keeps its own amber system; its navigation is a rail on wide screens.
- Screenshots of the public pages of Transolido, Other Twist and Ilnami (`public/images/work/`, captured from the live sites on 2026-11-08), of PRONOQ, Corte1D and Contact QR, and of the README of SpecForge's public repository (2026-11-17). Transolido's public face is its sign-in page; the home's wall uses a closer capture of it.
- English level is B1 (CV): say "Spanish (native) and English", never "native English".
- Absent and never to be fabricated: client testimonials, client logos used with permission, revenue or performance figures, prices, a calendar link, screenshots of logged-in product areas.

## Product Principles

1. Prove, don't claim: every statement traces to the CV or a live product.
2. The problem before the technology: speak in business outcomes, then show the engineering.
3. Built to last and to be handed over: documentation, tests and handover are part of the work.
4. Direct and senior: one person, accountable from diagnosis to production.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥4.5:1, visible focus, 44 px touch targets on mobile, status shown with icon and text, full function without JavaScript and with reduced motion.

import type { SiteContent } from "@/content/site/types"

export const en: SiteContent = {
  meta: {
    home: {
      title:
        "Jefferson Montesdeoca — Software Architect & Senior Backend Engineer",
      description:
        "Backend systems for banks and fintechs, and the AI inside them. Technical advisory, engineering delivery and fractional architecture. Andorra, remote, CET.",
    },
    services: {
      title: "Services — Technical Advisory, Delivery, Fractional Architecture",
      description:
        "Three ways to work together: a written second opinion, hands-on backend delivery on Java and Spring, or an architect a few hours a week.",
    },
    work: {
      title: "Case studies — Banking, product and applied AI",
      description:
        "Three case studies: modernising a private bank's Java platform, a private-by-design app built alone, and AI-written code held to engineering standards.",
    },
    experience: {
      title: "Experience — Seven years in banking, legal, energy and telecom",
      description:
        "Solutions architect and technical PM at Andbank, senior engineer at elAbogado, and Java and big-data consulting for Vodafone and Endesa.",
    },
    contact: {
      title: "Contact — Let's discuss your project",
      description:
        "Available for part-time work from January 2027. Remote, Andorra time (CET). Send a few lines about your project and get a reply within one business day.",
    },
    privacy: {
      title: "Privacy — what this site does with your data",
      description:
        "No analytics, no tracking cookies, no contact forms. What happens to an email you send, to text you give the AI assistant on /cv, and to server logs.",
    },
  },
  nav: {
    label: "Main",
    home: "Home",
    services: "Services",
    work: "Work",
    experience: "Experience",
    contact: "Contact",
    menu: "Menu",
    skipToContent: "Skip to content",
    toggleTheme: "Switch between light and dark theme",
    breadcrumb: "Breadcrumb",
  },
  cta: "Let's discuss your project",
  hero: {
    role: "Software Architect & Senior Backend Engineer",
    eyebrow: "Software Architect · Backend · Applied AI",
    headline: [
      "I design and build the backend systems ",
      { emphasis: "banks and fintechs" },
      " run on\u00a0— and the ",
      { emphasis: "AI" },
      " that is starting to run inside them.",
    ],
    subtitle:
      "Java and Spring backends, legacy integration and maintainable architecture.",
    availability:
      "Available for part-time work from January 2027\u00a0· Remote\u00a0· Andorra time (CET)",
    proof: [
      "7 years in banking and critical systems",
      "Architect in private banking",
      "Own products in production",
    ],
    seeWork: "See selected work",
  },
  about: {
    title: "About",
    paragraphs: [
      [
        "I have spent seven years building software where mistakes are expensive. Today I am solutions architect and technical PM at Andbank, a private bank in Andorra. Before that I modernised the platform of elAbogado, Spain's leading legal marketplace, and built Java and big-data systems for energy and telecom companies as a consultant. In parallel, I build my own products from the first database table to production. The details are on the ",
        { text: "experience page", href: "/experience" },
        ".",
      ],
      [
        "I work remotely and asynchronously, and I write decisions down: what we chose, why, and what we rejected. My goal is a system your team can run and change without me: a documented architecture, tests that explain the behaviour, and a complete handover of the code, the documents and the knowledge. You can see three examples in the ",
        { text: "case studies", href: "/work" },
        ".",
      ],
    ],
  },
  selectedWork: {
    title: "Selected work",
    readCase: "Read the case study",
    allCases: "All case studies",
  },
  services: {
    title: "Services",
    homeTitle: "How we can work together",
    intro:
      "Three formats for three situations. All of them start the same way and end with something your team can use without me.",
    items: [
      {
        id: "advisory",
        name: "Technical Advisory",
        summary:
          "A senior second opinion on your architecture, your backend or your modernisation plan, delivered in writing.",
        audience:
          "Teams that need a senior second opinion before a decision that is hard to undo.",
        includes: [
          "Architecture review",
          "Backend and code audit",
          "Modernisation plan for legacy systems",
          "Choosing the stack, and deciding whether to build or buy",
          "Technical due diligence: a technical check before you invest or buy",
        ],
        format:
          "1 to 5 days. You receive a written report with findings, risks and a prioritised plan.",
      },
      {
        id: "delivery",
        name: "Engineering Delivery",
        summary:
          "I design and build the backend with your team: Java and Spring services, integrations, migrations and the launch to production.",
        audience:
          "Companies that need to build or modernise a backend and take it to production.",
        includes: [
          "Java and Spring Boot backends",
          "Integrations: core banking, banking-as-a-service (BaaS), payment providers and third-party APIs",
          "Microservices and APIs",
          "Migrations and framework upgrades",
          "Preparing for production and the launch itself",
        ],
        format:
          "A daily rate, or a fixed price for a fixed scope. From January 2027: 10 to 15 hours per week; full time when my availability allows it.",
      },
      {
        id: "fractional",
        name: "Fractional Architecture",
        summary:
          "An architect for a few hours every week, for teams that do not have one yet.",
        audience:
          "Startups and teams without an architect that need technical direction every week.",
        includes: [
          "Recurring architecture and code reviews",
          "Technical roadmap",
          "Mentoring for the team",
          "Bringing AI into real processes, with limits and a manual way to work when the AI fails",
        ],
        format: "Monthly agreement, 4 to 8 hours per week.",
      },
    ],
    audienceLabel: "For",
    includesLabel: "Includes",
    formatLabel: "Format",
    details: "See the services in detail",
    startTitle: "How we start working together",
    startSteps: [
      "You write to me and we book a 30-minute video call about your context and your problem.",
      "A one-page written proposal: scope, format and dates.",
      "We start.",
    ],
    rates:
      "Rates depend on the scope and the format. You receive them in the written proposal.",
    closing:
      "I take on work I can do well and sustain. If your project is not a good fit, I will tell you and point you somewhere better.",
  },
  experience: {
    title: "Experience",
    intro:
      "Seven years in banking, legal, energy and telecom. For each role: what I was responsible for and what I delivered.",
    groups: [
      {
        id: "andbank",
        period: "2024 — present",
        organization: "Andbank",
        role: "Solutions Architect / Technical PM",
        summary:
          "Backend architecture, legacy integration and technical management in private banking.",
        entries: ["andbank-2024"],
      },
      {
        id: "elabogado",
        period: "2022 — 2024",
        organization: "elAbogado",
        role: "Senior Full Stack Engineer",
        summary:
          "Modernised Spain's leading legal marketplace: from Struts2 to React and Spring Boot, with microservices and secure APIs.",
        entries: ["elabogado-2022"],
      },
      {
        id: "consulting",
        period: "2019 — 2022",
        organization: "Zemsania · Keapps (Atos) · Ayesa",
        role: "Software Engineer, consulting",
        summary:
          "Java microservices for Vodafone and big-data platforms for Endesa.",
        entries: ["zemsania-2021", "keapps-2020", "ayesa-2019"],
      },
    ],
    fullHistory: "Full experience",
    present: "present",
    cvLead: "Need the complete CV, skills and education?",
    cvLink: "Open the full CV and PDF",
  },
  work: {
    title: "Case studies",
    intro:
      "Three projects from three angles: a bank's platform, a product I built alone, and AI held to engineering standards. Each page covers the context, my decisions and the result.",
    labels: {
      sector: "Sector",
      role: "My role",
      outcome: "Result",
      context: "Context",
      responsibility: "Responsibility",
      owned: "What was mine",
      notOwned: "What was not mine",
      decisions: "Decisions",
      reason: "Why",
      rejected: "Rejected alternative",
      implementation: "Implementation",
      results: "Result",
      stack: "Stack",
      architecture: "Simplified architecture",
      next: "Next case study",
    },
    cases: [
      {
        slug: "private-bank-modernization",
        sector: "Private banking",
        title:
          "Modernising a private bank's Java platform without stopping delivery",
        outcome:
          "Platform upgrades, a new homebanking architecture and one identity provider, while the bank kept releasing.",
        tags: ["Java 21", "Spring Boot 3", "Keycloak"],
        meta: {
          title: "Case study: modernising a private bank's Java platform",
          description:
            "Clean architecture, legacy integration behind adapters, Spring Boot 3 upgrades and central identity for a private bank in Andorra, without a delivery freeze.",
        },
        summary: {
          sector:
            "A private bank in Andorra that operates in several jurisdictions",
          role: "Solutions architect and technical PM, since 2024",
          result:
            "A platform that moves forward in small steps and a new homebanking architecture, while releases continue.",
        },
        context: [
          "The bank serves its customers through Java applications that sit on top of a much older core: COBOL programs on AS400, with DB2 as the system of record. Over the years the Java side had fallen behind the current versions of its framework and application servers.",
          "The bank needed a new homebanking, stronger customer authentication and a platform it could keep up to date. Stopping feature work for a long migration was not an option.",
        ],
        responsibility: {
          owned: [
            "Backend architecture for new services and the new homebanking",
            "Development standards for internal teams and vendors",
            "The plan and technical lead for the framework and application server upgrades",
            "The identity rollout with Keycloak",
            "Code quality tooling across all repositories",
            "Technical vendor management and advice on whether to build or buy",
            "Evaluation of AI tools for the team",
          ],
          notOwned: [
            "The COBOL and AS400 core and its roadmap, which stay with their owners",
            "Business priorities and the product roadmap",
          ],
        },
        decisions: [
          {
            choice: "Clean, hexagonal architecture for every new service",
            reason:
              "Business rules live apart from the framework and from the legacy adapters. The next framework upgrade changes the edges, not the domain.",
            rejected:
              "Classic layers built around the framework, which tie business rules to one framework version.",
          },
          {
            choice:
              "Integrate the legacy core behind adapters instead of rewriting it",
            reason:
              "The core holds the bank's records and it works. A rewrite is a multi-year risk that does not help the customer-facing roadmap.",
            rejected: "A big-bang replacement of the core.",
          },
          {
            choice: "Upgrade the platform in small increments",
            reason:
              "Each step — the Spring Boot 3 migration with the Jakarta namespace, the application server upgrades — stays small enough to test and roll back while feature work continues.",
            rejected:
              "A freeze-and-migrate project that stops delivery for months.",
          },
          {
            choice:
              "One identity provider: Keycloak with MFA and rules per jurisdiction",
            reason:
              "Authentication policy lives in one place, and the rules of each jurisdiction are configuration, not code repeated in every application.",
            rejected: "Authentication logic copied inside each application.",
          },
          {
            choice:
              "Measure technical debt before refactoring, with SonarQube on every repository, COBOL included",
            reason:
              "Internal teams and vendors prioritise against the same objective data.",
            rejected: "Refactoring based on opinions.",
          },
        ],
        implementation: [
          "The work is shared between internal teams and external vendors. My role mixes architecture and technical management: I define the standards vendors build against, review designs, and decide what to build and what to buy.",
          "New services use Java 21 and Spring Boot 3 and run on OpenShift. Access to the legacy core goes through adapters, so the services do not depend on COBOL or DB2 details.",
          "SonarQube quality gates run on every repository, including the COBOL code.",
          "I also led the department's first AI adoption: Gemini Code Assist for the whole team.",
        ],
        result: [
          "Framework and runtime upgrades that move forward in small steps, while releases continue.",
          "A new homebanking designed as independent components on a clean architecture.",
          "One identity provider with MFA and rules per jurisdiction.",
          "Technical debt visible across the whole platform, legacy code included.",
          "The department's first AI tool in daily use by the whole team.",
          "Internal details and figures stay confidential.",
        ],
        stack: [
          "Java 21",
          "Spring Boot 3",
          "Clean / hexagonal architecture",
          "OpenShift (OCP4)",
          "Keycloak",
          "DB2",
          "COBOL / AS400",
          "SonarQube",
          "Gemini Code Assist",
        ],
        diagram: [
          { label: "Homebanking", detail: "Customer channel" },
          { label: "Keycloak", detail: "MFA · rules per jurisdiction" },
          {
            label: "Java 21 services",
            detail: "Spring Boot 3 · hexagonal domain",
          },
          {
            label: "Legacy adapters",
            detail: "Keep the core out of the domain",
          },
          { label: "Core banking", detail: "COBOL · AS400 · DB2" },
        ],
        links: [],
      },
      {
        slug: "ilnami-private-by-design",
        sector: "Own product",
        title:
          "A private-by-design app, built alone from database to production",
        outcome:
          "Online in Spanish and English. The database itself keeps each diary private, and the AI suggests but never saves.",
        tags: ["Next.js", "PostgreSQL row-level security", "OpenAI Vision"],
        meta: {
          title: "Case study: Ilnami, a private-by-design app built alone",
          description:
            "Row-level security in PostgreSQL, AI that assists but never decides, EU data residency and monitoring without personal data, from schema to production.",
        },
        summary: {
          sector: "Consumer app, my own product",
          role: "Everything: product, architecture, backend, frontend and operations",
          result: "Online and open at ilnami.com, in Spanish and English.",
        },
        context: [
          "Review apps answer the question “what do strangers think of this place?”. Ilnami answers a different one: what did I order here, and would I go back? It is a private food diary on your own map: the place, the date, the dishes and your verdict.",
          "A diary like this is personal data. It shows where you go and what you like. So privacy had to be a property of the architecture, not a setting that a user can forget.",
        ],
        responsibility: {
          owned: [
            "Product definition and scope",
            "Data model and security model",
            "AI integration and its limits",
            "Frontend, PWA and maps",
            "Deployment, monitoring and consent",
          ],
          notOwned: [
            "The platforms underneath — Supabase, Vercel, OpenAI and Mapbox — which I chose and configured but do not operate",
          ],
        },
        decisions: [
          {
            choice:
              "Authorisation inside the database, with PostgreSQL row-level security",
            reason:
              "Every query is filtered to the owner of the row or to the circle it was shared with. A bug in the application cannot show one person's diary to another.",
            rejected: "Permission checks only in application code.",
          },
          {
            choice:
              "No public profiles, no public reviews; private circles by invitation",
            reason:
              "Sharing is always an explicit act. The product never needs to expose anyone in order to grow.",
            rejected: "A public feed of reviews as a growth channel.",
          },
          {
            choice: "AI that assists and never decides",
            reason:
              "OpenAI Vision reads menus, labels and receipts and suggests the place, the date and the dishes. The user reviews everything before saving, manual entry always works, and quotas per plan keep costs under control.",
            rejected: "Saving whatever the model extracts.",
          },
          {
            choice: "Stored data stays in the EU",
            reason:
              "Supabase in Frankfurt and Vercel in fra1: the database and the app run in the EU. Only the images a user chooses to scan are sent to OpenAI for suggestions.",
            rejected: "Default US regions.",
          },
          {
            choice: "Monitoring without personal data",
            reason:
              "Sentry runs without personal data, analytics only load with consent, and a strict Content Security Policy limits what the browser can load.",
            rejected: "Default SDK settings that collect more than needed.",
          },
        ],
        implementation: [
          "Next.js 16 as a PWA on Vercel, with Supabase for authentication and PostgreSQL. PostGIS stores the places and Mapbox draws each user's private map.",
          "Users can export all their data as JSON at any time.",
          "The site is ready for AI agents too: llms.txt, llms-full.txt, an Agent Skills index and a blog that is also published as Markdown.",
        ],
        result: [
          "Online and open at ilnami.com, in Spanish and English.",
          "Privacy enforced by the database, not only by the interface.",
          "AI that saves time without ever writing data on its own.",
          "The database and the app hosted in the EU, with analytics only after consent.",
        ],
        stack: [
          "Next.js 16",
          "Supabase",
          "PostgreSQL RLS",
          "PostGIS",
          "Mapbox",
          "OpenAI Vision",
          "PWA",
          "Sentry",
          "Vercel",
        ],
        diagram: [
          { label: "PWA", detail: "Next.js 16 · Vercel fra1" },
          { label: "OpenAI Vision", detail: "Suggests · the user confirms" },
          { label: "Supabase Auth", detail: "Every request carries the user" },
          {
            label: "PostgreSQL + RLS",
            detail: "Owner or circle only · Frankfurt",
          },
          { label: "PostGIS + Mapbox", detail: "Each user's private map" },
        ],
        links: [{ label: "ilnami.com", href: "https://ilnami.com" }],
      },
      {
        slug: "specforge-verified-ai-delivery",
        sector: "Applied AI",
        title: "Making AI-written code earn its place in the repository",
        outcome:
          "An open-source CLI where agent output only moves forward after tests, quality gates and a human review.",
        tags: ["Go", "Claude Code", "TDD"],
        meta: {
          title: "Case study: SpecForge, verified AI-assisted delivery",
          description:
            "An open-source Go CLI that drives Claude Code or Gemini CLI through sealed specs, tests that cannot be edited, automatic gates and verified legacy rewrites.",
        },
        summary: {
          sector: "Developer tooling and applied AI, open source",
          role: "Author and maintainer",
          result:
            "Verified, traceable AI delivery, tested end to end on a Java 6 application rewritten in Java 21.",
        },
        context: [
          "Coding agents are fast, and they are often wrong with total confidence. In a regulated environment like a bank, “the AI says it is done” is not evidence.",
          "I wanted to use Claude Code and Gemini CLI on real work and still prove every step: what was asked, what was decided, which test proves each behaviour, and who approved it.",
        ],
        responsibility: {
          owned: [
            "Design and architecture",
            "Implementation in Go",
            "Tests, CI and releases",
            "Documentation",
          ],
          notOwned: [
            "The AI models: SpecForge drives Claude Code or Gemini CLI, it does not replace them",
          ],
        },
        decisions: [
          {
            choice: "Spec first: interviewed, then sealed",
            reason:
              "The agent interviews the developer turn by turn, and the spec is sealed before any plan or code exists.",
            rejected: "Prompting straight to code.",
          },
          {
            choice: "A contract at the end of every agent answer",
            reason:
              "Each answer ends with JSON: done, question or blocked. Open questions go to the developer and are recorded, so the agent asks instead of inventing.",
            rejected: "Parsing free-form chat.",
          },
          {
            choice: "Check the files on disk, not the agent's report",
            reason:
              "SpecForge runs the tests itself and compares the files on disk. Tests are fingerprinted after the red phase, so nobody can edit them later to make the code pass.",
            rejected: "Accepting the agent's own report.",
          },
          {
            choice: "Automatic gates before any step moves forward",
            reason:
              "Linters, duplication checks, mutation testing, ArchUnit and migration checks run on every scenario.",
            rejected: "Review by eye only.",
          },
          {
            choice: "Legacy rewrites without invention",
            reason:
              "The agent reads the old code read-only. Every file:line it cites is opened and checked, and behaviour that nobody can explain becomes a question for a person.",
            rejected:
              "Letting the agent describe legacy behaviour from memory.",
          },
        ],
        implementation: [
          "A Go CLI built with Cobra on a hexagonal architecture, with 77% test coverage and CI on Windows, macOS and Linux, under the Apache 2.0 licence.",
          "Each scenario goes Red → Green → Refactor, with the developer's review and one commit per scenario.",
          "The handover is traceable: DELIVERY.md and the pull request body link each scenario to its test and its commit.",
          "Version 5 adds verified legacy rewrites, from Java 6 to Java 21, and ready-made Java, React, Python and Go projects.",
        ],
        result: [
          "Tested end to end on a Java 6 servlet application rewritten in Java 21.",
          "Every change is linked to a spec, a test and a commit.",
          "The AI works like a supervised junior engineer: it can propose anything, but only evidence moves the work forward.",
        ],
        stack: [
          "Go",
          "Cobra",
          "Hexagonal architecture",
          "Claude Code",
          "Gemini CLI",
          "chromedp",
          "TDD · BDD",
        ],
        diagram: [
          { label: "Spec interview", detail: "Turn by turn, then sealed" },
          { label: "Reviewed plan", detail: "Approved by the developer" },
          { label: "Agent", detail: "Claude Code or Gemini CLI" },
          { label: "Gates", detail: "Tests · mutation · ArchUnit · lint" },
          { label: "Human review", detail: "One commit per scenario" },
          { label: "Traceable delivery", detail: "DELIVERY.md · PR body" },
        ],
        links: [
          {
            label: "Source code on GitHub",
            href: "https://github.com/jefmonjor/specforge",
          },
          {
            label: "Releases",
            href: "https://github.com/jefmonjor/specforge/releases",
          },
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    homeTitle: "Let's talk",
    intro:
      "Tell me about your project in a few lines: the context, the problem and your timeline. I reply within one business day.",
    facts: [
      {
        label: "Availability",
        value:
          "Part-time work from January 2027. You can write now to plan a start date.",
      },
      { label: "Location", value: "Andorra · remote" },
      {
        label: "Time zone",
        value: "Andorra time: CET, UTC+1 in winter and UTC+2 in summer",
      },
      {
        label: "Reply time",
        value: "Within one business day (Monday to Friday)",
      },
    ],
    includeTitle: "Useful to include",
    include: [
      "What your company does and who uses the system",
      "The problem or the decision in front of you",
      "Your timeline and the format you have in mind",
    ],
    email: {
      label: "Email",
      write: "Write an email",
      copy: "Copy address",
      copied: "Address copied",
      copyFailed: "Could not copy. Select the address instead.",
      withoutJavaScript:
        "The email address appears when JavaScript is on. You can also write to me on LinkedIn.",
      subject: "Project enquiry — jefmonjor.dev",
      noMailApp:
        "This opens your email app. No email app? Copy the address and write from your webmail.",
    },
    elsewhere: "Also on",
  },
  footer: {
    location: "Andorra · Remote · Andorra time (CET)",
    fullCv: "Full CV",
    privacy: "Privacy",
  },
  privacy: {
    title: "Privacy",
    updated: "Last updated: 7 November 2026",
    sections: [
      {
        title: "Who is responsible",
        paragraphs: [
          [
            "Jefferson Montesdeoca Jordán, Andorra la Vella, Andorra. For anything about your data, write to the address on the ",
            { text: "contact page", href: "/contact" },
            ".",
          ],
        ],
      },
      {
        title: "What this site does not do",
        paragraphs: [
          [
            "No analytics, no advertising, no tracking cookies and no contact forms. Fonts and scripts are served from this domain; the pages load nothing from third parties.",
          ],
        ],
      },
      {
        title: "If you send me an email",
        paragraphs: [
          [
            "I receive your address and your message in my mailbox, which is hosted by Google. I use them only to answer you and, if we work together, to manage that work. I keep them while they are needed for that and for my legal obligations.",
          ],
        ],
      },
      {
        title: "The AI assistant and the tailored CV on /cv",
        paragraphs: [
          [
            "What you type into the assistant, or paste to get a CV tailored to a job offer, is sent to OpenAI to produce the answer. This site asks OpenAI not to store the responses and does not save your text on its own server. The conversation stays in your browser's session storage and disappears when you close the tab. Please do not paste personal or confidential information. OpenAI processes the text under its own API terms and privacy policy.",
          ],
        ],
      },
      {
        title: "Hosting and server logs",
        paragraphs: [
          [
            "The site runs on Vercel. Like any web server, it processes your IP address and the request to deliver each page and to protect the site against abuse. The AI features and the PDF downloads count requests per IP address, or per network for IPv6, in a counter store that deletes them within 24 hours.",
          ],
        ],
      },
      {
        title: "In your browser",
        paragraphs: [
          [
            "A cookie named NEXT_LOCALE remembers the language, and local storage remembers the theme and the background of /cv. They are functional only and never leave your device except as part of normal page requests.",
          ],
        ],
      },
      {
        title: "Legal basis and international transfers",
        paragraphs: [
          [
            "Email: to answer the request you send. AI features: because you choose to use them. Server logs and request counters: the legitimate interest in keeping the site secure and available. OpenAI, Vercel and Google are based in the United States and may process data outside Andorra and the EU under their own data-transfer safeguards.",
          ],
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          [
            "You can ask for access to your data, and for its correction, deletion, restriction or portability, or object to its use, under Andorra's Law 29/2021 on personal data protection and, where it applies, the GDPR. Write to the address on the ",
            { text: "contact page", href: "/contact" },
            ". You can also complain to the Andorran Data Protection Agency (APDA).",
          ],
        ],
      },
    ],
  },
}

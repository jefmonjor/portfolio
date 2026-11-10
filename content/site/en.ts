import type { SiteContent } from "@/content/site/types"

export const en: SiteContent = {
  meta: {
    home: {
      title: "Jefferson Montesdeoca — Software Architect & Senior Engineer",
      description:
        "I build new products, modernize existing systems and put AI to work inside them. Seven years, from a private bank's architecture team to my own products in production. Remote, CET.",
    },
    services: {
      title: "Custom software, integrations and applied AI — Services",
      description:
        "A review and roadmap in 1–5 days, custom software and integrations taken to production, or a fractional tech lead every week. Remote, CET.",
    },
    work: {
      title: "Case studies — Invoicing, apps, applied AI and banking",
      description:
        "Four case studies: the evolution of a private bank's Java platform, VERI*FACTU-compliant invoicing, an offline-first platform for writers and a private-by-design app.",
    },
    experience: {
      title: "Experience — Seven years in banking, legal, energy and telecom",
      description:
        "Solutions architect and technical PM at Andbank, senior engineer at elAbogado, and Java and big-data consulting for Vodafone and Endesa.",
    },
    contact: {
      title: "Contact — Let's discuss your project",
      description:
        "Remote, CET. Send a few lines about your project and get a reply within one business day.",
    },
    privacy: {
      title: "Privacy — what this site does with your data",
      description:
        "No analytics and no tracking cookies. What happens to the project form, to an email you send, to text you give the AI assistants, and to server logs.",
    },
  },
  nav: {
    label: "Main",
    home: "Home",
    services: "Services",
    work: "Work",
    experience: "Experience",
    cv: "CV",
    contact: "Contact",
    menu: "Menu",
    skipToContent: "Skip to content",
    toggleTheme: "Switch between light and dark theme",
    breadcrumb: "Breadcrumb",
  },
  cta: "Let's talk",
  hero: {
    role: "Software Architect · Senior Engineer",
    headline: [
      "I build new products,",
      "modernize existing systems",
      "and put AI to work inside them.",
    ],
    subtitle:
      "Seven years shipping software where mistakes are expensive: from a private bank's architecture team to products of my own, from the database to production.",
    cta: "Tell me about your project",
    availability: {
      status: "Open to projects, and to the right full-time role.",
    },
    stack: "Java · Spring · TypeScript · Applied AI",
    engagement: "Remote · CET · Full-time, part-time or project-based",
    seeWork: "See my work",
    terminalHint: "Prefer a terminal? Open it (Ctrl K)",
    tools: {
      label:
        "Main tools: Java, Spring Boot, PostgreSQL, Redis, Docker, Kubernetes, React and Claude. The full list is in the CV.",
      center: "Your system",
      caption:
        "And whatever the project needs: I have worked with Java, TypeScript, Dart, Go and Python.",
    },
    live: {
      title: "Live in production",
      items: [
        {
          name: "Transolido",
          slug: "transolido-verifactu-invoicing",
          what: "Invoicing",
          href: "https://www.transolido.com",
        },
        {
          name: "Other Twist",
          slug: "othertwist-offline-writing",
          what: "Writing app",
          href: "https://othertwist.com",
        },
        {
          name: "Ilnami",
          slug: "ilnami-private-by-design",
          what: "Food diary",
          href: "https://ilnami.com",
        },
      ],
    },
  },

  credentials: {
    label: "I have worked at",
    companies: ["Andbank", "elAbogado", "Vodafone", "Endesa"],
  },
  display: {
    capabilities: ["What I can take on"],
    approach: ["How I work"],
    work: ["Four sectors, same standard"],
    services: ["How we can work together"],
    about: ["Hi, I'm Jefferson"],
    contact: ["Tell me what you need to solve"],
  },
  approach: {
    intro:
      "AI speeds up the work. Automated tests and my review decide what reaches production, and I answer for the result.",
    pipeline: [
      { step: "Spec", by: "I define it" },
      { step: "Code", by: "AI speeds it up" },
      { step: "Tests", by: "Automated gate" },
      { step: "Review", by: "I answer for it", human: true },
      { step: "Production", by: "Monitored" },
    ],
    principles: [
      {
        title: "Validated contracts",
        body: "Whatever the AI reads or returns is checked against strict contracts before it is used.",
      },
      {
        title: "Deterministic where it matters",
        body: "Calculations and decisions stay in deterministic code; the AI explains, it does not decide.",
      },
      {
        title: "Limits and a manual path",
        body: "Usage limits to control cost, and a manual path if the AI fails.",
      },
      {
        title: "Closed source of truth",
        body: "An assistant answers only from the data you give it and says when something is missing.",
      },
    ],
  },

  capabilities: {
    intro:
      "Three kinds of work, each with a case study behind it. The stack adapts to the project.",
    items: [
      {
        title: "Build something new",
        body: "A product, a SaaS, an app or an API, from scratch to production.",
        points: [
          "Architecture and data model from day one",
          "Backend, frontend or mobile app",
          "Deployed, monitored and documented",
        ],
        caseSlug: "transolido-verifactu-invoicing",
        caseName: "Transolido",
      },
      {
        title: "Modernize what exists",
        body: "Systems that work but have fallen behind, improved without stopping delivery.",
        points: [
          "Java and Spring Boot upgrades",
          "From a monolith to clear modules, and technical debt measured",
          "Security and identity, with MFA",
        ],
        caseSlug: "private-bank-modernization",
        caseName: "Private bank",
      },
      {
        title: "Integrate AI",
        body: "AI inside your processes, with limits and human review.",
        points: [
          "Assistants that answer from your own data",
          "Automation with a person confirming",
          "Validated contracts and a manual path if the AI fails",
        ],
        caseSlug: "ilnami-private-by-design",
        caseName: "Ilnami",
      },
    ],
    caseLabel: "Case study",
  },
  hiring: {
    title: "Also open to the right full-time role",
    body: "If the fit is right: product work, a senior team, AI applied seriously and remote work.",
    cvLink: "See the full CV",
  },

  about: {
    title: "About",
    lead: "I own the whole system: design, code, deployment and handover.",
    paragraphs: [
      [
        "I work in the architecture and solutions team at Andbank, a private bank in Andorra. Before that I worked at elAbogado as a full-stack developer and, as a consultant, on projects for Vodafone and Endesa. I also build and run my own products. The details are on the ",
        { text: "experience page", href: "/experience" },
        " and in my ",
        { text: "full CV", href: "/cv" },
        ".",
      ],
      [
        "I work remotely and write decisions down, so anyone can pick up the work later.",
      ],
    ],
    principle:
      "I take on few projects at a time. If yours is not a good fit, I will say so and recommend someone else.",
    signature: "Jefferson",
    facts: [
      { label: "Based in", value: "Andorra, CET" },
      { label: "Languages", value: "Spanish (native) and English" },
      { label: "Works", value: "Remote, from diagnosis to production" },
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
      "Three formats for three moments: before deciding, while building and once it is running. Whatever your stack is, I learn it quickly and take ownership of it.",
    statement:
      "Three formats for three moments: before deciding, while building and once it is running.",
    items: [
      {
        id: "advisory",
        name: "Review and roadmap",
        summary:
          "A written look at a process, a system or an idea: what to automate, what to build and what not to.",
        audience:
          "CTOs and companies that want a second opinion or a clear plan before investing.",
        includes: [
          "A map of the current process and the tools involved",
          "Where automation or AI pays off, and where it does not",
          "Architecture or code review of an existing system",
          "Build, buy or integrate: a reasoned recommendation",
          "A prioritised plan with scope and next steps",
        ],
        deliverable:
          "A written report: what works, the risks, and a prioritised plan.",
        format:
          "1 to 5 days. You receive a written report with findings, risks and a prioritised plan.",
      },
      {
        id: "delivery",
        name: "Build and integrate",
        summary:
          "Custom software, APIs and integrations, automation and applied AI, taken all the way to production.",
        audience:
          "Teams that need a new product built, an existing system modernised or AI integrated into it.",
        includes: [
          "Custom business software and internal tools",
          "APIs and integrations with ERPs, payment providers and third-party services",
          "Automation of documents and repetitive work, with AI reviewed by a person",
          "Java and Spring Boot backends, migrations and upgrades",
          "Deployment, monitoring, documentation and handover",
        ],
        deliverable:
          "Software in production, with the code, the documentation and the handover.",
        format:
          "A daily rate, or a fixed price for a fixed scope, at 10 to 15 hours per week.",
      },
      {
        id: "fractional",
        name: "Fractional tech lead",
        summary:
          "Senior engineering every week, for teams without a technical lead or with a CTO who needs support.",
        audience:
          "Companies and startups that need technical direction and steady evolution.",
        includes: [
          "Recurring architecture and code reviews",
          "Technical roadmap and priorities",
          "Evolution and maintenance of what we built",
          "Bringing AI into real processes, with limits and a manual way to work when the AI fails",
        ],
        deliverable:
          "Technical decisions, reviews and a roadmap your team can follow.",
        format: "Monthly agreement, 4 to 8 hours per week.",
      },
    ],
    audienceLabel: "Best for",
    includesLabel: "Includes",
    deliverableLabel: "You get",
    formatLabel: "Format",
    details: "See the services in detail",
    startTitle: "How we start working together",
    startSteps: [
      {
        step: "You write to me and we book a 30-minute video call about your context and your problem.",
        deliverable:
          "A straight answer on whether I am the right person, and what the first step would be.",
      },
      {
        step: "A one-page written proposal.",
        deliverable:
          "Scope, format, dates and the rate in writing, before you commit to anything.",
      },
      {
        step: "We start.",
        deliverable:
          "Software in production, with the code, the documentation and the handover.",
      },
    ],
    rates:
      "Rates depend on the scope and the format. You receive them in the written proposal.",
    closing:
      "I take on work I can do well and sustain. If your project is not a good fit, I will tell you and point you somewhere better.",
  },
  experience: {
    title: "Experience",
    intro: "Seven years in banking, legal, energy and telecom.",
    groups: [
      {
        id: "andbank",
        period: "2024 — present",
        organization: "Andbank",
        role: "Architecture and solutions team",
        summary:
          "Backend architecture, integration with existing systems and technical coordination with teams and vendors.",
        highlights: [
          "Backend design of new services in Java 21 and Spring Boot 3 on OpenShift.",
          "Integration with the existing core (COBOL, AS400, DB2) through adapters.",
          "Framework and server upgrades, identity with Keycloak and code quality with SonarQube.",
          "Rolling out AI tools for the team.",
        ],
        entries: ["andbank-2024"],
      },
      {
        id: "elabogado",
        period: "2022 — 2024",
        organization: "elAbogado",
        role: "Senior Full Stack Engineer",
        summary:
          "Full-stack development on the platform: React, Spring Boot, microservices and APIs.",
        highlights: [
          "Full-stack development with React and Spring Boot.",
          "Took part in the migration from Struts2 to microservices and REST APIs.",
          "Performance and maintainability improvements to the platform.",
        ],
        entries: ["elabogado-2022"],
      },
      {
        id: "consulting",
        period: "2019 — 2022",
        organization: "Zemsania · Keapps (Atos) · Ayesa",
        role: "Software Engineer, consulting",
        summary:
          "Java microservices for Vodafone and data platforms for Endesa.",
        highlights: [
          "Java microservices and OpenAPI-documented APIs for Vodafone.",
          "Java systems and data processing with Hadoop and Spark for Endesa.",
        ],
        entries: ["zemsania-2021", "keapps-2020", "ayesa-2019"],
      },
    ],
    present: "present",
    cvLead: "Need the complete CV, skills and education?",
    cvLink: "Open the full CV and PDF",
  },
  work: {
    title: "Case studies",
    intro:
      "Four projects, each told the same way: the problem, the decisions, the solution and what you can check. Three are products I built and run myself; one is a bank's platform, anonymised.",
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
        sector: "Professional experience · Private banking",
        title: "Evolving a private bank's Java platform",
        outcome:
          "Java services on top of a COBOL and AS400 core, in a bank that operates in several jurisdictions: incremental upgrades, a new online banking architecture and one identity provider with MFA.",
        tags: ["Java 21", "Spring Boot 3", "Keycloak"],
        meta: {
          title: "Case study: evolving a private bank's Java platform",
          description:
            "Clean architecture, legacy integration behind adapters, Spring Boot 3 upgrades and central identity for a private bank in Andorra, without a delivery freeze.",
        },
        summary: {
          sector:
            "A private bank in Andorra that operates in several jurisdictions",
          role: "Architecture and solutions team, since 2024",
          result:
            "The bank modernizes without freezing releases: upgrades in small, lower-risk steps, a single identity provider with MFA, and technical debt that can now be measured.",
        },
        context: [
          "The bank serves its customers through Java applications that sit on top of a much older core: COBOL programs on AS400, with DB2 as the system of record. Over the years the Java side had fallen behind the current versions of its framework and application servers.",
          "The bank needed a new homebanking, stronger customer authentication and a platform it could keep up to date. Stopping feature work for a long migration was not an option.",
        ],
        responsibility: {
          owned: [
            "Backend architecture for new services and the new homebanking",
            "Development standards for internal teams and vendors",
            "The technical plan for the framework and application server upgrades",
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
          "The work is shared between internal teams and external vendors. From the architecture team, I define standards for vendors, review designs and propose what to build and what to buy.",
          "New services use Java 21 and Spring Boot 3 and run on OpenShift. Access to the legacy core goes through adapters, so the services do not depend on COBOL or DB2 details.",
          "SonarQube quality gates run on every repository, including the COBOL code.",
          "I also took part in the department's first AI adoption: Gemini Code Assist for the team.",
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
        slug: "transolido-verifactu-invoicing",
        screenshotAlt:
          "Transolido's sign-in page at transolido.com, with a link to its VERI*FACTU declaration",
        sector: "Own product · Invoicing SaaS",
        title:
          "Invoicing that keeps small businesses compliant with Spain's VERI*FACTU",
        outcome:
          "Live at transolido.com: compliant invoices with full traceability, and AI that helps capture data without bypassing the rules.",
        tags: ["Java 21 · Spring Boot", "VERI*FACTU", "Claude API"],
        meta: {
          title: "Case study: Transolido, VERI*FACTU-compliant invoicing",
          description:
            "A modular Java 21 and Spring Boot monolith with its own JWT authentication, Redis events, PostgreSQL on Neon and AI-assisted data extraction, built for Spain's invoicing rules.",
        },
        summary: {
          sector: "Business software (SaaS), my own product",
          role: "Everything: product, architecture, backend, frontend and operations",
          result:
            "Invoices that comply with VERI*FACTU without a report bolted on at the end: compliance lives in the core, and the AI saves typing without being able to issue an invoice on its own. Live at transolido.com.",
        },
        context: [
          "Spain's VERI*FACTU rules change how invoicing software must behave: every invoice has to be traceable, and records cannot be quietly altered once they are issued. For a small business this is not a feature request; it is a legal requirement.",
          "Transolido is invoicing software built around that requirement. Compliance had to live in the core of the system, not in a report added at the end.",
        ],
        responsibility: {
          owned: [
            "Product definition and scope",
            "Domain model and module boundaries",
            "Authentication and security",
            "Compliance and traceability",
            "AI-assisted data extraction and its limits",
            "Deployment and operations",
          ],
          notOwned: [
            "The managed platforms underneath — Neon, Upstash, Google Cloud Run and Vercel — which I chose and configured but do not operate",
            "The regulation itself, set by the Spanish tax authority",
          ],
        },
        decisions: [
          {
            choice: "A modular monolith instead of microservices",
            reason:
              "One deployable unit with clear module boundaries is simple to run for a single team, and a module can still be split out later if it needs to scale on its own.",
            rejected: "Microservices from day one.",
          },
          {
            choice: "Traceability enforced by the backend",
            reason:
              "Every invoice keeps the complete record the regulation asks for, and the rules are enforced by the backend, not by the screen.",
            rejected: "Adding compliance as an export at the end.",
          },
          {
            choice: "My own JWT authentication",
            reason:
              "Authentication stays inside the backend, with tokens the API checks on every request.",
            rejected: "Delegating the whole identity layer to a third party.",
          },
          {
            choice: "Events over Redis",
            reason:
              "Work that does not need to block the user travels as events on Upstash Redis, so the API answers fast and the steps stay decoupled.",
            rejected: "Doing every step inside the request.",
          },
          {
            choice: "AI that helps capture data and never issues invoices",
            reason:
              "The Claude API extracts data to save typing; what it returns goes through the same validation as manual entry before it becomes an invoice.",
            rejected: "Letting the model write records directly.",
          },
        ],
        implementation: [
          "Java 21 and Spring Boot 3 on Google Cloud Run, PostgreSQL on Neon and events on Upstash Redis. The frontend is React on Vercel.",
          "Each module owns its part of the domain and talks to the others through explicit interfaces, so the monolith stays easy to change.",
        ],
        result: [
          "Live at transolido.com.",
          "VERI*FACTU compliance with full traceability.",
          "Own authentication and event streaming on managed infrastructure: Neon, Upstash, Cloud Run and Vercel.",
          "AI that speeds up data entry without bypassing the rules.",
        ],
        stack: [
          "Java 21",
          "Spring Boot 3",
          "PostgreSQL · Neon",
          "Upstash Redis",
          "React",
          "Claude API",
          "VERI*FACTU",
          "Google Cloud Run",
          "Vercel",
        ],
        diagram: [
          { label: "React app", detail: "Vercel" },
          {
            label: "JWT authentication",
            detail: "Own tokens, checked per request",
          },
          { label: "Spring Boot modules", detail: "Java 21 · Cloud Run" },
          { label: "Claude API", detail: "Extracts data · backend validates" },
          { label: "Redis events", detail: "Upstash · decoupled steps" },
          { label: "PostgreSQL · Neon", detail: "VERI*FACTU traceability" },
        ],
        links: [
          { label: "transolido.com", href: "https://www.transolido.com" },
        ],
      },
      {
        slug: "othertwist-offline-writing",
        screenshotAlt:
          "Other Twist's landing page at othertwist.com, with the app's project library on a phone",
        sector: "Own product · App and backend",
        title: "A writing platform that keeps working without a connection",
        outcome:
          "Live at othertwist.com: writers keep working without a connection, and their changes sync when they are back online.",
        tags: ["Flutter · offline-first", "Java 21 · hexagonal", "Docker"],
        meta: {
          title:
            "Case study: Other Twist, an offline-first platform for writers",
          description:
            "A Flutter app with a local store and sync, on a Java 21 and Spring Boot hexagonal backend with OAuth2/JWT, Flyway and Redis, containerised and moving to a self-hosted server.",
        },
        summary: {
          sector: "Platform for writers, my own product",
          role: "Everything: product, app, backend and operations",
          result:
            "Writers lose neither their work nor the moment when the connection drops: the app keeps working and syncs when they are back online. Live at othertwist.com.",
        },
        context: [
          "Writers do not always write with a connection: on a train, in a café, somewhere with poor coverage. A writing tool that stops working offline loses the moment it was opened for.",
          "Other Twist is an all-in-one platform for writers. The app had to treat offline as the normal case, and the backend had to receive the changes later.",
        ],
        responsibility: {
          owned: [
            "Product definition and scope",
            "Flutter app: local store, state and navigation",
            "Sync between the app and the backend",
            "Hexagonal backend, authentication and migrations",
            "Containers and the move to a self-hosted server",
          ],
          notOwned: [
            "Supabase Auth, used as the identity provider",
            "The hosting providers: Google Cloud Run today, a netcup server as the destination",
          ],
        },
        decisions: [
          {
            choice: "Offline-first, with a local database in the app",
            reason:
              "Drift on SQLite keeps the writing on the device, so the app works the same with or without a connection and syncs when it can.",
            rejected: "An app that needs the network for every action.",
          },
          {
            choice: "Hexagonal architecture in the backend",
            reason:
              "The domain does not depend on the framework, the database or the identity provider; each of them is an adapter that can change without rewriting the rules.",
            rejected:
              "Business logic spread across controllers and repositories.",
          },
          {
            choice: "OAuth2 and JWT with Supabase Auth",
            reason:
              "A proven identity provider handles sign-in; the Java backend verifies the tokens on every request.",
            rejected: "Building sign-in from scratch.",
          },
          {
            choice: "A versioned schema with Flyway",
            reason:
              "Every database change is a migration in the repository, so any environment can be rebuilt to the same state.",
            rejected: "Changing the database by hand.",
          },
          {
            choice: "Containers, to own the deployment",
            reason:
              "Docker images run the same anywhere, which turns the move from Cloud Run to a self-hosted server into a deployment change.",
            rejected: "Depending on one provider's runtime.",
          },
        ],
        implementation: [
          "Flutter with Riverpod for state and GoRouter for navigation; Drift on SQLite as the local store, synchronised with the backend.",
          "Java 21 and Spring Boot 3.5 in a hexagonal architecture, with OAuth2/JWT through Supabase Auth, Flyway migrations, Redis and PostgreSQL, packaged with Docker.",
          "The website is othertwist.com and the app signs in at app.othertwist.com.",
        ],
        result: [
          "Live at othertwist.com, with the app at app.othertwist.com.",
          "Writing works without a connection and syncs when it returns.",
          "A backend whose domain does not depend on its framework or its providers.",
          "Containerised, and moving from Google Cloud Run to a self-hosted server.",
        ],
        stack: [
          "Flutter",
          "Riverpod",
          "GoRouter",
          "Drift · SQLite",
          "Java 21",
          "Spring Boot 3.5",
          "Supabase Auth",
          "PostgreSQL",
          "Redis",
          "Flyway",
          "Docker",
        ],
        diagram: [
          { label: "Flutter app", detail: "Riverpod · GoRouter" },
          { label: "Drift · SQLite", detail: "Local store · works offline" },
          { label: "Sync", detail: "Changes travel when online" },
          { label: "Supabase Auth", detail: "OAuth2 · JWT" },
          {
            label: "Spring Boot · hexagonal",
            detail: "Java 21 · domain at the centre",
          },
          { label: "PostgreSQL · Redis", detail: "Flyway · Docker" },
        ],
        links: [{ label: "othertwist.com", href: "https://othertwist.com" }],
      },
      {
        slug: "ilnami-private-by-design",
        screenshotAlt:
          "Ilnami's landing page at ilnami.com, with the app's map of saved visits on a phone",
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
          result:
            "Each diary stays private because the database enforces it, not just the screen, and the AI saves time without saving anything on its own. Live at ilnami.com, in Spanish and English.",
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
    ],
  },
  contact: {
    title: "Contact",
    homeTitle: "Let's talk",
    intro:
      "Tell me about your project in a few lines. I reply within one business day and, if it fits, we talk for 30 minutes with no commitment.",
    facts: [
      {
        label: "Availability",
        value:
          "Projects at 10 to 15 hours per week, or full-time in the right role.",
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
    email: {
      label: "Email",
      write: "Write an email",
      copy: "Copy address",
      copied: "Address copied",
      copyFailed: "Could not copy. Select the address instead.",
      withoutJavaScript:
        "Write to me at hola (at) jefmonjor.dev, or on LinkedIn.",
      subject: "Project enquiry — jefmonjor.dev",
      noMailApp:
        "This opens your email app. No email app? Copy the address and write from your webmail.",
    },
    brief: {
      title: "Tell me about your project",
      intro:
        "Six short questions and your email. It reaches me directly and I reply within one business day; nothing is stored on this site.",
      fields: {
        name: "Your name",
        email: "Your email",
        company: "Company (optional)",
        problem: "What do you need to solve?",
        problemHint:
          "Describe it in your own words; you do not need to know the technology.",
        type: "Type of project",
        budget: "Approximate budget",
        timeline: "When would you like to start?",
      },
      projectTypes: [
        "Custom software",
        "Process automation",
        "System integration and APIs",
        "Applied AI",
        "Architecture and modernisation",
        "Not sure yet, I need guidance",
      ],
      budgets: [
        "Less than €2,000",
        "€2,000–5,000",
        "€5,000–10,000",
        "€10,000–25,000",
        "More than €25,000",
        "I need an estimate",
      ],
      timelines: [
        "As soon as possible",
        "In 1–3 months",
        "In 3–6 months",
        "Just exploring",
      ],
      submit: "Send",
      copy: "Copy the text",
      copied: "Text copied",
      copyFailed: "Could not copy the text",
      required: "Write your name, your email and the problem to continue.",
      invalidEmail: "Check your email: I need it to reply.",
      sending: "Sending…",
      sent: "Received. I will reply within one business day to the email you left.",
      fallback:
        "It could not be sent from the site, so your email app opens with everything written. If nothing happens, copy the text and paste it into your webmail.",
      emailLabels: {
        name: "Name",
        email: "Email",
        company: "Company",
        type: "Project",
        budget: "Budget",
        timeline: "Start",
        problem: "The problem",
      },
      subject: "Project brief — jefmonjor.dev",
    },
    direct: "Prefer to write directly?",
    elsewhere: "Also on",
  },
  footer: {
    location: "Andorra · Remote · CET",
    privacy: "Privacy",
    backToTop: "Back to top",
  },
  console: {
    assistant: {
      open: "Ask the AI",
      title: "Ask about my work",
      intro:
        "An assistant that answers only from this site: services, cases, how I work and availability. For anything else, write to me.",
      placeholder: "Ask a question…",
      send: "Send",
      close: "Close the assistant",
      suggestions: [
        "What could you build for my business?",
        "When can we start?",
        "How do you use AI without breaking things?",
      ],
      thinking: "Thinking…",
      errors: {
        rate_limited:
          "That is the limit of questions for now. Try again later or write to me.",
        unconfigured:
          "The assistant is not available right now. Write to me instead.",
        upstream:
          "The assistant could not answer this time. Write to me instead.",
        bad_request: "I could not send that question. Try rephrasing it.",
        network: "No connection. Check it and try again, or write to me.",
      },
      email: "Write me an email",
      brief: "Fill in the project brief",
      disclaimer:
        "Answers are generated by AI from this site and can be wrong. Nothing you type is saved on this site.",
    },
    terminal: {
      open: "Open the terminal",
      title: "Terminal",
      close: "Close the terminal",
      prompt: "visitor@jefmonjor.dev:~$",
      banner: [
        "Jefferson Montesdeoca — Senior Software Engineer · Software Architect",
        "type 'help' to start · Tab completes · Esc or ` closes",
      ],
      thinking: "asking the assistant…",
      helpTitle: "AVAILABLE COMMANDS",
      commands: {
        help: "list the commands",
        whoami: "who I am",
        ls: "list sections, or products with ls projects",
        projects: "my products in production",
        open: "open a product in a new tab",
        cat: "read services, work, experience, skills, contact or a product",
        services: "the three ways to work together",
        work: "the case studies",
        how: "how I work with AI",
        experience: "where I have worked",
        skills: "the technologies I use most",
        availability: "when I can start",
        contact: "how to reach me",
        mail: "write me an email",
        brief: "open the project brief",
        cv: "open my full CV",
        ask: "ask the AI assistant",
        theme: "switch theme: dark or light",
        lang: "switch to Spanish",
        goto: "scroll to a section of the home page",
        date: "my local time in Andorra",
        clear: "clear the screen",
        exit: "close the terminal",
      },
      usage: {
        ls: "ls [projects]",
        open: "open <product>",
        cat: "cat <topic>",
        ask: "ask <question>",
        theme: "theme [dark|light]",
        goto: "goto <section>",
      },
      notFound: "command not found: %s — type 'help'",
      usageOpen: "usage: open <product> — try 'projects'",
      unknownProduct: "no product called %s — try 'projects'",
      privateProduct: "%s is in development — no public link yet",
      usageGoto: "usage: goto <section> — available: %s",
      catUsage: "usage: cat <services|work|experience|skills|contact|product>",
      askUsage: "usage: ask <your question>",
      opening: "opening %s…",
      sudo: "nice try — you are already root here.",
      emailLabel: "Email",
      briefLabel: "Project brief",
    },
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
            "No analytics, no advertising and no tracking cookies. Fonts and scripts are served from this domain; the pages load nothing from third parties.",
          ],
        ],
      },
      {
        title: "If you send me the project form",
        paragraphs: [
          [
            "What you write in the form on the contact page reaches me as an email through Brevo (Sendinblue SAS, France), the service that sends this domain's email. This site does not store it: Brevo keeps a record of the delivery under its own terms, and the message stays in my mailbox like any email. I use it only to answer you. If sending fails, the form opens your own email app with the text.",
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
        title: "The AI assistants and the tailored CV on /cv",
        paragraphs: [
          [
            "What you type into the assistant on this site or on /cv, or paste to get a CV tailored to a job offer, is sent to OpenAI to produce the answer. This site asks OpenAI not to store the responses and does not save your text on its own server. The conversation stays in your browser's session storage and disappears when you close the tab. Please do not paste personal or confidential information. OpenAI processes the text under its own API terms and privacy policy.",
          ],
        ],
      },
      {
        title: "Hosting and server logs",
        paragraphs: [
          [
            "The site runs on Vercel. Like any web server, it processes your IP address and the request to deliver each page and to protect the site against abuse. The AI features, the project form and the PDF downloads count requests per IP address, or per network for IPv6, in a counter store that deletes them within 24 hours.",
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
            "Email and the project form: to answer the request you send. AI features: because you choose to use them. Server logs and request counters: the legitimate interest in keeping the site secure and available. OpenAI, Vercel and Google are based in the United States and may process data outside Andorra and the EU under their own data-transfer safeguards; Brevo processes data in the EU.",
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

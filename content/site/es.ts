import type { SiteContent } from "@/content/site/types"

export const es: SiteContent = {
  meta: {
    home: {
      title:
        "Jefferson Montesdeoca — Software Architect & Senior Backend Engineer",
      description:
        "Sistemas backend para bancos y fintechs, y la IA que funciona dentro de ellos. Asesoría técnica, desarrollo y arquitectura fraccional. Andorra, remoto, CET.",
    },
    services: {
      title:
        "Servicios — Asesoría técnica, desarrollo y arquitectura fraccional",
      description:
        "Tres formas de trabajar juntos: una segunda opinión por escrito, desarrollo backend con Java y Spring, o un arquitecto unas horas a la semana.",
    },
    work: {
      title: "Casos de estudio — Banca, producto e IA aplicada",
      description:
        "Tres casos: la modernización de la plataforma Java de un banco privado, una app privada por diseño construida en solitario y código escrito por IA con estándares de ingeniería.",
    },
    experience: {
      title:
        "Experiencia — Siete años en banca, legal, energía y telecomunicaciones",
      description:
        "Arquitecto de soluciones y technical PM en Andbank, ingeniero sénior en elAbogado y consultoría Java y big data para Vodafone y Endesa.",
    },
    contact: {
      title: "Contacto — Hablemos de tu proyecto",
      description:
        "Disponible para colaboraciones a tiempo parcial desde enero de 2027. Remoto, CET. Escribe unas líneas sobre tu proyecto y te respondo en un día laborable.",
    },
    privacy: {
      title: "Privacidad — qué hace esta web con tus datos",
      description:
        "Sin analítica, sin cookies de seguimiento, sin formularios de contacto. Qué pasa con un email que envías, con el texto que das al asistente de IA de /cv y con los registros del servidor.",
    },
  },
  nav: {
    label: "Principal",
    home: "Inicio",
    services: "Servicios",
    work: "Casos",
    experience: "Experiencia",
    contact: "Contacto",
    menu: "Menú",
    skipToContent: "Saltar al contenido",
    toggleTheme: "Cambiar entre tema claro y oscuro",
    breadcrumb: "Ruta de navegación",
  },
  cta: "Hablemos de tu proyecto",
  hero: {
    role: "Software Architect & Senior Backend Engineer",
    eyebrow: "Software Architect · Backend · IA aplicada",
    headline: [
      "Diseño y construyo los sistemas backend sobre los que funcionan ",
      { emphasis: "bancos y fintechs" },
      ", y la ",
      { emphasis: "IA" },
      " que empieza a funcionar dentro de ellos.",
    ],
    subtitle:
      "Backends Java y Spring, integración con legacy y arquitectura mantenible.",
    availability: {
      status: "Disponible a tiempo parcial desde enero de 2027",
      detail: "Remoto\u00a0· Hora de Andorra (CET)",
    },
    proof: [
      "7 años en banca y sistemas críticos",
      "Arquitecto en banca privada",
      "Productos propios en producción",
    ],
    seeWork: "Ver trabajos seleccionados",
  },
  credentials: {
    label: "Experiencia en",
    companies: ["Andbank", "elAbogado", "Vodafone", "Endesa"],
    stats: [
      { value: 7, label: "años en banca y sistemas críticos" },
      {
        value: 4,
        label: "sectores: banca, legal, energía y telecomunicaciones",
      },
    ],
  },
  about: {
    title: "Sobre mí",
    lead: "Siete años construyendo software donde los errores salen caros.",
    paragraphs: [
      [
        "Hoy soy arquitecto de soluciones y technical PM en Andbank, un banco privado de Andorra. Antes modernicé la plataforma de elAbogado, el marketplace legal líder en España, y construí sistemas Java y de big data para empresas de energía y telecomunicaciones como consultor. En paralelo, construyo mis propios productos desde la primera tabla de la base de datos hasta producción. Tienes el detalle en la ",
        { text: "página de experiencia", href: "/experience" },
        ".",
      ],
      [
        "Trabajo en remoto y en asíncrono, y dejo las decisiones por escrito: qué elegimos, por qué y qué descartamos. Mi objetivo es un sistema que tu equipo pueda operar y cambiar sin mí: la arquitectura documentada, tests que explican el comportamiento y un traspaso completo del código, los documentos y el conocimiento. Tienes tres ejemplos en los ",
        { text: "casos de estudio", href: "/work" },
        ".",
      ],
    ],
  },
  selectedWork: {
    title: "Trabajo seleccionado",
    readCase: "Leer el caso",
    allCases: "Todos los casos",
  },
  services: {
    title: "Servicios",
    homeTitle: "Cómo podemos trabajar juntos",
    intro:
      "Tres formatos para tres situaciones. Todos empiezan igual y terminan con algo que tu equipo puede usar sin mí.",
    items: [
      {
        id: "advisory",
        name: "Technical Advisory",
        summary:
          "Una segunda opinión sénior sobre tu arquitectura, tu backend o tu plan de modernización, entregada por escrito.",
        audience:
          "Equipos que necesitan una segunda opinión sénior antes de una decisión difícil de deshacer.",
        includes: [
          "Revisión de arquitectura",
          "Auditoría de backend y de código",
          "Plan de modernización de sistemas legacy",
          "Elección del stack y decidir si construir o comprar",
          "Due diligence técnica: una revisión técnica antes de invertir o comprar",
        ],
        format:
          "De 1 a 5 días. Recibes un informe escrito con hallazgos, riesgos y un plan priorizado.",
      },
      {
        id: "delivery",
        name: "Engineering Delivery",
        summary:
          "Diseño y construyo el backend con tu equipo: servicios Java y Spring, integraciones, migraciones y puesta en producción.",
        audience:
          "Empresas que necesitan construir o modernizar un backend y llevarlo a producción.",
        includes: [
          "Backends con Java y Spring Boot",
          "Integraciones: core bancario, banca como servicio (BaaS), pasarelas de pago y APIs de terceros",
          "Microservicios y APIs",
          "Migraciones y actualizaciones de framework",
          "Preparación y puesta en producción",
        ],
        format:
          "Por día o a precio cerrado para un alcance cerrado. Desde enero de 2027: de 10 a 15 horas por semana; jornada completa cuando mi disponibilidad lo permita.",
      },
      {
        id: "fractional",
        name: "Fractional Architecture",
        summary:
          "Un arquitecto unas horas cada semana, para equipos que todavía no tienen uno.",
        audience:
          "Startups y equipos sin arquitecto que necesitan dirección técnica cada semana.",
        includes: [
          "Revisiones periódicas de arquitectura y de código",
          "Roadmap técnico",
          "Mentoría del equipo",
          "IA en procesos reales, con límites y una forma manual de trabajar cuando la IA falla",
        ],
        format: "Acuerdo mensual, de 4 a 8 horas por semana.",
      },
    ],
    audienceLabel: "Para",
    includesLabel: "Incluye",
    formatLabel: "Formato",
    details: "Ver los servicios en detalle",
    startTitle: "Cómo empezamos a trabajar juntos",
    startSteps: [
      "Me escribes y reservamos una videollamada de 30 minutos sobre tu contexto y tu problema.",
      "Una propuesta escrita de una página: alcance, formato y fechas.",
      "Empezamos.",
    ],
    rates:
      "Las tarifas dependen del alcance y del formato. Las recibes en la propuesta escrita.",
    closing:
      "Acepto trabajo que puedo hacer bien y sostener. Si tu proyecto no encaja, te lo diré y te indicaré a alguien mejor.",
  },
  experience: {
    title: "Experiencia",
    intro:
      "Siete años en banca, legal, energía y telecomunicaciones. En cada puesto: de qué era responsable y qué entregué.",
    groups: [
      {
        id: "andbank",
        period: "2024 — actualidad",
        organization: "Andbank",
        role: "Arquitecto de Soluciones / Technical PM",
        summary:
          "Arquitectura backend, integración de sistemas legacy y dirección técnica en banca privada.",
        entries: ["andbank-2024"],
      },
      {
        id: "elabogado",
        period: "2022 — 2024",
        organization: "elAbogado",
        role: "Senior Full Stack Engineer",
        summary:
          "Modernicé el marketplace legal líder en España: de Struts2 a React y Spring Boot, con microservicios y APIs seguras.",
        entries: ["elabogado-2022"],
      },
      {
        id: "consulting",
        period: "2019 — 2022",
        organization: "Zemsania · Keapps (Atos) · Ayesa",
        role: "Ingeniero de software, consultoría",
        summary:
          "Microservicios Java para Vodafone y plataformas de big data para Endesa.",
        entries: ["zemsania-2021", "keapps-2020", "ayesa-2019"],
      },
    ],
    fullHistory: "Experiencia completa",
    present: "actualidad",
    cvLead: "¿Necesitas el CV completo, las habilidades y la formación?",
    cvLink: "Abrir el CV completo y el PDF",
  },
  work: {
    title: "Casos de estudio",
    intro:
      "Tres proyectos desde tres ángulos: la plataforma de un banco, un producto que construí en solitario y una IA sometida a estándares de ingeniería. Cada página explica el contexto, mis decisiones y el resultado.",
    labels: {
      sector: "Sector",
      role: "Mi papel",
      outcome: "Resultado",
      context: "Contexto",
      responsibility: "Responsabilidad",
      owned: "Qué era mío",
      notOwned: "Qué no era mío",
      decisions: "Decisiones",
      reason: "Por qué",
      rejected: "Alternativa descartada",
      implementation: "Implementación",
      results: "Resultado",
      stack: "Stack",
      architecture: "Arquitectura simplificada",
      next: "Siguiente caso",
    },
    cases: [
      {
        slug: "private-bank-modernization",
        sector: "Banca privada",
        title:
          "Modernizar la plataforma Java de un banco privado sin parar las entregas",
        outcome:
          "Actualizaciones de plataforma, una nueva arquitectura de banca online y un único proveedor de identidad, mientras el banco seguía lanzando versiones.",
        tags: ["Java 21", "Spring Boot 3", "Keycloak"],
        meta: {
          title: "Caso: modernizar la plataforma Java de un banco privado",
          description:
            "Arquitectura limpia, integración del legacy tras adaptadores, migración a Spring Boot 3 e identidad centralizada para un banco privado de Andorra, sin congelar las entregas.",
        },
        summary: {
          sector:
            "Un banco privado de Andorra que opera en varias jurisdicciones",
          role: "Arquitecto de soluciones y technical PM, desde 2024",
          result:
            "Una plataforma que avanza en pasos pequeños y una nueva arquitectura de banca online, sin detener las entregas.",
        },
        context: [
          "El banco atiende a sus clientes con aplicaciones Java que se apoyan en un core mucho más antiguo: programas COBOL sobre AS400, con DB2 como sistema de registro. Con los años, la parte Java se había quedado atrás respecto a las versiones actuales de su framework y de sus servidores de aplicaciones.",
          "El banco necesitaba una nueva banca online, una autenticación de clientes más fuerte y una plataforma que pudiera mantener al día. Parar el desarrollo de funcionalidades durante una migración larga no era una opción.",
        ],
        responsibility: {
          owned: [
            "La arquitectura backend de los nuevos servicios y de la nueva banca online",
            "Los estándares de desarrollo para equipos internos y proveedores",
            "El plan y la dirección técnica de las actualizaciones de framework y de servidor de aplicaciones",
            "El despliegue de identidad con Keycloak",
            "Las herramientas de calidad de código en todos los repositorios",
            "La gestión técnica de proveedores y las recomendaciones de construir o comprar",
            "La evaluación de herramientas de IA para el equipo",
          ],
          notOwned: [
            "El core COBOL y AS400 y su roadmap, que siguen en manos de sus responsables",
            "Las prioridades de negocio y el roadmap de producto",
          ],
        },
        decisions: [
          {
            choice: "Arquitectura limpia y hexagonal en cada servicio nuevo",
            reason:
              "Las reglas de negocio viven separadas del framework y de los adaptadores del legacy. La próxima actualización de framework cambia los bordes, no el dominio.",
            rejected:
              "Capas clásicas construidas alrededor del framework, que atan las reglas de negocio a una versión concreta.",
          },
          {
            choice:
              "Integrar el core legacy tras adaptadores en lugar de reescribirlo",
            reason:
              "El core guarda los registros del banco y funciona. Reescribirlo es un riesgo de varios años que no ayuda al roadmap de cara al cliente.",
            rejected: "Sustituir el core de golpe.",
          },
          {
            choice: "Actualizar la plataforma en incrementos pequeños",
            reason:
              "Cada paso — la migración a Spring Boot 3 con el espacio de nombres Jakarta, las actualizaciones del servidor de aplicaciones — es lo bastante pequeño para probarlo y revertirlo mientras sigue el desarrollo.",
            rejected:
              "Un proyecto de congelar y migrar que detiene las entregas durante meses.",
          },
          {
            choice:
              "Un único proveedor de identidad: Keycloak con MFA y reglas por jurisdicción",
            reason:
              "La política de autenticación vive en un solo sitio, y las reglas de cada jurisdicción son configuración, no código repetido en cada aplicación.",
            rejected: "Lógica de autenticación copiada en cada aplicación.",
          },
          {
            choice:
              "Medir la deuda técnica antes de refactorizar, con SonarQube en todos los repositorios, COBOL incluido",
            reason:
              "Equipos internos y proveedores priorizan sobre los mismos datos objetivos.",
            rejected: "Refactorizar según opiniones.",
          },
        ],
        implementation: [
          "El trabajo se reparte entre equipos internos y proveedores externos. Mi papel mezcla arquitectura y dirección técnica: defino los estándares con los que construyen los proveedores, reviso diseños y decido qué se construye y qué se compra.",
          "Los servicios nuevos usan Java 21 y Spring Boot 3 y se ejecutan en OpenShift. El acceso al core legacy pasa por adaptadores, de modo que los servicios no dependen de los detalles de COBOL ni de DB2.",
          "Los controles de calidad de SonarQube se ejecutan en todos los repositorios, también en el código COBOL.",
          "También lideré la primera adopción de IA del departamento: Gemini Code Assist para todo el equipo.",
        ],
        result: [
          "Actualizaciones de framework y de servidor que avanzan en pasos pequeños, sin detener las entregas.",
          "Una nueva banca online diseñada como componentes independientes sobre una arquitectura limpia.",
          "Un único proveedor de identidad con MFA y reglas por jurisdicción.",
          "Deuda técnica visible en toda la plataforma, código legacy incluido.",
          "La primera herramienta de IA del departamento, en uso diario por todo el equipo.",
          "Los detalles internos y las cifras son confidenciales.",
        ],
        stack: [
          "Java 21",
          "Spring Boot 3",
          "Arquitectura limpia / hexagonal",
          "OpenShift (OCP4)",
          "Keycloak",
          "DB2",
          "COBOL / AS400",
          "SonarQube",
          "Gemini Code Assist",
        ],
        diagram: [
          { label: "Banca online", detail: "Canal del cliente" },
          { label: "Keycloak", detail: "MFA · reglas por jurisdicción" },
          {
            label: "Servicios Java 21",
            detail: "Spring Boot 3 · dominio hexagonal",
          },
          { label: "Adaptadores legacy", detail: "El core, fuera del dominio" },
          { label: "Core bancario", detail: "COBOL · AS400 · DB2" },
        ],
        links: [],
      },
      {
        slug: "ilnami-private-by-design",
        sector: "Producto propio",
        title:
          "Una app privada por diseño, construida en solitario de la base de datos a producción",
        outcome:
          "En producción en español e inglés. La propia base de datos mantiene privado cada diario, y la IA sugiere pero nunca guarda.",
        tags: ["Next.js", "Seguridad por fila en PostgreSQL", "OpenAI Vision"],
        meta: {
          title:
            "Caso: Ilnami, una app privada por diseño construida en solitario",
          description:
            "Seguridad por fila en PostgreSQL, IA que ayuda pero no decide, datos en la UE y monitorización sin datos personales, del esquema a producción.",
        },
        summary: {
          sector: "App de consumo, producto propio",
          role: "Todo: producto, arquitectura, backend, frontend y operación",
          result: "En producción y abierta en ilnami.com, en español e inglés.",
        },
        context: [
          "Las apps de reseñas responden a la pregunta «¿qué opinan unos desconocidos de este sitio?». Ilnami responde a otra: ¿qué pedí aquí y volvería? Es un diario gastronómico privado sobre tu propio mapa: el sitio, la fecha, los platos y tu veredicto.",
          "Un diario así son datos personales. Muestra adónde vas y qué te gusta. Por eso la privacidad tenía que ser una propiedad de la arquitectura, no un ajuste que el usuario puede olvidar.",
        ],
        responsibility: {
          owned: [
            "La definición y el alcance del producto",
            "El modelo de datos y el modelo de seguridad",
            "La integración de IA y sus límites",
            "El frontend, la PWA y los mapas",
            "El despliegue, la monitorización y el consentimiento",
          ],
          notOwned: [
            "Las plataformas de debajo — Supabase, Vercel, OpenAI y Mapbox —, que elegí y configuré pero no opero",
          ],
        },
        decisions: [
          {
            choice:
              "La autorización dentro de la base de datos, con seguridad por fila de PostgreSQL",
            reason:
              "Cada consulta se filtra al dueño de la fila o al círculo con el que se compartió. Un fallo en la aplicación no puede mostrar el diario de una persona a otra.",
            rejected: "Comprobar permisos solo en el código de la aplicación.",
          },
          {
            choice:
              "Sin perfiles públicos ni reseñas públicas; círculos privados por invitación",
            reason:
              "Compartir es siempre un acto explícito. El producto nunca necesita exponer a nadie para crecer.",
            rejected: "Un feed público de reseñas como canal de crecimiento.",
          },
          {
            choice: "Una IA que ayuda y nunca decide",
            reason:
              "OpenAI Vision lee cartas, etiquetas y tickets y sugiere el sitio, la fecha y los platos. El usuario lo revisa todo antes de guardar, la entrada manual siempre funciona y las cuotas por plan mantienen el coste bajo control.",
            rejected: "Guardar lo que el modelo extraiga.",
          },
          {
            choice: "Los datos guardados se quedan en la UE",
            reason:
              "Supabase en Fráncfort y Vercel en fra1: la base de datos y la aplicación funcionan en la UE. Solo las imágenes que el usuario decide escanear se envían a OpenAI para obtener sugerencias.",
            rejected: "Las regiones de EE. UU. por defecto.",
          },
          {
            choice: "Monitorización sin datos personales",
            reason:
              "Sentry funciona sin datos personales, la analítica solo se carga con consentimiento y una Content Security Policy estricta limita lo que el navegador puede cargar.",
            rejected:
              "La configuración por defecto de los SDK, que recoge más de lo necesario.",
          },
        ],
        implementation: [
          "Next.js 16 como PWA en Vercel, con Supabase para la autenticación y PostgreSQL. PostGIS guarda los sitios y Mapbox dibuja el mapa privado de cada usuario.",
          "Cada usuario puede exportar todos sus datos en JSON cuando quiera.",
          "La web también está preparada para agentes de IA: llms.txt, llms-full.txt, un índice de Agent Skills y un blog publicado además en Markdown.",
        ],
        result: [
          "En producción y abierta en ilnami.com, en español e inglés.",
          "Privacidad garantizada por la base de datos, no solo por la interfaz.",
          "Una IA que ahorra tiempo sin escribir nunca datos por su cuenta.",
          "La base de datos y la aplicación alojadas en la UE, y analítica solo tras el consentimiento.",
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
          { label: "OpenAI Vision", detail: "Sugiere · el usuario confirma" },
          { label: "Supabase Auth", detail: "Cada petición lleva su usuario" },
          {
            label: "PostgreSQL + RLS",
            detail: "Solo dueño o círculo · Fráncfort",
          },
          {
            label: "PostGIS + Mapbox",
            detail: "El mapa privado de cada usuario",
          },
        ],
        links: [{ label: "ilnami.com", href: "https://ilnami.com" }],
      },
      {
        slug: "specforge-verified-ai-delivery",
        sector: "IA aplicada",
        title:
          "Que el código escrito por IA se gane su sitio en el repositorio",
        outcome:
          "Una CLI open source donde lo que produce el agente solo avanza tras los tests, los controles de calidad y una revisión humana.",
        tags: ["Go", "Claude Code", "TDD"],
        meta: {
          title: "Caso: SpecForge, entrega asistida por IA y verificada",
          description:
            "Una CLI open source en Go que guía a Claude Code o Gemini CLI con especificaciones selladas, tests que no se pueden editar, controles automáticos y reescrituras legacy verificadas.",
        },
        summary: {
          sector:
            "Herramientas para desarrolladores e IA aplicada, open source",
          role: "Autor y mantenedor",
          result:
            "Entrega con IA verificada y trazable, probada de punta a punta en una aplicación Java 6 reescrita en Java 21.",
        },
        context: [
          "Los agentes de código son rápidos y a menudo se equivocan con total seguridad. En un entorno regulado como un banco, «la IA dice que está hecho» no es una prueba.",
          "Quería usar Claude Code y Gemini CLI en trabajo real y aun así poder demostrar cada paso: qué se pidió, qué se decidió, qué test demuestra cada comportamiento y quién lo aprobó.",
        ],
        responsibility: {
          owned: [
            "El diseño y la arquitectura",
            "La implementación en Go",
            "Los tests, la CI y las releases",
            "La documentación",
          ],
          notOwned: [
            "Los modelos de IA: SpecForge dirige a Claude Code o Gemini CLI, no los sustituye",
          ],
        },
        decisions: [
          {
            choice: "Primero la especificación: entrevistada y después sellada",
            reason:
              "El agente entrevista al desarrollador turno a turno, y la especificación se sella antes de que exista ningún plan ni código.",
            rejected: "Pedir código directamente.",
          },
          {
            choice: "Un contrato al final de cada respuesta del agente",
            reason:
              "Cada respuesta termina con JSON: hecho, pregunta o bloqueado. Las preguntas abiertas llegan al desarrollador y quedan registradas, así que el agente pregunta en lugar de inventar.",
            rejected: "Interpretar un chat en texto libre.",
          },
          {
            choice: "Comprobar los ficheros en disco, no el informe del agente",
            reason:
              "SpecForge ejecuta los tests por su cuenta y compara los ficheros en disco. Los tests reciben una huella tras la fase roja, así que nadie puede editarlos después para que el código pase.",
            rejected: "Aceptar el informe del propio agente.",
          },
          {
            choice: "Controles automáticos antes de que avance cualquier paso",
            reason:
              "Linters, detección de duplicados, mutation testing, ArchUnit y comprobaciones de migración en cada escenario.",
            rejected: "Revisar solo a ojo.",
          },
          {
            choice: "Reescrituras legacy sin invención",
            reason:
              "El agente lee el código antiguo en modo solo lectura. Cada fichero:línea que cita se abre y se comprueba, y el comportamiento que nadie sabe explicar se convierte en una pregunta para una persona.",
            rejected:
              "Dejar que el agente describa de memoria el comportamiento del legacy.",
          },
        ],
        implementation: [
          "Una CLI en Go con Cobra sobre una arquitectura hexagonal, con un 77 % de cobertura de tests y CI en Windows, macOS y Linux, bajo licencia Apache 2.0.",
          "Cada escenario pasa por Rojo → Verde → Refactor, con la revisión del desarrollador y un commit por escenario.",
          "El traspaso es trazable: DELIVERY.md y la descripción de la pull request enlazan cada escenario con su test y su commit.",
          "La versión 5 añade reescrituras legacy verificadas, de Java 6 a Java 21, y proyectos listos para Java, React, Python y Go.",
        ],
        result: [
          "Probada de punta a punta en una aplicación de servlets Java 6 reescrita en Java 21.",
          "Cada cambio queda enlazado a una especificación, un test y un commit.",
          "La IA trabaja como un ingeniero júnior supervisado: puede proponer cualquier cosa, pero solo las pruebas hacen avanzar el trabajo.",
        ],
        stack: [
          "Go",
          "Cobra",
          "Arquitectura hexagonal",
          "Claude Code",
          "Gemini CLI",
          "chromedp",
          "TDD · BDD",
        ],
        diagram: [
          {
            label: "Entrevista de spec",
            detail: "Turno a turno, luego sellada",
          },
          { label: "Plan revisado", detail: "Aprobado por el desarrollador" },
          { label: "Agente", detail: "Claude Code o Gemini CLI" },
          { label: "Controles", detail: "Tests · mutación · ArchUnit · lint" },
          { label: "Revisión humana", detail: "Un commit por escenario" },
          { label: "Entrega trazable", detail: "DELIVERY.md · descripción PR" },
        ],
        links: [
          {
            label: "Código fuente en GitHub",
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
    title: "Contacto",
    homeTitle: "Hablemos",
    intro:
      "Cuéntame tu proyecto en unas líneas: el contexto, el problema y tus plazos. Te respondo en un día laborable.",
    facts: [
      {
        label: "Disponibilidad",
        value:
          "Colaboraciones a tiempo parcial desde enero de 2027. Puedes escribir ya para planificar el inicio.",
      },
      { label: "Ubicación", value: "Andorra · remoto" },
      {
        label: "Zona horaria",
        value: "Hora de Andorra: CET, UTC+1 en invierno y UTC+2 en verano",
      },
      { label: "Respuesta", value: "En un día laborable (de lunes a viernes)" },
    ],
    includeTitle: "Conviene incluir",
    include: [
      "A qué se dedica tu empresa y quién usa el sistema",
      "El problema o la decisión que tienes delante",
      "Tus plazos y el formato que tienes en mente",
    ],
    email: {
      label: "Email",
      write: "Escribir un email",
      copy: "Copiar dirección",
      copied: "Dirección copiada",
      copyFailed: "No se pudo copiar. Selecciona la dirección a mano.",
      withoutJavaScript:
        "La dirección de email aparece con JavaScript activado. También puedes escribirme por LinkedIn.",
      subject: "Consulta de proyecto — jefmonjor.dev",
      noMailApp:
        "Se abre tu aplicación de correo. ¿No tienes ninguna? Copia la dirección y escribe desde tu webmail.",
    },
    elsewhere: "También en",
  },
  footer: {
    location: "Andorra · Remoto · Hora de Andorra (CET)",
    fullCv: "CV completo",
    privacy: "Privacidad",
    backToTop: "Volver arriba",
  },
  privacy: {
    title: "Privacidad",
    updated: "Última actualización: 7 de noviembre de 2026",
    sections: [
      {
        title: "Quién es el responsable",
        paragraphs: [
          [
            "Jefferson Montesdeoca Jordán, Andorra la Vella, Andorra. Para cualquier cuestión sobre tus datos, escribe a la dirección de la ",
            { text: "página de contacto", href: "/contact" },
            ".",
          ],
        ],
      },
      {
        title: "Qué no hace esta web",
        paragraphs: [
          [
            "Sin analítica, sin publicidad, sin cookies de seguimiento y sin formularios de contacto. Las fuentes y los scripts se sirven desde este dominio; las páginas no cargan nada de terceros.",
          ],
        ],
      },
      {
        title: "Si me envías un email",
        paragraphs: [
          [
            "Recibo tu dirección y tu mensaje en mi buzón, alojado por Google. Los uso solo para responderte y, si trabajamos juntos, para gestionar ese trabajo. Los conservo mientras hagan falta para eso y para mis obligaciones legales.",
          ],
        ],
      },
      {
        title: "El asistente de IA y el CV adaptado de /cv",
        paragraphs: [
          [
            "Lo que escribes en el asistente, o pegas para obtener un CV adaptado a una oferta, se envía a OpenAI para generar la respuesta. Esta web pide a OpenAI que no almacene las respuestas y no guarda tu texto en su propio servidor. La conversación se queda en el almacenamiento de sesión de tu navegador y desaparece al cerrar la pestaña. Por favor, no pegues datos personales ni información confidencial. OpenAI trata el texto según sus propias condiciones de API y su política de privacidad.",
          ],
        ],
      },
      {
        title: "Alojamiento y registros del servidor",
        paragraphs: [
          [
            "La web funciona en Vercel. Como cualquier servidor web, trata tu dirección IP y la petición para servir cada página y proteger la web frente a abusos. Las funciones de IA y las descargas de PDF cuentan peticiones por dirección IP, o por red en IPv6, en un almacén de contadores que los borra en menos de 24 horas.",
          ],
        ],
      },
      {
        title: "En tu navegador",
        paragraphs: [
          [
            "Una cookie llamada NEXT_LOCALE recuerda el idioma, y el almacenamiento local recuerda el tema y el fondo de /cv. Son solo funcionales y no salen de tu dispositivo salvo como parte de las peticiones normales a las páginas.",
          ],
        ],
      },
      {
        title: "Base legal y transferencias internacionales",
        paragraphs: [
          [
            "Email: para responder a la petición que me envías. Funciones de IA: porque decides usarlas. Registros del servidor y contadores de peticiones: el interés legítimo en mantener la web segura y disponible. OpenAI, Vercel y Google tienen sede en Estados Unidos y pueden tratar datos fuera de Andorra y de la UE con sus propias garantías de transferencia.",
          ],
        ],
      },
      {
        title: "Tus derechos",
        paragraphs: [
          [
            "Puedes pedir el acceso a tus datos y su rectificación, supresión, limitación o portabilidad, u oponerte a su uso, según la Ley 29/2021 de protección de datos personales de Andorra y, cuando sea aplicable, el RGPD. Escribe a la dirección de la ",
            { text: "página de contacto", href: "/contact" },
            ". También puedes reclamar ante la Agencia Andorrana de Protección de Datos (APDA).",
          ],
        ],
      },
    ],
  },
}

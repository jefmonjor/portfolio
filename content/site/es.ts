import type { SiteContent } from "@/content/site/types"

export const es: SiteContent = {
  meta: {
    home: {
      title:
        "Jefferson Montesdeoca — Software a medida, integraciones e IA aplicada",
      description:
        "Software a medida, sistemas conectados, automatización e IA aplicada para empresas, con siete años de ingeniería en banca, legal, energía y telecomunicaciones. En remoto desde Andorra, CET.",
    },
    services: {
      title:
        "Servicios — Diagnóstico, construir e integrar, socio de ingeniería",
      description:
        "Tres formas de trabajar juntos: un diagnóstico por escrito de un proceso o un sistema, software a medida e integraciones hasta producción, o un socio de ingeniería cada semana.",
    },
    work: {
      title: "Casos de estudio — Facturación, apps, IA aplicada y banca",
      description:
        "Cuatro casos: facturación conforme a VERI*FACTU, una plataforma offline-first para escritores, una app privada por diseño y la modernización de la plataforma Java de un banco privado.",
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
        "Sin analítica, sin cookies de seguimiento y sin formularios que envíen datos. Qué pasa con un email que envías, con el texto que das al asistente de IA de /cv y con los registros del servidor.",
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
    role: "Senior Software Engineer · Software Architect",
    headline: [
      "Conecta tus sistemas.",
      "Automatiza lo repetitivo.",
      "Pon la IA a trabajar.",
    ],
    subtitle:
      "Soy Jefferson, ingeniero de software senior. Construyo software a medida, integraciones y automatizaciones con IA para pymes. La IA acelera cada paso, de la especificación a los tests; siete años en banca, legal, energía y telecomunicaciones deciden qué llega a producción.",
    availability: {
      status: "Acepto proyectos desde enero de 2027",
    },
    direct:
      "Hablas con el ingeniero que lo construye. Sin agencias de por medio.",
    seeWork: "Ver mi trabajo",
    based: "Andorra · CET · español e inglés",
    live: {
      title: "En producción",
      items: [
        {
          name: "Transolido",
          what: "Facturación",
          href: "https://www.transolido.com",
        },
        {
          name: "Other Twist",
          what: "App de escritura",
          href: "https://othertwist.com",
        },
        {
          name: "Ilnami",
          what: "Diario gastronómico",
          href: "https://ilnami.com",
        },
      ],
    },
  },

  credentials: {
    label: "He trabajado en",
    companies: ["Andbank", "elAbogado", "Vodafone", "Endesa"],
  },
  display: {
    connect: ["Tus sistemas, por fin conectados"],
    approach: ["Cómo trabajo"],
    work: ["Cuatro sistemas funcionando en producción"],
    services: ["Cómo podemos trabajar juntos"],
    about: ["Hola, soy Jefferson"],
    experience: ["Dónde he trabajado"],
    contact: ["Cuéntame qué necesitas resolver"],
  },
  approach: {
    intro:
      "La IA escribe código rápido. La experiencia evita que ese código rompa producción. Uso las dos, y soy yo quien aprueba cada cambio.",
    pipeline: [
      { step: "Especificación", by: "La IA redacta, yo defino" },
      { step: "Código", by: "Lo escribe la IA" },
      { step: "Tests", by: "Los escribe la IA" },
      { step: "Revisión", by: "Decido yo", human: true },
      { step: "Producción", by: "Monitorizado" },
    ],
    pillars: [
      {
        title: "IA en todo el ciclo",
        body: "Especificación, código, tests, migraciones y documentación: la IA acelera cada paso, y cada cambio pasa por mi revisión antes de salir.",
      },
      {
        title: "De principio a fin, una sola persona",
        body: "De la base de datos y el backend a la app web o móvil y el despliegue. No coordinas a cinco proveedores.",
      },
      {
        title: "Tests antes de tocar nada",
        body: "Los sistemas antiguos se modernizan paso a paso, con tests automáticos alrededor de lo que ya funciona, para que una entrega no rompa la anterior.",
      },
      {
        title: "IA en tus procesos, bajo control",
        body: "Asistentes, lectura de documentos y automatizaciones conectados a tus herramientas. Tus datos siguen siendo tuyos y una persona confirma antes de guardar nada.",
      },
    ],
  },

  connect: {
    intro:
      "La mayoría de las empresas no necesitan más herramientas. Necesitan que las que ya tienen trabajen juntas.",
    steps: [
      {
        title: "Herramientas que no se hablan",
        body: "Hojas de cálculo, un ERP, el banco, una tienda online: el mismo dato tecleado en tres sitios y nadie seguro de cuál es el bueno.",
      },
      {
        title: "Un backend en el centro",
        body: "Una API y un flujo de eventos conectan cada sistema. El dato se introduce una vez y llega donde hace falta.",
      },
      {
        title: "Automatización e IA donde compensan",
        body: "Los pasos repetitivos se hacen solos. La IA lee documentos y propone; una persona confirma antes de guardar nada.",
      },
      {
        title: "En producción, y tuyo",
        body: "Desplegado y monitorizado, con el código, la documentación y los accesos en tus manos.",
      },
    ],
    nodes: {
      sources: ["Hojas de cálculo", "ERP · CRM", "Banco · pagos", "Documentos"],
      core: "Tu backend",
      coreDetail: "API · eventos",
      ai: "IA · revisada",
      outputs: ["Facturas", "Paneles", "Avisos"],
    },
  },

  about: {
    title: "Sobre mí",
    lead: "Casi toda mi carrera ha sido software donde los errores salen caros.",
    paragraphs: [
      [
        "Hoy soy arquitecto de soluciones y technical PM en Andbank, un banco privado de Andorra. Antes modernicé la plataforma de elAbogado, el marketplace legal líder en España, y construí sistemas Java y de big data para empresas de energía y telecomunicaciones como consultor. En paralelo, construyo mis propios productos desde la primera tabla de la base de datos hasta producción. Tienes el detalle en la ",
        { text: "página de experiencia", href: "/experience" },
        ".",
      ],
      [
        "Trabajo en remoto y en asíncrono, y dejo las decisiones por escrito: qué elegimos, por qué y qué descartamos, para que quien venga después no tenga que adivinar.",
      ],
    ],
    principle:
      "Acepto pocos proyectos a la vez, para que cada uno tenga toda mi atención. Si el tuyo no encaja, te lo diré y te indicaré a alguien mejor.",
    signature: "Jefferson",
    facts: [
      { label: "Desde", value: "Andorra, hora CET" },
      { label: "Idiomas", value: "Español (nativo) e inglés" },
      { label: "Trabajo", value: "En remoto, del diagnóstico a producción" },
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
      "Tres formatos para tres momentos: antes de decidir, mientras se construye y cuando ya funciona. Todos empiezan por tu problema, no por una tecnología.",
    items: [
      {
        id: "advisory",
        name: "Revisión y hoja de ruta",
        summary:
          "Un análisis por escrito de un proceso, un sistema o una idea: qué automatizar, qué construir y qué no.",
        audience:
          "Empresas que quieren un plan claro antes de invertir en software.",
        includes: [
          "Mapa del proceso actual y de las herramientas que intervienen",
          "Dónde compensan la automatización o la IA, y dónde no",
          "Revisión de arquitectura o de código de un sistema existente",
          "Construir, comprar o integrar: una recomendación razonada",
          "Un plan priorizado con alcance y próximos pasos",
        ],
        deliverable:
          "Un informe escrito: qué funciona, los riesgos y un plan priorizado.",
        format:
          "De 1 a 5 días. Recibes un informe escrito con hallazgos, riesgos y un plan priorizado.",
      },
      {
        id: "delivery",
        name: "Construir e integrar",
        summary:
          "Software a medida, APIs e integraciones, automatización e IA aplicada, hasta producción.",
        audience:
          "Empresas que necesitan construir software, conectar sistemas o modernizar una aplicación antigua.",
        includes: [
          "Software de negocio a medida y herramientas internas",
          "APIs e integraciones: ERP, bancos, pasarelas de pago y servicios de terceros",
          "Automatización de documentos y tareas repetitivas, con IA revisada por una persona",
          "Backends Java y Spring Boot, migraciones y actualizaciones",
          "Despliegue, monitorización, documentación y traspaso",
        ],
        deliverable:
          "Software en producción, con el código, la documentación y el traspaso.",
        format:
          "Por día o a precio cerrado para un alcance cerrado. Desde enero de 2027: de 10 a 15 horas por semana; jornada completa cuando mi disponibilidad lo permita.",
      },
      {
        id: "fractional",
        name: "Tech lead fraccional",
        summary:
          "Ingeniería senior cada semana, para empresas sin responsable técnico.",
        audience:
          "Empresas y startups que necesitan dirección técnica y una evolución constante.",
        includes: [
          "Revisiones periódicas de arquitectura y de código",
          "Roadmap técnico y prioridades",
          "Evolución y mantenimiento de lo que construimos",
          "IA en procesos reales, con límites y una forma manual de trabajar cuando la IA falla",
        ],
        deliverable:
          "Decisiones técnicas, revisiones y una hoja de ruta que tu equipo pueda seguir.",
        format: "Acuerdo mensual, de 4 a 8 horas por semana.",
      },
    ],
    audienceLabel: "Ideal para",
    includesLabel: "Incluye",
    deliverableLabel: "Te llevas",
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
      "Cuatro proyectos contados igual: el problema, las decisiones, la solución y lo que puedes comprobar. Tres son productos que construí y opero yo; uno es la plataforma de un banco, anonimizada.",
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
        slug: "transolido-verifactu-invoicing",
        screenshotAlt:
          "Página de acceso de Transolido en transolido.com, con el enlace a su declaración VERI*FACTU",
        sector: "Producto propio · SaaS de facturación",
        title: "Facturación que mantiene a las pymes al día con VERI*FACTU",
        outcome:
          "En producción en transolido.com: facturas conformes con trazabilidad completa e IA que ayuda a capturar datos sin saltarse las reglas.",
        tags: ["Java 21 · Spring Boot", "VERI*FACTU", "Claude API"],
        meta: {
          title:
            "Caso de estudio: Transolido, facturación conforme a VERI*FACTU",
          description:
            "Monolito modular en Java 21 y Spring Boot con autenticación JWT propia, eventos en Redis, PostgreSQL en Neon y extracción de datos asistida por IA, para la normativa española de facturación.",
        },
        summary: {
          sector: "Software de empresa (SaaS), producto propio",
          role: "Todo: producto, arquitectura, backend, frontend y operación",
          result: "En producción en transolido.com y conforme a VERI*FACTU.",
        },
        context: [
          "VERI*FACTU cambia cómo debe comportarse el software de facturación en España: cada factura tiene que ser trazable y los registros no se pueden alterar en silencio una vez emitidos. Para una pyme no es una mejora opcional; es una obligación legal.",
          "Transolido es un software de facturación construido alrededor de esa obligación. El cumplimiento tenía que vivir en el núcleo del sistema, no en un informe añadido al final.",
        ],
        responsibility: {
          owned: [
            "Definición del producto y del alcance",
            "Modelo de dominio y límites entre módulos",
            "Autenticación y seguridad",
            "Cumplimiento y trazabilidad",
            "Extracción de datos asistida por IA y sus límites",
            "Despliegue y operación",
          ],
          notOwned: [
            "Las plataformas gestionadas de debajo — Neon, Upstash, Google Cloud Run y Vercel —, que elegí y configuré pero no opero",
            "La propia normativa, que fija la Agencia Tributaria",
          ],
        },
        decisions: [
          {
            choice: "Un monolito modular en lugar de microservicios",
            reason:
              "Una sola unidad desplegable con límites claros entre módulos es sencilla de operar para un equipo pequeño, y un módulo se puede separar más adelante si necesita escalar por su cuenta.",
            rejected: "Microservicios desde el primer día.",
          },
          {
            choice: "Trazabilidad garantizada por el backend",
            reason:
              "Cada factura conserva el registro completo que pide la normativa, y las reglas las aplica el backend, no la pantalla.",
            rejected: "Añadir el cumplimiento como una exportación al final.",
          },
          {
            choice: "Autenticación JWT propia",
            reason:
              "La autenticación se queda dentro del backend, con tokens que la API comprueba en cada petición.",
            rejected: "Delegar toda la capa de identidad en un tercero.",
          },
          {
            choice: "Eventos sobre Redis",
            reason:
              "El trabajo que no necesita bloquear al usuario viaja como eventos en Upstash Redis, así la API responde rápido y los pasos quedan desacoplados.",
            rejected: "Hacer cada paso dentro de la petición.",
          },
          {
            choice: "IA que ayuda a capturar datos y nunca emite facturas",
            reason:
              "Claude extrae datos para ahorrar tecleo; lo que devuelve pasa por la misma validación que la entrada manual antes de convertirse en factura.",
            rejected: "Dejar que el modelo escriba registros directamente.",
          },
        ],
        implementation: [
          "Java 21 y Spring Boot 3 en Google Cloud Run, PostgreSQL en Neon y eventos en Upstash Redis. El frontend es React en Vercel.",
          "Cada módulo es dueño de su parte del dominio y habla con los demás mediante interfaces explícitas, para que el monolito siga siendo fácil de cambiar.",
        ],
        result: [
          "En producción en transolido.com.",
          "Cumplimiento de VERI*FACTU con trazabilidad completa.",
          "Autenticación propia y eventos en streaming sobre infraestructura gestionada: Neon, Upstash, Cloud Run y Vercel.",
          "IA que acelera la entrada de datos sin saltarse las reglas.",
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
          { label: "App React", detail: "Vercel" },
          {
            label: "Autenticación JWT",
            detail: "Tokens propios en cada petición",
          },
          { label: "Módulos Spring Boot", detail: "Java 21 · Cloud Run" },
          { label: "Claude API", detail: "Extrae datos · valida el backend" },
          { label: "Eventos Redis", detail: "Upstash · pasos desacoplados" },
          { label: "PostgreSQL · Neon", detail: "Trazabilidad VERI*FACTU" },
        ],
        links: [
          { label: "transolido.com", href: "https://www.transolido.com" },
        ],
      },
      {
        slug: "othertwist-offline-writing",
        screenshotAlt:
          "Página de inicio de Other Twist en othertwist.com, con la biblioteca de proyectos de la app en un móvil",
        sector: "Producto propio · App y backend",
        title: "Una plataforma de escritura que sigue funcionando sin conexión",
        outcome:
          "En producción en othertwist.com: quien escribe sigue trabajando sin conexión y sus cambios se sincronizan al volver a tenerla.",
        tags: ["Flutter · offline-first", "Java 21 · hexagonal", "Docker"],
        meta: {
          title:
            "Caso de estudio: Other Twist, una plataforma offline-first para escritores",
          description:
            "Una app Flutter con almacenamiento local y sincronización, sobre un backend hexagonal en Java 21 y Spring Boot con OAuth2/JWT, Flyway y Redis, en contenedores y en migración a un servidor propio.",
        },
        summary: {
          sector: "Plataforma para escritores, producto propio",
          role: "Todo: producto, app, backend y operación",
          result:
            "En producción en othertwist.com, con la app en app.othertwist.com.",
        },
        context: [
          "No siempre se escribe con conexión: en un tren, en una cafetería, en un sitio con mala cobertura. Una herramienta de escritura que deja de funcionar sin red pierde justo el momento para el que se abrió.",
          "Other Twist es una plataforma todo en uno para escritores. La app tenía que tratar la falta de conexión como el caso normal, y el backend, recibir los cambios después.",
        ],
        responsibility: {
          owned: [
            "Definición del producto y del alcance",
            "App Flutter: almacenamiento local, estado y navegación",
            "Sincronización entre la app y el backend",
            "Backend hexagonal, autenticación y migraciones",
            "Contenedores y la migración a un servidor propio",
          ],
          notOwned: [
            "Supabase Auth, como proveedor de identidad",
            "Los proveedores de alojamiento: hoy Google Cloud Run y, como destino, un servidor de netcup",
          ],
        },
        decisions: [
          {
            choice: "Offline-first, con una base de datos local en la app",
            reason:
              "Drift sobre SQLite guarda lo escrito en el dispositivo, así la app funciona igual con o sin conexión y sincroniza cuando puede.",
            rejected: "Una app que necesita la red para cada acción.",
          },
          {
            choice: "Arquitectura hexagonal en el backend",
            reason:
              "El dominio no depende del framework, de la base de datos ni del proveedor de identidad; cada uno es un adaptador que puede cambiar sin reescribir las reglas.",
            rejected:
              "Lógica de negocio repartida entre controladores y repositorios.",
          },
          {
            choice: "OAuth2 y JWT con Supabase Auth",
            reason:
              "Un proveedor de identidad probado se encarga del inicio de sesión; el backend Java verifica los tokens en cada petición.",
            rejected: "Construir el inicio de sesión desde cero.",
          },
          {
            choice: "Un esquema versionado con Flyway",
            reason:
              "Cada cambio de la base de datos es una migración en el repositorio, así cualquier entorno se puede reconstruir en el mismo estado.",
            rejected: "Cambiar la base de datos a mano.",
          },
          {
            choice: "Contenedores, para ser dueño del despliegue",
            reason:
              "Las imágenes Docker funcionan igual en cualquier sitio, lo que convierte el paso de Cloud Run a un servidor propio en un cambio de despliegue.",
            rejected: "Depender del runtime de un solo proveedor.",
          },
        ],
        implementation: [
          "Flutter con Riverpod para el estado y GoRouter para la navegación; Drift sobre SQLite como almacenamiento local, sincronizado con el backend.",
          "Java 21 y Spring Boot 3.5 en arquitectura hexagonal, con OAuth2/JWT mediante Supabase Auth, migraciones con Flyway, Redis y PostgreSQL, empaquetado con Docker.",
          "La web es othertwist.com y la app se abre en app.othertwist.com.",
        ],
        result: [
          "En producción en othertwist.com, con la app en app.othertwist.com.",
          "Se escribe sin conexión y se sincroniza al volver.",
          "Un backend cuyo dominio no depende de su framework ni de sus proveedores.",
          "En contenedores y en migración de Google Cloud Run a un servidor propio.",
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
          { label: "App Flutter", detail: "Riverpod · GoRouter" },
          { label: "Drift · SQLite", detail: "Local · funciona sin conexión" },
          { label: "Sincronización", detail: "Los cambios viajan con red" },
          { label: "Supabase Auth", detail: "OAuth2 · JWT" },
          {
            label: "Spring Boot hexagonal",
            detail: "Java 21 · dominio en el centro",
          },
          { label: "PostgreSQL · Redis", detail: "Flyway · Docker" },
        ],
        links: [{ label: "othertwist.com", href: "https://othertwist.com" }],
      },
      {
        slug: "ilnami-private-by-design",
        screenshotAlt:
          "Página de inicio de Ilnami en ilnami.com, con el mapa de visitas guardadas de la app en un móvil",
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
    brief: {
      title: "Cuéntame tu proyecto",
      intro:
        "Seis preguntas breves. Al enviarlo se abre tu aplicación de correo con todo escrito; esta web no guarda nada.",
      fields: {
        name: "Tu nombre",
        company: "Empresa (opcional)",
        problem: "¿Qué necesitas resolver?",
        problemHint:
          "Cuéntalo con tus palabras; no hace falta saber qué tecnología necesitas.",
        type: "Tipo de proyecto",
        budget: "Presupuesto aproximado",
        timeline: "¿Cuándo te gustaría empezar?",
      },
      projectTypes: [
        "Software a medida",
        "Automatización de procesos",
        "Integración de sistemas y APIs",
        "Inteligencia artificial aplicada",
        "Arquitectura y modernización",
        "No lo sé, necesito orientación",
      ],
      budgets: [
        "Menos de 2.000 €",
        "2.000–5.000 €",
        "5.000–10.000 €",
        "10.000–25.000 €",
        "Más de 25.000 €",
        "Necesito una estimación",
      ],
      timelines: [
        "Lo antes posible",
        "En 1–3 meses",
        "En 3–6 meses",
        "Solo estoy explorando",
      ],
      submit: "Preparar el email",
      copy: "Copiar el texto",
      copied: "Texto copiado",
      copyFailed: "No se pudo copiar el texto",
      required: "Escribe tu nombre y el problema para continuar.",
      opened:
        "Tu aplicación de correo debería abrirse con el brief. Si no ha pasado nada, copia el texto y pégalo en tu webmail.",
      emailLabels: {
        name: "Nombre",
        company: "Empresa",
        type: "Proyecto",
        budget: "Presupuesto",
        timeline: "Inicio",
        problem: "El problema",
      },
      subject: "Brief de proyecto — jefmonjor.dev",
    },
    direct: "¿Prefieres escribir directamente?",
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
            "Sin analítica, sin publicidad y sin cookies de seguimiento. El formulario de proyecto de la página de contacto no envía nada a esta web: prepara un email en tu propia aplicación de correo. Las fuentes y los scripts se sirven desde este dominio; las páginas no cargan nada de terceros.",
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

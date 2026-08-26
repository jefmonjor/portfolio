# Portfolio — Jefferson Montesdeoca

Portfolio y CV trilingüe de Jefferson Montesdeoca: Product Engineer con foco en IA y backend, actualmente Arquitecto de Soluciones / Technical PM. Construido con Next.js 16 y desplegado en Vercel.

**En vivo:** [jefmonjor.dev](https://jefmonjor.dev)

![Vista del portfolio](public/projects/portfolio/01.webp)

## Qué tiene dentro

- **Asistente de IA acotado** — chat sobre el perfil usando la API de OpenAI (`gpt-5-mini`, Responses API) y un dossier público cerrado. Distingue el cargo actual del posicionamiento objetivo, trata las ofertas pegadas como datos no fiables y reconoce cuándo falta información.
- **Control de consumo** — rate limiting por IP (minuto y día) más un techo global diario compartido por las funciones de IA, configurable mediante variables de entorno.
- **Tres CV con propósito distinto** — general editorial, técnico de una columna y **según oferta**. En el último, Structured Outputs solo puede seleccionar términos y proyectos de listas canónicas; el servidor filtra la selección, construye el resumen desde textos verificados y genera el PDF sin aceptar contenido del modelo desde el navegador.
- **PDFs generados en servidor** con `@react-pdf/renderer` — misma fuente de datos que la web, siempre sincronizados.
- **El CV también en formato máquina** — [`/cv.md`](https://www.jefmonjor.dev/cv.md) en texto plano y [`/cv.json`](https://www.jefmonjor.dev/cv.json) en [MAC](https://github.com/getmanfred/mac), el esquema abierto de CV que usan varias plataformas de recruiting. Un agente lo lee sin descargar un PDF; el email nunca aparece en estas superficies.
- **Email anti-spam** — la dirección nunca aparece en el HTML ni en el bundle JS (se ensambla por códigos de carácter tras la hidratación); en los PDF sí va, porque se generan bajo demanda.
- **Trilingüe** ES · EN · CA con `next-intl`, tema claro/oscuro, estados explícitos de proyecto y **terminal interactiva** (icono en la barra o tecla `` ` ``: `help`, `projects`, `cv`, `web`).
- **Identidad accesible y progresiva** — la presentación estática funciona sin WebGL; la credencial 3D es una mejora opcional que solo se carga tras una interacción compatible.
- **SEO y GEO** — metadata localizada, canonical, `hreflang`, sitemap, JSON-LD de perfil y proyectos públicos, más [`/llms.txt`](https://www.jefmonjor.dev/llms.txt) como resumen complementario para sistemas de recuperación.

## Stack

Next.js 16 (App Router + Turbopack) · TypeScript estricto · Tailwind CSS v4 · shadcn/ui · next-intl · motion · tRPC + React Query · Zod · OpenAI SDK · @react-pdf/renderer · Three.js

## Variables de entorno

Solo una es necesaria para activar la IA; el resto tienen valores por defecto seguros.

| Variable                                         | Por defecto       | Qué hace                                                                                                           |
| ------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `OPENAI_API_KEY`                                 | —                 | Activa el asistente y el adaptador de CV. Sin ella, la web funciona igual y el chat muestra un aviso con el email. |
| `ASSISTANT_MODEL`                                | `gpt-5-mini`      | Modelo de OpenAI.                                                                                                  |
| `ASSISTANT_MAX_OUTPUT_TOKENS`                    | `500`             | Tokens de salida por respuesta.                                                                                    |
| `ASSISTANT_MAX_TURNS` / `ASSISTANT_MAX_CHARS`    | `8` / `800`       | Historial y tamaño de mensaje.                                                                                     |
| `ASSISTANT_RATE_MINUTE` / `ASSISTANT_RATE_DAILY` | `4` / `20`        | Límites por visitante.                                                                                             |
| `ASSISTANT_GLOBAL_DAILY`                         | `300`             | Techo global diario de peticiones de IA (todas las funciones).                                                     |
| `ASSISTANT_REASONING` / `ASSISTANT_VERBOSITY`    | `minimal` / `low` | Latencia y estilo de las respuestas.                                                                               |
| `CV_TAILOR_MAX_OFFER_CHARS`                      | `4000`            | Tamaño máximo de la oferta pegada.                                                                                 |

## Ejecutar en local

```bash
pnpm install
pnpm dev          # desarrollo en http://localhost:3000
pnpm test         # contratos y regresiones
pnpm typecheck    # TypeScript estricto
pnpm lint         # ESLint
pnpm build        # build de producción
```

## Despliegue

- **Vercel** — despliegue automático de `main` y previews por PR.
- **GitHub Actions** — CI (lint, typecheck, build) en cada PR, y workflow de despliegue por Docker + SSH a VPS propio (netcup), listo para activar con los secretos `SSH_HOST`, `SSH_USER` y `SSH_KEY`. Detalles en [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Estructura

```text
app/                  Rutas, layouts y route handlers (assistant, cv-tailor, cv.pdf, cv.md, cv.json)
components/           Componentes de la web (portfolio/) y primitivas shadcn (ui/)
lib/                  Perfil, dossier del asistente, rate limiting, email ofuscado
messages/             Textos ES · EN · CA (next-intl)
server/               Documentos PDF del CV y lógica de servidor
public/projects/      Capturas de los proyectos para los previews en bucle
```

El proyecto sigue un flujo _spec-driven_: `AGENTS.md` es el punto de entrada y `.ai/` contiene contexto, patrones y prompts reutilizables.

## Créditos

Base inicial a partir de [mdbep/portfolio](https://github.com/mdbep/portfolio), rediseñada y ampliada. Construido con ayuda de Claude Code.

## Licencia

[MIT](LICENSE) © Jefferson Montesdeoca Jordán.

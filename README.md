# Portfolio — Jefferson Montesdeoca

Portfolio personal bilingüe (ES/EN) con asistente de IA, CV inteligente en tres variantes y diseño editorial pixel perfect. Construido con Next.js 16 y desplegado en Vercel.

**En vivo:** [portfolio-omega-drab-fsvg6tmcd2.vercel.app](https://portfolio-omega-drab-fsvg6tmcd2.vercel.app) *(pronto en jefmonjor.dev)*

![Vista del portfolio](public/projects/portfolio/01.webp)

## Qué tiene dentro

- **Asistente de IA** — chat flotante que responde sobre el perfil usando la API de OpenAI (`gpt-5-mini`, Responses API) con un *dossier cerrado* anti-alucinaciones: solo responde con datos reales del perfil, y si no sabe algo lo dice y redirige al email.
- **Control de costes blindado** — rate limiting por IP (minuto y día) más un **techo global diario** compartido por todas las funciones de IA: el gasto máximo está acotado pase lo que pase. Todo configurable por variables de entorno sin redesplegar.
- **CV inteligente** — el botón de descarga abre un modal con tres caminos: CV completo editorial (PDF de 4 páginas), CV ATS compacto (2 páginas, una columna, cabeceras estándar para filtros automáticos) o **CV adaptado a una oferta**: pegas el texto de la oferta y la IA reescribe el resumen y las palabras clave usando solo datos reales.
- **PDFs generados en servidor** con `@react-pdf/renderer` — misma fuente de datos que la web, siempre sincronizados.
- **Email anti-spam** — la dirección nunca aparece en el HTML ni en el bundle JS (se ensambla por códigos de carácter tras la hidratación); en los PDF sí va, porque se generan bajo demanda.
- **Bilingüe** ES/EN con `next-intl`, tema claro/oscuro, previews de proyectos en bucle, iconos de tecnologías, métricas animadas y terminal interactiva.
- **Diseño editorial** — acento terracota, tipografía fluida con `clamp()` de 320px a escritorio, animaciones con `motion` y cero scroll horizontal verificado en 6 anchos × 2 idiomas.

## Stack

Next.js 16 (App Router + Turbopack) · TypeScript estricto · Tailwind CSS v4 · shadcn/ui · next-intl · motion · tRPC + React Query · Zod · OpenAI SDK · @react-pdf/renderer · Three.js

## Variables de entorno

Solo una es necesaria para activar la IA; el resto tienen valores por defecto seguros.

| Variable | Por defecto | Qué hace |
|---|---|---|
| `OPENAI_API_KEY` | — | Activa el asistente y el adaptador de CV. Sin ella, la web funciona igual y el chat muestra un aviso con el email. |
| `ASSISTANT_MODEL` | `gpt-5-mini` | Modelo de OpenAI. |
| `ASSISTANT_MAX_OUTPUT_TOKENS` | `500` | Tokens de salida por respuesta. |
| `ASSISTANT_MAX_TURNS` / `ASSISTANT_MAX_CHARS` | `8` / `800` | Historial y tamaño de mensaje. |
| `ASSISTANT_RATE_MINUTE` / `ASSISTANT_RATE_DAILY` | `4` / `20` | Límites por visitante. |
| `ASSISTANT_GLOBAL_DAILY` | `300` | Techo global diario de peticiones de IA (todas las funciones). |
| `ASSISTANT_REASONING` / `ASSISTANT_VERBOSITY` | `minimal` / `low` | Latencia y estilo de las respuestas. |
| `CV_TAILOR_MAX_OFFER_CHARS` | `4000` | Tamaño máximo de la oferta pegada. |

## Ejecutar en local

```bash
pnpm install
pnpm dev          # desarrollo en http://localhost:3000
pnpm typecheck    # TypeScript estricto
pnpm lint         # ESLint
pnpm build        # build de producción
```

## Despliegue

- **Vercel** — despliegue automático de `main` y previews por PR.
- **GitHub Actions** — CI (lint, typecheck, build) en cada PR, y workflow de despliegue por Docker + SSH a VPS propio (netcup), listo para activar con los secretos `SSH_HOST`, `SSH_USER` y `SSH_KEY`. Detalles en [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Estructura

```text
app/                  Rutas, layouts y route handlers (assistant, cv-tailor, cv.pdf)
components/           Componentes de la web (portfolio/) y primitivas shadcn (ui/)
lib/                  Perfil, dossier del asistente, rate limiting, email ofuscado
messages/             Textos ES/EN (next-intl)
server/               Documentos PDF del CV y lógica de servidor
public/projects/      Capturas de los proyectos para los previews en bucle
```

El proyecto sigue un flujo *spec-driven*: `AGENT.md` es el punto de entrada y `.ai/` contiene contexto, patrones y prompts reutilizables.

## Créditos

Base inicial a partir de [mdbep/portfolio](https://github.com/mdbep/portfolio), rediseñada y ampliada. Construido con ayuda de Claude Code.

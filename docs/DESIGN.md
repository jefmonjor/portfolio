# Sistema de diseño

Sistema bloqueado del portfolio. Cualquier cambio visual futuro debe respetar estos tokens y pasar las verificaciones del final. Género: **modern-minimal** (escuela Apple / Notion / Vercel / Linear), con acento editorial propio (etiquetas mono + terracota).

## Tipografía

| Capa | Fuente | Uso |
|---|---|---|
| Display (`--font-display` → `font-heading`) | **Geist** | h1–h3, nombre, títulos de sección. Tracking apretado (h1: `-0.03em`) |
| Cuerpo (`--font-sans`) | **Figtree** | Párrafos, descripciones |
| Mono (`--font-mono`) | **Geist Mono** | Etiquetas kicker, índices, badges, metadatos |

- Tamaños fluidos con `clamp()`: h1 `clamp(2.5rem,5.5vw+1rem,5rem)`, h2 `clamp(1.125rem,0.6vw+1rem,1.375rem)`, email `clamp(1.25rem,2.2vw+0.75rem,1.875rem)`, métricas `clamp(1.75rem,1.8vw+1.1rem,2.25rem)`.
- Títulos multi-línea llevan `text-balance` (sin viudas). Nunca cursiva en titulares.

## Color

- Neutros oklch en `app/globals.css` (`--background`, `--foreground`, `--muted-foreground`, `--border`…), tema claro y oscuro.
- **Acento único: `--brand` (terracota)** — claro `oklch(0.55 0.12 55)`, oscuro `oklch(0.74 0.115 60)`. Solo en la capa kicker: índices de sección, línea del hero, puntos decorativos, ping de estado, barra de progreso. Nunca en bloques grandes ni texto de cuerpo.
- Prohibido introducir un segundo acento o hex sueltos: todo color nuevo se declara como token.

## Superficies

- Tarjetas: borde **sólido** `border-border` + `rounded-xl` (+ `overflow-hidden` si tienen divisiones internas). Los bordes discontinuos están retirados — eran la huella de la plantilla original.
- Nav: **píldora flotante** (`rounded-full`, `bg-background/85`, blur, `shadow-sm`) separada del borde superior; progreso de scroll como línea `h-0.5 bg-brand` fija arriba.
- Chat del asistente: panel `rounded-2xl`, lanzador `rounded-full`. Diálogos `rounded-xl`.

## Movimiento

- Curva única: `cubic-bezier(0.16, 1, 0.3, 1)`, ~420–550ms. Entradas con `opacity + translateY` pequeñas. Sin rebotes ni overshoot.
- Todo respeta `prefers-reduced-motion` (fallbacks CSS `motion-reduce:*`).

## Verificación obligatoria antes de cada merge visual

1. `pnpm typecheck && pnpm lint && pnpm build` en verde.
2. **Cero scroll horizontal** en 320 / 375 / 414 / 768 / 1280 / 1440 px, ES y EN (12 combinaciones), recorriendo la página completa.
3. Revisión visual de capturas: hero móvil claro, contacto móvil oscuro, hero escritorio oscuro, proyectos escritorio.
4. Móviles grandes (412–480px): títulos sin viudas.
5. El email no aparece literal en `.next/static` (`grep -r "jefmonjor@" .next/static` vacío).

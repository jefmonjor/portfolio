# Sistema de diseño

Sistema bloqueado del portfolio. Cualquier cambio visual futuro debe respetar estos tokens y pasar las verificaciones del final. Género: **modern-minimal** (escuela Apple / Notion / Vercel / Linear), con un único acento terracota y la mono reservada a datos.

## Tipografía

| Capa | Fuente | Uso |
|---|---|---|
| Display (`--font-display` → `font-heading`) | **Geist** | h1–h3, nombre, posicionamiento del hero, títulos de sección. Tracking apretado (h1: `-0.03em`, h2: `-0.02em`) |
| Cuerpo (`--font-sans`) | **Figtree** | Párrafos, descripciones, navegación, botones, pistas de sección |
| Mono (`--font-mono`) | **Geist Mono** | Solo datos: fechas, zona horaria, metadatos de la ficha y de cada puesto, atajos de teclado, terminal. Los badges de tecnología van en sans |

- Tamaños fluidos con `clamp()`: h1 `clamp(2.5rem,5.5vw+1rem,5rem)`, h2 `clamp(1.5rem,1.1vw+1.15rem,2rem)`, posicionamiento del hero `clamp(1.25rem,1vw+1rem,1.625rem)`, email `clamp(1.25rem,2.2vw+0.75rem,1.875rem)`, métricas `clamp(1.75rem,1.8vw+1.1rem,2.25rem)`.
- Títulos multi-línea llevan `text-balance` (sin viudas). Nunca cursiva en titulares.
- **Suelo de 11px** para cualquier texto funcional; la medida de lectura no pasa de ~75 caracteres.
- **Sin kickers ni numeración de secciones** ("01 — Sobre mí"): el título carga la sección. Retirados en octubre de 2026 tras la auditoría de Impeccable, junto con el texto "scramble" del hero y la franja marquee infinita.

## Color

- Neutros oklch en `app/globals.css` (`--background`, `--foreground`, `--muted-foreground`, `--border`…), tema claro y oscuro. `--muted-foreground` claro es `0.5` (≥5,5:1 sobre `--muted`); nada de opacidades `/60`–`/80` sobre texto.
- **Acento único: `--brand` (terracota)** — claro `oklch(0.55 0.12 55)`, oscuro `oklch(0.74 0.115 60)`. Solo como marca: el cuadrado junto a cada título de sección y a la marca de la barra, ping de estado, barra de progreso, selección de texto y caret. Nunca en bloques grandes ni texto de cuerpo.
- Prohibido introducir un segundo acento o hex sueltos: todo color nuevo se declara como token.

## Superficies

- Tarjetas: borde **sólido** `border-border` + `rounded-xl` (+ `overflow-hidden` si tienen divisiones internas). Los bordes discontinuos están retirados — eran la huella de la plantilla original.
- Nav: **píldora flotante** (`rounded-full`, `bg-background/85`, blur, `shadow-sm`) separada del borde superior; progreso de scroll como línea `h-0.5 bg-brand` fija arriba.
- Chat del asistente: panel `rounded-2xl`, lanzador `rounded-full`. Diálogos `rounded-xl`.

## Movimiento

- Curva única: `cubic-bezier(0.16, 1, 0.3, 1)`, ~420–550ms. Entradas con `opacity + translateY` pequeñas. Sin rebotes ni overshoot.
- Un momento propio: la credencial 3D. El resto son entradas sobrias de sección y feedback de interacción, todo en CSS.
- Todo respeta `prefers-reduced-motion` (fallbacks CSS `motion-reduce:*`).

## Verificación obligatoria antes de cada merge visual

1. `pnpm typecheck && pnpm lint && pnpm build` en verde.
2. `impeccable detect` sobre el build (1280 y 375 px) sin hallazgos de contraste, texto pequeño ni relleno.
3. **Cero scroll horizontal** en 320 / 375 / 414 / 768 / 1280 / 1440 px, ES y EN (12 combinaciones), recorriendo la página completa.
4. Revisión visual de capturas: hero móvil claro, contacto móvil oscuro, hero escritorio oscuro, proyectos escritorio.
5. Móviles grandes (412–480px): títulos sin viudas.
6. El email no aparece literal en `.next/static` (`grep -r "jefmonjor@" .next/static` vacío).

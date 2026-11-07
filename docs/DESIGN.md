# Sistema de diseño

Dos productos, dos sistemas que no se mezclan:

- **Web comercial** (`/`, `/es`, la 404): **Underlay**, tema Violet, Inter.
- **`/cv`** (portfolio y CV): acento ámbar, Fraunces + Geist, cantos rectos.

Cada uno carga solo sus fuentes: la web precarga Inter; `/cv` precarga Geist y Fraunces (sus variables viven en `:root` porque los diálogos se montan en `<body>`); la 404 usa Inter sin precarga para no añadirla a `/cv`.

## Web comercial: Underlay (Violet)

### Cadena de color

`Foundations → Theme → Tokens → Layers`, todo en `app/globals.css`. Los componentes solo leen tokens; ningún hex ni escala cruda en `components/site/`.

| Capa | Qué contiene | Ejemplos |
|---|---|---|
| Foundations | Escalas crudas | `--gray-0…950`, `--violet-300/500/600/700`, `--green/red/orange/blue-50/200/500/950` |
| Theme | La marca, derivada de una escala | `--primary-base` `#462CF2`, `--primary-dark`, `--primary-darker`, `--primary-stroke` (violet-500 en claro, violet-300 en oscuro), `--primary-alpha-10/16/24` |
| Tokens | Semántica, cambia con el modo | `bg/strong-950`, `bg/surface-800`, `bg/sub-300`, `bg/soft-200`, `bg/weak-50`, `bg/white-0`; `text/strong-950`, `text/sub-600`, `text/soft-400`, `text/disabled-400`, `text/white-0`; `stroke/strong-950`, `stroke/sub-300`, `stroke/soft-200`, `stroke/white-0`; `icon/*`; `overlay`; `state/{success,error,warning,information,faded}-{dark,base,light,lighter}`; `elevation-*`; `static-white/black` |
| Layers | Componentes y páginas | `components/site/*`, clases `.site-*` |

- Utilidades Tailwind generadas: `bg-bg-white-0`, `text-text-sub-600`, `ring-stroke-soft-200`, `fill-primary-alpha-10`, `bg-state-success-lighter`, `shadow-elevation-card`…
- **Modo oscuro:** solo cambian los tokens (y `--primary-stroke`/alfas del tema). Neutros y estados nunca cambian con la marca.
- `avatar/*` no se declara: la web no tiene avatares. Un token entra cuando una capa lo necesita.

### Dónde va la marca

Solo en el **botón primario** (`.site-button`), el **elemento activo** (indicador de navegación, nodo activo del diagrama), la **selección** (`--primary-alpha-24`) y el **anillo de foco** (`--primary-stroke`, ≥ 3:1 en ambos modos). Nunca en texto, enlaces, iconos decorativos ni la marca del logo, que es `bg-strong-950`.

### Tipografía

Solo **Inter** (variable, `swap`, precargada). Escala en tokens `--text-*` con interlineado, tracking y peso:

- `title-h1…h6` (h1–h4 fluidos con `clamp()`; h1 36→56 px, tracking −0,032 em), `label-lg/md/sm/xs`, `paragraph-lg/md/sm`, `subheading-sm/xs` (mayúsculas, tracking +0,06/0,08 em).
- **Juego normal** para texto de varias líneas. **Juego Trim** (`trim` = `text-box: trim-both cap alphabetic`) para texto de una línea dentro de una caja: insignias, etiquetas, contadores; el texto queda centrado ópticamente.
- `text-soft-400` (2,6:1) solo para adornos con `aria-hidden` (contador `01 / 03`, separadores); nunca texto legible.

### Superficies

- **Anillo de 1 px en lugar de borde** en todo componente con contorno: tarjetas (`.site-card` = `inset 0 0 0 1px stroke-soft-200` + `elevation-card`), etiquetas, insignias, botones secundarios. Los separadores entre bloques son reglas `border-stroke-soft-200`.
- **Elevaciones:** `card`, `input`, `outline`, `badge`, `dropdown`, `modal` (sombras sobre `gray-950`; negras en oscuro).
- **Radios:** `rounded-6` (etiquetas), `rounded-10` (botones, iconos), `rounded-16` (datos de contacto), `rounded-20` (tarjetas), `rounded-full` (insignias de estado).
- Botones: primario violeta con texto `static-white` (7,2:1); secundario `.site-button-stroke` (fondo `bg-white-0`, anillo, `elevation-outline`).

### Estado

Siempre **icono + texto**: disponibilidad = insignia `state/success` con punto pulsante y etiqueta; copiar email = icono de check en `success-base` o de alerta en `error-base` junto al texto «Copiado»/«No se pudo copiar».

### Movimiento (CSS, sin librerías ni WebGL)

1. **Hero:** titular por líneas con máscara, una vez por sesión, < 1,2 s; líneas del diagrama que se dibujan y pulso hacia el nodo activo.
2. **Trabajos — baraja apilada:** cada caso es `position: sticky` y se apila sobre el anterior con 14 px de desfase; el de debajo se encoge (`scale` 0,93/0,965) con `animation-timeline: view()` sobre la lista. Filas iguales (`grid-auto-rows: 1fr`) para que ninguna tarjeta asome por debajo. El caso con foco sube encima (`:focus-within`). Solo con pantallas de ≥ 640 px de alto.
3. **Servicios — reparto:** desde 768 px las tres tarjetas salen apiladas y giradas desde el centro y se reparten en su columna a medida que la sección entra (`cover 0% → 40%`); en móvil cada tarjeta sube y se endereza al entrar.
4. **Raíl de experiencia** que se dibuja con el scroll y **cabecera** que se vuelve translúcida a partir de 40 px.

`prefers-reduced-motion` desactiva todo (la baraja pasa a lista normal); sin soporte de scroll-driven animations la baraja se apila igualmente con `sticky` y los servicios quedan en su rejilla; al imprimir todo es estático. Ninguna animación oculta contenido sin JavaScript.

### Accesibilidad (WCAG 2.2 AA)

Texto ≥ 4,5:1 (`text-sub-600` 7,1:1 en claro y oscuro), foco visible con contraste ≥ 3:1, objetivos táctiles de 44 px en móvil, estado nunca solo por color, foco nunca tapado por la baraja.

### Reglas de maquetación

- Mobile-first en 390 px; hero en dos columnas desde `lg`; secciones con título fijo a la izquierda desde `lg`; botón de contacto en la cabecera desde `wide` (1200 px).
- **Un solo CTA** («Let's discuss your project» / «Hablemos de tu proyecto»), siempre hacia `/contact`.
- Diagramas en SVG inline, máximo 6 cajas (lo comprueba `content/site/content.test.ts`).
- Imagen OG de la web en paleta Underlay (fondo blanco, Inter, marca violeta); la de `/cv` sigue en ámbar.

## `/cv`: sistema ámbar

> Lo que sigue aplica solo a `/cv` y a sus imágenes OG.

### Revisión de noviembre de 2026

- **Color.** Texto `#141210` / `#F2EFEA`. Acento único ámbar quemado `#B8621B` (claro) / `#E9A760` (oscuro), solo en marcas y el foco; nunca en texto pequeño. Fondo oscuro `#0D0C0B`.
- **Tipografía.** Fraunces 500 (estática, `swap`, precargada) para titulares; Geist para el resto. Etiquetas en versalitas con tracking 0,14–0,18 em en `text-muted-foreground`.
- Hasta esta revisión la web comercial compartía este sistema; desde la adopción de Underlay solo lo usa `/cv`.

Sistema bloqueado del portfolio. Cualquier cambio visual futuro debe respetar estos tokens y pasar las verificaciones del final. Género: **modern-minimal** (escuela Apple / Notion / Vercel / Linear), con un único acento terracota y la mono reservada a datos.

### Tipografía

| Capa | Fuente | Uso |
|---|---|---|
| Display (`--font-display` → `font-heading`) | **Fraunces** (serif variable, eje `opsz`) | h1–h3, nombre, posicionamiento del hero, títulos de sección, email de contacto, 404. Peso 500; tracking suave (h1: `-0.02em`, h2 y posicionamiento: `-0.01em`). Es la única fuente elegida por carácter: una serif de ojo grande junto a una interfaz de cantos rectos y datos en mono |
| Cuerpo (`--font-sans`) | **Figtree** | Solo texto corrido y controles: párrafos, descripciones, navegación, botones, pistas de sección. Es la neutra; no se usa en titulares |
| Mono (`--font-mono`) | **Geist Mono** | Solo datos: fechas, zona horaria, metadatos de la ficha y de cada puesto, atajos de teclado, terminal. Los badges de tecnología van en sans |

- Tamaños fluidos con `clamp()`: h1 `clamp(2.5rem,5.5vw+1rem,5rem)`, h2 `clamp(1.5rem,1.1vw+1.15rem,2rem)`, posicionamiento del hero `clamp(1.25rem,1vw+1rem,1.625rem)`, email `clamp(1.25rem,2.2vw+0.75rem,1.875rem)`.
- Títulos multi-línea llevan `text-balance` (sin viudas). Nunca cursiva en titulares.
- **Suelo de 11px** para cualquier texto funcional; la medida de lectura no pasa de ~75 caracteres.
- **Sin kickers ni numeración de secciones** ("01 — Sobre mí"): el título carga la sección. El cuadrado de marca del título cuelga en el margen desde `sm` (`-ml-[1.125rem]`) para que el texto del título comparta borde izquierdo con el cuerpo; en móvil va en línea. Retirados en octubre de 2026 tras la auditoría de Impeccable, junto con el texto "scramble" del hero y la franja marquee infinita. La tira de métricas (6+ años · 3 sectores · 5 empresas) se retiró en noviembre de 2026: los números ya se cuentan con contexto en el párrafo de «Quién soy».

### Color

- Neutros **cálidos** en oklch en `app/globals.css` (`--background`, `--foreground`, `--muted-foreground`, `--border`…): página blanca (`oklch(1 0 0)`, no crema: el detector de Impeccable marca el crema como fondo reflejo) con tinta (`oklch(0.21 0.018 55)`), superficies (`--card`, `--muted`, `--secondary`, `--accent`) y bordes cálidos en claro; carbón cálido (`oklch(0.17 0.01 60)`) en oscuro. Ningún neutro de superficie es gris puro: todos llevan un poco del matiz terracota. `--muted-foreground` claro es `0.47` (5,9:1 sobre `--muted`, 7:1 sobre fondo); oscuro `0.72` (6,1:1 sobre `--muted`). Nada de opacidades `/60`–`/80` sobre texto.
- **Acento único: `--brand` (terracota)** — claro `oklch(0.55 0.12 55)`, oscuro `oklch(0.74 0.115 60)`. Solo como marca: el cuadrado junto a cada título de sección y a la marca de la barra, ping de estado, barra de progreso, selección de texto y caret. Nunca en bloques grandes ni texto de cuerpo.
- Prohibido introducir un segundo acento o hex sueltos: todo color nuevo se declara como token.

### Superficies

- **Radio: ninguno.** `--radius` es `0px` y toda la escala (`rounded-sm`…`rounded-4xl`) resuelve al mismo canto recto, como el cuadrado de la marca. Solo lleva curva lo que es redondo de verdad (puntos de estado, avatar, píldora de navegación, lanzador del chat) y usa `rounded-full`. No se declara ningún radio en componentes.
- Marcos: borde **sólido** `border-border`, sin radio. Los bordes discontinuos están retirados — eran la huella de la plantilla original.
- **No todo es tarjeta.** Solo llevan marco completo los elementos repetidos (la rejilla de proyectos, las opciones del diálogo de CV) y lo que flota (diálogos, terminal, panel del chat, imagen de la credencial). Habilidades, enfoque de IA, despliegue, idiomas, la ficha del hero y los datos de contacto son listas abiertas: una regla `border-t` por bloque, texto a ras del margen, sin cajas.
- Nav: **píldora flotante** (`rounded-full`, `bg-background/85`, blur, `shadow-sm`) separada del borde superior; progreso de scroll como línea `h-0.5 bg-brand` fija arriba.
- Chat del asistente: panel recto con `shadow-lg`, lanzador `rounded-full`. Diálogos y terminal rectos.

### Movimiento

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

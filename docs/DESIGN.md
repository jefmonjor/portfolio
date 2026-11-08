# Sistema de diseño

Dos productos con la misma marca (ámbar quemado) y dos implementaciones:

- **Web comercial** (`/`, `/es`, la 404): arquitectura de tokens **Underlay** con el tema **Ámbar**; **Instrument Serif** + Inter.
- **`/cv`** (portfolio y CV): tokens shadcn en ámbar; Fraunces + Geist.

El layout raíz no carga fuentes. La web las carga en `app/[locale]/(site)/layout.tsx` (precargadas) y la 404 en su propio archivo sin precarga, porque esa frontera envuelve también `/cv`. `/cv` declara Fraunces, Geist y Geist Mono como variables de `:root` (`components/portfolio/cv-fonts.tsx`), porque sus diálogos se montan en `<body>`.

La dirección de la home está fijada en `PRODUCT.md` y en `.impeccable/surfaces/app-locale-site-page-tsx.md`.

## Web comercial: Underlay con tema Ámbar

### Cadena de color

`Foundations → Theme → Tokens → Layers`, todo en `app/globals.css`. Los componentes solo leen tokens; ningún hex ni escala cruda en `components/site/`. Cambiar de marca es cambiar el bloque Theme (así se pasó de Violet a Ámbar sin tocar componentes).

| Capa | Qué contiene | Ejemplos |
|---|---|---|
| Foundations | Escalas crudas | `--gray-0…1000` (neutros cálidos: tinta `#141210`, papel oscuro `#0D0C0B`), `--amber-300/500`, `--green/red/orange/blue-50/200/500/950` |
| Theme | La marca | `--primary-base` (`#B8621B` claro, `#E9A760` oscuro), `--primary-inverse` (el ámbar del otro modo, para superficies invertidas), `--primary-alpha-6/10/24` |
| Tokens | Semántica, cambia con el modo | `bg/strong-950`, `bg/surface-800`, `bg/sub-300`, `bg/soft-200`, `bg/weak-50`, `bg/white-0`; `text/strong-950`, `text/sub-600`, `text/soft-400`, `text/disabled-400`, `text/white-0`; `stroke/*`; `icon/*`; `overlay`; `state/{success,error,warning,information,faded}-{dark,base,light,lighter}`; `elevation-*`; `static-white/black` |
| Layers | Componentes y páginas | `components/site/*`, clases `.site-*` |

- Utilidades Tailwind generadas: `bg-bg-white-0`, `text-text-sub-600`, `ring-stroke-soft-200`, `fill-primary-alpha-10`, `bg-state-success-lighter`, `shadow-elevation-card`…
- Contraste: `text-sub-600` 7,1:1 en claro y en oscuro; ámbar de foco 4,4:1 sobre blanco y 9,5:1 sobre `#0D0C0B`.
- `.surface-dark` reutiliza los tokens del modo oscuro en cualquier modo: hero, banda de declaración y cierre.
- Un token entra cuando una capa lo necesita.

### Dónde va el ámbar

Marca cuadrada del logo, la palabra en cursiva de tres titulares (abajo), la ruta y los puntos de las anotaciones del hero, la flecha del CTA, el indicador de navegación activo, los enlaces encendidos del mapa de conexión, la selección y el anillo de foco. Nunca en bloques grandes ni en texto de cuerpo. El CTA es tinta (`bg-strong-950`, texto `text-white-0`; claro sobre las superficies oscuras) con la flecha en `--primary-inverse`: más contraste que un botón ámbar (el blanco sobre `#B8621B` no llega a 4,5:1).

### Tipografía

- **Instrument Serif 400** (normal y cursiva, `swap`) en todos los titulares (`font-heading` + `text-title-*`); **Inter** en el resto.
- Escala: `title-h1` `clamp(3.25rem, 1.75rem + 6.2vw, 6rem)` / 0,95; `title-h2` `clamp(2.6rem, 1.6rem + 3.9vw, 4.75rem)`; `title-h3…h5` 1,75rem; `title-h6` 1,4rem. Después `label-*`, `paragraph-*` y `subheading-*` (mayúsculas con tracking, solo para etiquetas).
- **Cursiva ámbar solo tres veces en la home:** el titular del hero («runs on» / «funciona»), la banda de declaración («without me» / «sin mí») y el cierre («lasts» / «dure»). El resto de títulos de sección son frases normales sin cursiva ni punto final, para que no se repita la fórmula.
- **Juego normal** para texto de varias líneas. **Juego Trim** (`trim` = `text-box: trim-both cap alphabetic`) para texto de una línea dentro de una caja: insignias, etiquetas, chips.
- `text-soft-400` solo para adornos con `aria-hidden` (números de paso, separadores); nunca texto legible.

### Fotografía

- Seis fotos de Unsplash autoalojadas en `public/images/site/` (importación estática de `next/image`, `placeholder="blur"`), con la procedencia embebida en cada archivo (`impeccable embed-prompt --scan` sin pendientes). Créditos en el pie y en el hero, con `utm_source=jefmonjor_dev&utm_medium=referral`. Datos en `content/site/photos.ts`.
- **Tema: software e infraestructura** — rack de servidores (hero), código en pantalla (declaración y cierre), diagrama en una pizarra, portátil y un desarrollador con varios monitores (servicios). Nada de edificios ni metáforas de estudio de arquitectura: la web vende ingeniería de software.
- Sobre foto, el texto siempre va sobre una capa de sombra que garantiza 4,5:1: más densa a la izquierda en escritorio y uniforme en móvil.

### Hero

Marco oscuro de 24 px de radio (`min-height: min(90svh, 56rem)`) con la foto del rack a sangre, algo desaturada y con un Ken Burns lento. Encima, un SVG con el mismo `viewBox` que la foto (`2400×1590`, `xMidYMid slice`) para que las cinco anotaciones (API · Apps, Services · AI, Events, Integrations, Your data) caigan siempre sobre las mismas bahías: la ruta se dibuja la primera vez de la sesión, los puntos laten y una señal SMIL recorre la ruta. Por debajo de 48 rem el SVG se oculta, porque el texto ocupa toda la foto.

Orden del texto: insignia de disponibilidad → titular (entra por palabras con máscara) → subtítulo (para quién y qué) → CTA de 56 px + «Ver trabajos seleccionados ↓» → crédito de la foto. Debajo del marco, la fila de prueba en texto pequeño separada por puntos (los puntos van en `::before` y se recortan al principio de cada línea).

### Superficies

- **Anillo de 1 px en lugar de borde** en todo componente con contorno: tarjetas (`.site-card` = `inset 0 0 0 1px stroke-soft-200` + `elevation-card`), etiquetas, insignias, botones secundarios. Los separadores entre bloques son reglas `border-stroke-soft-200`.
- **Radios:** `rounded-6` (etiquetas), `rounded-10` (botones), `rounded-16` (datos de contacto), `rounded-20` (tarjetas), 24 px (paneles con foto), `rounded-full` (insignias y botones de flecha).

### Estado

Siempre **icono + texto**: disponibilidad = insignia `state/success` con punto y etiqueta; copiar o preparar el email = check en `success` o alerta en `error` junto al texto.

### Orden de la home

Hero → «Experiencia en» (Andbank, elAbogado, Vodafone, Endesa) → Tus sistemas, por fin conectados → Cuatro sistemas en producción (casos) → banda de declaración con foto → Tres formas de empezar → Con quién vas a trabajar (retrato) → Dónde he trabajado → cierre con foto.

### Movimiento (CSS, sin WebGL ni librerías)

1. **Hero:** Ken Burns de la foto, anotaciones que se dibujan una vez por sesión, puntos que laten y una señal que recorre la ruta.
2. **Tus sistemas, conectados (desde 64 rem):** cuatro pasos y, fijo al lado, un mapa SVG que cuenta el antes y el después con el scroll: herramientas sueltas con borde discontinuo → conexiones que se dibujan hacia «Tu backend» → la IA revisada se enciende y los datos circulan → se iluminan facturas, paneles y avisos. Cada paso tiene su `view-timeline` (`--connect-2…4`, con `timeline-scope`); los resaltes son una capa que anima `opacity` (interpolar un `fill` con `color-mix()` rompe el color en Chrome). **Por debajo de 64 rem** el mapa va completo y estático encima de los pasos, sin fijarse: en móvil tapaba los títulos.
3. **Casos (desde 48 rem de ancho y 40 rem de alto):** cada tarjeta es `sticky` y se apila; la de debajo se encoge. En móvil son una lista normal. Un paquete ámbar recorre la arquitectura en miniatura de cada tarjeta.
4. **Banda de declaración:** parallax suave de la foto con `view()`.
5. **Servicios:** desde 48 rem las tres tarjetas se reparten con una inclinación pequeña (−3°, 1°, 3°) y se dan la vuelta; en móvil solo suben y aparecen, sin giro, para que el texto nunca se vea torcido. Debajo, la línea ámbar recorre los pasos de «Cómo empezamos».
6. **Experiencia:** el raíl se dibuja con el scroll.

Reglas: lo que se mueve en bucle o al cargar usa `transform`/`translate`/`opacity`; lo ligado al scroll puede animar propiedades registradas porque solo corre mientras se hace scroll. `prefers-reduced-motion` lo desactiva todo (foto quieta, anotaciones estáticas, mapa completo, casos en lista, tarjetas boca arriba); sin soporte de scroll-driven animations las piezas quedan en su estado final; al imprimir todo es estático. Nada oculta contenido sin JavaScript. Nada lleva `content-visibility`: dejaba el mapa en blanco en capturas e impresión.

### Reglas de maquetación

- Mobile-first en 390 px; botón de contacto en la cabecera desde `wide` (1200 px). Controles de 44 px en móvil; menú móvil a pantalla completa con la API `popover`.
- **Un solo CTA** («Let's discuss your project» / «Hablemos de tu proyecto»), siempre hacia `/contact`. Allí el **brief de proyecto** es el camino principal (botón de tinta): seis preguntas (nombre, empresa, problema, tipo, presupuesto orientativo, plazo) con chips accesibles. Al enviarlo abre el correo del visitante con todo escrito y confirma en pantalla con la alternativa de copiar el texto; el error de campos vacíos se borra en cuanto están rellenos. El cuerpo del correo usa etiquetas cortas (Nombre, Empresa, Proyecto, Presupuesto, Inicio, El problema). No hay servidor ni datos guardados (`method="dialog"` evita cualquier envío sin JavaScript). El email directo es la vía secundaria (botón con contorno), en `/contact` y en el cierre.
- Migas de pan con la página actual al final (`aria-current="page"`).
- **Posicionamiento:** pymes y empresas en general (software a medida, integración, automatización, IA aplicada); la banca es prueba de nivel. Casos: Transolido, Other Twist e Ilnami, más el banco anonimizado. Los títulos de los casos hablan de negocio; la tecnología va en etiquetas y en la página del caso.
- Diagramas en SVG inline, máximo 6 cajas (lo comprueba `content/site/content.test.ts`).
- Imagen OG de la web en la misma paleta que la de `/cv` (fondo `#0D0C0B`, ámbar), con Inter.

## `/cv`: sistema ámbar

> Lo que sigue aplica solo a `/cv` y a sus imágenes OG.

### Revisión de noviembre de 2026

- **Color.** Texto `#141210` / `#F2EFEA`. Acento único ámbar quemado `#B8621B` (claro) / `#E9A760` (oscuro), solo en marcas y el foco; nunca en texto pequeño. Fondo oscuro `#0D0C0B`.
- **Tipografía.** Fraunces 500 (estática, `swap`, precargada) para titulares; Geist para el resto. Etiquetas en versalitas con tracking 0,14–0,18 em en `text-muted-foreground`.
- La web comercial comparte el ámbar pero no tokens ni fuentes: usa Underlay e Instrument Serif (arriba).

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

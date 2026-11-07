# Sistema de diseño

Dos productos con la misma marca (ámbar quemado, Fraunces en titulares) y dos implementaciones:

- **Web comercial** (`/`, `/es`, la 404): arquitectura de tokens **Underlay** con el tema **Ámbar**; Fraunces + Inter.
- **`/cv`** (portfolio y CV): tokens shadcn en ámbar; Fraunces + Geist.

Fraunces se carga en el layout raíz y la comparten ambos (una sola descarga en caché). Inter solo se precarga en la web; Geist solo en `/cv` (sus variables viven en `:root` porque los diálogos se montan en `<body>`); la 404 usa Inter sin precarga.

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
- `avatar/*` no se declara: la web no tiene avatares. Un token entra cuando una capa lo necesita.

### Dónde va el ámbar

Marca cuadrada del logo (gira 90° en hover), subrayado que se dibuja bajo «banks and fintechs» / «IA», atmósfera del fondo (6 %), flecha del CTA, indicador de navegación activo, nodo activo del diagrama, selección y anillo de foco. Nunca en bloques grandes ni texto de cuerpo. El CTA es tinta (`bg-strong-950`, texto `text-white-0`; invertido en oscuro) con la flecha en `--primary-inverse`: más contraste que un botón ámbar (el blanco sobre `#B8621B` no llega a 4,5:1).

### Tipografía

- **Fraunces 500** (estática, `swap`, precargada) en todos los titulares (`font-heading` + `text-title-*`); **Inter** en el resto.
- Escala: `title-h1` `clamp(2.4rem, 8vw, 5.5rem)` / 1,05 / −0,02 em (en dos columnas, `title-h1-split` con 4,6 vw), `title-h2…h6`, `label-lg/md/sm/xs`, `paragraph-lg/md/sm`, `subheading-sm/xs` (mayúsculas, tracking +0,06/0,08 em; la etiqueta del hero sube a 0,18 em desde `sm`).
- **Juego normal** para texto de varias líneas. **Juego Trim** (`trim` = `text-box: trim-both cap alphabetic`) para texto de una línea dentro de una caja: insignias, etiquetas, contadores.
- `text-soft-400` solo para adornos con `aria-hidden` (contador `01 / 03`, separadores); nunca texto legible.

### Hero

Etiqueta → titular → subtítulo (`paragraph-lg`, secundario) → disponibilidad (insignia verde con punto pulsante + «Remoto · Hora de Andorra») → CTA de 56 px (ancho completo en móvil, flecha que se desplaza 4 px) con «Ver trabajos seleccionados ↓» como enlace de texto → fila de prueba en texto pequeño separada por puntos. Los puntos están en `::before` y se recortan al principio de cada línea, así nunca queda uno colgando al partir la fila. Diagrama de arquitectura decorativo a la derecha desde 768 px y debajo en móvil.

### Superficies

- **Anillo de 1 px en lugar de borde** en todo componente con contorno: tarjetas (`.site-card` = `inset 0 0 0 1px stroke-soft-200` + `elevation-card`), etiquetas, insignias, botones secundarios. Los separadores entre bloques son reglas `border-stroke-soft-200`.
- **Atmósfera:** gradiente radial desde la esquina superior derecha con `--primary-alpha-6` y grano SVG fijo al 3 % (5 % en oscuro).
- **Elevaciones:** `card`, `input`, `outline`, `badge`, `dropdown`, `modal`.
- **Radios:** `rounded-6` (etiquetas), `rounded-10` (botones, iconos), `rounded-16` (datos de contacto), `rounded-20` (tarjetas), `rounded-full` (insignias de estado).

### Estado

Siempre **icono + texto**: disponibilidad = insignia `state/success` con punto pulsante y etiqueta; copiar email = icono de check en `success-base` o de alerta en `error-base` junto al texto.

### Movimiento y 3D (CSS 3D, sin WebGL ni librerías)

1. **Hero — arquitectura en 3D:** cinco placas isométricas (`perspective` + `preserve-3d`) con grosor real, cuadrícula de plano y módulos en relieve: Core banking (ámbar), BaaS · Integrations, Events, Services · AI y API. Al cargar caen y se ensamblan una tras otra (`translate` en el compositor, una vez por sesión); siguen al ratón con una inclinación de hasta 10° (`PointerTilt`, el único JavaScript nuevo: escribe dos variables CSS); al hacer scroll se separan (`--stack-explode` registrada con `@property` y ligada a `view()`); una señal ámbar recorre la pila de la API al core cada 3,6 s. El texto del titular entra por líneas con máscara y el subrayado ámbar se dibuja.
2. **Prueba:** banda «Experiencia en» (Andbank, elAbogado, Vodafone, Endesa en Fraunces) y contadores 0 → 7 años y 0 → 4 sectores (`@property --stat` entera animada con `view()`; el número real está en el DOM para lectores de pantalla y sin soporte se ve el valor final).
3. **Sobre mí:** la frase principal se rellena de gris (`text-sub-600`, 7:1) a tinta en orden de lectura con el scroll (`background-clip: text` sobre un `span` en línea; con `forced-colors` y al imprimir vuelve a texto normal).
4. **Trabajos — baraja 3D:** cada caso es `sticky` y se apila; el de debajo se encoge y se inclina hacia atrás (`scale` + `rotate: x 9deg`). Contador `01 → 03` con barra bajo el título (`timeline-scope`), arquitectura en miniatura que se monta al entrar, e **inclinación 3D con foco de luz** que sigue al ratón en cada tarjeta.
5. **Servicios — reparto boca abajo:** las tres cartas salen apiladas, giradas y **boca abajo** (dorso oscuro con cuadrícula, marca ámbar y número) y se reparten dándose la vuelta en 3D (`rotate: y 180deg → 0`, `backface-visibility`); en móvil cada carta se voltea al entrar. Debajo, «Cómo empezamos» con la línea ámbar que recorre los pasos.
6. **Cierre:** panel oscuro (`.surface-dark` reutiliza los tokens del modo oscuro en cualquier modo) con brillo ámbar, disponibilidad, email y datos; el pie termina con tu nombre como gran marca tipográfica que se desvanece.

Cabecera translúcida a partir de 40 px, secciones que aparecen al entrar y raíl de experiencia que se dibuja completan la lectura.

Reglas: todo lo que se mueve en bucle o al cargar usa `transform`/`translate`/`opacity` (compositor); lo ligado al scroll puede animar propiedades registradas porque solo corre mientras se hace scroll. `prefers-reduced-motion` lo desactiva todo (pila estática, baraja como lista, cartas boca arriba, contador oculto, pasos en gris); sin soporte de scroll-driven animations las piezas quedan en su estado final; al imprimir todo es estático. Nada oculta contenido sin JavaScript.

### Reglas de maquetación

- Mobile-first en 390 px; hero y secciones en dos columnas desde `md`/`lg`; botón de contacto en la cabecera desde `wide` (1200 px). Controles de 44 px en móvil; menú móvil a pantalla completa con la API `popover`.
- **Un solo CTA** («Let's discuss your project» / «Hablemos de tu proyecto»), siempre hacia `/contact`.
- Diagramas en SVG inline, máximo 6 cajas (lo comprueba `content/site/content.test.ts`).
- Imagen OG de la web en la misma paleta que la de `/cv` (fondo `#0D0C0B`, ámbar), con Inter.

## `/cv`: sistema ámbar

> Lo que sigue aplica solo a `/cv` y a sus imágenes OG.

### Revisión de noviembre de 2026

- **Color.** Texto `#141210` / `#F2EFEA`. Acento único ámbar quemado `#B8621B` (claro) / `#E9A760` (oscuro), solo en marcas y el foco; nunca en texto pequeño. Fondo oscuro `#0D0C0B`.
- **Tipografía.** Fraunces 500 (estática, `swap`, precargada) para titulares; Geist para el resto. Etiquetas en versalitas con tracking 0,14–0,18 em en `text-muted-foreground`.
- La web comercial comparte marca (ámbar, Fraunces) pero no tokens: usa Underlay (arriba).

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

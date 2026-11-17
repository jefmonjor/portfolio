# Sistema de diseño

Dos productos y dos implementaciones:

- **Web comercial** (`/`, `/es`, la 404): tokens **Underlay** con el tema **Pino** (verde) sobre grises neutros; **Bricolage Grotesque** (titulares e interfaz) + **Source Sans 3** (solo texto corrido).
- **`/cv`** (portfolio y CV): tokens shadcn en ámbar; Fraunces + Geist.

El layout raíz no carga fuentes. La web las carga en `app/[locale]/(site)/layout.tsx` (precargadas) y la 404 en su propio archivo sin precarga, porque esa frontera envuelve también `/cv`. `/cv` declara Fraunces, Geist y Geist Mono como variables de `:root` (`components/portfolio/cv-fonts.tsx`).

La dirección de la web está en `PRODUCT.md` y en `.impeccable/surfaces/app-locale-site-page-tsx.md`. Es una web personal de consultor senior, en primera persona, con la estructura que el dueño fijó en noviembre de 2026 a partir de geronimo.design: una barra lateral fija, una frase, un muro de trabajo a dos columnas y una página corta. De esa referencia no se toman el fondo crema, las fuentes de pago, la fila de logos de cliente ni sus textos e imágenes. Su foto solo vive en `/cv` (decisión del dueño). Nada de fotos de stock ni de los looks típicos de webs generadas con IA (fondo crema, serif con cursiva, terracota; héroe oscuro con anotaciones brillantes).

## Web comercial: Underlay con tema Pino

### Cadena de color

`Foundations → Theme → Tokens → Layers`, todo en `app/globals.css`. Los componentes solo leen tokens; ningún hex ni escala cruda en `components/site/`.

| Capa | Qué contiene | Ejemplos |
|---|---|---|
| Foundations | Escalas crudas | `--gray-0…1000` neutros fríos (tinta `#111417`, fondo oscuro `#0B0D0F`), `--pine-50/100/200/300/600/800/900`, `--green/red/orange/blue-*` para estados |
| Theme | La marca | `--primary-base` (`#0F6B4F` claro, `#5FD1A0` oscuro), `--text-on-primary` (blanco en claro, `#0B0D0F` en oscuro), `--primary-inverse`, `--primary-alpha-6/10/24` |
| Tokens | Semántica, cambia con el modo | `bg/*`, `text/*`, `stroke/*`, `icon/*`, `state/*`, `elevation-*` |
| Layers | Componentes y páginas | `components/site/*`, clases `.site-*` |

- Contraste: `text-sub-600` 7:1 sobre blanco y 7,4:1 sobre `#0B0D0F`; blanco sobre `#0F6B4F` 6,5:1; `#5FD1A0` sobre `#0B0D0F` 10:1.
- `.surface-brand` (cierres) pone el campo en `pine-800` (`pine-900` en oscuro), texto blanco y secundario `#B9C9C1` (5,9:1); el botón principal pasa a claro con texto verde.
- Fondo gris frío (`--ground`, `gray-50`) con paneles blancos de 16 px sin anillo (`--panel`), definidos en `.site-ground`; en oscuro el panel queda un paso por encima del fondo. La home pone sus baldosas directamente sobre el fondo; el resto de páginas van en una hoja blanca de 20 px de radio, para que lo que se dibujó sobre blanco conserve su superficie (en oscuro, hoja y fondo son el mismo color). Sin degradados de atmósfera ni grano.

### Dónde va el verde

El botón principal (barra lateral, intro en móvil, servicios y cierre), la etapa «Revisión · Respondo yo» del flujo de trabajo, el núcleo de la órbita, el campo de los paneles de cierre, los puntos de las listas de capacidades y el foco. Nunca en texto de cuerpo. El punto de disponibilidad usa el verde de estado y está quieto: sin latido.

### Tipografía

- **Bricolage Grotesque** (variable con eje `opsz`, `swap`) es la fuente por defecto de la web (`font-heading` en el `SiteShell`): titulares a 600–700, navegación, botones, etiquetas, chips y datos. **Source Sans 3** (`font-ui`, variable `--font-text`) solo para texto corrido: `.site-prose`, `text-paragraph-*` y los campos del brief. Nada de Inter, Geist ni system-ui como fuente visible de la web. Sin cursivas.
- Escala: `title-h1` `clamp(2.25rem, 1.2rem + 3.6vw, 3.9rem)` / 1,02 / −0,035 em; `title-h2` `clamp(2rem, 1.35rem + 2.5vw, 3.25rem)`; `title-h3` hasta 2,15rem; `title-h4` hasta 1,65rem; `title-h5` 1,25rem; `title-h6` 1,0625rem.
- El titular de la home (`.wall-title`) va a `clamp(1.875rem, 1.25rem + 2.2vw, 2.875rem)`, peso 700, −0,04 em e interlínea 1,1: tres líneas en escritorio, con cada frase empezando línea; en móvil las dos frases van seguidas para que ninguna línea quede corta. Ningún título de la home es mayor que él.

### Imágenes

- Solo material real: capturas de las páginas públicas de Transolido, Other Twist, Ilnami, PRONOQ, Corte1D y Contact QR (`public/images/work/`, 1440×900, tomadas de las webs en producción). El retrato del dueño no aparece en la web comercial ni en sus datos estructurados; solo en `/cv`. Cada archivo lleva su procedencia embebida (`impeccable embed-prompt --scan public/images`: 0 pendientes). Mapa en `content/site/images.ts`.
- Las capturas van en un marco de navegador mínimo con el dominio real; el caso del banco, sin capturas por confidencialidad, muestra su arquitectura en el mismo hueco.
- El muro encuadra dos capturas a su manera (`wallScreenshots`): Transolido desde más cerca (`transolido-sign-in.jpg`) e Ilnami hasta el final de su primera sección. `/work` usa las generales.

### Asistente de IA y terminal (toda la web comercial)

- **Asistente:** botón «Pregunta a la IA» con su texto y con contorno (nunca en verde, para no competir con el CTA). Con 75 rem de ancho y 48 rem de alto se acopla al pie de la barra lateral y su panel se abre junto a ella; en pantallas más bajas o estrechas flota abajo a la derecha, y en móvil aparece tras el primer scroll para no tapar la intro (`components/site/site-console.tsx`). Abre un panel (hoja inferior en móvil, tarjeta de 24 rem en escritorio) con tres preguntas sugeridas, el hilo y, siempre visibles, «Escríbeme un email» (hola@jefmonjor.dev) y «Rellena el brief de proyecto».
  - Responde `POST /api/site-assistant`, con el mismo modelo, límites y presupuesto diario que el asistente de `/cv`.
  - Usa un dossier con el contenido de la web, la experiencia, los productos propios y las tecnologías (`lib/site-assistant/dossier.ts`), sin precios ni detalles del banco. Habla de Jefferson en tercera persona: si el visitante menciona su sector, propone dos o tres ideas concretas, hace una o dos preguntas y le invita al brief o a hola@jefmonjor.dev.
  - Si falla, explica por qué y devuelve la pregunta al campo.
- **Terminal** (al nivel de la de `/cv`):
  - **Cómo se abre:** «Terminal» en la barra lateral (o en la cabecera, por debajo de 75 rem), «Abrir la terminal» en el menú del móvil, o las teclas `` ` `` y Ctrl/⌘+K.
  - **Comandos:** el motor puro está en `lib/site-terminal.ts` (con pruebas) y ofrece `help`, `whoami`, `ls [projects]`, `projects`, `open <producto>`, `cat <tema>`, `services`, `work`, `how`, `experience`, `skills`, `availability`, `contact`, `mail`, `brief`, `cv`, `ask <pregunta>`, `theme`, `lang`, `goto <sección>`, `date`, `clear`, `exit` y el huevo de pascua `sudo`.
  - **Uso:** Tab completa comandos, productos y secciones, ↑/↓ recorre el historial, y hay botones rápidos (help, projects, work, contact, brief) para el móvil.
  - **Datos:** los prepara el servidor (`lib/site-console.ts`, con los productos de `lib/site-products.ts`).
- Ambos se cargan con `next/dynamic` la primera vez que se abren y no se pintan sin JavaScript. El email nunca va literal en el HTML ni en el bundle.

### Patrones de plantilla que la home evita

- **Sin pastilla ni etiqueta sobre el titular:** el rol va bajo el nombre en la barra y la disponibilidad junto al botón, como frase normal con un punto quieto. En móvil, las dos bajo el botón.
- **Sin etiqueta sobre el título de cada baldosa:** primero el título, luego el resultado y al final el sector.
- **Sin grillas de tarjetas iguales:** el muro mezcla un diagrama, capturas, una lista con miniaturas, la órbita, un flujo y paneles de texto, cada uno con su altura.
- **Sin puntos que laten** y **sin filas de pasos numerados:** cada etapa dice qué te llevas (`stage-deliverable`) y los principios van sin números.

### La barra lateral y la cabecera

Desde 75 rem, `SiteRail` (18 rem, fija, con su propia barra de desplazamiento si la pantalla es baja) lleva el nombre y el rol, seis enlaces con icono (Inicio, Servicios, Casos, Experiencia, CV, Contacto; el actual, en un panel blanco), el botón «Hablemos», la disponibilidad, idioma, terminal y tema, la línea «He trabajado para…» en texto (no hay logos de cliente) y el asistente. Por debajo de 75 rem la sustituye la cabecera de siempre con su menú, sin botón de contacto propio: en esos anchos el botón va en la intro, en el panel de servicios, en móvil tras los productos y en el cierre.

### Orden de la home

`WallIntro` (titular y una entradilla de dos frases) y `WorkWall`, cuyas dos columnas son las dos mitades del titular. La página mide 4,1 pantallas a 1440 px.

- **Izquierda, los sistemas:** el caso del banco con su arquitectura, la órbita de herramientas, «Cómo trabajo» (el flujo Especificación → Código → Tests → **Revisión** → Producción y los títulos de los cuatro principios de IA), «Cómo podemos trabajar juntos» (una frase y los tres servicios, con enlace a `/services`) y «Hola, soy Jefferson».
- **Derecha, los productos:** Transolido, Other Twist e Ilnami con su captura, «También en producción» (PRONOQ, Corte1D y Contact QR como lista con miniaturas), «También abierto al puesto adecuado» (la nota para selección, con el CV) y el cierre en verde con el brief.
- **En la primera pantalla** quedan la arquitectura del banco y un producto real.
- **En móvil** hay una sola columna y las clases `max-md:order-*` ponen la prueba antes que el método: banco, productos, «También en producción», botón de contacto, órbita, flujo, servicios, sobre mí, selección y cierre.
- **Lo que salió de la home vive en `/services`:** «Lo que puedo asumir» (modernizar, integrar IA y construir, cada uno con su caso) al principio, y «Cómo trabajo» completo, con el texto de los cuatro principios, antes del cierre. La tabla comparativa de servicios y la línea de terminal del hero ya no existen.

### Superficies y estado

- **Anillo de 1 px en lugar de borde** en tarjetas (`.site-card`), etiquetas, insignias y botones secundarios; separadores con `border-stroke-soft-200`.
- **Radios:** `rounded-6` etiquetas, `rounded-10` botones, `rounded-16` tarjetas pequeñas, `rounded-20` tarjetas, 24 px retrato y paneles.
- Estado siempre con **icono + texto**.

### Movimiento (CSS)

1. **Intro de la home:** el titular entra por palabras con máscara, una vez por sesión, y la entradilla aparece detrás. La **órbita de herramientas** (`components/site/tool-orbit.tsx`) va en su baldosa: «Tu sistema» en el centro y 8 logos reales en dos anillos (Java, Spring Boot y PostgreSQL dentro; Redis, Docker, Kubernetes, Keycloak y Claude fuera; pocas a propósito, el stack completo está en /cv) que giran despacio en sentidos alternos, con los logos siempre derechos (el anillo gira y cada ficha contragira) y un punto verde que recorre cada anillo. La primera visita de la sesión, las fichas salen del centro hacia su anillo; el centro late cada 3 s; al pasar el ratón la órbita se detiene y la ficha muestra su nombre. Solo `rotate`, `scale` y `opacity` en el compositor; con movimiento reducido queda quieta. Los logos salen de simple-icons mediante `scripts/generate-site-tools.mjs` → `components/site/tool-rings.generated.ts` (los colores de marca casi negros usan el color del texto para que se vean en oscuro).
2. **Títulos de sección (páginas interiores):** cada letra se enfoca (opacidad y desenfoque) cuando su sección se revela al hacer scroll; el barrido dura menos de 0,4 s sea cual sea la longitud. El `h2` lleva el título en `aria-label` y las letras van con `aria-hidden` (`DisplayTitle letters`). Las secciones que ya están a la vista al cargar no se animan; con movimiento reducido, nada.
3. **Casos:** la arquitectura del banco, en su baldosa de la home, se inclina hasta 3° hacia el ratón (`components/site/tilt-frame.tsx`, solo con ratón; con movimiento reducido queda plano).
4. **Experiencia (página /experience):** el raíl se dibuja con el scroll. En la home no hay línea de tiempo: la línea «He trabajado para» de la barra y el párrafo de «Hola, soy Jefferson» la resumen.

`prefers-reduced-motion` lo desactiva todo; sin soporte de scroll-driven animations todo queda en su estado final; al imprimir todo es estático. Nada oculta contenido sin JavaScript. Sin inclinaciones 3D ni cartas que giran.

### Reglas de maquetación

- Mobile-first en 390 px; muro a dos columnas desde 48 rem; barra lateral desde `wide` (75 rem, 1200 px). Controles de 44 px en móvil.
- **Un solo CTA**, siempre hacia `/contact`: «Tell me about your project» / «Cuéntame tu proyecto» en la intro (bajo 75 rem), tras los productos en móvil, en el panel de servicios (bajo 75 rem) y en el cierre; la barra lateral y el menú del móvil usan la forma corta («Let's talk» / «Hablemos»). Allí el **brief de proyecto** es el camino principal; el email directo es secundario (botón con contorno). El brief se envía desde la web (`POST /api/contact` → Brevo, con el visitante como *reply-to*), muestra «Enviando…» y «Recibido» y no se guarda en ningún sitio; si el envío no está disponible o falla, abre la app de correo del visitante con todo escrito. Lleva un campo trampa oculto contra bots y un límite por IP.
- Migas de pan con la página actual al final (`aria-current="page"`).
- Diagramas en SVG inline, máximo 6 cajas (lo comprueba `content/site/content.test.ts`).
- Imagen OG de la web en los neutros fríos con el verde claro como marca, con Inter.

## `/cv`: sistema ámbar

> Lo que sigue aplica solo a `/cv` y a sus imágenes OG.

### Revisión de noviembre de 2026

- **Color.** Texto `#141210` / `#F2EFEA`. Acento único ámbar quemado `#B8621B` (claro) / `#E9A760` (oscuro), solo en marcas y el foco; nunca en texto pequeño. Fondo oscuro `#0D0C0B`.
- **Tipografía.** Fraunces 500 (estática, `swap`, precargada) para titulares; Geist para el resto. Etiquetas en versalitas con tracking 0,14–0,18 em en `text-muted-foreground`.
- La web comercial no comparte tokens, color ni fuentes con `/cv`: usa Underlay, el verde pino y Bricolage Grotesque (arriba).

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
- Nav: hasta 75 rem, **píldora flotante** (`rounded-full`, `bg-background/85`, blur, `shadow-sm`) separada del borde superior. Desde 75 rem, la misma barra pasa a ser una **barra lateral fija** de 16 rem con los tokens de `/cv` (cantos rectos, borde a la derecha, mono en las etiquetas): marca y rol, las siete secciones, «Contáctame», «Descargar CV», la disponibilidad con su punto ámbar, LinkedIn y GitHub, y abajo terminal, búsqueda, idioma y tema; en ese ancho la fila de botones del hero se oculta porque la barra ya los lleva. El progreso de scroll sigue como línea `h-0.5 bg-brand` fija arriba.
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
6. Los emails no aparecen literales en `.next/static` (`grep -r "jefmonjor" .next/static` sin direcciones). La web usa hola@jefmonjor.dev (`siteContactEmail()`); `/cv` mantiene la suya.

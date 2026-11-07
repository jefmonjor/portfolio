# QA de lanzamiento — jefmonjor.dev (7 de noviembre de 2026)

Cinco usuarios sintéticos recorrieron la build de producción en un Chromium real (Playwright) desde la página de inicio hasta el primer éxito: ver el email y un `mailto` con asunto en `/contact`. Las capturas y los scripts quedaron fuera del repositorio, en el directorio de trabajo de la sesión.

| Persona | Condiciones | Primer éxito (primer pase) |
|---|---|---|
| Impaciente | 1280×800 y 390×844, hace clic en lo primero que brilla | 1 clic en escritorio (0,66 s), 2 toques en móvil |
| Escéptico | 1280×900, lee precios, privacidad, `<head>` y fuentes máquina | Sí, con un email prudente |
| Móvil | 375×667 táctil, 3G lento (400 ms, 500 kbit/s), CPU 4× | 2 toques, 6,9 s |
| No nativo | Inglés B1, lectura literal, 1280×900 y 390×844 | 1 clic |
| Destructor | Basura en formularios, Atrás/recarga, dobles clics, teclado, URLs desconocidas, POST directos | Sí; sin XSS |

## Matriz de fricción, ordenada por cuántos usuarios la sufrieron

| # | Problema | Usuarios | Severidad | Estado |
|---|---|---|---|---|
| 1 | El enlace «Español» de las páginas inglesas apuntaba a `/es/en/…` (404 en pestaña nueva, sin JS, antes de hidratar y para crawlers). `usePathname` devuelve en el servidor la ruta interna con `/en`. | 4 (impaciente, móvil, no nativo, destructor) | Mayor | Corregido, con test |
| 2 | Asunto del email del CV en español también en las páginas inglesa y catalana. | 3 (escéptico, no nativo, destructor) | Menor | Corregido (también en los PDF) |
| 3 | `/contact` abierto directamente: «el email aparece con JavaScript activado» con JS activado hasta hidratar, y luego un salto de 108–133 px. | 2 (impaciente, móvil) | Mayor | Corregido: hueco reservado, aviso solo en `<noscript>` |
| 4 | Hero vacío en el primer pintado; el CTA tardaba 0,9 s (1,6 s en red lenta). | 2 (impaciente, móvil) | Mayor | Corregido: CTA visible desde el primer pintado |
| 5 | Disponibilidad contradictoria: «desde enero de 2027» frente a «ahora, 10–15 h». | 2 (escéptico, no nativo) | Mayor | Corregido |
| 6 | El menú móvil no se cerraba al tocar fuera (ni al tocar el enlace de la página actual). | 2 (impaciente, móvil) | Menor | Corregido |
| 7 | La 404 no tenía `<title>`. | 2 (móvil, destructor) | Menor | Corregido; sin meta robots duplicada |
| 8 | Cabecera móvil sin CTA ni idioma visible. | 2 (impaciente, no nativo) | Menor | Idioma visible junto al menú; CTA del hero visible al cargar |
| 9 | Transición entre páginas de 0,3–0,47 s que superponía textos; con Atrás lanzaba «Transition was skipped» sin capturar. | 2 (impaciente, destructor) | Menor | Retirada la transición SPA |
| 10 | Sin aviso de privacidad; el asistente y el CV adaptado no decían a qué proveedor va el texto. | 1 (escéptico) | Mayor | `/privacy` y `/es/privacy`; los textos nombran a OpenAI |
| 11 | Caso del banco: revelaba versiones de Tomcat sin soporte en un banco identificable. | 1 (escéptico) | Mayor | Corregido |
| 12 | `cv.json`: contrato indefinido y 6 años, frente a la oferta freelance y los siete años del resto. | 1 (escéptico) | Mayor | Corregido (años calculados) |
| 13 | Diálogos del CV: al cerrarlos el foco caía en `<body>`. | 1 (destructor) | Mayor | Corregido para todos los diálogos |
| 14 | Pedir el CV al asistente daba 500 sin clave de firma. | 1 (destructor) | Mayor (según entorno) | Corregido: respuesta sin firmar |
| 15 | Jerga e idiomatismos (BaaS, go-live, build-or-buy, handover, «Trust the disk», RLS…), zona horaria sin horario de verano, cómo se reserva la llamada, qué hacer sin app de correo. | 1 (no nativo) | Menor | Corregido |
| 16 | `/work` terminaba sin CTA; la Home no tenía CTA entre el hero y el final. | 1 (impaciente) | Menor | Corregido |
| 17 | Entradas altas de `/experience` al 62–79 % de opacidad mientras se leen. | 1 (móvil) | Menor | Corregido |
| 18 | LCP de 4,1 s en 3G por el repintado al llegar Fraunces. | 1 (móvil) | Menor | `font-display: optional` en la fuente display |
| 19 | Enlaces sueltos de 26 px de alto; CTA del hero bajo el pliegue a 320 px. | 1 (móvil) | Menor | Corregido |
| 20 | Mensajes solo con espacios de anchura cero; `/cv` sin skip link; cambiar de idioma en el CV rompía Atrás. | 1 (destructor) | Menor | Corregido |
| 21 | `llms.txt` afirmaba que no publica el email ni fechas; claim de datos en la UE en Ilnami; JSON-LD con el posicionamiento como cargo. | 1 (escéptico) | Menor | Corregido |

## Pendiente de decisión del propietario

- «banks and fintechs» en el titular: decisión de posicionamiento; el escéptico pide un caso fintech que lo respalde.
- Credencial SMPC: la página de verificación dice EIGP, 13/04/2022; la web dice SCRUMstudy, 2023.
- Identidad legal, NDA y propiedad intelectual: cuando el comerç esté dado de alta.
- Email en un dominio propio en lugar de Gmail; referencias o testimonios.
- `/cv` (portfolio anterior): controles de 28 px, texto de 11 px, el atajo Ctrl+K sobre la terminal y el anillo de foco de las tarjetas de proyecto.

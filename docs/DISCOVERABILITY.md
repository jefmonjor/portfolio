# Checklist de descubribilidad profesional

Este documento contiene las acciones externas que no puede aplicar el repositorio por sí solo. Mantener el mismo posicionamiento y los mismos hechos en cada plataforma; el cargo actual no se sustituye por el rol objetivo.

## GitHub

### Perfil público

- Nombre: `Jefferson Montesdeoca Jordán`
- Bio: `Product Engineer focused on AI & backend · Java/Spring · architecture`
- Empresa: `Andbank`
- Ubicación: `Andorra la Vella, Andorra`
- Web: `https://www.jefmonjor.dev`
- Disponibilidad: activada solo como señal general; el texto del README aclara que es selectiva.
- Copiar [`GITHUB_PROFILE_README.md`](GITHUB_PROFILE_README.md) al `README.md` de `jefmonjor/jefmonjor` y retirar el muro de badges, las estadísticas y la animación snake.

### Repositorio del portfolio

- Descripción: `Trilingual portfolio and CV with a bounded AI assistant, technical PDF generation and a type-safe Next.js stack.`
- Homepage: `https://www.jefmonjor.dev`
- Topics: `portfolio`, `nextjs`, `typescript`, `trpc`, `next-intl`, `openai`, `ai-assistant`, `pdf-generation`.
- La licencia debe aparecer como MIT después de publicar este cambio.
- Integrar o cerrar el PR que corrige `Trasolido` por `Transolido` antes de sustituir el README de perfil.

### Separación de la red de forks

1. Publicar o respaldar primero todas las ramas necesarias y crear una copia espejo local.
2. Confirmar que no hay issues, pull requests, stars o discusiones que deban conservarse.
3. En GitHub: `Settings → General → Danger Zone → Leave fork network`.
4. Verificar que `jefmonjor/portfolio` ya no indica `fork`, conserva `main`, Actions y la URL pública.

La separación es irreversible y puede eliminar metadatos asociados a la red de forks; no ejecutarla desde una automatización sin sesión autenticada y copia comprobada.

## LinkedIn

El texto completo listo para pegar —titular, «Acerca de», cada empleo, proyectos,
aptitudes, formación e idiomas— está en [`LINKEDIN.md`](LINKEDIN.md).

Al aplicarlo: mantener el cargo y las fechas laborales existentes sin
sustituirlos por «AI Engineer», dejar la sección **Servicios** desactivada (no
hay oferta freelance) y añadir portfolio, GitHub, Transolido y Corte1D en
`Destacados`.

## Nothiring: aparecer en su radar

Nothiring no publica ofertas: sus **agentes autónomos** reciben una job
description y buscan perfiles en LinkedIn, GitHub, la web abierta, sus bases de
datos, su red y comunidades técnicas, para entregar entre uno y tres candidatos
por vacante. Eso deja tres vías, y solo una la cubre este repositorio.

### 1. Alta directa en su base de datos — lo más rápido, y solo puede hacerlo Jefferson

- Entrar en [Nothiring Community](https://nothiring.me/es/community) y completar el perfil en [app.nothiring.me](https://app.nothiring.me).
- Activar el **opt-in de recruiting**: viene desactivado por defecto, así que sin ese paso no llega ninguna oferta.
- Usar la misma URL, ubicación, titular y disponibilidad que en GitHub y LinkedIn: los agentes correlacionan fuentes y las contradicciones restan.

### 2. LinkedIn y GitHub — las dos fuentes que más pesan

- Aplicar [`LINKEDIN.md`](LINKEDIN.md) entero, con la URL `jefmonjor.dev` en el campo de sitio web.
- Copiar [`GITHUB_PROFILE_README.md`](GITHUB_PROFILE_README.md) al perfil y rellenar bio, empresa, ubicación y web.
- Ambos enlaces son además los dos backlinks de más autoridad hacia el portfolio, así que trabajan en la vía 3.

### 3. La web abierta — lo que sí cubre el repositorio

Ya publicado: metadata localizada, canonical y `hreflang`, sitemap, JSON-LD de
perfil con `hasOccupation`, `/llms.txt` con los datos que pregunta un agente de
sourcing (cargo actual, posicionamiento objetivo, años, ubicación,
disponibilidad, idiomas) y `/cv.md`, el CV completo en texto plano — un agente
lo lee sin descargar un PDF.

Falta lo que no puede hacer el código, y es la diferencia entre estar publicado
y estar indexado:

- Dar de alta el dominio en Google Search Console y Bing Webmaster Tools, enviar el sitemap y solicitar indexación de `/en`, `/es` y `/ca`.
- Conseguir los primeros backlinks: perfil de GitHub, campo web de LinkedIn, y los repos públicos con `homepage` apuntando al portfolio.
- Comprobar cada pocas semanas que el nombre y `jefmonjor.dev` devuelven el portfolio en Google y Bing. Mientras no aparezca ahí, ningún agente que busque en la web abierta lo va a encontrar.

## Perfiles antiguos

- Desactivar el perfil antiguo de Freelancer si ya no se utiliza, para evitar que el precio y la descripción histórica contradigan el perfil actual.

## Después del despliegue

- Comprobar `https://www.jefmonjor.dev/llms.txt`, `/robots.txt` y `/sitemap.xml`.
- Solicitar indexación de `/en`, `/es` y `/ca` y reenviar el sitemap en Google Search Console.
- Importar o verificar el dominio en Bing Webmaster Tools, enviar el sitemap y revisar AI Performance.
- Validar el JSON-LD de la página española con Rich Results Test y confirmar que solo aparecen proyectos públicos.

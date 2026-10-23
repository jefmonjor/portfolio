# Despliegue

**Producción corre en Vercel** (`www.jefmonjor.dev`, ver la zona DNS más
abajo): Vercel construye y publica `main` por su cuenta. Este documento
describe además la vía alternativa, autoalojada, que hoy solo está a medias:
el workflow publica la imagen, pero el paso de SSH se salta porque el secreto
`SSH_HOST` no existe en el repositorio.

## Límites y presupuesto de IA según dónde se despliegue

Los contadores de límites (por IP, techo diario de peticiones, presupuesto
diario de tokens) se guardan en **Upstash Redis** si existen
`UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (ambas opcionales), y si
no en la memoria del proceso:

- **Vercel sin Upstash** (la configuración por defecto): cada instancia
  serverless lleva sus propios contadores y los pierde en cada arranque en
  frío. Con N instancias, cada límite vale hasta N veces. No hay presupuesto
  global efectivo: la barrera real es el tope de gasto del panel de OpenAI.
- **Vercel con Upstash**: límites y presupuesto globales. Crea una base
  Redis en Upstash (o desde Vercel → Storage → Upstash), copia la *REST URL*
  y el *REST token* a las variables de entorno del proyecto en Vercel y
  vuelve a desplegar. Si Redis deja de responder, las rutas de IA responden
  429 (fallan cerradas); `/cv.pdf` sigue sirviendo.
- **Docker en un servidor**: un solo proceso, así que los contadores ya son
  globales; se reinician con el contenedor salvo que se configure Upstash.

## Servidor propio (netcup)

Cada push a `main` dispara `.github/workflows/deploy.yml`:

1. **Build**: construye la imagen Docker (multi-stage, Next.js standalone) y la
   publica en `ghcr.io/jefmonjor/portfolio` con las etiquetas `latest` y el SHA
   del commit.
2. **Deploy**: entra por SSH al servidor, hace `docker pull` y reinicia el
   contenedor `portfolio` escuchando en `127.0.0.1:3000`.

## Secrets necesarios (Settings → Secrets and variables → Actions)

| Secret | Valor |
| --- | --- |
| `SSH_HOST` | IP o hostname del servidor netcup |
| `SSH_USER` | Usuario SSH (p. ej. `root` o un usuario con acceso a Docker) |
| `SSH_KEY` | Clave privada SSH (formato OpenPGP/PEM completo, sin passphrase) |
| `SSH_PORT` | (Opcional) Puerto SSH si no es 22 |
| `GHCR_TOKEN` | (Opcional) PAT con scope `read:packages`, solo si la imagen es privada |

> Consejo: tras el primer despliegue, haz pública la imagen en
> github.com/jefmonjor?tab=packages → portfolio → Package settings →
> Change visibility. Así no necesitas `GHCR_TOKEN` en el servidor.

## Requisitos en el servidor

- Docker instalado (`curl -fsSL https://get.docker.com | sh`).
- La clave pública correspondiente a `SSH_KEY` en `~/.ssh/authorized_keys`.
- Un reverse proxy delante del puerto 3000 (el contenedor solo escucha en
  `127.0.0.1`). Fuera de Vercel, la app cuenta las peticiones por el
  **último** valor de `X-Forwarded-For`, el que pone el proxy; si el proxy
  no lo pone, por `X-Real-IP`. Ejemplo con **Caddy** (TLS automático con
  Let's Encrypt; sin `trusted_proxies`, Caddy descarta el `X-Forwarded-For`
  que manda el cliente y escribe la IP real):

```caddyfile
jefmonjor.dev, www.jefmonjor.dev {
    reverse_proxy 127.0.0.1:3000
}
```

Equivalente con **nginx** + certbot:

```nginx
server {
    server_name jefmonjor.dev www.jefmonjor.dev;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # $remote_addr, no $proxy_add_x_forwarded_for: este proxy es el primer
        # salto, así que lo que el cliente mande en X-Forwarded-For se descarta
        # en lugar de concatenarse delante.
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## DNS — configuración actual (Cloudflare Registrar)

El dominio `jefmonjor.dev` está registrado en **Cloudflare** y su DNS se
gestiona allí. El portfolio vive en **Vercel**; el VPS netcup sirve los
subdominios de proyectos. Zona completa:

| Nombre | Tipo | Valor | Proxy | Sirve |
| --- | --- | --- | --- | --- |
| `jefmonjor.dev` | A | `76.76.21.21` | **DNS only** (nube gris) | Redirección al portfolio canónico |
| `www` | CNAME | `cname.vercel-dns.com` | **DNS only** (nube gris) | Portfolio canónico en Vercel |
| `pronoq` | A | IP del netcup | DNS only | PRONOQ en el VPS |
| `*` (wildcard, opcional) | A | IP del netcup | DNS only | Futuros subdominios sin tocar DNS |

> **Importante**: los registros de Vercel deben ir SIN el proxy naranja de
> Cloudflare ("DNS only") para que Vercel emita su propio certificado.
> Los valores exactos los muestra Vercel en Settings → Domains al añadir
> el dominio; si difieren de la tabla, manda lo que diga Vercel.

- **.dev fuerza HTTPS** (HSTS precargado): el VPS debe servir siempre con
  TLS. Con el Caddyfile de arriba es automático. Para un certificado
  wildcard `*.jefmonjor.dev`, usa el plugin Cloudflare de Caddy con un
  API token de Cloudflare (Zone → DNS → Edit).

## Correo (@jefmonjor.dev)

- **Recibir** — Cloudflare **Email Routing** (gratis): regla
  `hola@jefmonjor.dev` → Gmail personal. Al activarlo, Cloudflare añade
  solo los MX y el SPF de recepción.
- **Enviar (apps)** — Brevo: autenticar el dominio en Brevo → añade en
  Cloudflare los TXT que indique (DKIM ×2 + `brevo-code`), y el SPF debe
  incluir a Brevo (`include:spf.brevo.com`). Recomendado añadir DMARC:
  `_dmarc` TXT `v=DMARC1; p=quarantine; rua=mailto:hola@jefmonjor.dev`.
- **Responder como hola@ desde Gmail** — Gmail → Configuración → Cuentas →
  "Enviar como" con el SMTP de Brevo (`smtp-relay.brevo.com`, puerto 587,
  login del panel SMTP de Brevo).

## Despliegue manual (sin Actions)

```bash
docker build -t portfolio .
docker run -d --name portfolio --restart unless-stopped -p 127.0.0.1:3000:3000 portfolio
```

Las variables de entorno (`OPENAI_API_KEY` y, si se quieren, las de Upstash)
se pasan con `-e` o `--env-file`; el workflow de despliegue no pasa ninguna
todavía, así que una instancia lanzada por él arranca con la IA desactivada.

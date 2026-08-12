# Despliegue en servidor propio (netcup)

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
- Un reverse proxy delante del puerto 3000. Ejemplo con **Caddy**
  (TLS automático con Let's Encrypt):

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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
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
| `jefmonjor.dev` | A | `76.76.21.21` | **DNS only** (nube gris) | Portfolio en Vercel |
| `www` | CNAME | `cname.vercel-dns.com` | **DNS only** (nube gris) | Redirección a la raíz |
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

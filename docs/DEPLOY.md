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

## DNS

En el registrador de `jefmonjor.dev`, crea un registro `A` (y `AAAA` si el
servidor tiene IPv6) apuntando a la IP del netcup, más un `CNAME` de `www`
al dominio raíz.

## Despliegue manual (sin Actions)

```bash
docker build -t portfolio .
docker run -d --name portfolio --restart unless-stopped -p 127.0.0.1:3000:3000 portfolio
```

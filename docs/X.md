# Perfil de X — texto listo para pegar

Mismo posicionamiento, mismas cifras y misma foto que LinkedIn y jefmonjor.dev
(ver `docs/LINKEDIN.md`). En X la autoridad no se declara, se enseña: hilos
cortos sobre decisiones reales y respuestas con criterio a CTOs y founders.

Reglas:

- **Ninguna cifra que no esté publicada** en el CV o en la web.
- **Andbank sin detalles internos:** se puede contar el tipo de problema y la
  decisión, nunca nombres de sistemas internos, proveedores ni cifras que no
  estén ya en el CV.
- **Inglés B1:** escribe frases cortas y revisa con IA, pero publica solo lo
  que podrías explicar tú mismo en una entrevista.

---

## Perfil

- **Nombre:** `Jefferson Montesdeoca`
- **Usuario:** `@jefmonjor` si está libre (el mismo que LinkedIn y GitHub).
- **Foto y cabecera:** las mismas que LinkedIn.
- **Ubicación:** `Andorra · Remote (CET)`
- **Web:** `https://jefmonjor.dev`

**Bio (máx. 160 caracteres)** — en inglés, para el alcance internacional:

```
Software Architect & Senior Backend Engineer. Java/Spring for banking and legacy. I build and run my own products in production. AI with tests and review.
```

Versión en español, si prefieres publicar sobre todo en español:

```
Software Architect y Senior Backend Engineer. Java/Spring en banca y legacy. Construyo y opero productos propios en producción. IA con tests y revisión.
```

---

## Post fijado

```
I'm Jefferson, a Software Architect and Senior Backend Engineer in Andorra.

At a private bank I designed the architecture of a new online banking platform (15+ components) and lead a Spring Boot 3 / Tomcat migration across 40+ VMs without freezing releases.

On the side I build and run my own products in production:
· Transolido — VERI*FACTU invoicing, Java 21
· Other Twist — offline-first writing app, Flutter + Java
· Ilnami — private-by-design food diary, Next.js + Postgres RLS
· SpecForge — open-source Go CLI that runs AI coding agents with tests and review

Available now for freelance projects, and open to the right full-time role. Remote in European hours.

Work and case studies → jefmonjor.dev
```

---

## Hilos para las primeras semanas

Cada uno sale de un caso publicado en la web. Formato: un gancho con el
problema, tres o cuatro posts con la decisión y lo descartado, y un cierre con
el enlace al caso.

1. **Monolito modular frente a microservicios (Transolido).** «For a small
   team, I picked a modular monolith over microservices. Here is why, and what
   would make me split a module out 🧵»
2. **Cumplimiento en el núcleo (VERI*FACTU).** Por qué la trazabilidad la
   garantiza el backend y no la pantalla, y por qué añadirla como exportación
   al final era la opción mala.
3. **IA que extrae datos pero nunca emite una factura.** Lo que devuelve el
   modelo pasa por la misma validación que la entrada manual.
4. **Migrar 40+ VMs a Spring Boot 3 y Tomcat 10 sin congelar entregas.** El
   orden de los pasos y qué se rompe con el cambio a Jakarta, sin detalles del
   banco.
5. **SonarQube sobre 12.000 ficheros COBOL.** Hacer visible la deuda técnica
   del legacy antes de decidir qué tocar.
6. **Offline-first en Flutter (Other Twist).** Escribir sin conexión y
   sincronizar al volver sin perder cambios.
7. **Seguridad por fila en PostgreSQL (Ilnami).** Privacidad que impone la base
   de datos, no solo la interfaz.
8. **Cómo programo con IA (SpecForge).** Especificación → código → tests →
   revisión → producción: dónde acelera la IA y dónde decido yo.

Ritmo sostenible: dos o tres posts por semana y diez respuestas con criterio
al día en cuentas de CTOs, founders y referentes de Java, Spring y arquitectura.
Una buena respuesta en el post de un founder trae más visitas al perfil que un
hilo propio.

---

## Búsquedas guardadas

En la búsqueda de X, pestaña **Latest** (lo más reciente): las primeras horas
de un post de contratación son las que cuentan. Guarda cada búsqueda.

Empleo remoto en inglés:

```
(hiring OR "we're hiring" OR "join our team") ("java" OR "spring boot" OR "backend engineer") remote -filter:replies lang:en
```

Arquitectura y liderazgo técnico en Europa:

```
("software architect" OR "staff engineer" OR "tech lead") (hiring OR "join us") (remote OR europe OR EMEA) -filter:replies
```

Empleo en español:

```
(buscamos OR contratando OR "estamos buscando") (java OR "spring boot" OR backend) (remoto OR "en remoto") -filter:replies lang:es
```

Proyectos (clientes, no empleo):

```
("looking for a freelance" OR "need a backend" OR "fractional CTO" OR "need help with our backend") -filter:replies lang:en
```

Además, una lista privada de X con los CTOs y founders de fintech, banca y
SaaS europeo a los que quieras seguir de cerca.

---

## Mensaje directo

Cuando un founder o un CTO publica una búsqueda. Nada de «I'm interested» con
el CV pegado: una prueba concreta y una pregunta corta.

**English**

```
Hi [name], saw your post about [role / problem].

I'm a Software Architect and Senior Backend Engineer. At a private bank I designed a 15+ component online banking architecture and lead a Spring Boot 3 migration across 40+ VMs without freezing releases. On the side I build and run my own products, like VERI*FACTU invoicing on Java 21.

[One specific line about their product or stack.]

Work and case studies: jefmonjor.dev · LinkedIn: linkedin.com/in/jefmonjor

If you're still looking, would a 15-minute call this week make sense?
```

**Español**

```
Hola, [nombre]. He visto tu post sobre [puesto / problema].

Soy Software Architect y Senior Backend Engineer. En un banco privado diseñé la arquitectura de una nueva banca online de más de 15 componentes y dirijo una migración a Spring Boot 3 en más de 40 VMs sin congelar las entregas. En paralelo construyo y opero productos propios, como un software de facturación VERI*FACTU en Java 21.

[Una línea concreta sobre su producto o su stack.]

Trabajo y casos: jefmonjor.dev · LinkedIn: linkedin.com/in/jefmonjor

Si seguís buscando, ¿te encaja una llamada de 15 minutos esta semana?
```

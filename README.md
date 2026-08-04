# drjasonvaldivia.com

Sitio del **Dr. Jason Alejandro Valdivia Nájar** — Cirujano General, Puerto Vallarta.

## Cómo se publica

Netlify sirve esta carpeta tal cual. Hasta el 2026-08-03 se desplegaba **arrastrando
la carpeta** (Netlify Drop), sin historial ni forma de revisar qué cambió. Desde
este repositorio, cada cambio queda registrado.

Las páginas usan `support.js`, un runtime que interpola las plantillas `{{ }}` y los
`<sc-for>`. **No lo borre**: sin él las páginas salen en blanco.

### Antes de publicar, corra el revisor de rutas

```bash
node revisar-rutas.mjs      # debe decir "sin rutas relativas rotas"
```

**Por qué existe**: al traer el sitio a este repositorio se copiaron las páginas pero
**no los archivos que cada carpeta necesita al lado**. El resultado fue que todas las
páginas menos la portada salieron en blanco en producción, sin un solo error visible —
sólo un 404 silencioso de `./support.js`. Cada carpeta de procedimiento necesita, junto
a su `index.html`:

| Archivo | Para qué |
|---|---|
| `image-slot.js` | el componente que pinta la foto del encabezado |
| `ProcedurePage.dc.html` | la plantilla de la página; **es distinta en cada carpeta** |
| `illus.png` | la ilustración clínica de esa cirugía |
| `logo.png` | el logotipo que usa la plantilla |

Una página que se ve bien en el navegador **no** prueba que las demás también. El
revisor las mira todas.

## Reglas que no se negocian

1. **Sin testimonios de pacientes.** Están prohibidos en publicidad médica en México
   aunque sean reales y aunque el paciente autorice (LGS arts. 300-310 y su
   Reglamento). Las opiniones se remiten a Google, que es plataforma de terceros.
2. **Sin promesas de resultado.** Nada de "resultados seguros", "definitivo",
   "garantizado", "sin riesgo", "el mejor".
3. **El número de aviso de publicidad va en CADA página**: `2614082002A00062`.
4. **El teléfono público es el que ALGUIEN CONTESTA.** Hoy es el del Dr.:
   **33 3971 8620**.

   ⚠ El 2026-08-03 se cambiaron los 18 enlaces al número del consultorio
   (33 1347 0335) *anticipando* el asistente automático. Fue un error y estuvo en
   producción: **ese número no lo puede leer nadie**. Un número dado de alta en la
   API de WhatsApp deja de funcionar en la app de WhatsApp —es así por diseño de
   Meta—, así que el Dr. no lo ve; y el asistente que sí lo recibiría está apagado
   y la app de Meta sin publicar. Resultado: los pacientes escribían al vacío.

   **Cuándo cambiarlo al del consultorio**: sólo cuando las tres cosas sean ciertas
   a la vez — app de Meta publicada, `ASISTENTE_ACTIVO=true`, y la bandeja
   `/asistente` del expediente atendida. Antes no. Un número de publicidad que
   nadie contesta es peor que no poner número.
5. **Cada página lleva su `<title>` y su descripción** en el HTML, no inyectados por
   JavaScript. Hasta el 2026-08-03 ninguna los tenía y el sitio era invisible en
   Google pese a estar bien diseñado.

## Estructura

- `index.html` — portada (bilingüe, con selector ES/EN)
- `citas/`, `gracias/` — flujo de contacto
- `cirugia-*/` — páginas por procedimiento en español
- `*-puerto-vallarta/`, `gallbladder-surgery/` — sus equivalentes en inglés
- `images/` · `support.js` · `robots.txt` · `sitemap.xml`

## Pendiente

- Publicar `/aviso-de-privacidad/` — el pie ya enlaza ahí y todavía da 404.

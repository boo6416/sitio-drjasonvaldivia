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

## Posicionamiento en Google (revisado el 2026-08-15)

Objetivo del Dr.: aparecer cuando alguien busca **«cirujano en vallarta»**.

**Lo que ya estaba bien y no hay que tocar.** La ficha de Google Maps —que para una
búsqueda local como ésa pesa MÁS que el sitio, porque el mapa sale antes que los
resultados azules— está reclamada, con categoría «Cirujano» y **5.0 estrellas sobre
71 reseñas**. Es el activo más fuerte del consultorio y ningún cambio de código lo
supera. `robots.txt` también: permite explícitamente a los buscadores con IA.

**Lo que se corrigió.** El `<title>` decía «Cirujano General en Puerto Vallarta»
pero el **H1 decía «Cirugía laparoscópica avanzada»** — la señal más fuerte después
del title hablaba de una técnica que casi nadie busca por su nombre. Ahora el H1 es
«Cirujano General en Puerto Vallarta», que además es lo que dice su cédula: la
especialidad es Cirugía General y la laparoscopia es descriptor comercial. La
laparoscopia bajó al párrafo, con los procedimientos concretos.

**El conteo de reseñas se escribe a mano** y se había quedado en 69 cuando ya eran
71. Vive en `index.html`, en `CONTENT.es` y `CONTENT.en`: `reviewsLabel`, `trust4`,
`testRating` y `testMore` — ocho lugares, cuatro por idioma. Revíselo cada tanto.

**El `hreflang` de la portada se quitó**: declaraba español e inglés apuntando a la
misma URL, que es una etiqueta que se contradice sola. Las páginas de procedimiento
sí lo tienen bien porque cada idioma vive en su propia dirección. La portada no
tiene versión en inglés con URL propia — el selector ES/EN pinta sobre la misma. Si
algún día existe `/en/`, se vuelven a poner cruzados.

### Lo que falta, y no se puede hacer desde el código

1. **SEARCH CONSOLE NO ESTÁ DADO DE ALTA.** Se entró con `jason.valdivian@gmail.com`
   y sale la pantalla de bienvenida: cero propiedades. El archivo de verificación
   `google75da1461c60a16fd.html` ya está en el sitio, así que dar de alta
   `https://drjasonvaldivia.com/` en `search.google.com/search-console` verifica al
   instante. **Sin esto se trabaja a ciegas**: no se sabe qué se busca para llegar
   aquí, en qué posición sale, ni si Google indexó una página. Es lo primero.
2. **Reseñas nuevas.** Es la palanca que más mueve el mapa. Pedirlas a pacientes
   reales está permitido; escribirlas o incentivarlas, no.

### La portada depende de JavaScript, las demás no

⚠ Las páginas de procedimiento son HTML estático con su texto dentro: un rastreador
las lee sin ejecutar nada. **La portada no**: su HTML trae ~160 `{{ }}` y el texto lo
pinta `support.js` en el navegador. Google ejecuta JavaScript y sí la lee —se
comprobó que renderiza—, pero lo hace en una segunda pasada, más tarde y con menos
garantía, y los rastreadores que no ejecutan JS no ven nada.

No se cambió porque la portada es bilingüe con selector en la misma URL, y volverla
estática significa partirla en `/` y `/en/`: es una reestructuración de verdad, no un
ajuste. **Si el posicionamiento se atora teniendo ya Search Console, ése es el
siguiente paso**, y el patrón a copiar ya está en el repo — mírese cualquier carpeta
`cirugia-*`.

## Pendiente

- ~~Publicar `/aviso-de-privacidad/`~~ ✅ responde 200 (verificado el 2026-08-15).

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

## ⚠ CAMBIO DE DOMICILIO — 2026-09-01

El consultorio **se mudó**. Lo que cambió y lo que NO:

| | |
|---|---|
| **Consulta** | **Healthcare by the Sea** — Centro quirúrgico ambulatorio<br>De Los Tules 168-10, Jardines de Las Gaviotas, 48328 Puerto Vallarta, Jal.<br>Coordenadas `20.6391151, -105.2208455` |
| **Cirugía** | No se redacta. Opera en varios hospitales — lo dice `/credenciales/` |
| Domicilio anterior | Hospital Multimédica Vallarta, Calle Francia 186, Consultorio 4, Col. Versalles, 48310 |

**La dirección se escribe como la escribe Google, letra por letra**: «De Los Tules
168-10, Jardines de Las Gaviotas». Ojo — la web de la propia clínica
(`seahealth.com.mx`) dice «Las Aralias» en vez de «Jardines de Las Gaviotas».
Manda la ficha de Google, que es contra la que Google compara el NAP.

⚠ **NO se redacta dónde opera.** La primera versión de esta mudanza escribió
«las cirugías se siguen realizando en Hospital Multimédica»; el Dr. lo corrigió:
**«yo opero en todos los hospitales, no es una aclaración necesaria»**. Nombrar
un solo hospital no informa, lo encoge. Multimédica se nombra UNA vez, como el
domicilio anterior, y nada más.

**El enlace corto `maps.app.goo.gl/q8n5PdiaCsoAVkMv7` no se tocó** —los 46 que
hay en el sitio— porque apunta a la FICHA del Dr., no a un domicilio: al MOVER la
ficha (que es lo que se decidió, en vez de crear una nueva) el enlace sigue al
lugar solo, y con él las 71 reseñas. ⚠ Verifíquelo después de mover la ficha: si
se creó una nueva en vez de moverla, esos 46 enlaces llevan al domicilio viejo.

### Cómo se hizo, y qué correr si vuelve a mudarse

```bash
node mudanza-domicilio.mjs            # ensayo
node mudanza-domicilio.mjs --aplicar  # 44 archivos
node aviso-mudanza.mjs --aplicar      # el banner de «cambiamos de domicilio»
node aviso-mudanza.mjs --quitar --aplicar   # para retirarlo dentro de ~1 año
```

⚠ **La lección de esta mudanza**: cambiar las 13 cadenas obvias —los
`streetAddress`, los códigos postales, los pies de página— dejó la dirección
vieja viva **dentro de la prosa** de seis páginas, escrita a mano en cinco
redacciones distintas («Col. Versalles», «colonia Versalles», «Colonia
Versalles»…), y en los textos fuente de `_pendiente/`, que habrían resucitado el
domicilio viejo el día que alguien regenerara esas páginas. Se descubrió con un
grep DESPUÉS de aplicar. **No dé el trabajo por hecho sin correr esto:**

```bash
grep -rniE "francia 186|versalles|48310|20\.6364712" --include=*.html --include=*.mjs --include=*.json .
```

`alinear-direccion.mjs` quedó **neutralizado**: alineaba el domicilio viejo y
correrlo hoy lo reinyectaría. Se conserva porque documenta el criterio de poner
el nombre del inmueble delante del número; para y avisa si alguien lo invoca.

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
5. **No se escribe dónde opera.** El Dr. está credencializado en varios
   hospitales y lo dice `/credenciales/`. Nombrar uno solo lo encoge; se
   corrigió el 2026-09-01 tras hacerlo mal.
6. **Cada página lleva su `<title>` y su descripción** en el HTML, no inyectados por
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
2. **Reseñas nuevas.** Es la palanca que más mueve el mapa: 71 contra las 297 del
   consultorio que ocupa el segundo lugar. Pedirlas a pacientes reales está
   permitido; escribirlas o incentivarlas, no. El expediente ya las pide solo
   desde el 2026-08-15 (`resenas.yml` en `ehr-valdivia`; antes el motor estaba
   encendido pero nadie lo disparaba).
3. **Estar en los directorios que HOY ocupan la primera página.** Doctoralia y
   TopDoctors salen arriba para «cirujano en vallarta». Un perfil ahí con enlace
   al sitio hace dos cosas a la vez: aparece en esa primera página por la vía del
   directorio, y le da al dominio las citas y enlaces entrantes que hoy no tiene
   —que es exactamente lo que le falta para que Google indexe las seis páginas
   que descartó—.
4. **El primer lugar del paquete del mapa se compra.** Salía «Patrocinado». Si se
   quiere presencia inmediata mientras la autoridad crece, ése es el camino, y es
   una decisión de presupuesto, no técnica.
5. **Que el horario de la ficha de Google coincida con el del sitio.** El sitio ya
   declara el horario real (lunes a jueves 14-17 y 19-20; viernes 14-20). Si la
   ficha dice otra cosa, Google lo nota y la incoherencia le resta.

### Lo que dijeron los datos reales (Search Console, 90 días)

8 clics · 239 impresiones · posición media 9,7. Poquísimo volumen. El detalle:

| Consulta | Posición | Impr. |
|---|---|---|
| cirujano general puerto vallarta | 1,0 | 10 |
| **cirujano en vallarta** | **1,0** | **1** |
| colecistectomía puerto vallarta | 10,2 | 10 |
| especialista en hernias puerto vallarta | 16,2 | 10 |
| cirujano de hernia puerto vallarta | 14,0 | 9 |
| hernia inguinal puerto vallarta | 15,2 | 9 |
| operación hernia hiatal puerto vallarta | 34,9 | 8 |
| funduplicatura puerto vallarta | 48,9 | 7 |

⚠ **La posición 1,0 en «cirujano en vallarta» NO significa que salga primero.** Es
UNA impresión en 90 días: una muestra de uno es ruido, no un ranking. Se comprobó
buscando de verdad, con la ubicación en Puerto Vallarta, y **no aparece en ninguna
parte de la primera página** — ni en el mapa ni en los resultados. La primera
página la ocupan directorios (Doctoralia, TopDoctors), hospitales, competidores y
**dominios de coincidencia exacta** (`cirujanoenvallarta.com`,
`cirujanopuertovallarta.net`), que son muy difíciles de desbancar.

El paquete del mapa —los tres lugares de arriba— lo ocupaban: un ANUNCIO PAGADO
(5.0, 23 reseñas), el Dr. Aguiar (4.9 con **297 reseñas**) y el Dr. Alvarado (5.0,
96). Con 71 reseñas él tiene la mejor calificación y el peor volumen. Y el primer
lugar del paquete **se compra**: dice «Patrocinado».

**Dónde está la oportunidad real**: en las consultas de procedimiento, que traen
intención de paciente y donde hoy está en la página 2 o peor. Ahí no compite con
directorios genéricos.

### Indexación: 13 de 29 páginas

Google conoce estas seis y **decidió no indexarlas**: `/cirugia-de-vesicula/`,
`/cirugia-antirreflujo/`, `/cirugia-de-quistes-y-lipomas/`, `/seguros/`,
`/acid-reflux-surgery-puerto-vallarta/`, `/appendectomy-puerto-vallarta/`.

Se descartaron las causas técnicas una por una: **no son huérfanas** (13 a 29
enlaces internos cada una), **no son delgadas** (13-15 KB de texto), tienen
títulos correctos con los términos médicos que la gente busca, y ya traían
`MedicalProcedure`, `FAQPage` y `BreadcrumbList`. Lo que queda es **autoridad de
dominio**: el sitio es nuevo y no tiene enlaces entrantes. Eso no se arregla
escribiendo código.

### Sobre poner la calificación de Google en la página

Sí y no, y la diferencia importa:

- **Como texto visible: ya está y está bien.** «5.0 ★ · 71 reseñas en Google» con
  enlace a la ficha. Es un dato de un tercero, atribuido a ese tercero.
- **Como `aggregateRating` en los datos estructurados: NO.** Google exige que las
  reseñas marcadas así estén recogidas y alojadas por el propio sitio; marcar las
  de Google como propias viola sus lineamientos y la sanción típica es perder
  TODOS los resultados enriquecidos del dominio. No vale la pena.

Lo que sí se hizo es unir las identidades: `sameAs` con la ficha de Maps,
Instagram y Facebook, en las 26 páginas que declaran `Physician`. Antes lo tenía
sólo la portada — o sea que en las páginas que compiten por las consultas de
procedimiento, la reputación de la ficha no respaldaba nada.


### Tres idiomas, tres URLs (2026-08-15)

| | | |
|---|---|---|
|  | español | «Cirujano General en Puerto Vallarta» |
|  | inglés | «General Surgeon in Puerto Vallarta» |
|  | francés | «Chirurgien généraliste à Puerto Vallarta» |

Antes el inglés sólo existía como SELECTOR sobre , sin dirección propia. Por eso
las búsquedas en inglés —«surgery puerto vallarta», «surgery vallarta»— no tenían
a dónde llegar: las páginas de procedimiento en inglés existían, pero sin una
portada que las reuniera. Ahora  es esa portada, y el  de los tres
se cruza bien (es · en · fr · x-default).

El francés NO promete atención en francés — lo dice explícitamente en la página.
Existe porque Puerto Vallarta recibe muchísimo visitante quebequés en invierno y
esa gente busca en su idioma antes de decidir. La consulta sigue siendo en
español o inglés, y la página lo advierte para no crear una expectativa falsa.

Las dos portadas nuevas son HTML estático puro: sin , sin plantillas.
Un rastreador las lee sin ejecutar nada.

### Las palabras del paciente, no las del médico

Un análisis de cobertura sobre las 32 páginas encontró que el sitio decía
«cálculos biliares», «hernia inguinal», «reflujo» y «hemorroides» y NUNCA
«piedras en la vesícula», «bulto en la ingle», «agruras» ni «almorranas» — que es
como lo teclea la gente. Se agregaron esas preguntas, con respuesta real, al
bloque visible Y al  de cada página. Están en
, que es idempotente.

⚠ Una respuesta que viva sólo en los datos estructurados y no en la página
visible es exactamente lo que Google sanciona. Van en los dos sitios.

### La portada depende de JavaScript, las demás no

⚠ Las páginas de procedimiento son HTML estático con su texto dentro: un rastreador
las lee sin ejecutar nada. **La portada no**: su HTML trae ~160 `{{ }}` y el texto lo
pinta `support.js` en el navegador. Google ejecuta JavaScript y sí la lee —se
comprobó que renderiza—, pero lo hace en una segunda pasada, más tarde y con menos
garantía, y los rastreadores que no ejecutan JS no ven nada.

**Resuelto el 2026-08-15 sin reestructurar nada.** La portada y `/citas/` llevan
ahora un bloque `#pre-portada` / `#pre-citas` con clase `.pre-estatico`: el H1 de
verdad, la prosa, los datos del consultorio y los enlaces a los 12 procedimientos,
todo en HTML plano. Se retira solo en cuanto el runtime monta —se comprueba que
aparezca otro `<h1>` fuera del bloque, no con un temporizador, porque un
temporizador fijo parpadea en un teléfono lento—. Si a los 8 segundos la
aplicación no montó, **el bloque se queda**: mejor una portada sobria que la
página en blanco que quedaba antes.

`/citas/` era el caso más grave: es la página de conversión y su H1 crudo era una
plantilla sin rellenar. Si `support.js` fallaba, quedaba en blanco justo cuando el
paciente ya había decidido.

⚠ **Esto NO es contenido oculto ni una página puerta.** Se sirve el mismo HTML a
todo el mundo, dice lo mismo que la versión rica y es visible mientras el runtime
no monte. Es el mismo recurso que las páginas de procedimiento ya usaban dentro
de `<dc-import>`. Contenido distinto para el buscador que para la persona sí
estaría prohibido, y la sanción es quedarse fuera de Google.

Queda pendiente, si algún día se quiere: la portada en inglés no tiene URL propia
(el selector ES/EN pinta sobre `/`). Las páginas de procedimiento sí. Partirla en
`/` y `/en/` es una reestructuración, no un ajuste.

## Pendiente

- ~~Publicar `/aviso-de-privacidad/`~~ ✅ responde 200 (verificado el 2026-08-15).

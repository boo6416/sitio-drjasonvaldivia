# drjasonvaldivia.com

Sitio del **Dr. Jason Alejandro Valdivia Nájar** — Cirujano General, Puerto Vallarta.

## Cómo se publica

Netlify sirve esta carpeta tal cual. Hasta el 2026-08-03 se desplegaba **arrastrando
la carpeta** (Netlify Drop), sin historial ni forma de revisar qué cambió. Desde
este repositorio, cada cambio queda registrado.

Las páginas usan `support.js`, un runtime que interpola las plantillas `{{ }}` y los
`<sc-for>`. **No lo borre**: sin él las páginas salen en blanco.

## Reglas que no se negocian

1. **Sin testimonios de pacientes.** Están prohibidos en publicidad médica en México
   aunque sean reales y aunque el paciente autorice (LGS arts. 300-310 y su
   Reglamento). Las opiniones se remiten a Google, que es plataforma de terceros.
2. **Sin promesas de resultado.** Nada de "resultados seguros", "definitivo",
   "garantizado", "sin riesgo", "el mejor".
3. **El número de aviso de publicidad va en CADA página**: `2614082002A00062`.
4. **El teléfono público es el del CONSULTORIO**: 33 1347 0335. Es el que tiene el
   asistente automático; con el personal, el asistente no atiende a nadie.
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

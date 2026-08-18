// Quita `index.html` del final de todo enlace interno — 2026-08-17
//
// POR QUÉ. Search Console avisó el 17/8 de un motivo nuevo de no indexación:
// «Página alternativa con etiqueta canónica adecuada», 3 páginas. Se revisaron
// en el informe y las tres son la MISMA página servida dos veces:
//
//     https://drjasonvaldivia.com/cirugia-de-hernia-umbilical/index.html
//     https://drjasonvaldivia.com/umbilical-hernia-surgery-puerto-vallarta/index.html
//     https://drjasonvaldivia.com/wound-vac-therapy-puerto-vallarta/index.html
//
// Se comprobó contra producción: `/x/` y `/x/index.html` responden AMBAS 200.
// Netlify no aplica la redirección de «URL bonita» en este sitio, así que cada
// una de las 42 páginas existe en internet con dos direcciones distintas.
//
// El aviso en sí es benigno: la canónica está bien puesta y Google la respeta
// —por eso dice «adecuada»— así que no se ha perdido nada del índice. Lo que no
// es benigno es de dónde salen esas URLs: **las enlaza el propio sitio**.
//
//   · `altLangHref: '../hernia-surgery-puerto-vallarta/index.html'` — el selector
//     de idioma de cada página de padecimiento. 22 archivos.
//   · `href:'cirugia-de-vesicula/index.html'` — las 12 tarjetas de servicio de la
//     portada, seis en español y seis en inglés.
//
// LO QUE CUESTA. En el mismo informe hay 6 páginas «Descubierta: actualmente sin
// indexar» — Google las conoce y NO ha ido a rastrearlas. Entre ellas
// `/cirugia-de-vesicula/`, que es de las que más importan. Un sitio nuevo tiene
// un presupuesto de rastreo pequeño, y aquí se está gastando en visitar dos
// veces la misma página. Además el enlace interno reparte autoridad hacia una
// URL que después se descarta por canónica: se tira por el desagüe.
//
// QUÉ HACE. Reescribe `.../index.html` → `.../` en los `href` y `altLangHref`
// de los HTML. No toca las canónicas (ya eran correctas), ni el sitemap (ya
// lista las URLs limpias), ni los comentarios del README.
//
// ⚠ Sólo enlaces internos relativos. Un `href` que apunte a otro dominio se
// deja como está — no es asunto nuestro cómo sirva sus URLs.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.cwd();
const OMITIR = new Set(['.git', 'images', '_pendiente', 'node_modules']);

function htmls(dir) {
  const salida = [];
  for (const nombre of readdirSync(dir)) {
    if (OMITIR.has(nombre)) continue;
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...htmls(ruta));
    else if (nombre.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

// Comilla + ruta que NO empieza por http/mailto/tel + `index.html` + misma comilla.
// El grupo 1 se queda tal cual y sólo desaparece el `index.html` final.
const ENLACE = /(["'])((?!https?:|mailto:|tel:|#)[^"'\s]*?\/)index\.html\1/g;

let archivosTocados = 0;
let enlacesTocados = 0;
const detalle = [];

for (const ruta of htmls(RAIZ)) {
  const antes = readFileSync(ruta, 'utf8');
  let n = 0;
  const despues = antes.replace(ENLACE, (_m, comilla, camino) => {
    n++;
    return `${comilla}${camino}${comilla}`;
  });
  if (n === 0) continue;
  writeFileSync(ruta, despues);
  archivosTocados++;
  enlacesTocados += n;
  detalle.push(`  ${ruta.slice(RAIZ.length + 1).replace(/\\/g, '/')} — ${n}`);
}

console.log(detalle.join('\n'));
console.log(`\n${enlacesTocados} enlaces limpiados en ${archivosTocados} archivos.`);

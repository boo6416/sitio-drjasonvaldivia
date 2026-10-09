/* Crea una página de procedimiento nueva a partir de otra del mismo idioma.
 *
 * ⚠ LA TRAMPA QUE ESTO EVITA: una carpeta de procedimiento no es sólo su
 * index.html. Necesita al lado `ProcedurePage.dc.html`, `image-slot.js`,
 * `illus.png` y `logo.png`, y el `ProcedurePage.dc.html` NO es el mismo en
 * todas las carpetas. El 2026-08-05 se copiaron páginas sin sus vecinos y
 * TODAS salieron en blanco en producción, sin un solo error visible.
 *
 *   node nueva-pagina.mjs <carpeta-modelo> <carpeta-nueva> <titulo> <descripcion> <ruta-del-otro-idioma>
 *
 * Después hay que correr `regenerar-pagina.mjs` con el contenido, y añadirla
 * al sitemap.
 */
import fs from "node:fs";
import path from "node:path";

const [modelo, nueva, titulo, descripcion, otroIdioma] = process.argv.slice(2);
if (!modelo || !nueva || !titulo || !descripcion || !otroIdioma) {
  console.error("faltan argumentos");
  process.exit(1);
}
if (fs.existsSync(nueva)) { console.error(nueva + " ya existe"); process.exit(1); }

fs.mkdirSync(nueva);
for (const f of ["ProcedurePage.dc.html", "image-slot.js", "illus.png", "logo.png"]) {
  const origen = path.join(modelo, f);
  if (!fs.existsSync(origen)) { console.error("el modelo no tiene " + f); process.exit(1); }
  fs.copyFileSync(origen, path.join(nueva, f));
}

const base = "https://drjasonvaldivia.com/";
let html = fs.readFileSync(path.join(modelo, "index.html"), "utf8");
const urlModelo = base + modelo + "/";
const urlNueva = base + nueva + "/";
const urlOtro = base + otroIdioma + "/";

// El título y la descripción viejos, para cambiarlos en todas sus copias (title, og, twitter).
const tituloViejo = html.slice(html.indexOf("<title>") + 7, html.indexOf("</title>"));
const i = html.indexOf('<meta name="description" content="') + '<meta name="description" content="'.length;
const descViejo = html.slice(i, html.indexOf('"', i));

html = html.split(tituloViejo).join(titulo);
html = html.split(descViejo).join(descripcion);
// Todas las URL del modelo pasan a ser las de la página nueva.
html = html.split(urlModelo).join(urlNueva);
// El par de idiomas: la pareja del modelo deja de serlo.
const parViejo = html.match(/hreflang="(en|es)" href="(https:\/\/drjasonvaldivia\.com\/[^"]+)"/g) || [];
for (const p of parViejo) {
  const url = p.slice(p.indexOf('href="') + 6, -1);
  if (url !== urlNueva) html = html.split(url).join(urlOtro);
}

fs.writeFileSync(path.join(nueva, "index.html"), html, "utf8");
console.log(nueva + "/: creada desde " + modelo + " (index.html + 4 archivos vecinos)");
console.log("  título: " + titulo);
console.log("  pareja de idioma: " + urlOtro);
console.log("  falta: regenerar-pagina.mjs con el contenido, y el sitemap");

/* Pone en el sitemap la fecha REAL de cada página, no la del despliegue.
 *
 *  Antes las 42 URL declaraban todas el mismo `lastmod`: el día del build. Para
 *  Google eso significa «todo cambió hoy», que es evidentemente falso, y la
 *  respuesta documentada es dejar de usar el dato para priorizar el rastreo —
 *  justo la señal que decide si una URL «descubierta» pasa a rastreada.
 *
 *  La fecha sale del último commit que tocó ese archivo. Si el archivo no está
 *  en git todavía, cae a la fecha de modificación del disco.
 *
 *  Córralo antes de publicar cuando haya cambiado páginas.
 */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { execSync } from "node:child_process";

let s = readFileSync("sitemap.xml", "utf8");
const rutas = [...s.matchAll(/<loc>https:\/\/drjasonvaldivia\.com\/([^<]*)<\/loc>/g)].map((m) => m[1]);

let cambiados = 0, sinArchivo = 0;
for (const ruta of rutas) {
  const archivo = ruta === "" ? "index.html" : ruta.replace(/\/$/, "") + "/index.html";
  let fecha = "";
  try {
    fecha = execSync(`git log -1 --format=%cs -- "${archivo}"`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch { /* sin git o sin historial */ }
  if (!fecha) {
    try { fecha = statSync(archivo).mtime.toISOString().slice(0, 10); }
    catch { sinArchivo++; continue; }
  }
  const url = `https://drjasonvaldivia.com/${ruta}`;
  const i = s.indexOf(`<loc>${url}</loc>`);
  if (i < 0) continue;
  const antes = s;
  s = s.slice(0, i) + s.slice(i).replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${fecha}</lastmod>`);
  if (s !== antes) cambiados++;
}
writeFileSync("sitemap.xml", s);

const fechas = [...new Set([...s.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]))].sort();
console.log(`  URLs con fecha real: ${cambiados}`);
if (sinArchivo) console.log(`  ⚠ ${sinArchivo} URL sin archivo en disco`);
console.log(`  fechas distintas: ${fechas.length}  (${fechas[0]} → ${fechas[fechas.length - 1]})`);

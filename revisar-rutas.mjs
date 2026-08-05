/** Revisa que TODA ruta relativa de cada página exista en disco.
 *  Nació de un 404 silencioso: cada página interior pedía "./support.js" y el
 *  archivo sólo estaba en la raíz, así que el sitio interior salía en blanco. */
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const dirs = readdirSync(".").filter(
  (f) => statSync(f).isDirectory() && f !== ".git" && f !== "images",
);
const paginas = ["index.html", ...dirs.map((d) => `${d}/index.html`)].filter(existsSync);

const malas = [];
const plantilla = new Set();
for (const f of paginas) {
  const base = dirname(f);
  const html = readFileSync(f, "utf8");
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/g;
  const vistos = new Set();
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|#|\/|data:)/.test(u)) continue;

    /* Los `{{ … }}` los rellena el runtime del sitio en el navegador: en el
     * archivo son marcadores, no rutas. Se contaban como rotas y el auditor
     * cerraba SIEMPRE con "rotas: 3".
     *
     * Eso es peor que no tener auditor. Un número que nunca baja a cero enseña
     * a ignorarlo, y el día que se rompa una ruta de verdad va a salir como
     * "rotas: 4" — indistinguible del ruido de todos los días. La misma lección
     * del lote que se cortaba en silencio: un resultado que parece dato y es
     * accidente es peor que un error, porque nadie lo investiga. */
    if (u.includes("{{")) { plantilla.add(`${f}  ->  ${u}`); continue; }

    if (vistos.has(u)) continue;
    vistos.add(u);
    const real = join(base, u.replace(/^\.\//, ""));
    if (!existsSync(real)) malas.push(`${f}  ->  ${u}`);
  }
}
console.log(malas.length ? malas.join("\n") : "sin rutas relativas rotas");
if (plantilla.size) {
  // Se listan, no se esconden: si un marcador dejara de rellenarse, la pista
  // está aquí. Pero no cuentan como rotas.
  console.log(`(${plantilla.size} marcadores que rellena el navegador, no son rutas)`);
}
console.log("--- paginas revisadas:", paginas.length, "· rotas:", malas.length);
process.exit(malas.length ? 1 : 0);

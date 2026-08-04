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
for (const f of paginas) {
  const base = dirname(f);
  const html = readFileSync(f, "utf8");
  const re = /(?:src|href)\s*=\s*["']([^"']+)["']/g;
  const vistos = new Set();
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|#|\/|data:)/.test(u)) continue;
    if (vistos.has(u)) continue;
    vistos.add(u);
    const real = join(base, u.replace(/^\.\//, ""));
    if (!existsSync(real)) malas.push(`${f}  ->  ${u}`);
  }
}
console.log(malas.length ? malas.join("\n") : "sin rutas relativas rotas");
console.log("--- paginas revisadas:", paginas.length, "· rotas:", malas.length);

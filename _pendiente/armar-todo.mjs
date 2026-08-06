/* Arma las DOCE páginas —seis en español y sus seis en inglés— y las enlaza.
 *
 * Se arman JUNTAS a propósito. El `hreflang` tiene que ir en los dos sentidos:
 * si sólo una apunta a la otra, Google no acepta el par y las trata como
 * páginas rivales por la misma consulta — elige una y entierra la otra. Armar
 * las españolas hoy y las inglesas mañana es exactamente cómo se olvida la
 * mitad del enlace.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { armar } from "./armar-paginas.mjs";

const SITIO = "C:/Users/boo_v/Documents/sitio-drjasonvaldivia-live";
const es = JSON.parse(readFileSync("paginas.json", "utf8"));
const en = JSON.parse(readFileSync("paginas-en.json", "utf8"));

// es-slug → en-slug, que es lo que hace de pareja a las dos.
const pareja = Object.fromEntries(en.map((x) => [x.es, x.slug]));

for (const p of es) {
  armar({
    slug: p.slug, metaTitle: p.pagina.metaTitle, metaDescription: p.pagina.metaDescription,
    d: p.pagina.d, idioma: "es", par: pareja[p.slug],
  });
  console.log("  es ", p.slug, "↔", pareja[p.slug]);
}
for (const p of en) {
  armar({
    slug: p.slug, metaTitle: p.metaTitle, metaDescription: p.metaDescription,
    d: p.d, idioma: "en", par: p.es,
  });
  console.log("  en ", p.slug);
}

/* ── Que no nazcan huérfanas ────────────────────────────────────────────────
 * Una página que no está enlazada ni en el sitemap existe en el disco y en
 * ningún otro lado. En este sitio ya hubo doce así. */
const NUEVAS = [
  ...es.map((p) => [p.slug, p.pagina.d.breadcrumbLabel]),
  ...en.map((p) => [p.slug, p.d.breadcrumbLabel]),
];

let sm = readFileSync(`${SITIO}/sitemap.xml`, "utf8");
const faltan = NUEVAS.filter(([s]) => !sm.includes(`/${s}/`))
  .map(([s]) => `  <url><loc>https://drjasonvaldivia.com/${s}/</loc></url>`).join("\n");
if (faltan) sm = sm.replace("</urlset>", faltan + "\n</urlset>");
writeFileSync(`${SITIO}/sitemap.xml`, sm, "utf8");

/* El pie: sólo las españolas. Un pie con doce entradas —seis repetidas en otro
   idioma— es un pie que ya no se lee. Las inglesas se alcanzan desde el botón
   de idioma de su pareja, que es donde alguien que lee en inglés va a mirar. */
const estilo = 'style="color:rgba(255,255,255,0.68);text-decoration:none;font-size:.87rem;"';
const items = es.map((p) => `<li><a href="/${p.slug}/" ${estilo}>${p.pagina.d.breadcrumbLabel}</a></li>`).join("");
const ancla = '<li><a href="/cirugia-de-quistes-y-lipomas/"';

function htmls(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    if ([".git", "node_modules", "images", "_pendiente"].includes(e)) continue;
    const p = `${dir}/${e}`;
    if (statSync(p).isDirectory()) htmls(p, acc);
    else if (e.endsWith(".html")) acc.push(p);
  }
  return acc;
}

let pies = 0;
for (const f of htmls(SITIO)) {
  let s = readFileSync(f, "utf8");
  if (s.includes("/cirugia-de-hemorroides/")) continue;   // ya lo tiene
  const i = s.indexOf(ancla);
  if (i < 0) continue;
  const fin = s.indexOf("</li>", i) + 5;
  writeFileSync(f, s.slice(0, fin) + items + s.slice(fin), "utf8");
  pies++;
}

console.log(`\nsitemap: ${(sm.match(/<url>/g) ?? []).length} urls · pies completados: ${pies}`);

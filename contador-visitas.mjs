/* Contador de visitas — Cloudflare Web Analytics (2026-11-08, autorizado por el Dr.).
 *
 * Por qué éste: es gratis, NO usa cookies ni guarda datos personales de quien
 * visita (en un sitio médico eso importa, y no exige aviso de cookies). Dice
 * cuántas visitas, de qué país, desde dónde llegaron (Google, Facebook,
 * Instagram, Doctoralia…) y qué páginas leyeron. NO dice la ciudad.
 *
 * Se pega antes de </body> en todas las páginas. Es idempotente: si la página
 * ya lo tiene, no lo vuelve a poner. Uso:  node contador-visitas.mjs
 *
 * El token es PÚBLICO (queda escrito en el HTML de cualquier sitio que lo use);
 * no es una credencial. El panel está en la cuenta de Cloudflare boo6416@gmail.com
 * → Analytics → Web analytics → drjasonvaldivia.com. */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TOKEN = "47224f9db6ad4e2fa528f2a79a824144";
const SNIPPET = `<!-- Cloudflare Web Analytics --><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${TOKEN}"}'></script><!-- End Cloudflare Web Analytics -->`;
const FUERA = new Set(["node_modules", "_pendiente", ".git"]);

function paginas(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    if (FUERA.has(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...paginas(p));
    // ⚠ Los `*.dc.html` NO son páginas: son plantillas que el runtime carga
    // DENTRO de una página. Ahí el contador sobra y contaría doble.
    else if (n.endsWith(".html") && !n.endsWith(".dc.html") && !n.startsWith("google")) out.push(p);
  }
  return out;
}

let puestas = 0, ya = 0, sinBody = 0;
for (const f of paginas(".")) {
  const html = readFileSync(f, "utf8");
  if (html.includes("cloudflareinsights")) { ya++; continue; }
  const i = html.lastIndexOf("</body>");
  if (i < 0) { sinBody++; console.log("sin </body>:", f); continue; }
  writeFileSync(f, html.slice(0, i) + SNIPPET + "\n" + html.slice(i));
  puestas++;
}
console.log(`contador puesto en ${puestas} páginas · ya lo tenían ${ya} · sin </body> ${sinBody}`);

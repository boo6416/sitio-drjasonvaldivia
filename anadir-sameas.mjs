/* Añade `sameAs` al esquema `Physician` de TODAS las páginas (2026-08-15).
 *
 *  `sameAs` es lo que le dice a Google que el «Dr. Jason Valdivia» de este sitio,
 *  el de la ficha de Maps, el de Instagram y el de Facebook son la MISMA persona.
 *  Sin eso son cuatro entidades sueltas, y la reputación de la ficha —5.0 con 71
 *  reseñas, el activo más fuerte del consultorio— no respalda al sitio.
 *
 *  Lo tenía sólo la portada. Las otras 28 páginas declaraban `Physician` sin un
 *  solo enlace de identidad, que es justo donde más falta hace: son las que
 *  compiten por «cirugía de hernia en Puerto Vallarta» y compañía.
 *
 *  Se ancla en `hasMap`, que aparece UNA vez y sólo dentro del bloque Physician.
 *  `areaServed` no sirve de ancla: también está en MedicalProcedure.
 *
 *  Idempotente: si la página ya tiene `sameAs`, no la toca.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PERFILES = [
  "https://www.instagram.com/drjasonvaldivia/",
  "https://www.facebook.com/profile.php?id=177835868736674",
  "https://maps.app.goo.gl/q8n5PdiaCsoAVkMv7",
];
const ANCLA = '"hasMap":"https://maps.app.goo.gl/q8n5PdiaCsoAVkMv7",';
const SAMEAS = `"sameAs":${JSON.stringify(PERFILES)},`;

function paginas(dir = ".", acc = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules" || n === "_pendiente") continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) paginas(p, acc);
    else if (n === "index.html") acc.push(p);
  }
  return acc;
}

let tocadas = 0, yaTenian = 0, sinAncla = 0;
for (const p of paginas()) {
  let html = readFileSync(p, "utf8");
  if (html.includes('"sameAs"')) {
    // La portada ya lo tenía, pero sin la ficha de Maps: se completa.
    if (!html.includes(`"sameAs":["https://www.instagram`) || html.includes("maps.app.goo.gl/q8n5PdiaCsoAVkMv7\"]")) { yaTenian++; continue; }
    const viejo = /"sameAs":\[[^\]]*\]/;
    if (viejo.test(html) && !html.match(viejo)[0].includes("maps.app.goo.gl")) {
      html = html.replace(viejo, `"sameAs":${JSON.stringify(PERFILES)}`);
      writeFileSync(p, html);
      console.log(`  completado  ${p}`);
      tocadas++;
      continue;
    }
    yaTenian++;
    continue;
  }
  if (!html.includes(ANCLA)) { sinAncla++; console.log(`  sin ancla   ${p}`); continue; }
  html = html.split(ANCLA).join(ANCLA + SAMEAS);
  writeFileSync(p, html);
  console.log(`  añadido     ${p}`);
  tocadas++;
}
console.log(`\n${tocadas} página(s) modificada(s) · ${yaTenian} ya lo tenían · ${sinAncla} sin bloque Physician`);

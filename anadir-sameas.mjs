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
  "https://maps.app.goo.gl/MnbK3xqooJie5NaSA",
];
const ANCLA = '"hasMap":"https://maps.app.goo.gl/MnbK3xqooJie5NaSA",';
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
    /* ⚠ ESTA CONDICION QUEDO MUERTA, y se arregla por claridad (2026-10-02).
     *
     * Buscaba el enlace RETIRADO (`q8n5PdiaCsoAVkMv7`), que ya no existe en
     * ningun archivo del sitio, asi que no podia cumplirse nunca. El guion
     * seguia funcionando bien —la comprobacion de abajo ve que el `sameAs` ya
     * trae un mapa y se salta la pagina igual—, pero el codigo decia algo
     * imposible. El reemplazo masivo de la URL no la alcanzo porque aqui la
     * cadena va SIN `https://`.
     *
     * ⛔ Y OJO CON LO QUE SUPONE: que el mapa sea el ULTIMO elemento del sameAs
     * (por el `"]`). Hoy no siempre lo es —hay paginas que terminan en
     * Doctoralia—, asi que esta comprobacion no detecta todo lo que cree. Se
     * deja igual a proposito: el guion es idempotente y no corrompe nada, pero
     * quien lo vuelva a correr tiene que revisar esto primero. */
    if (!html.includes(`"sameAs":["https://www.instagram`) || html.includes("maps.app.goo.gl/MnbK3xqooJie5NaSA\"]")) { yaTenian++; continue; }
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

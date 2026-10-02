/** EL AVISO DE CAMBIO DE DOMICILIO — 2026-09-01.
 *
 *  Lo pidio el Dr. con estas palabras: «quiero que la gente ya sepa de mi
 *  cambio de domicilio para evitar confusion y duplicidad».
 *
 *  Son DOS cosas distintas y por eso el aviso dice las dos:
 *
 *   · CONFUSION — el paciente que ya fue a Versalles vuelve ahi. El aviso tiene
 *     que decir que la consulta se MUDO, no solo cual es la direccion nueva:
 *     una direccion nueva sin la palabra «mudo» se lee como un segundo
 *     consultorio.
 *   · DUPLICIDAD — el paciente que lo vio en Multimedica tiene que entender
 *     que es el mismo medico, no otro. Por eso el aviso nombra el domicilio
 *     anterior en vez de callarlo.
 *
 *  ⚠ EL AVISO NO DICE DONDE OPERA. La primera version cerraba con "las cirugias
 *  se siguen realizando en Hospital Multimedica"; el Dr. lo corrigio porque
 *  opera en todos los hospitales y nombrar uno solo lo encoge.
 *
 *  ⚠ VA EN HTML PLANO, JUSTO DESPUES DE <body>, y no dentro de la plantilla de
 *  `support.js`. Es a proposito: la portada pinta su texto con JavaScript, y un
 *  aviso de mudanza que solo aparece si el runtime monta es justo el que no
 *  aparece en el telefono lento del paciente que va llegando tarde. Es la misma
 *  razon por la que existe el bloque `.pre-estatico`.
 *
 *  Va en las CUATRO portadas de entrada (es, en, fr y /citas/) y una linea mas
 *  sobria en el bloque «Consultorio» que comparten 14 paginas. En las paginas
 *  de procedimiento no se repite el banner: quien entra por «cirugia de
 *  vesicula» va a leer el procedimiento, y el pie ya le dice donde es.
 *
 *  CUANDO QUITARLO: cuando deje de hacer falta, mas o menos un ano despues de
 *  la mudanza, o cuando el Dr. lo diga. Corra `node aviso-mudanza.mjs --quitar`.
 *
 *  Idempotente: correrlo dos veces no duplica el aviso.
 *
 *      node aviso-mudanza.mjs            # ensayo
 *      node aviso-mudanza.mjs --aplicar  # escribe
 *      node aviso-mudanza.mjs --quitar   # lo retira de todas partes
 */
import { readFileSync, writeFileSync } from "node:fs";

const APLICAR = process.argv.includes("--aplicar");
const QUITAR = process.argv.includes("--quitar");

const MARCA = "aviso-mudanza-2026";
const MAPA = "https://maps.app.goo.gl/MnbK3xqooJie5NaSA";

/* Un solo dibujo para los tres idiomas. Colores del sitio: fondo crema sobre el
 * azul de la marca, sin rojo — esto es un dato util, no una alarma. */
const banner = ({ titulo, cuerpo, enlace }) => `
<div id="${MARCA}" style="background:#fdf0ea;border-bottom:3px solid #0d2b3e;font-family:'DM Sans',system-ui,sans-serif;padding:0.85rem 6%;">
  <p style="max-width:1120px;margin:0 auto;font-size:0.92rem;line-height:1.6;color:#0d2b3e;">
    <strong>📍 ${titulo}</strong> ${cuerpo}
    <a href="${MAPA}" target="_blank" rel="noopener" style="color:#0d2b3e;text-decoration:underline;white-space:nowrap;">${enlace} ↗</a>
  </p>
</div>`;

const ES = banner({
  titulo: "El consultorio cambió de domicilio.",
  cuerpo: "Desde septiembre de 2026 la <b>consulta</b> es en <b>Healthcare by the Sea</b>, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta — ya no en Hospital Multimédica.",
  enlace: "Cómo llegar",
});
const EN = banner({
  titulo: "The office has moved.",
  cuerpo: "As of September 2026, <b>consultations</b> are at <b>Healthcare by the Sea</b>, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta — no longer at Hospital Multimédica.",
  enlace: "Directions",
});
const FR = banner({
  titulo: "Le cabinet a changé d'adresse.",
  cuerpo: "Depuis septembre 2026, les <b>consultations</b> ont lieu à <b>Healthcare by the Sea</b>, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta — et non plus à l'Hospital Multimédica.",
  enlace: "Itinéraire",
});

const PORTADAS = [
  ["index.html", ES],
  ["citas/index.html", ES],
  ["en/index.html", EN],
  ["fr/index.html", FR],
];

/* La linea del bloque «Consultorio», que comparten 14 paginas. El idioma se
 * deduce de la linea del HORARIO que va justo debajo, porque la linea de la
 * direccion es identica en los tres idiomas y por si sola no distingue. */
const DIR = "Healthcare by the Sea · De Los Tules 168-10, Jardines de Las Gaviotas, 48328 Puerto Vallarta, Jalisco.<br>";
const NOTA = {
  "Lunes a jueves": ' <span class="nota-mudanza"><i>Domicilio nuevo desde septiembre de 2026 — antes en Hospital Multimédica.</i></span><br>',
  "Monday to Thursday": ' <span class="nota-mudanza"><i>New address as of September 2026 — previously at Hospital Multimédica.</i></span><br>',
  "Atención en español": ' <span class="nota-mudanza"><i>Domicilio nuevo desde septiembre de 2026 — antes en Hospital Multimédica.</i></span><br>',
  "Lunes a viernes": ' <span class="nota-mudanza"><i>Domicilio nuevo desde septiembre de 2026 — antes en Hospital Multimédica.</i></span><br>',
  "Lundi au jeudi": ' <span class="nota-mudanza"><i>Nouvelle adresse depuis septembre 2026 — auparavant à l\'Hospital Multimédica, où le Dr opère toujours.</i></span><br>',
};

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
function* html(dir) {
  for (const e of readdirSync(dir)) {
    if ([".git", "node_modules", "_pendiente", "images"].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* html(p);
    else if (e.endsWith(".html")) yield p;
  }
}

let banners = 0, notas = 0, quitados = 0;

if (QUITAR) {
  for (const p of html(".")) {
    const antes = readFileSync(p, "utf8");
    let d = antes;
    // El banner completo, desde su div marcado hasta el cierre.
    d = d.replace(new RegExp(`\\n?<div id="${MARCA}"[\\s\\S]*?\\n</div>`, "g"), "");
    d = d.replace(/ <span class="nota-mudanza">[\s\S]*?<\/span><br>/g, "");
    if (d === antes) continue;
    quitados++;
    console.log("   quitado de", p.replace(/^\.[\\/]/, ""));
    if (APLICAR) writeFileSync(p, d);
  }
  console.log(`\n── ${quitados} archivos ──`);
  if (!APLICAR) console.log("(ensayo — nada se escribio; agregue --aplicar)");
  process.exit(0);
}

for (const [rel, aviso] of PORTADAS) {
  const antes = readFileSync(rel, "utf8");
  if (antes.includes(`id="${MARCA}"`)) { console.log("   ya lo tiene:", rel); continue; }
  if (!antes.includes("<body>")) { console.log("   ⚠ SIN <body>, revisar a mano:", rel); continue; }
  banners++;
  console.log("   banner →", rel);
  if (APLICAR) writeFileSync(rel, antes.replace("<body>", "<body>" + aviso));
}

for (const p of html(".")) {
  const antes = readFileSync(p, "utf8");
  if (!antes.includes(DIR) || antes.includes("nota-mudanza")) continue;
  const idioma = Object.keys(NOTA).find((k) => antes.includes(DIR + "\n  " + k) || antes.includes(DIR + "\r\n  " + k));
  if (!idioma) { console.log("   ⚠ idioma no reconocido, revisar a mano:", p.replace(/^\.[\\/]/, "")); continue; }
  notas++;
  console.log("   nota  →", p.replace(/^\.[\\/]/, ""), `(${idioma})`);
  if (APLICAR) writeFileSync(p, antes.replace(DIR, DIR + NOTA[idioma]));
}

console.log(`\n── ${banners} banners · ${notas} notas de pie ──`);
if (!APLICAR) console.log("(ensayo — nada se escribio; use --aplicar)");

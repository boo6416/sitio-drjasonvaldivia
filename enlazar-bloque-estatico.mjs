/* El enlazado interno que ven los rastreadores de IA (2026-10-13).
 *
 * ⚠ ESTE SITIO SE LEE DOS VECES Y DISTINTO:
 *
 *   · GOOGLEBOT ejecuta JavaScript. Ve la página de React, que en las interiores
 *     trae CATORCE enlaces y ninguno a una página hermana.
 *   · GPTBot, OAI-SearchBot, PerplexityBot y ClaudeBot NO ejecutan JavaScript.
 *     Ven únicamente el bloque `.pre-estatico`. Para ChatGPT, ese bloque ES el
 *     sitio.
 *
 * Medido antes de tocar: de las 26 páginas React, TRECE no llevan la lista
 * «Otros procedimientos» en su bloque estático y se quedan en cinco enlaces, que
 * son los de cortesía (inicio, citas, seguros, costos, preguntas). O sea que
 * para ChatGPT son callejones sin salida: entra y no hay por dónde seguir.
 *
 * Esto les pone la misma lista que ya tienen las otras trece, en su idioma y sin
 * enlazarse a sí mismas. Y de paso mete la hernia inguinal en TODAS, que es la
 * página que Google lleva dos meses sin rastrear por falta de enlaces.
 *
 * ⛔ No toca la versión React. Eso es harina de otro costal y se decide aparte.
 *
 * Idempotente: correrlo dos veces no añade nada.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

/* El ancla: la franja oscura que va justo DESPUÉS de `.pre-estatico`, como
   hermana suya. Se eligió porque es la única marca que aparece exactamente una
   vez en las 26 páginas y siempre en la misma posición — el cierre `</div>` no
   sirve, hay varios y anidados. */
const FRANJA = '<div style="background:#0d2b3e; color:rgba(255,255,255,0.55);';

const ES = [
  ["/cirugia-de-vesicula/", "Cirugía de Vesícula"],
  ["/cirugia-de-hernia/", "Cirugía de Hernia"],
  ["/cirugia-de-hernia-inguinal/", "Hernia Inguinal"],
  ["/cirugia-de-hernia-umbilical/", "Hernia Umbilical"],
  ["/cirugia-antirreflujo/", "Cirugía Antirreflujo"],
  ["/cirugia-de-apendice/", "Cirugía de Apéndice"],
  ["/cirugia-de-tiroides/", "Cirugía de Tiroides"],
  ["/cirugia-de-quistes-y-lipomas/", "Quistes y Lipomas"],
  ["/cirugia-de-hemorroides/", "Cirugía de Hemorroides"],
  ["/cirugia-anorrectal/", "Cirugía Anorrectal"],
  ["/cirugia-de-urgencia/", "Cirugía de Urgencia"],
  ["/cirugia-laparoscopica/", "Cirugía Laparoscópica"],
  ["/manejo-de-heridas-complejas/", "Heridas Complejas"],
  ["/terapia-de-presion-negativa/", "Terapia de Presión Negativa"],
];
const EN = [
  ["/gallbladder-surgery/", "Gallbladder Surgery"],
  ["/hernia-surgery-puerto-vallarta/", "Hernia Repair"],
  ["/inguinal-hernia-surgery-puerto-vallarta/", "Inguinal Hernia Repair"],
  ["/umbilical-hernia-surgery-puerto-vallarta/", "Umbilical Hernia Repair"],
  ["/acid-reflux-surgery-puerto-vallarta/", "Anti-Reflux Surgery"],
  ["/appendectomy-puerto-vallarta/", "Appendectomy"],
  ["/thyroid-surgery-puerto-vallarta/", "Thyroid Surgery"],
  ["/cyst-lipoma-removal-puerto-vallarta/", "Cysts &amp; Lipomas"],
  ["/hemorrhoid-surgery-puerto-vallarta/", "Hemorrhoid Surgery"],
  ["/emergency-surgery-puerto-vallarta/", "Emergency Surgery"],
  ["/laparoscopic-surgery-puerto-vallarta/", "Laparoscopic Surgery"],
  ["/complex-wound-care-puerto-vallarta/", "Complex Wound Care"],
  ["/wound-vac-therapy-puerto-vallarta/", "Wound VAC Therapy"],
];

/* Inglesa si su propia ruta está en el catálogo inglés. No se adivina por el
   nombre: `surgery-cost-puerto-vallarta` es inglesa y `cirugia-...` española,
   pero hay mezclas, y una lista en el idioma equivocado es peor que ninguna. */
const esIngles = (ruta) => EN.some(([u]) => u === ruta);

let tocadas = 0, yaEstaban = 0;
const dirs = readdirSync(".", { withFileTypes: true })
  .filter((d) => d.isDirectory() && !/^(images|_pendiente|\.git|node_modules)$/.test(d.name))
  .map((d) => d.name);

for (const dir of dirs) {
  const f = `${dir}/index.html`;
  if (!existsSync(f)) continue;
  let h = readFileSync(f, "utf8");
  if (!h.includes('type="text/x-dc"')) continue;          // sólo páginas React
  if (h.includes('<ul class="pre-otros">')) { yaEstaban++; continue; }

  const ruta = `/${dir}/`;
  const ingles = esIngles(ruta);
  const catalogo = (ingles ? EN : ES).filter(([u]) => u !== ruta);
  const titulo = ingles ? "Other procedures" : "Otros procedimientos";

  const lista =
    `  <h2>${titulo}</h2>\n  <ul class="pre-otros">\n    ` +
    catalogo.map(([u, t]) => `<li><a href="${u}">${t}</a></li>`).join("") +
    `\n  </ul>\n`;

  const i = h.indexOf(FRANJA);
  if (i < 0) { console.error(`  ✗ ${f}: no encontré la franja; NO se toca`); process.exitCode = 1; continue; }
  h = h.slice(0, i) + lista + h.slice(i);
  writeFileSync(f, h);
  tocadas++;
  console.log(`  + ${f.padEnd(44)} ${catalogo.length} enlaces (${ingles ? "inglés" : "español"})`);
}

console.log(`\n${tocadas} páginas con lista nueva · ${yaEstaban} ya la tenían.`);

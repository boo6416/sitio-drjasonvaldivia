/* La hernia inguinal, en las listas que ya existían (2026-10-13).
 *
 * `enlazar-bloque-estatico.mjs` creó las listas que faltaban, y esas ya nacen
 * con la inguinal dentro. Pero DOCE listas antiguas no la traen, porque la
 * página nació después que ellas.
 *
 * Va justo detrás de la hernia general, que es el orden clínico: primero la
 * madre, luego las variantes. Si la página no tiene entrada de hernia general
 * —porque ES la de hernia—, va al principio.
 *
 * ⛔ Una página NO se enlaza a sí misma: las dos inguinales se saltan.
 * Idempotente.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const ES_ING = '<li><a href="/cirugia-de-hernia-inguinal/">Hernia Inguinal</a></li>';
const EN_ING = '<li><a href="/inguinal-hernia-surgery-puerto-vallarta/">Inguinal Hernia Repair</a></li>';
const ES_MADRE = '<li><a href="/cirugia-de-hernia/">Cirugía de Hernia</a></li>';
const EN_MADRE = '<li><a href="/hernia-surgery-puerto-vallarta/">Hernia Repair</a></li>';

const PROPIAS = ["cirugia-de-hernia-inguinal", "inguinal-hernia-surgery-puerto-vallarta"];
const INGLESAS = /^(gallbladder-surgery|hernia-surgery|inguinal-hernia|umbilical-hernia|acid-reflux|appendectomy|thyroid-surgery|cyst-lipoma|hemorrhoid-surgery|emergency-surgery|laparoscopic-surgery|complex-wound|wound-vac|surgery-cost)/;

let n = 0;
for (const dir of readdirSync(".", { withFileTypes: true })
  .filter((d) => d.isDirectory() && !/^(images|_pendiente|\.git|node_modules)$/.test(d.name))
  .map((d) => d.name)) {
  const f = `${dir}/index.html`;
  if (!existsSync(f) || PROPIAS.includes(dir)) continue;
  let h = readFileSync(f, "utf8");
  if (!h.includes('<ul class="pre-otros">')) continue;

  const ingles = INGLESAS.test(dir);
  const nuevo = ingles ? EN_ING : ES_ING;
  const madre = ingles ? EN_MADRE : ES_MADRE;
  if (h.includes(nuevo)) continue;

  if (h.includes(madre)) {
    h = h.replace(madre, madre + nuevo);
  } else {
    h = h.replace('<ul class="pre-otros">\n    ', '<ul class="pre-otros">\n    ' + nuevo);
  }
  writeFileSync(f, h);
  n++;
  console.log(`  + ${f.padEnd(46)} ${ingles ? "inglés" : "español"}${h.includes(madre) ? " (tras la hernia general)" : " (al principio)"}`);
}
console.log(`\n${n} listas completadas.`);

/* Catorce títulos que Google corta a media frase (2026-10-13).
 *
 * Google muestra unos 600 px de título, que en español son ~60 caracteres. De
 * 46 páginas, catorce pasaban de 65 y llegaban hasta 75: lo que sobra no se ve,
 * y lo que sobraba era justo el término por el que la gente busca. El caso más
 * caro: `/cirugia-antirreflujo/` terminaba en «| Funduplicatura», y
 * «funduplicatura puerto vallarta» es la consulta con MÁS impresiones del sitio
 * —76 en diez semanas, posición 7.0, cero clics—. La palabra estaba, pero
 * fuera de pantalla.
 *
 * Criterio: el término que la gente teclea, al frente; «Puerto Vallarta»
 * siempre; fuera el nombre del doctor cuando ya no cabe —quien busca un
 * procedimiento no busca el nombre—; y nada que prometa resultado, que lo
 * prohíbe COFEPRIS.
 *
 * ⚠ SÓLO SE TOCA <title>. `og:title` lo repetía, pero ése es el que se ve
 * cuando alguien comparte la página POR WHATSAPP, que es el canal de la
 * campaña — y ahí no hay límite de 60 caracteres ni conviene recortar. Se
 * quedan distintos a propósito.
 *
 * Idempotente.
 */
import { readFileSync, writeFileSync } from "node:fs";

const NUEVOS = {
  "costo-de-cirugia": "¿Cuánto cuesta una cirugía en Puerto Vallarta?",
  "cirugia-de-apendice": "Cirugía de apéndice en Puerto Vallarta | Apendicectomía",
  "absceso-perianal": "Absceso perianal en Puerto Vallarta | Drenaje urgente",
  "quiste-pilonidal": "Quiste pilonidal en Puerto Vallarta | Cirugía",
  "perianal-abscess-puerto-vallarta": "Perianal Abscess in Puerto Vallarta | Urgent Drainage",
  "fisura-anal": "Fisura anal en Puerto Vallarta | Dolor al evacuar",
  "fistula-anal": "Fístula anal en Puerto Vallarta | Salida de pus",
  // «Fundoplication» al frente: es el término de búsqueda, y cerraba la frase.
  "acid-reflux-surgery-puerto-vallarta": "Fundoplication in Puerto Vallarta | Hiatal Hernia",
  "cirugia-de-quistes-y-lipomas": "Quistes y lipomas en Puerto Vallarta | Cirugía menor",
  // 76 impresiones y la palabra no se veía. Ahora abre el título.
  "cirugia-antirreflujo": "Funduplicatura en Puerto Vallarta | Hernia hiatal",
  "gallbladder-surgery": "Gallbladder Surgery in Puerto Vallarta | Laparoscopic",
  "cirugia-de-vesicula": "Cirugía de vesícula en Puerto Vallarta | Colecistectomía",
  "hernia-surgery-puerto-vallarta": "Hernia Surgery in Puerto Vallarta | Inguinal, Umbilical",
  "cirugia-de-hernia": "Cirugía de hernia en Puerto Vallarta | Inguinal y umbilical",
};

let n = 0;
for (const [dir, nuevo] of Object.entries(NUEVOS)) {
  const f = `${dir}/index.html`;
  const h = readFileSync(f, "utf8");
  const m = h.match(/<title>([^<]*)<\/title>/);
  if (!m) { console.error(`  ✗ ${f}: sin <title>`); process.exitCode = 1; continue; }
  if (m[1] === nuevo) { continue; }
  if (nuevo.length > 60) { console.error(`  ✗ ${dir}: el nuevo mide ${nuevo.length}, no cabe`); process.exitCode = 1; continue; }
  writeFileSync(f, h.replace(m[0], `<title>${nuevo}</title>`));
  n++;
  console.log(`  ${String(m[1].length).padStart(3)} → ${String(nuevo.length).padStart(2)}  ${dir}`);
  console.log(`        antes: ${m[1]}`);
  console.log(`        ahora: ${nuevo}`);
}
console.log(`\n${n} títulos acortados. og:title sin tocar.`);

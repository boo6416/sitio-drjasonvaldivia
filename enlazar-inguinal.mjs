/* La hernia inguinal no existía para Google: cero enlaces internos (2026-10-13).
 *
 * MEDIDO ANTES DE TOCAR NADA:
 *   · `site:drjasonvaldivia.com/cirugia-de-hernia-inguinal/` → sin resultados.
 *     Search Console la tiene como «Descubierta: actualmente sin indexar».
 *   · En las consultas que contienen «inguinal» compiten OCHO páginas del sitio
 *     —la portada en posición 36, la inglesa de vesícula en la 95— y la página
 *     de hernia inguinal NO está entre ellas. Cero impresiones.
 *   · La causa: la portada es el único sitio del sitio renderizado que enlaza a
 *     páginas de procedimiento (18 de ellas, todas desde el pie), y las dos
 *     inguinales son las ÚNICAS que faltan.
 *
 * ⚠ POR QUÉ NO BASTA CON TOCAR `.pre-estatico`. Las páginas interiores llevan un
 * bloque de respaldo con una lista «Otros procedimientos» que SÍ incluye la
 * inguinal — pero `support.js` SUSTITUYE ese bloque al cargar, y la página
 * renderizada se queda con catorce enlaces y ninguno a una página hermana.
 * Googlebot renderiza JavaScript: ve la versión sin esos enlaces. Añadir el
 * enlace ahí no habría servido de nada, y era lo que yo iba a hacer.
 *
 * Esto sólo toca la PORTADA, que es la que de verdad reparte autoridad:
 *   1. el pie, columna «Procedimientos» → la inguinal en español;
 *   2. el pie, columna «In English»     → su gemela en inglés;
 *   3. la lista del bloque de respaldo  → para quien navegue sin JavaScript.
 *
 * No se deshace solo: correrlo dos veces no duplica nada (comprueba antes).
 */
import { readFileSync, writeFileSync } from "node:fs";

const F = "index.html";
let s = readFileSync(F, "utf8");
const antes = s;
let hechos = 0;

/** Inserta `nuevo` justo después de `ancla`, si `nuevo` no está ya. */
function tras(ancla, nuevo, que) {
  if (s.includes(nuevo)) { console.log(`  = ${que}: ya estaba`); return; }
  const i = s.indexOf(ancla);
  if (i < 0) { console.error(`  ✗ ${que}: NO encontré el ancla`); process.exitCode = 1; return; }
  s = s.slice(0, i + ancla.length) + nuevo + s.slice(i + ancla.length);
  hechos++;
  console.log(`  + ${que}`);
}

/* El estilo va EN LÍNEA y repetido en cada <a> porque así está escrito el pie
   entero: no hay hoja de estilos para él. Copiarlo es lo correcto aquí; no
   copiarlo deja el enlace azul y subrayado sobre fondo azul marino, que es
   justo el defecto que ya tiene la lista de respaldo de `/cirugia-de-hernia/`. */
const ESTILO = `style="color:rgba(255,255,255,0.68);text-decoration:none;font-size:.87rem;"`;

// ── 1 · pie, columna «Procedimientos» ─────────────────────────────────────
tras(
  `<li><a href="/cirugia-de-hernia/" ${ESTILO}>Cirugía de Hernia</a></li>`,
  `<li><a href="/cirugia-de-hernia-inguinal/" ${ESTILO}>Hernia Inguinal</a></li>`,
  "pie · Hernia Inguinal (español)",
);

// ── 2 · pie, columna «In English» ─────────────────────────────────────────
tras(
  `<li><a href="/hernia-surgery-puerto-vallarta/" ${ESTILO}>Hernia Repair</a></li>`,
  `<li><a href="/inguinal-hernia-surgery-puerto-vallarta/" ${ESTILO}>Inguinal Hernia Repair</a></li>`,
  "pie · Inguinal Hernia Repair (inglés)",
);

// ── 3 · bloque de respaldo, para quien navegue sin JavaScript ─────────────
/* Va DESPUÉS de la hernia general y ANTES de la umbilical, que es el orden
   clínico y el que ya sigue el resto de la lista. */
tras(
  `    <li><a href="/cirugia-de-hernia/">Cirugía de hernia — inguinal, umbilical e incisional</a></li>\n`,
  `    <li><a href="/cirugia-de-hernia-inguinal/">Cirugía de hernia inguinal — bulto en la ingle</a></li>\n`,
  "respaldo sin JS · hernia inguinal",
);

if (s !== antes) writeFileSync(F, s);
console.log(`\n${hechos} enlaces añadidos a ${F}.`);

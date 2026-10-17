/* Pone al día el número de reseñas de Google que muestra la portada.
 *
 *   node actualizar-resenas.mjs 82            # ensayo: dice qué cambiaría
 *   node actualizar-resenas.mjs 82 --aplicar
 *
 * ⚠ POR QUÉ EXISTE. El conteo estaba escrito a mano en OCHO lugares de
 * `index.html` —los diccionarios `es` y `en`, cuatro frases cada uno— y se
 * quedó en **70** mientras la ficha iba por **82**. Doce reseñas de prueba
 * social que el sitio no estaba enseñando, y ninguna señal de que estuviera
 * desfasado: un número a mano no avisa cuando caduca.
 *
 * ⛔ EL NÚMERO NO SE INVENTA NI SE ESTIMA. Se lee de la ficha, que es la única
 * fuente, y Google Maps **no entrega texto por `curl`** —es JavaScript—, así
 * que hay que abrirla en el navegador. Y SIEMPRE con `authuser=1`: la ficha
 * vive en `boo.valdi@gmail.com` y la cuenta por omisión del Chrome del Dr. es
 * otra, que no administra nada. Ya se perdieron semanas por mirar el panel
 * vacío de la cuenta equivocada y concluir que la ficha no era suya.
 *
 *   https://maps.app.goo.gl/MnbK3xqooJie5NaSA   → resolver → abrir con authuser=1
 *
 * Medido el 2026-10-17: 5,0 · 82 reseñas.
 */
import { readFileSync, writeFileSync } from "node:fs";

const n = Number(process.argv[2]);
const aplicar = process.argv.includes("--aplicar");

if (!Number.isInteger(n) || n < 1 || n > 100000) {
  console.error("uso: node actualizar-resenas.mjs <numero de reseñas> [--aplicar]");
  process.exit(1);
}

const RUTA = "index.html";
const antes = readFileSync(RUTA, "utf8");

/* Se sustituye el NÚMERO pegado a la palabra, no la frase entera: así el
 * guion sobrevive a que alguien reescriba el texto alrededor. */
const PATRON = /\b\d{1,5}(?=\s+(?:reseñas?|reviews?)\b)/g;

const encontrados = antes.match(PATRON) ?? [];
if (!encontrados.length) {
  console.error("✗ No se encontró ningún conteo de reseñas en index.html.");
  console.error("  Si el texto cambió de forma, actualice el patrón de este guion.");
  process.exit(1);
}

const distintos = [...new Set(encontrados)];
console.log(`${encontrados.length} menciones, con ${distintos.length} valor(es): ${distintos.join(", ")}`);
if (distintos.length > 1) {
  console.log("⚠ Había valores DISTINTOS entre sí: el sitio se contradecía solo.");
}

const despues = antes.replace(PATRON, String(n));
if (despues === antes) {
  console.log(`Ya decía ${n} en las ${encontrados.length} menciones. Nada que hacer.`);
  process.exit(0);
}

for (const linea of despues.split("\n").entries()) {
  const [i, txt] = linea;
  if (/\b\d{1,5}\s+(?:reseñas?|reviews?)\b/.test(txt) && txt !== antes.split("\n")[i]) {
    console.log(`  ${RUTA}:${i + 1}  ${txt.trim().slice(0, 110)}`);
  }
}

if (!aplicar) {
  console.log(`\n(ensayo) ${encontrados.length} menciones pasarían a ${n}. Repita con --aplicar.`);
  process.exit(0);
}

writeFileSync(RUTA, despues);
console.log(`\n✓ ${encontrados.length} menciones actualizadas a ${n}.`);
console.log("  Ahora: node revisar-rutas.mjs");

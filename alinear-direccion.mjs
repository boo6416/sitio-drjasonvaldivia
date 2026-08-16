/* Alinea la dirección del sitio con la de las fichas (2026-08-16).
 *
 *  POR QUÉ IMPORTA. Que el nombre, la dirección y el teléfono (el «NAP») digan
 *  EXACTAMENTE lo mismo en el sitio, en la ficha de Google y en los directorios
 *  es un factor de posicionamiento local — y aquí no coincidían:
 *
 *    Sitio       → «Calle Francia 186, Col. Versalles»
 *    Doctoralia  → «Hospital Multimédica Vallarta, Francia 186, Consultorio 4,
 *                   Versalles, Puerto Vallarta 48310»   (verificado en el perfil)
 *    Google      → «Francia 186, Versalles, 48310 Puerto Vallarta, Jal.»
 *
 *  Y hay una razón de fondo, más importante que la coincidencia literal: en
 *  Francia 186 existe TAMBIÉN la ficha de Google del propio Hospital Multimédica.
 *  Dos negocios en el mismo domicilio se filtran entre sí en el paquete del mapa
 *  salvo que estén claramente diferenciados. El número de consultorio es
 *  justamente lo que los diferencia — y era lo único que faltaba.
 *
 *  Se toma la versión con «Consultorio 4» porque es la más específica y la que
 *  ya publica Doctoralia. La ficha de Google y el perfil de Doctoralia deben
 *  quedar igual; eso lo hace el Dr., son formularios de sus cuentas.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const VIEJO_SCHEMA = '"streetAddress":"Calle Francia 186, Col. Versalles"';
const NUEVO_SCHEMA = '"streetAddress":"Hospital Multimédica Vallarta, Calle Francia 186, Consultorio 4, Col. Versalles"';

/* En el texto visible se dice el hospital primero: para un paciente que va a
   llegar en coche, «Hospital Multimédica» es un punto de referencia real y
   «Francia 186» no lo es. */
const VISIBLES = [
  ["Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.",
   "Hospital Multimédica Vallarta · Calle Francia 186, Consultorio 4, Col. Versalles, 48310 Puerto Vallarta, Jalisco."],
  ["Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.<br>",
   "Hospital Multimédica Vallarta · Calle Francia 186, Consultorio 4, Col. Versalles, 48310 Puerto Vallarta, Jalisco.<br>"],
];

function paginas(dir = ".", acc = []) {
  for (const n of readdirSync(dir)) {
    if ([".git", "node_modules", "_pendiente"].includes(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) paginas(p, acc);
    else if (n === "index.html") acc.push(p);
  }
  return acc;
}

let esquemas = 0, textos = 0;
for (const p of paginas()) {
  let html = readFileSync(p, "utf8");
  const antes = html;

  if (html.includes(VIEJO_SCHEMA)) {
    html = html.split(VIEJO_SCHEMA).join(NUEVO_SCHEMA);
    esquemas++;
  }
  for (const [de, a] of VISIBLES) {
    if (html.includes(de) && !html.includes("Consultorio 4")) {
      html = html.split(de).join(a);
      textos++;
    }
  }
  if (html !== antes) writeFileSync(p, html);
}
console.log(`  esquemas actualizados: ${esquemas}`);
console.log(`  bloques de texto visible: ${textos}`);

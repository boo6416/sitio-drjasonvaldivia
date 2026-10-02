/** MUDANZA DE DOMICILIO — 2026-09-01.
 *
 *  El consultorio deja Hospital Multimedica Vallarta (Calle Francia 186,
 *  Consultorio 4, Col. Versalles, 48310) y pasa a:
 *
 *      Healthcare by the Sea — Centro quirurgico ambulatorio
 *      De Los Tules 168-10, Jardines de Las Gaviotas, 48328 Puerto Vallarta, Jal.
 *
 *  ⚠ LO QUE SE MUDA ES LA CONSULTA. Multimedica se sigue nombrando UNA vez,
 *  como referencia del domicilio ANTERIOR, porque de eso trata el aviso.
 *
 *  ⚠ Y NO SE REDACTA NADA SOBRE DONDE OPERA. La primera version decia "las
 *  cirugias se siguen realizando en Hospital Multimedica" — el Dr. lo corrigio:
 *  «yo opero en todos los hospitales, no es una aclaracion necesaria». Nombrar
 *  un solo hospital no informa, lo ENCOGE. La pagina /credenciales/ ya dice que
 *  esta credencializado en varios.
 *
 *  LA DIRECCION SE ESCRIBE COMO LA ESCRIBE GOOGLE, letra por letra —
 *  «De Los Tules 168-10, Jardines de Las Gaviotas» — porque el NAP sólo sirve
 *  si coincide. Ojo: la propia web de la clinica (seahealth.com.mx) dice
 *  «Las Aralias» en vez de «Jardines de Las Gaviotas». Manda la ficha de
 *  Google, que es la que Google compara.
 *
 *  LAS COORDENADAS NO SE INVENTARON. Salen de la ficha del lugar en Google
 *  Maps (`!3d20.6391151!4d-105.2208455`), leidas el 2026-09-01. Las viejas
 *  llevaban al paciente a Versalles.
 *
 *  ⛔ AQUI DECIA QUE EL ENLACE CORTO `q8n5PdiaCsoAVkMv7` NO SE TOCABA PORQUE
 *  "sigue al lugar solo". ERA FALSO, y costo que una paciente citada el 1-oct
 *  llegara al consultorio VIEJO, un mes despues de esta mudanza.
 *
 *  UN ENLACE CORTO DE MAPS ES UNA FOTOGRAFIA DEL MOMENTO EN QUE SE CREO. Ese
 *  llevaba las coordenadas antiguas GRABADAS dentro de la URL
 *  (`!3d20.6364712!4d-105.2275679`), que caen en Calle Francia, CP 48310. Google
 *  obedece esas coordenadas incrustadas, asi que abria Francia aunque la ficha
 *  ya estuviera mudada.
 *
 *  ⚠ LA FICHA NUNCA ESTUVO MAL: dice "De Los Tules 168-10 … 48328" y "Se
 *  encuentra en: Healthcare by the Sea". El fallo era solo del enlace.
 *
 *  Hoy el sitio usa `MnbK3xqooJie5NaSA`, regenerado por el Dr. con "Compartir"
 *  el 2026-10-02 y verificado: resuelto sin sesion lleva la direccion nueva y
 *  NINGUNA coordenada congelada —solo el id de la ficha—, y el navegador lo
 *  dibuja a ~5 m del consultorio. Por resolver por id, ese si la sigue.
 *
 *  ⚠ EL AVISO DE VERIFICAR YA ESTABA ESCRITO AQUI, y nadie lo ejecuto en un mes.
 *  Un "verifiquelo despues" no es una verificacion: al cambiar este enlace,
 *  RESUELVALO Y MIRE DONDE CAE antes de darlo por bueno.
 *
 *  Idempotente: correrlo dos veces no hace dano.
 *
 *      node mudanza-domicilio.mjs            # ensayo, no escribe
 *      node mudanza-domicilio.mjs --aplicar  # escribe
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const APLICAR = process.argv.includes("--aplicar");

/* Cada par es [lo que dice hoy, lo que debe decir]. Se hacen por texto EXACTO y
 * no por expresion regular: una regexp sobre 48 archivos que llevan JSON-LD
 * dentro del HTML es como se cuela un cambio en un sitio que nadie miro. */
const CAMBIOS = [
  // ── 1. Datos estructurados (schema.org) ──────────────────────────────────
  ['"streetAddress":"Hospital Multimédica Vallarta, Calle Francia 186, Consultorio 4, Col. Versalles"',
   '"streetAddress":"Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas"'],
  ['"postalCode":"48310"', '"postalCode":"48328"'],
  ['"latitude":20.6364712,"longitude":-105.2275679',
   '"latitude":20.6391151,"longitude":-105.2208455'],

  // ── 2. Pie de pagina visible (16 paginas) ────────────────────────────────
  ["Hospital Multimédica Vallarta · Calle Francia 186, Consultorio 4, Col. Versalles, 48310 Puerto Vallarta, Jalisco.",
   "Healthcare by the Sea · De Los Tules 168-10, Jardines de Las Gaviotas, 48328 Puerto Vallarta, Jalisco."],

  /* 3. La respuesta de «¿Donde esta el consultorio?» en los datos
   *    estructurados. ⚠ VA ANTES QUE EL DOMICILIO LEGAL DE ABAJO, y no es un
   *    capricho de orden: el domicilio legal es una SUBCADENA de esta
   *    respuesta. Puesto al reves, el cambio generico se la comia primero y la
   *    pregunta quedaba con la direccion nueva pero SIN la distincion entre
   *    donde se consulta y donde se opera — que es justo lo que hay que
   *    decir. El ensayo lo destapo: esta cadena salia con 0 reemplazos. */
  ['"@type":"Answer","text":"En Hospital Multimédica Vallarta, Calle Francia 186, Consultorio 4, Col. Versalles, C.P. 48310, Puerto Vallarta, Jalisco."',
   '"@type":"Answer","text":"La consulta es en Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas, C.P. 48328, Puerto Vallarta, Jalisco — domicilio nuevo desde septiembre de 2026."'],

  // ── 4. Domicilio LEGAL del aviso de privacidad ───────────────────────────
  ["Hospital Multimédica Vallarta, Calle Francia 186, Consultorio 4, Col. Versalles, C.P. 48310, Puerto Vallarta, Jalisco.",
   "Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas, C.P. 48328, Puerto Vallarta, Jalisco."],

  // ── 5. Tarjeta de contacto de la portada ─────────────────────────────────
  ["Calle Francia #186, Consultorio 4, Col. Versalles, Puerto Vallarta, Jal.",
   "De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta, Jal."],

  /* 5. Las preguntas frecuentes. Aqui es donde el hospital CAMBIA DE PAPEL en
   *    vez de desaparecer: la respuesta separa donde se consulta de donde se
   *    opera, que es justo la confusion que hay que evitar. */
  ["En Hospital Multimédica, Calle Francia #186, Consultorio 4, Colonia Versalles, Puerto Vallarta, Jalisco. Las cirugías pueden realizarse en el hospital que mejor se adapte a su caso y cobertura.",
   "La CONSULTA es en Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta, Jalisco — domicilio nuevo desde septiembre de 2026; antes se atendía en Hospital Multimédica."],
  ["At Hospital Multimédica, Calle Francia #186, Consultorio 4, Colonia Versalles, Puerto Vallarta, Jalisco. Surgeries can be performed at the hospital that best fits your case and insurance coverage.",
   "OFFICE VISITS are at Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta, Jalisco — a new address as of September 2026; the office was previously at Hospital Multimédica."],

  /* 6. Etiquetas cortas. «Consultorio · Hospital Multimedica» era una etiqueta,
   *    no una direccion, y por eso no la agarra ninguno de los cambios de
   *    arriba: hay que cambiarla a mano o el sitio sigue diciendo el nombre
   *    viejo en la tarjeta de contacto y en la fila de credenciales. */
  ["trust2: 'Hospital Multimédica'", "trust2: 'Healthcare by the Sea'"],
  ["contactAddrLabel: 'Consultorio · Hospital Multimédica'",
   "contactAddrLabel: 'Consultorio · Healthcare by the Sea'"],
  ["contactAddrLabel: 'Office · Hospital Multimédica'",
   "contactAddrLabel: 'Office · Healthcare by the Sea'"],

  /* 7. El mapa incrustado. El identificador del lugar (`!1s0x8421…`) es el de
   *    la ficha del Dr. y NO cambia —se mueve con ella—; lo que cambia es el
   *    centro del mapa, que estaba clavado en Versalles. */
  ["!1d3732.8!2d-105.2301428!3d20.6364762!", "!1d3732.8!2d-105.2208455!3d20.6391151!"],

  /* ── 8. LA SEGUNDA CAPA ────────────────────────────────────────────────────
   *
   *  ⚠ Los cambios de arriba dejaron viva la direccion escrita A MANO DENTRO DE
   *  LA PROSA de seis paginas, en cinco redacciones distintas —«Col. Versalles»,
   *  «colonia Versalles», «Colonia Versalles», con y sin «Puerto Vallarta»— y en
   *  los generadores, que ademas usan un formato ANTERIOR (sin hospital y sin
   *  «Consultorio 4») porque son de antes de `alinear-direccion.mjs`.
   *
   *  Se descubrio con un grep DESPUES de aplicar, no antes. Es la leccion de
   *  esta mudanza: cambiar las 13 cadenas obvias deja el sitio diciendo la
   *  direccion vieja en el parrafo que el paciente si lee. Cuando vuelva a
   *  mudarse, corra el grep del final ANTES de dar el trabajo por hecho.
   *
   *  ⚠ VAN DE MAS LARGA A MAS CORTA. «Calle Francia 186, Col. Versalles» es
   *  subcadena de la linea completa del pie; al reves, la corta parte la larga
   *  por la mitad y deja un remiendo.
   *
   *  Estas frases hablan del CONSULTORIO —donde se consulta—, asi que llevan la
   *  direccion nueva a secas. La cirugia se nombra aparte, en las preguntas
   *  frecuentes y en el aviso de la portada. */
  ["Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.",
   "De Los Tules 168-10, Jardines de Las Gaviotas, 48328 Puerto Vallarta, Jalisco."],
  ["Consultorio en el <strong>Hospital Multimédica</strong>, Calle Francia #186, Consultorio 4, Col. Versalles, Puerto Vallarta, Jalisco.",
   "Consultorio en <strong>Healthcare by the Sea</strong>, De Los Tules 168-10, Jardines de Las Gaviotas, Puerto Vallarta, Jalisco."],
  ['streetAddress: "Calle Francia 186, Col. Versalles"',
   'streetAddress: "Healthcare by the Sea, De Los Tules 168-10, Jardines de Las Gaviotas"'],
  ['postalCode: "48310"', 'postalCode: "48328"'],
  ["Calle Francia 186, Col. Versalles", "De Los Tules 168-10, Jardines de Las Gaviotas"],
  ["Calle Francia 186, colonia Versalles", "De Los Tules 168-10, Jardines de Las Gaviotas"],
  ["Calle Francia 186, Colonia Versalles", "De Los Tules 168-10, Jardines de Las Gaviotas"],
];

/* `.json` y `_pendiente/` entran a proposito. Ahi viven los textos FUENTE de
 * las seis paginas que arma `armar-paginas.mjs`. Dejarlos con la direccion
 * vieja no rompe nada hoy y lo rompe todo el dia que alguien regenere: las
 * paginas volverian a salir mandando al paciente a Versalles. */
const EXT = /\.(html|mjs|json)$/;
const SALTAR = new Set([".git", "node_modules", "images"]);
/* `alinear-direccion.mjs` se deja EN PAZ: es el guion historico que alineo el
 * domicilio VIEJO. Reescribirle las cadenas lo dejaria mintiendo sobre lo que
 * hizo. Se neutraliza aparte, al final, para que nadie lo corra por error. */
const INTOCABLES = new Set(["alinear-direccion.mjs", "mudanza-domicilio.mjs"]);

function* archivos(dir) {
  for (const e of readdirSync(dir)) {
    if (SALTAR.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* archivos(p);
    else if (EXT.test(e) && !INTOCABLES.has(e)) yield p;
  }
}

let tocados = 0, total = 0;
const porCambio = new Map(CAMBIOS.map(([de]) => [de, 0]));

for (const p of archivos(".")) {
  const antes = readFileSync(p, "utf8");
  let despues = antes;
  for (const [de, a] of CAMBIOS) {
    if (!despues.includes(de)) continue;
    porCambio.set(de, porCambio.get(de) + despues.split(de).length - 1);
    despues = despues.replaceAll(de, a);
  }
  if (despues === antes) continue;
  tocados++;
  total += [...porCambio.values()].reduce((a, b) => a + b, 0) && 1;
  console.log("  ", p.replace(/^\.[\\/]/, ""));
  if (APLICAR) writeFileSync(p, despues);
}

console.log(`\n── ${tocados} archivos ${APLICAR ? "cambiados" : "por cambiar"} ──\n`);
console.log("Reemplazos por cadena:");
for (const [de, n] of porCambio) {
  const etiqueta = de.length > 64 ? de.slice(0, 61) + "…" : de;
  console.log(`   ${String(n).padStart(3)} × ${etiqueta}`);
}
const sinUso = [...porCambio].filter(([, n]) => n === 0);
if (sinUso.length) {
  console.log("\n⚠ CADENAS QUE NO APARECIERON EN NINGUN ARCHIVO:");
  for (const [de] of sinUso) console.log("   ", de);
  console.log("   O ya se aplicaron, o el texto cambio y hay que revisarlas a mano.");
}
if (!APLICAR) console.log("\n(ensayo — nada se escribio; use --aplicar)");

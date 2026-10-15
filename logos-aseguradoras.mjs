/* Pone (o quita) el <img> del logo de cada aseguradora en /seguros/, según el
 * archivo esté o no en `images/aseguradoras/`. Sólo toca esa página.
 *
 * ⚠ POR QUÉ EXISTE (2026-10-14). La página traía los veinte `<img>` SIEMPRE, y
 * como los logos no están —a propósito: son marcas registradas de terceros y
 * mostrarlas puede leerse como que el Dr. pertenece a su red— cada visita
 * producía **veinte 404**. A la vista no se notaba, porque cada `<img>` lleva
 * `onerror="this.remove()"` y la tarjeta se queda con el nombre; pero cualquier
 * auditoría del sitio los cuenta como veinte imágenes rotas, y eso es lo que
 * acaba en la captura de pantalla de quien ofrece «arreglarle la página».
 *
 * El arreglo no es descargar las marcas: es no pedir lo que no está. La tarjeta
 * con sólo el nombre era ya el resultado real.
 *
 * Para poner un logo: deje el PNG en `images/aseguradoras/` con el nombre de la
 * lista de abajo y corra `node logos-aseguradoras.mjs`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PAGINA = "seguros/index.html";
const CARPETA = "images/aseguradoras";

/* El nombre del archivo que le toca a cada aseguradora. La clave es el texto
   que ya está en la tarjeta, que es lo que no se puede perder. */
const LOGOS = {
  "GNP Seguros": "gnp.png",
  "AXA México": "axa.png",
  "MetLife México": "metlife.png",
  "Seguros Monterrey New York Life": "monterrey.png",
  "Mapfre México": "mapfre.png",
  "Allianz México": "allianz.png",
  "Zurich México": "zurich.png",
  "HDI Seguros": "hdi.png",
  "Seguros Banorte": "banorte.png",
  "Seguros Inbursa": "inbursa.png",
  "Seguros Atlas": "atlas.png",
  "Plan Seguro": "planseguro.png",
  "BUPA Global": "bupa.png",
  "Cigna Global": "cigna.png",
  "Allianz Care": "allianzcare.png",
  "IMG — International Medical Group": "img.png",
  "GeoBlue": "geoblue.png",
  "Aetna International": "aetna.png",
  "Now Health International": "nowhealth.png",
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let html = readFileSync(PAGINA, "utf8");
let puestos = 0, quitados = 0, yaBien = 0;

for (const [nombre, archivo] of Object.entries(LOGOS)) {
  const hay = existsSync(`${CARPETA}/${archivo}`);
  const img = `<img src="/${CARPETA}/${archivo}" alt="${nombre}" loading="lazy" onerror="this.remove()">`;
  /* Se ancla a la tarjeta entera y se reescribe su interior: así el guion no
     depende de si el <img> está o no, ni del orden de los atributos. */
  const re = new RegExp(
    `<div class="tarjeta">(?:<img[^>]*>)?<span>${esc(nombre)}</span></div>`,
  );
  const m = html.match(re);
  if (!m) {
    console.error(`  ⚠ no encontré la tarjeta de «${nombre}» — sin tocar`);
    continue;
  }
  const tenia = m[0].includes("<img");
  if (tenia === hay) { yaBien++; continue; }
  html = html.replace(
    re,
    `<div class="tarjeta">${hay ? img : ""}<span>${nombre}</span></div>`,
  );
  if (hay) puestos++; else quitados++;
}

writeFileSync(PAGINA, html);
console.log(
  `logos: ${puestos} puestos, ${quitados} quitados, ${yaBien} ya estaban bien`,
);
console.log(
  `(un logo se añade dejando su PNG en ${CARPETA}/ y volviendo a correr esto)`,
);

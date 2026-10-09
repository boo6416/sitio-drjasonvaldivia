/* Reescribe una página de procedimiento desde UNA sola fuente.
 *
 * POR QUÉ EXISTE: cada página lleva su contenido TRES veces — el objeto `d` que
 * pinta el componente, el bloque `.pre-estatico` que es lo que lee Google, y el
 * FAQPage de los datos estructurados. Editarlas a mano es exactamente como se
 * despegan: el 2026-10-08 doce páginas llevaban pegada otra página entera
 * porque un generador no limpió la plantilla entre iteraciones. Esto toma la
 * `d` nueva y reescribe las tres a la vez, así que no pueden discrepar.
 *
 *   node regenerar-pagina.mjs <carpeta> <archivo.json>
 *
 * ⚠ La cola del bloque estático —«Otros procedimientos» y el pie— se conserva
 * tal cual: son enlaces propios de cada página y no salen de la `d`.
 */
import fs from "node:fs";

const [carpeta, fuente] = process.argv.slice(2);
if (!carpeta || !fuente) {
  console.error("uso: node regenerar-pagina.mjs <carpeta> <archivo.json>");
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(fuente, "utf8"));
const archivo = carpeta + "/index.html";
let html = fs.readFileSync(archivo, "utf8");

const esc = (s) => String(s).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
// JSON.stringify da una cadena JS válida y escapa todo lo que haga falta.
const jsStr = (s) => JSON.stringify(String(s));

/* 1 — El objeto `d` del componente. */
const campos = [];
for (const [k, v] of Object.entries(d)) {
  if (Array.isArray(v) && v.length && typeof v[0] === "object") {
    const filas = v.map((o) =>
      "          { " + Object.entries(o).map(([a, b]) => a + ": " + jsStr(b)).join(", ") + " },").join("\n");
    campos.push("        " + k + ": [\n" + filas + "\n        ],");
  } else if (Array.isArray(v)) {
    campos.push("        " + k + ": [\n" + v.map((x) => "          " + jsStr(x) + ",").join("\n") + "\n        ],");
  } else {
    campos.push("        " + k + ": " + jsStr(v) + ",");
  }
}
const nuevoD = "      d: {\n" + campos.join("\n") + "\n      },";
const dIni = html.indexOf("      d: {");
const dFin = html.indexOf("\n      },", dIni);
if (dIni < 0 || dFin < 0) throw new Error("no encontré el objeto d");
html = html.slice(0, dIni) + nuevoD + html.slice(dFin + "\n      },".length);

/* 2 — El bloque estático, calcado de la misma `d`. */
// La cola empieza en «Otros procedimientos» o en su equivalente inglés.
let colaDesde = html.indexOf("  <h2>Otros procedimientos</h2>");
if (colaDesde < 0) colaDesde = html.indexOf("  <h2>Other procedures</h2>");
const colaHasta = html.indexOf("</div></dc-import>");
if (colaDesde < 0 || colaHasta < 0) throw new Error("no encontré la cola del bloque estático");
const cola = html.slice(colaDesde, colaHasta);

const li = (xs) => xs.map((x) => "<li>" + esc(x) + "</li>").join("");
const faqHtml = d.faqs.map((x) => "<h3>" + esc(x.q) + "</h3><p>" + esc(x.a) + "</p>").join("");
/* Las etiquetas fijas del bloque van en español o en inglés según la página.
   Se leen del HTML que ya está, no se adivinan por la carpeta: así una página
   nueva en otro idioma no sale mezclada. */
const ingles = html.includes('<html lang="en"');
const T = ingles
  ? { inicio: "Home", agendar: "Book a consultation", wa: "WhatsApp", faq: "Frequently Asked Questions" }
  : { inicio: "Inicio", agendar: "Agendar consulta", wa: "WhatsApp citas", faq: "Preguntas frecuentes" };

const estatico =
  '  <nav class="pre-migas"><a href="/">' + T.inicio + "</a> / <span>" + esc(d.breadcrumbLabel) + "</span></nav>\n" +
  '  <p class="pre-kicker">' + esc(d.kicker) + "</p>\n" +
  "  <h1>" + esc(d.title) + "</h1>\n" +
  '  <p class="pre-lede">' + esc(d.lede) + "</p>\n" +
  '  <p class="pre-cta">\n' +
  '    <a class="pre-boton" href="/citas/">' + T.agendar + "</a>\n" +
  '    <a class="pre-boton pre-wa" href="' + d.whatsappHref + '">' + T.wa + "</a>\n" +
  "  </p>\n" +
  "  <h2>" + esc(d.symptomsTitle) + "</h2>\n" +
  "  <p>" + esc(d.symptomsIntro) + "</p>\n" +
  "  <ul>" + li(d.symptoms) + "</ul>\n" +
  "  <h2>" + esc(d.whenTitle) + "</h2><p>" + esc(d.whenText) + "</p>\n" +
  "  <h2>" + esc(d.procedureTitle) + "</h2>\n" +
  "  <p>" + esc(d.procedureIntro) + "</p>\n" +
  "  <ol>" + li(d.steps.map((s) => s.desc)) + "</ol>\n" +
  '  <p class="pre-nota"><strong>' + esc(d.calloutStrong) + "</strong> " + esc(d.calloutText) + "</p>\n" +
  "  <h2>" + esc(d.recoveryTitle) + "</h2><p>" + esc(d.recoveryText) + "</p>\n" +
  "  <h2>" + T.faq + "</h2>" + faqHtml + "\n" +
  "  <h2>" + esc(d.finalTitle) + "</h2><p>" + esc(d.finalText) + "</p>\n";

const marca = '<div class="pre-estatico">\n';
const bloqueIni = html.indexOf(marca) + marca.length;
html = html.slice(0, bloqueIni) + estatico + cola + html.slice(colaHasta);

/* 3 — El FAQPage de los datos estructurados, de la misma `d`. */
const faqLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: d.faqs.map((x) => ({
    "@type": "Question",
    name: x.q,
    acceptedAnswer: { "@type": "Answer", text: x.a },
  })),
});
const abre = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage"';
const i = html.indexOf(abre);
if (i < 0) throw new Error("no encontré el FAQPage");
const cierra = html.indexOf("</script>", i) + "</script>".length;
html = html.slice(0, i) + '<script type="application/ld+json">' + faqLd + "</script>" + html.slice(cierra);

fs.writeFileSync(archivo, html, "utf8");
const palabras = estatico.split(/<[^>]*>/).join(" ").split(/\s+/).filter(Boolean).length;
console.log(archivo + ": reescrita · " + palabras + " palabras visibles · " + d.faqs.length + " preguntas");

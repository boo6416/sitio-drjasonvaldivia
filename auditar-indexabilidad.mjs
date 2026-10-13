/* ¿Qué ve cada rastreador? Sólo LEE; no toca nada.
 *
 * El sitio monta React en el navegador, así que hay DOS versiones de cada página:
 *
 *   · la RENDERIZADA, que es la que ve Googlebot (ejecuta JavaScript);
 *   · la ESTÁTICA del bloque `.pre-estatico`, que es la ÚNICA que ven GPTBot,
 *     OAI-SearchBot, PerplexityBot y ClaudeBot — ninguno ejecuta JavaScript.
 *
 * Por eso el bloque de respaldo no es un detalle de accesibilidad: es la cara
 * del consultorio ante ChatGPT. Esto mide si está a la altura.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const texto = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ").trim();

/* HAY DOS CLASES DE PAGINA EN ESTE SITIO, y confundirlas da un falso positivo
   enorme: la primera version de este guion reporto 18 paginas "sin contenido"
   que en realidad son las mejores.

     A) PAGINA REACT: lleva <script type="text/x-dc">. Lo estatico es solo el
        bloque `.pre-estatico`, porque support.js sustituye todo lo demas.
     B) PAGINA ESTATICA PURA: no lleva x-dc ni pre-estatico. Todo su <body> es
        estatico, y por tanto todo lo ve un rastreador que no ejecuta JS. */
const estatico = (html) => {
  const esReact = html.includes('type="text/x-dc"');
  if (!esReact) {
    const b = html.indexOf("<body");
    return b < 0 ? html : html.slice(b);
  }
  for (const marca of ['class="pre-estatico"', 'id="pre-portada"']) {
    const i = html.indexOf(marca);
    if (i < 0) continue;
    const j = html.indexOf('type="text/x-dc"', i);
    return html.slice(i, j < 0 ? html.length : j);
  }
  return "";
};

const paginas = [
  "index.html",
  ...readdirSync(".", { withFileTypes: true })
    .filter((d) => d.isDirectory() && !/^(images|_pendiente|\.git|node_modules)$/.test(d.name))
    .map((d) => `${d.name}/index.html`)
    .filter(existsSync),
];

const filas = [];
for (const p of paginas) {
  const h = readFileSync(p, "utf8");
  const bloque = estatico(h);
  const tipo = h.includes('type="text/x-dc"') ? "React" : "estatica";
  const t = texto(bloque);
  filas.push({
    pagina: p.replace("/index.html", "/").replace("index.html", "/"),
    tipo,
    palabras: t ? t.split(" ").length : 0,
    h1: (bloque.match(/<h1[\s>]/gi) || []).length,
    h2: (bloque.match(/<h2[\s>]/gi) || []).length,
    enlaces: new Set((bloque.match(/href="\/[a-z0-9-]+\//g) || [])).size,
    schema: (h.match(/"@type"\s*:\s*"([A-Za-z]+)"/g) || [])
      .map((x) => x.split('"')[3]).filter((v, i, a) => a.indexOf(v) === i).join(","),
    titulo: (h.match(/<title>([^<]*)<\/title>/) || [, ""])[1].length,
    desc: (h.match(/name="description" content="([^"]*)"/) || [, ""])[1].length,
  });
}

filas.sort((a, b) => a.palabras - b.palabras);
console.log("LO QUE VE CHATGPT (bloque estático, sin JavaScript)\n");
console.log("pág.".padEnd(42) + "tipo      palab  h1 h2 enl  tít desc  schema");
for (const f of filas) {
  const alarma = f.palabras < 150 ? " ⚠" : f.h1 !== 1 ? " ⚠h1" : "";
  console.log(
    f.pagina.padEnd(42) + f.tipo.padEnd(10) +
    String(f.palabras).padStart(5) + String(f.h1).padStart(4) + String(f.h2).padStart(3) +
    String(f.enlaces).padStart(4) + String(f.titulo).padStart(5) + String(f.desc).padStart(5) +
    "  " + (f.schema || "—").slice(0, 34) + alarma,
  );
}

const flacas = filas.filter((f) => f.palabras < 150);
const sinH1 = filas.filter((f) => f.h1 !== 1);
const sinSchema = filas.filter((f) => !f.schema);
const titMal = filas.filter((f) => f.titulo === 0 || f.titulo > 65);
const descMal = filas.filter((f) => f.desc === 0 || f.desc > 160);
console.log(`\n${filas.length} páginas.`);
console.log(`  sin contenido estático suficiente (<150 palabras): ${flacas.length}` +
  (flacas.length ? "\n    " + flacas.map((f) => f.pagina).join("\n    ") : ""));
console.log(`  sin un <h1> único: ${sinH1.length}` + (sinH1.length ? " → " + sinH1.map((f) => f.pagina).join(", ") : ""));
console.log(`  sin datos estructurados: ${sinSchema.length}` + (sinSchema.length ? " → " + sinSchema.map((f) => f.pagina).join(", ") : ""));
console.log(`  título ausente o >65 car: ${titMal.length}` + (titMal.length ? " → " + titMal.map((f) => f.pagina + "(" + f.titulo + ")").join(", ") : ""));
console.log(`  descripción ausente o >160 car: ${descMal.length}` + (descMal.length ? " → " + descMal.map((f) => f.pagina + "(" + f.desc + ")").join(", ") : ""));

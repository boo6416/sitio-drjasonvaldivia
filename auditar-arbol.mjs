/** La auditoria del ARBOL, no de las ramas. Tres preguntas, contra el origen
 *  que se le pase (local antes de desplegar, produccion despues):
 *
 *   1. ¿A que paginas se LLEGA desde la portada siguiendo enlaces, sin JS?
 *   2. ¿Cuanto texto ve un rastreador que no ejecuta JS, pagina por pagina?
 *   3. ¿Toda pagina ofrece salida —inicio y agendar—? Sin eso es un callejon.
 *
 *  Existe porque comprobar que cada URL responde 200 NO es auditar: las 12
 *  paginas de procedimiento devolvian 200 y servian 175 caracteres, sin un
 *  solo enlace que llegara a ellas.
 */
const RAIZ = process.argv[2] ?? "http://127.0.0.1:8941";
const ORIGEN = new URL(RAIZ).origin;

const ruta = (u, base = RAIZ) => {
  try {
    let p = new URL(u, base).pathname;
    if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
    return p;
  } catch { return null; }
};
const interno = (u) => { try { return new URL(u, RAIZ).origin === ORIGEN; } catch { return false; } };

const cache = new Map();
async function traer(p) {
  if (!cache.has(p)) {
    const r = await fetch(RAIZ + p).catch(() => null);
    cache.set(p, { est: r ? r.status : 0, t: r && r.ok ? await r.text() : "" });
  }
  return cache.get(p);
}

// 1 — recorrido desde la portada
const vistos = new Set(["/"]), cola = ["/"];
while (cola.length) {
  const p = cola.shift();
  const { est, t } = await traer(p);
  if (est !== 200) continue;
  for (const m of t.matchAll(/href\s*=\s*["']([^"']+)["']/g)) {
    if (!interno(m[1])) continue;
    const q = ruta(m[1]);
    if (q && !vistos.has(q) && !q.includes("%7B")) { vistos.add(q); cola.push(q); }
  }
}

const sm = await (await fetch(RAIZ + "/sitemap.xml")).text();
const decl = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => { let p = new URL(m[1]).pathname; if (!p.endsWith("/")) p += "/"; return p; });

const huerfanas = decl.filter((d) => !vistos.has(d));
console.log(`1) ALCANZABLES desde / sin JavaScript: ${vistos.size}  ·  declaradas en el sitemap: ${decl.length}`);
console.log("   huerfanas:", huerfanas.length ? huerfanas.join("  ") : "ninguna ✓");

// 2 — texto rastreable
console.log("\n2) TEXTO que ve un rastreador sin JS:");
let flacas = 0;
for (const d of decl) {
  const { t } = await traer(d);
  const txt = t.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
  const mal = txt.length < 800;
  if (mal) flacas++;
  console.log("  ", d.padEnd(40), String(txt.length).padStart(6), mal ? "⚠ CASI VACIA" : "");
}

// 3 — salidas
console.log("\n3) SALIDA de cada pagina (inicio · agendar):");
let sinSalida = 0;
for (const d of decl) {
  if (d === "/") continue;
  const { t } = await traer(d);
  const hrefs = [...t.matchAll(/href\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const inicio = hrefs.some((h) => h === "/" || h === "https://drjasonvaldivia.com/");
  const agendar = hrefs.some((h) => h.includes("/citas/") || h.includes("wa.me"));
  if (!inicio || !agendar) {
    sinSalida++;
    console.log("  ⚠", d.padEnd(40), inicio ? "" : "SIN INICIO", agendar ? "" : "SIN AGENDAR");
  }
}
if (!sinSalida) console.log("   todas ofrecen inicio y agendar ✓");

const mal = huerfanas.length + flacas + sinSalida;
console.log("\n" + (mal
  ? `── ${huerfanas.length} huerfanas · ${flacas} casi vacias · ${sinSalida} sin salida ──`
  : "── arbol completo: nada huerfano, nada vacio, nada sin salida ──"));
process.exit(mal ? 1 : 0);

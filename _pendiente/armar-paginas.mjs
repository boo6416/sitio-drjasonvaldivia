/* Arma paginas de procedimiento a partir de una plantilla y un JSON de contenido.
 *
 * POR QUE UN ENSAMBLADOR Y NO ESCRIBIR EL HTML A MANO. Cada pagina existe DOS
 * veces: un bloque estatico que es lo que ven los buscadores y quien no ejecuta
 * JavaScript, y un objeto de datos que pinta el runtime del sitio. Escribir las
 * dos a mano garantiza que un dia digan cosas distintas — y la que se
 * desincroniza en silencio es justo la que lee Google. Aqui las dos salen del
 * MISMO objeto.
 *
 * Y los archivos de al lado importan: `image-slot.js`, `ProcedurePage.dc.html`,
 * `logo.png`. Copiar un `index.html` sin ellos deja la pagina EN BLANCO en
 * produccion, con un 404 silencioso y ningun error visible. Ya paso en este
 * sitio y esta anotado en CLAUDE.md.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITIO = "C:/Users/boo_v/Documents/sitio-drjasonvaldivia-live";
const BASE = "https://drjasonvaldivia.com";

/* UNA PLANTILLA POR IDIOMA, y no es una comodidad: es obligatorio.
 *
 * `ProcedurePage.dc.html` —el componente que pinta la página— está TRADUCIDO
 * dentro de cada carpeta: la inglesa dice "Home", "Book consultation",
 * "Frequently asked questions"; la española, no. Y el marco de `index.html`
 * (menú, botones, migas) va igual. Copiando la plantilla española a una página
 * inglesa sale una página con el texto en inglés y TODO EL MARCO en español —
 * se vio en local antes de subirla.
 *
 * Es la trampa que ya está anotada en CLAUDE.md desde que se trajo el sitio:
 * «los archivos que cada carpeta necesita al lado, `ProcedurePage.dc.html`
 * —distinto en cada carpeta—». Estaba escrita y aun así la repetí. */
const PLANTILLAS = {
  es: join(SITIO, "cirugia-de-tiroides"),
  en: join(SITIO, "gallbladder-surgery"),
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsStr = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, " ") + "'";

/** El trozo `d: { ... }` completo, contando llaves. Un corte por posicion fija
 *  se rompe en cuanto el contenido cambia de largo. */
function bloqueLlaves(s, desde) {
  const ini = s.indexOf("{", desde);
  let n = 0, dentro = null;
  for (let i = ini; i < s.length; i++) {
    const c = s[i];
    if (dentro) { if (c === "\\") i++; else if (c === dentro) dentro = null; continue; }
    if (c === "'" || c === '"' || c === "`") { dentro = c; continue; }
    if (c === "{") n++;
    else if (c === "}") { n--; if (n === 0) return [ini, i + 1]; }
  }
  throw new Error("no cierra el bloque");
}

/* Los rótulos fijos del bloque estático. Van aquí y no incrustados abajo
   porque este bloque es EL QUE LEE GOOGLE: una página en inglés con "Inicio",
   "Agendar consulta" y "Preguntas frecuentes" le dice al buscador que el
   idioma no es el que declara el `hreflang`, y eso vale más que el descuido
   estético. */
const ROTULOS = {
  es: { inicio: "Inicio", agendar: "Agendar consulta", wa: "WhatsApp citas", faq: "Preguntas frecuentes" },
  en: { inicio: "Home", agendar: "Book a consultation", wa: "WhatsApp", faq: "Frequently asked questions" },
};

function estatico(d, waHref, idioma = "es") {
  const t = ROTULOS[idioma] ?? ROTULOS.es;
  const li = (xs) => xs.map((x) => `<li>${esc(x)}</li>`).join("");
  return `<div class="pre-estatico">
  <nav class="pre-migas"><a href="/">${t.inicio}</a> / <span>${esc(d.breadcrumbLabel)}</span></nav>
  <p class="pre-kicker">${esc(d.kicker)}</p>
  <h1>${esc(d.title)}</h1>
  <p class="pre-lede">${esc(d.lede)}</p>
  <p class="pre-cta">
    <a class="pre-boton" href="/citas/">${t.agendar}</a>
    <a class="pre-boton pre-wa" href="${waHref}">${t.wa}</a>
  </p>
  <h2>${esc(d.symptomsTitle)}</h2>
  <p>${esc(d.symptomsIntro)}</p>
  <ul>${li(d.symptoms)}</ul>
  <h2>${esc(d.whenTitle)}</h2><p>${esc(d.whenText)}</p>
  <h2>${esc(d.procedureTitle)}</h2>
  <p>${esc(d.procedureIntro)}</p>
  <ol>${li(d.steps.map((p) => p.desc))}</ol>
  <p class="pre-nota"><strong>${esc(d.calloutStrong)}</strong> ${esc(d.calloutText)}</p>
  <h2>${esc(d.recoveryTitle)}</h2><p>${esc(d.recoveryText)}</p>
  <h2>${t.faq}</h2>${d.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
  <h2>${esc(d.finalTitle)}</h2><p>${esc(d.finalText)}</p>
  <p class="pre-cta"><a class="pre-boton" href="/citas/">${t.agendar}</a></p>
</div>`;
}

function objetoDatos(d, waHref, par) {
  const paso = (p) => `{ title: ${jsStr(p.title)}, desc: ${jsStr(p.desc)} }`;
  const faq = (f) => `{ q: ${jsStr(f.q)}, a: ${jsStr(f.a)} }`;
  return `{
        breadcrumbLabel: ${jsStr(d.breadcrumbLabel)},
        kicker: ${jsStr(d.kicker)},
        title: ${jsStr(d.title)},
        lede: ${jsStr(d.lede)},
        whatsappHref: ${jsStr(waHref)},
        /* El botón de cambiar idioma. Si hay pareja, lleva a ella; si no, a la
           página de citas — nunca a un enlace muerto. */
        altLangHref: ${par ? `'../${par}/index.html'` : "'/citas/'"},
        slotId: ${jsStr(d.slotId)},
        imagePlaceholder: ${jsStr(d.imagePlaceholder)},
        imageSrc: 'illus.png',
        symptomsTitle: ${jsStr(d.symptomsTitle)},
        symptomsIntro: ${jsStr(d.symptomsIntro)},
        symptoms: [${d.symptoms.map(jsStr).join(", ")}],
        whenTitle: ${jsStr(d.whenTitle)},
        whenText: ${jsStr(d.whenText)},
        procedureTitle: ${jsStr(d.procedureTitle)},
        procedureIntro: ${jsStr(d.procedureIntro)},
        steps: [${d.steps.map(paso).join(", ")}],
        calloutStrong: ${jsStr(d.calloutStrong)},
        calloutText: ${jsStr(d.calloutText)},
        recoveryTitle: ${jsStr(d.recoveryTitle)},
        recoveryText: ${jsStr(d.recoveryText)},
        faqs: [${d.faqs.map(faq).join(", ")}],
        finalTitle: ${jsStr(d.finalTitle)},
        finalText: ${jsStr(d.finalText)},
      }`;
}

function jsonLd(p, d, url, plantilla) {
  const fisico = JSON.parse(readFileSync(join(plantilla, "index.html"), "utf8")
    .match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  fisico.url = url;
  const proc = {
    "@context": "https://schema.org", "@type": "MedicalProcedure",
    name: d.kicker, alternateName: [d.breadcrumbLabel], url,
    procedureType: { "@type": "MedicalProcedureType", name: "Surgical procedure" },
    howPerformed: d.procedureIntro,
    preparation: d.whenText,
    followup: d.recoveryText,
  };
  const migas = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: (ROTULOS[p.idioma] ?? ROTULOS.es).inicio, item: BASE + "/" },
      { "@type": "ListItem", position: 2, name: d.breadcrumbLabel, item: url },
    ],
  };
  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: d.faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return [fisico, proc, migas, faq]
    .map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join("\n");
}

export function armar(pagina) {
  const { slug, figura, metaTitle, metaDescription, d, idioma = "es", par } = pagina;
  const url = `${BASE}/${slug}/`;
  const dir = join(SITIO, slug);
  mkdirSync(dir, { recursive: true });

  d.slotId = `${slug}-hero`;
  d.imagePlaceholder = `${idioma === "en" ? "Illustration" : "Ilustración"}: ${d.breadcrumbLabel.toLowerCase()}`;
  const saludo = idioma === "en"
    ? "Hello doctor, I have questions about "
    : "Hola doctor, tengo dudas sobre ";
  const waHref = `https://wa.me/523313470335?text=${encodeURIComponent(saludo + d.breadcrumbLabel.toLowerCase())}`;

  const plantilla = PLANTILLAS[idioma] ?? PLANTILLAS.es;
  let s = readFileSync(join(plantilla, "index.html"), "utf8");

  // 1. Cabecera
  s = s.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(metaTitle)}</title>`);
  s = s.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(metaDescription)}">`);
  s = s.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  /* hreflang en los DOS sentidos, y sólo si la pareja existe de verdad.
   *
   * Declarar un idioma que apunta a una página inexistente es peor que no
   * declararlo: Google lo trata como error de rastreo. Y declararlo en un solo
   * sentido es igual de malo por otra razón — sin la referencia de vuelta,
   * Google no acepta el par y trata las dos páginas como rivales por la misma
   * consulta; termina eligiendo una y enterrando la otra. */
  const urlEs = idioma === "es" ? url : (par ? `${BASE}/${par}/` : url);
  const urlEn = idioma === "en" ? url : (par ? `${BASE}/${par}/` : null);
  const alternos = urlEn
    ? `<link rel="alternate" hreflang="es" href="${urlEs}">\n<link rel="alternate" hreflang="en" href="${urlEn}">`
    : `<link rel="alternate" hreflang="es" href="${urlEs}">`;
  s = s.replace(/<link rel="alternate" hreflang="es"[^>]*>(\s*<link rel="alternate" hreflang="en"[^>]*>)?/, alternos);
  s = s.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(metaTitle)}">`);
  s = s.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(metaDescription)}">`);
  s = s.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);

  // 2. Datos estructurados: los cuatro bloques de una vez
  const ld = /<script type="application\/ld\+json">[\s\S]*?<\/script>(\s*<script type="application\/ld\+json">[\s\S]*?<\/script>)*/;
  s = s.replace(ld, jsonLd(pagina, d, url, plantilla));

  // 3. Bloque estatico (el que lee Google)
  const iEst = s.indexOf('<div class="pre-estatico">');
  const finEst = s.indexOf("</div>", s.indexOf("<p class=\"pre-cta\"><a class=\"pre-boton\" href=\"/citas/\">", iEst));
  s = s.slice(0, iEst) + estatico(d, waHref, idioma) + s.slice(finEst + 6);

  // 4. Objeto de datos (el que pinta el runtime) — del MISMO objeto que el estatico
  const iD = s.indexOf("d: {");
  const [ini, fin] = bloqueLlaves(s, iD);
  s = s.slice(0, ini) + objetoDatos(d, waHref, par) + s.slice(fin);

  if (idioma === "en") {
    s = s.replace(`<html lang="es">`, `<html lang="en">`);
    s = s.replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="en_US">`);
  }
  writeFileSync(join(dir, "index.html"), s, "utf8");

  // 5. Los archivos de al lado, SIN los cuales la pagina sale en blanco
  for (const f of ["ProcedurePage.dc.html", "image-slot.js", "logo.png"]) {
    copyFileSync(join(plantilla, f), join(dir, f));
  }
  /* La imagen. Una página en inglés comparte la de su pareja española: es el
     MISMO procedimiento, y dos fotos distintas para lo mismo se leerían como
     dos consultorios. Por eso se busca primero por el nombre propio y, si no
     está, por el de la pareja. */
  const IMGS = "C:/Users/boo_v/.claude/jobs/1690a97e/tmp/imagenes";
  const fig = [join(IMGS, `${slug}.png`), par ? join(IMGS, `${par}.png`) : null]
    .find((p) => p && existsSync(p));
  if (!fig) throw new Error(`falta la imagen de ${slug}`);
  copyFileSync(fig, join(dir, "illus.png"));

  return dir;
}

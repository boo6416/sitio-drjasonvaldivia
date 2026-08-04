/** Genera /aviso-de-privacidad/index.html a partir del texto legal del repo.
 *
 *  Se genera y no se escribe a mano para que el texto publicado sea EXACTAMENTE
 *  el del documento legal: un aviso de privacidad reescrito "para que se lea
 *  mejor" deja de ser el documento que el Dr. firmó.
 *
 *  ⚠ Se OMITE el último párrafo del .docx: es una nota interna de preparación
 *  del documento, no parte del aviso que ve el paciente.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const parrafos = JSON.parse(readFileSync(process.argv[2], "utf8"));
const salida = process.argv[3];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const esTitulo = (l) => /^\d{1,2}\.\s/.test(l);

const titulo = parrafos[0];
const subtitulo = parrafos[1];
// Fuera el último párrafo (nota interna de preparación).
const cuerpo = parrafos.slice(2, -1);

const bloques = [];
for (const l of cuerpo) {
  if (esTitulo(l)) {
    bloques.push(`  <h2>${esc(l)}</h2>`);
  } else if (/^Importante —/.test(l)) {
    bloques.push(`  <p class="destacado">${esc(l)}</p>`);
  } else {
    bloques.push(`  <p>${esc(l)}</p>`);
  }
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aviso de privacidad | Dr. Jason Valdivia · Puerto Vallarta</title>
<meta name="description" content="Aviso de privacidad integral del Dr. Jason Alejandro Valdivia Nájar, cirujano general en Puerto Vallarta. Qué datos se recaban, para qué, y cómo ejercer sus derechos ARCO.">
<link rel="canonical" href="https://drjasonvaldivia.com/aviso-de-privacidad/">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dr. Jason Valdivia — Cirujano General">
<meta property="og:title" content="Aviso de privacidad | Dr. Jason Valdivia">
<meta property="og:url" content="https://drjasonvaldivia.com/aviso-de-privacidad/">
<meta property="og:locale" content="es_MX">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans',sans-serif; background:#faf7f2; color:#14293a; }
  nav { position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center;
        padding:1.1rem 5%; background:rgba(13,43,62,0.96); backdrop-filter:blur(14px);
        border-bottom:1px solid rgba(255,180,150,0.12); flex-wrap:wrap; gap:.6rem; }
  nav a.marca { display:flex; align-items:center; gap:12px; text-decoration:none; }
  nav img { width:38px; height:38px; border-radius:50%; object-fit:cover; background:#fdf0ea; }
  .n1 { font-family:'Playfair Display',serif; color:#fdf0ea; font-size:1.05rem; font-weight:600; display:block; }
  .n2 { font-size:.62rem; color:rgba(255,255,255,.5); letter-spacing:.13em; text-transform:uppercase; }
  nav .vuelta { color:rgba(255,255,255,.75); text-decoration:none; font-size:.85rem; }
  header { background:#0d2b3e; padding:3.5rem 6% 2.5rem; text-align:center; }
  header h1 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,4vw,2.5rem); color:#fdf0ea; font-weight:500; }
  header p { color:rgba(255,255,255,.62); font-size:.92rem; margin-top:.8rem; font-weight:300; }
  main { max-width:780px; margin:0 auto; padding:3rem 6% 4rem; }
  main h2 { font-family:'Playfair Display',serif; font-size:1.25rem; color:#0d2b3e; font-weight:500;
            margin:2.4rem 0 .9rem; padding-bottom:.5rem; border-bottom:1px solid rgba(13,43,62,.12); }
  main h2:first-child { margin-top:0; }
  main p { color:#42535f; line-height:1.85; font-weight:300; font-size:.97rem; margin-bottom:1rem; }
  main p.destacado { background:#fff; border-left:3px solid #4f7ea8; padding:1rem 1.2rem; border-radius:0 8px 8px 0; }
  footer { background:#091f2d; padding:2.2rem 6%; display:flex; justify-content:space-between;
           align-items:center; flex-wrap:wrap; gap:1rem; }
  footer span { font-family:'Playfair Display',serif; color:#8ab4d6; font-size:.92rem; }
  footer p { color:rgba(255,255,255,.35); font-size:.76rem; }
  .cofepris { background:#0d2b3e; color:rgba(255,255,255,.55); font-size:.72rem; text-align:center;
              padding:1.1rem 6%; line-height:1.7; }
  .cofepris a { color:rgba(255,255,255,.75); }
</style>
</head>
<body>
<nav>
  <a class="marca" href="/">
    <img src="/images/logo.png" alt="Dr. Jason Valdivia Nájar">
    <span>
      <span class="n1">Dr. Jason Valdivia</span>
      <span class="n2">Cirujano General · Puerto Vallarta</span>
    </span>
  </a>
  <a class="vuelta" href="/">&larr; Volver al inicio</a>
</nav>

<header>
  <h1>${esc(titulo.charAt(0) + titulo.slice(1).toLowerCase())}</h1>
  <p>${esc(subtitulo)}</p>
</header>

<main>
${bloques.join("\n")}
</main>

<footer>
  <span>Dr. Jason Alejandro Valdivia Nájar</span>
  <p>Cirugía General y Laparoscopia &middot; &copy; 2026</p>
</footer>
<div class="cofepris">
  Aviso de publicidad COFEPRIS No. 2614082002A00062 &nbsp;·&nbsp;
  <a href="/aviso-de-privacidad/">Aviso de privacidad</a>
</div>
</body>
</html>
`;

mkdirSync(salida.replace(/\/[^/]+$/, ""), { recursive: true });
writeFileSync(salida, html);
console.log("generado:", salida, "·", html.length, "bytes ·", bloques.length, "bloques");

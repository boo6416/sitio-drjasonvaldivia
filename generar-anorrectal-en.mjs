/* Versiones en INGLES del grupo anorrectal (2026-08-16).
 *
 *  El mapeo de consultas mostro demanda real en ingles para esta zona:
 *  «pilonidal cyst removal cost puerto vallarta mexico», «hemorrhoid surgery
 *  puerto vallarta english speaking doctor». Puerto Vallarta recibe residentes
 *  extranjeros y turistas que buscan en su idioma, y para esta region en
 *  particular el pudor hace que busquen ANTES de llamar a nadie.
 *
 *  Cada una se empareja con su version en espanol por hreflang, igual que las
 *  paginas de procedimiento (/cirugia-de-vesicula/ ↔ /gallbladder-surgery/).
 *
 *  Mismas reglas del sitio: sin testimonios, sin promesas de resultado, aviso de
 *  publicidad en cada pagina, y el telefono que alguien contesta.
 */
import { writeFileSync, mkdirSync } from "node:fs";

const TEL = "+523339718620";
const TEL_VIS = "+52 33 3971 8620";
const AVISO = "2614082002A00062";
const BASE = "https://drjasonvaldivia.com";

const MEDICO = {
  "@type": "Physician",
  name: "Dr. Jason Alejandro Valdivia Nájar",
  description: "General surgeon certified by the Mexican Council of General Surgery, in Puerto Vallarta. Consultation available in English.",
  telephone: TEL,
  medicalSpecialty: "Surgical",
  availableLanguage: ["en", "es"],
  knowsLanguage: ["en", "es"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Francia 186, Col. Versalles",
    addressLocality: "Puerto Vallarta", addressRegion: "Jalisco",
    postalCode: "48310", addressCountry: "MX",
  },
  sameAs: [
    "https://www.instagram.com/drjasonvaldivia/",
    "https://www.facebook.com/profile.php?id=177835868736674",
    "https://maps.app.goo.gl/q8n5PdiaCsoAVkMv7",
    "https://www.doctoralia.com.mx/perfil/jason-alejandro-valdivia-najar",
  ],
  areaServed: { "@type": "City", name: "Puerto Vallarta" },
};

const PAGINAS = [
  {
    slug: "anal-fissure-puerto-vallarta", es: "fisura-anal",
    titulo: "Anal Fissure in Puerto Vallarta | English-Speaking Surgeon | Dr. Jason Valdivia",
    desc: "Anal fissure in Puerto Vallarta: sharp pain with bowel movements and bright red blood. Assessment and surgery when needed, with a board-certified general surgeon. Consultation in English.",
    h1: "Anal Fissure in Puerto Vallarta",
    kicker: "Sharp pain when passing stool · Bright red blood",
    cond: "Anal fissure",
    lede: "An anal fissure is a <b>small tear</b> in the lining of the anus. It is one of the most common causes of severe anal pain — and one of the most often mistaken for hemorrhoids. The treatment is not the same.",
    urg: false,
    secs: [
      ["What it feels like", `<p>The telling symptom is <b>pain when passing stool</b>: sharp,
        like a cut or broken glass, starting during the bowel movement and often
        lasting minutes or hours afterwards. There is usually <b>bright red
        blood</b> on the paper or on the stool, not mixed into it.</p>
        <p>Many people start delaying going to the bathroom because of the pain.
        That makes the stool harder and reopens the fissure — that is the cycle
        that has to be broken.</p>`],
      ["Why it happens", `<p>The usual cause is passing hard or bulky stool, most often from
        constipation. It also appears after bouts of diarrhoea, after childbirth,
        or alongside other conditions. A fissure that has not healed in a few
        weeks is called <b>chronic</b>, and there is usually a spasm of the
        sphincter keeping it open.</p>`],
      ["How it is treated", `<p><b>Most fissures heal without surgery.</b> Initial treatment
        softens the stool and relaxes the sphincter: fibre, water, sitz baths and
        topical medication. That resolves a good share of acute cases.</p>
        <p>Surgery is considered when the fissure has become chronic, when pain
        persists despite treatment, or when it keeps coming back. The usual
        procedure is a <b>lateral internal sphincterotomy</b>, which releases the
        spasm so the tear can close.</p>
        <p>Which one applies to you is decided after examining you, not before.</p>`],
    ],
    faq: [
      ["Is an anal fissure the same as hemorrhoids?", "No. Hemorrhoids are dilated veins; a fissure is a tear in the lining. They get confused because both bleed bright red, but fissure pain is far more intense and happens right when passing stool. Treatment differs, which is why it is worth being examined rather than self-treating."],
      ["Does it always need surgery?", "No. Most acute fissures heal with medical treatment: fibre, water, sitz baths and topical medication. Surgery is considered when the fissure becomes chronic or does not respond to that treatment."],
      ["I am visiting Puerto Vallarta — can this be handled here?", "Yes. Assessment and, if needed, treatment can be done here, and the consultation and written instructions are in English. If you are travelling soon, say so at the consultation: it changes what is advisable and when."],
    ],
  },
  {
    slug: "anal-fistula-puerto-vallarta", es: "fistula-anal",
    titulo: "Anal Fistula in Puerto Vallarta | English-Speaking Surgeon | Dr. Jason Valdivia",
    desc: "Anal fistula in Puerto Vallarta: persistent drainage or pus near the anus that will not settle. It requires surgery. Board-certified general surgeon, consultation in English.",
    h1: "Anal Fistula in Puerto Vallarta",
    kicker: "Persistent drainage · Usually follows an abscess",
    cond: "Anal fistula",
    lede: "An anal fistula is an <b>abnormal tunnel</b> connecting the inside of the anal canal with the skin around it. It almost always appears <b>after an abscess</b>, and unlike other anal conditions, <b>it does not close on its own</b>.",
    urg: false,
    secs: [
      ["What it feels like", `<p>The hallmark is <b>drainage that never quite ends</b>: pus,
        fluid or a little blood coming from a small opening in the skin near the
        anus, sometimes with an odour. It stains underwear and comes in waves —
        better for a few days, then back.</p>
        <p>There may be pain and swelling when the tunnel blocks and material
        builds up, then sudden relief when it drains. That repeating pattern of
        «swells, drains, settles» strongly suggests a fistula.</p>`],
      ["Where it comes from", `<p>Most arise from a <b>previous perianal abscess</b>: after
        drainage, a tract is left that does not heal. That is why a share of
        people who had an abscess later develop a fistula, even when the drainage
        was done correctly.</p>
        <p>Some fistulas are associated with other conditions, such as
        inflammatory bowel disease. That changes the plan, and it is one reason
        the whole case needs assessing — not just the opening.</p>`],
      ["How it is treated", `<p><b>A fistula requires surgery.</b> No medication closes the
        tract; antibiotics can control an added infection but do not resolve the
        fistula.</p>
        <p>The technique depends on where the tract runs in relation to the
        sphincter, and that is what is studied before operating: simple fistulas
        can be laid open (<b>fistulotomy</b>), while more complex ones may need a
        <b>seton</b> or other techniques to protect continence.</p>
        <p>That distinction matters more than the fistula itself: the goal is to
        close the tract <i>without</i> compromising bowel control.</p>`],
    ],
    faq: [
      ["Can an anal fistula heal without surgery?", "No. The tract is lined and does not close by itself. Antibiotics can control an added infection and relieve symptoms for a time, but the fistula remains and the drainage returns."],
      ["I had an abscess drained and pus keeps coming — is that normal?", "It is common and often means a fistula was left behind. It is worth assessing: it does not mean the drainage was done badly, it is a known course after abscesses."],
      ["Will fistula surgery affect bowel control?", "That is exactly the risk considered when choosing the technique, which is why it matters to know where the tract runs before operating. At the consultation you are told which technique applies to your case and why."],
    ],
  },
  {
    slug: "perianal-abscess-puerto-vallarta", es: "absceso-perianal",
    titulo: "Perianal Abscess in Puerto Vallarta | Urgent Care | Dr. Jason Valdivia",
    desc: "Perianal abscess in Puerto Vallarta: severe pain, a hard swollen lump next to the anus, sometimes with fever. This is a surgical urgency and needs drainage. English-speaking surgeon.",
    h1: "Perianal Abscess in Puerto Vallarta",
    kicker: "Surgical urgency · Needs drainage",
    cond: "Perianal abscess",
    lede: "A perianal abscess is a <b>collection of pus</b> next to the anus. It hurts a great deal, worsens quickly, and <b>antibiotics alone will not fix it</b> — it has to be drained. This is one of the few things here that should not wait.",
    urg: true,
    secs: [
      ["When to be seen the same day", `<p>A perianal abscess is suspected when there is
        <b>severe, constant pain</b> beside the anus — not only when passing stool
        — with a <b>hard, hot, swollen lump</b>. Many patients say they
        <b>cannot sit down</b> or sleep.</p>
        <p>Seek care <b>the same day</b> if there is also <b>fever or chills</b>,
        if the pain increases hour by hour, or if you feel generally unwell. In
        people with diabetes or a weakened immune system the urgency is greater,
        because the infection spreads faster.</p>`],
      ["Why antibiotics alone are not enough", `<p>Pooled pus sits in a closed cavity that
        antibiotics reach poorly. They may bring the fever down and give an
        impression of improvement while the collection keeps growing inside.</p>
        <p>The treatment is <b>drainage</b>: opening and evacuating the pus. Pain
        relief is usually immediate and obvious. Antibiotics accompany treatment
        in some cases, but they do not replace drainage.</p>`],
      ["What happens afterwards", `<p>After drainage the wound is left to heal from the
        inside out, with dressings. It is important to know that <b>a share of
        abscesses later leave an <a href="/anal-fistula-puerto-vallarta/">anal
        fistula</a></b>: that does not mean anything was done wrong, it is a known
        course.</p>
        <p>If weeks later pus or discharge still comes from a small opening, that
        is assessed separately and has its own treatment.</p>`],
    ],
    faq: [
      ["Is a perianal abscess an emergency?", "Yes. It is an advancing infection and the treatment is to drain it. If there is fever, pain that increases hour by hour, or you cannot sit down, seek care the same day."],
      ["I am a tourist and this started on holiday — what do I do?", "Message or call directly. This is not something to fly home with: an untreated abscess gets worse, and flying with one is uncomfortable and unwise. It can be assessed and drained here, in English."],
      ["Can it burst on its own and that is the end of it?", "It sometimes drains on its own and the pain eases, but that does not guarantee the cavity emptied fully, and it is exactly the situation where a fistula tends to remain. Even if it drained on its own, have it assessed."],
    ],
  },
  {
    slug: "pilonidal-cyst-puerto-vallarta", es: "quiste-pilonidal",
    titulo: "Pilonidal Cyst Surgery in Puerto Vallarta | Dr. Jason Valdivia",
    desc: "Pilonidal cyst in Puerto Vallarta: a lump or drainage at the top of the buttock crease, near the tailbone. Assessment and surgery with a board-certified general surgeon. English spoken.",
    h1: "Pilonidal Cyst in Puerto Vallarta",
    kicker: "Top of the buttock crease · Near the tailbone",
    cond: "Pilonidal cyst",
    lede: "A pilonidal cyst is a cavity that forms in the <b>upper crease of the buttocks</b>, usually with hair inside. It is not at the anus — it sits higher, near the tailbone — and it is frequently mistaken for an anal abscess.",
    urg: false,
    secs: [
      ["Who gets it and how it feels", `<p>It appears mostly in <b>younger people</b>, more
        often men, and is associated with long hours sitting — drivers, desk work,
        long flights — and with heavy hair growth in the area.</p>
        <p>It may show only as a <b>small pit or lump</b> that does not bother
        anyone, or it can flare: pain, swelling, redness and <b>pus with an
        odour</b>. Many describe it as a boil that comes and goes.</p>`],
      ["Why it comes back", `<p>When only the flare is drained, the episode settles but
        <b>the cavity and the hair are still there</b>, so it is normal for it to
        return months later. That is why so many people carry this for years as
        «that thing that flares up now and then».</p>
        <p>Resolving it properly means removing the cavity and its tracts, not
        just emptying the pus.</p>`],
      ["How it is treated", `<p>If it is acutely infected, it is drained first to relieve
        pain. Definitive surgery is scheduled afterwards, once the area is free of
        active infection.</p>
        <p>There are several excision and closure techniques, and the choice
        depends on size, how many tracts there are, and whether it has been
        operated before. Recovery and wound care differ quite a bit between them,
        so they are explained before deciding.</p>
        <p>Hair care in the area after surgery is part of the treatment, not a
        detail: it affects whether it returns.</p>`],
    ],
    faq: [
      ["Is a pilonidal cyst the same as an anal abscess?", "No, though they are confused. The pilonidal sits at the top of the buttock crease near the tailbone; a perianal abscess sits beside the anus. Location is what tells them apart, and treatment differs."],
      ["It was drained and it came back — why?", "Because drainage settles the infection but leaves the cavity. That is the typical course when only drainage is done: to stop it returning, the cavity and its tracts have to be removed."],
      ["How much time off will I need?", "It depends on the technique and on your work, especially how much sitting it involves. That is worth raising at the consultation before scheduling, so the date is chosen with it in mind."],
    ],
  },
];

const css = `*{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'DM Sans',system-ui,-apple-system,sans-serif;color:#123549;line-height:1.75;background:#faf7f2}
  .env{max-width:780px;margin:0 auto;padding:2.4rem 6% 3.5rem}
  h1{font-family:Georgia,serif;font-size:clamp(1.8rem,5vw,2.35rem);line-height:1.2;margin:.5rem 0 1rem;color:#0d2b3e;font-weight:600}
  h2{font-family:Georgia,serif;font-size:1.3rem;margin:2.1rem 0 .6rem;color:#0d2b3e;font-weight:600}
  h3{font-size:1rem;margin:1.3rem 0 .25rem;color:#0d2b3e}
  a{color:#2f6690} ul{margin:.4rem 0 0 1.15rem} li{margin-bottom:.35rem}
  .kicker{font-size:.78rem;letter-spacing:.09em;text-transform:uppercase;color:#4f7ea8}
  .boton{display:inline-block;background:#0d2b3e;color:#fdf0ea;text-decoration:none;padding:.75rem 1.4rem;border-radius:6px;margin:.35rem .45rem .35rem 0;font-weight:600}
  .urgente{background:#fdece7;border-left:4px solid #c2410c;padding:1rem 1.15rem;border-radius:0 8px 8px 0;margin:1.3rem 0}
  .urgente .boton{background:#c2410c}
  .nota{background:#f2ede6;border-left:3px solid #4f7ea8;padding:.9rem 1.1rem;border-radius:0 8px 8px 0;margin:1.2rem 0}
  .pie{margin-top:2.4rem;padding-top:1.1rem;border-top:1px solid rgba(13,43,62,.14);font-size:.9rem;color:#456}`;

const otras = (slug) => [
  ["/hemorrhoid-surgery-puerto-vallarta/", "Hemorrhoids"],
  ["/anal-fissure-puerto-vallarta/", "Anal fissure"],
  ["/anal-fistula-puerto-vallarta/", "Anal fistula"],
  ["/perianal-abscess-puerto-vallarta/", "Perianal abscess"],
  ["/pilonidal-cyst-puerto-vallarta/", "Pilonidal cyst"],
].filter(([h]) => h !== `/${slug}/`).map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("\n    ");

for (const p of PAGINAS) {
  const url = `${BASE}/${p.slug}/`;
  const urlEs = `${BASE}/${p.es}/`;
  const ld = [
    { "@context": "https://schema.org", ...MEDICO, url },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/en/" },
      { "@type": "ListItem", position: 2, name: p.cond, item: url },
    ]},
    { "@context": "https://schema.org", "@type": "MedicalCondition", name: p.cond,
      associatedAnatomy: { "@type": "AnatomicalStructure", name: "Anorectal region" },
      possibleTreatment: { "@type": "MedicalTherapy", name: "Medical and surgical treatment", provider: { "@type": "Physician", name: MEDICO.name, url: BASE + "/en/" } },
      inLanguage: "en" },
    { "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];

  const urgencia = p.urg
    ? `<div class="urgente">
    <b>If you have a fever, pain that increases hour by hour, or you cannot sit
    down:</b> message or call directly. A perianal abscess is seen the
    <b>same day</b> — it is not something to leave until next week.
    <p style="margin-top:.7rem">
      <a class="boton" href="https://wa.me/523339718620">WhatsApp ${TEL_VIS}</a>
      <a class="boton" href="tel:${TEL}">Call now</a>
    </p>
  </div>`
    : `<p>
    <a class="boton" href="/citas/">Book an assessment</a>
    <a class="boton" href="https://wa.me/523339718620">WhatsApp ${TEL_VIS}</a>
  </p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.titulo}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="es" href="${urlEs}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dr. Jason Valdivia — General Surgeon">
<meta property="og:title" content="${p.titulo}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/images/dr-office-portrait.jpg">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<style>${css}</style>
</head>
<body>
<div class="env">

  <nav class="kicker"><a href="/en/">Home</a> / ${p.cond} · <a href="${urlEs}">Español</a></nav>
  <p class="kicker">${p.kicker}</p>
  <h1>${p.h1}</h1>

  <p>${p.lede}</p>

${urgencia}

${p.secs.map(([t, h]) => `  <h2>${t}</h2>\n  ${h}`).join("\n\n")}

  <h2>Frequently asked questions</h2>
${p.faq.map(([q, a]) => `  <h3>${q}</h3>\n  <p>${a}</p>`).join("\n")}

  <div class="nota">
    <b>This page informs, it does not diagnose.</b> Several conditions in this
    area look alike and are frequently confused — even with each other. What is
    described here helps you orient yourself; what you have, and what you need,
    is determined by examining you.
  </div>

  <h2>Other conditions in this area</h2>
  <ul>
    ${otras(p.slug)}
  </ul>

  <h2>The office</h2>
  <p>Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.<br>
  Monday to Thursday 2:00–5:00 pm and 7:00–8:00 pm · Friday 2:00–8:00 pm.<br>
  Phone and WhatsApp: <a href="tel:${TEL}">${TEL_VIS}</a>.<br>
  Initial consultation: <b>$800 MXN</b>. Major medical
  <a href="/seguros/">insurance</a> accepted, as well as private payment.<br>
  Consultation, surgical planning and follow-up in <b>English</b>.</p>

  <p class="pie">
    Dr. Jason Alejandro Valdivia Nájar · General Surgeon · Puerto Vallarta, Jalisco, Mexico<br>
    Aviso de publicidad COFEPRIS ${AVISO} ·
    <a href="/aviso-de-privacidad/">Privacy notice</a> ·
    <a href="/credenciales/">Credentials</a> ·
    <a href="/en/">English home</a>
  </p>

</div>
</body>
</html>
`;
  mkdirSync(p.slug, { recursive: true });
  writeFileSync(`${p.slug}/index.html`, html);
  console.log(`  ✓ /${p.slug}/  ↔  /${p.es}/`);
}
console.log(`\n${PAGINAS.length} página(s) en inglés generada(s)`);

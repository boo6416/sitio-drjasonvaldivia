/* Genera las páginas del grupo anorrectal (2026-08-16).
 *
 *  POR QUÉ EXISTEN. El mapeo de 302 consultas reales de paciente dejó ~180 sin
 *  cobertura, y el grupo más grande —y el de mayor urgencia emocional— era éste:
 *  fisura, fístula, absceso perianal y quiste pilonidal. El sitio tenía
 *  hemorroides y nada más. Ningún competidor de Vallarta lo cubre bien tampoco.
 *
 *  El Dr. confirmó el 2026-08-16 que realiza los cuatro. NO se incluyó mama, que
 *  también salió en la demanda, porque dijo expresamente que no la opera.
 *
 *  POR QUÉ PÁGINAS SEPARADAS Y NO UNA SOLA. Son cuatro padecimientos distintos:
 *  distinto síntoma, distinta urgencia, distinta población y distinto
 *  tratamiento. Un absceso es una urgencia de hoy; un quiste pilonidal es una
 *  molestia de meses. Meterlos juntos serviría al médico y no al paciente, que
 *  busca exactamente lo suyo.
 *
 *  POR QUÉ NO SE HIZO LO MISMO CON COLECISTITIS NI APENDICITIS. Ahí el sitio YA
 *  posiciona con `/cirugia-de-vesicula/` y `/cirugia-de-apendice/`. Una página
 *  nueva sobre el mismo tema competiría contra la que ya funciona y bajarían las
 *  dos. Cubrir un hueco es una cosa; fabricarse un competidor propio es otra.
 *
 *  REGLAS DEL SITIO QUE SE RESPETAN AQUÍ (ver README): sin testimonios, sin
 *  promesas de resultado, aviso de publicidad en cada página, y el teléfono es
 *  el que alguien contesta (33 3971 8620).
 */
import { writeFileSync, mkdirSync } from "node:fs";

const TEL = "+523339718620";
const TEL_VISIBLE = "33 3971 8620";
const AVISO = "2614082002A00062";
const BASE = "https://drjasonvaldivia.com";

const MEDICO = {
  "@type": "Physician",
  name: "Dr. Jason Alejandro Valdivia Nájar",
  url: BASE + "/",
  telephone: TEL,
  medicalSpecialty: "Surgical",
  availableLanguage: ["es", "en"],
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
    slug: "fisura-anal",
    titulo: "Fisura anal en Puerto Vallarta | Dolor al evacuar | Dr. Jason Valdivia",
    desc: "Fisura anal en Puerto Vallarta: dolor intenso al evacuar y sangrado rojo brillante. Valoración y cirugía cuando hace falta, con Cirujano General certificado.",
    h1: "Fisura anal en Puerto Vallarta",
    kicker: "Dolor al evacuar · Sangrado rojo brillante",
    condicion: "Fisura anal",
    lede: "Una fisura anal es una <b>pequeña desgarradura</b> en el revestimiento del ano. Es de las causas más frecuentes de dolor anal intenso, y de las que más se confunde con hemorroides — el tratamiento no es el mismo.",
    urgente: false,
    secciones: [
      ["Cómo se siente", `<p>El síntoma que la distingue es el <b>dolor al evacuar</b>: agudo,
        tipo cortada o vidrio, que empieza durante la evacuación y puede seguir
        minutos u horas después. Suele acompañarse de <b>sangre roja brillante</b>
        en el papel o sobre el excremento, no mezclada con él.</p>
        <p>Muchos pacientes empiezan a posponer ir al baño por miedo al dolor. Eso
        endurece más el excremento y vuelve a abrir la fisura: es el círculo que
        hay que romper.</p>`],
      ["De dónde sale", `<p>La causa más común es el paso de excremento duro o de gran
        volumen, casi siempre por estreñimiento. También aparece tras episodios de
        diarrea, después del parto, o asociada a otros padecimientos. Cuando una
        fisura no cicatriza en unas semanas se le llama <b>crónica</b>, y ahí
        suele haber un espasmo del esfínter que impide que cierre.</p>`],
      ["Cómo se trata", `<p><b>La mayoría de las fisuras cierran sin cirugía.</b> El
        tratamiento inicial busca ablandar el excremento y relajar el esfínter:
        fibra, agua, baños de asiento y medicamento tópico. Eso resuelve buena
        parte de los casos agudos.</p>
        <p>La cirugía se valora cuando la fisura ya es crónica, cuando el dolor no
        cede pese al tratamiento, o cuando reaparece una y otra vez. El
        procedimiento habitual es la <b>esfinterotomía lateral interna</b>, que
        libera el espasmo para que la herida pueda cerrar.</p>
        <p>Cuál corresponde en su caso se decide después de explorarlo, no antes.</p>`],
    ],
    faq: [
      ["¿La fisura anal es lo mismo que hemorroides?", "No. Las hemorroides son venas dilatadas; la fisura es una desgarradura del revestimiento. Se confunden porque las dos sangran en rojo brillante, pero el dolor de la fisura es mucho más intenso y ocurre justo al evacuar. El tratamiento es distinto, y por eso conviene que alguien la explore en vez de automedicarse."],
      ["¿Siempre se opera?", "No. La mayoría de las fisuras agudas cierran con tratamiento médico: fibra, agua, baños de asiento y medicamento tópico. La cirugía se valora cuando la fisura se vuelve crónica o cuando no responde a ese tratamiento."],
      ["¿Cuánto dura el dolor después de operarse?", "Varía entre pacientes. Lo habitual es que el dolor de la fisura mejore notablemente en los primeros días tras la cirugía, y que la molestia de la herida ceda de forma progresiva. En la consulta se le explica qué esperar en su caso concreto."],
      ["¿Se puede prevenir que vuelva?", "El punto principal es no volver al estreñimiento: fibra, líquidos y no posponer la evacuación. Esa parte depende de usted y es la que más pesa a largo plazo."],
    ],
  },
  {
    slug: "fistula-anal",
    titulo: "Fístula anal en Puerto Vallarta | Salida de pus | Dr. Jason Valdivia",
    desc: "Fístula anal en Puerto Vallarta: salida de pus o secreción cerca del ano que no cede. Requiere cirugía. Valoración con Cirujano General certificado.",
    h1: "Fístula anal en Puerto Vallarta",
    kicker: "Secreción persistente · Suele venir tras un absceso",
    condicion: "Fístula anal",
    lede: "Una fístula anal es un <b>túnel anormal</b> que comunica el interior del canal anal con la piel de alrededor. Casi siempre aparece <b>después de un absceso</b>, y a diferencia de otros padecimientos anales, <b>no cierra sola</b>.",
    urgente: false,
    secciones: [
      ["Cómo se siente", `<p>Lo más característico es la <b>secreción que no termina</b>:
        sale pus, líquido o algo de sangre por un orificio pequeño en la piel
        cercana al ano, a veces con mal olor. Mancha la ropa interior y aparece por
        temporadas — mejora unos días y vuelve.</p>
        <p>Puede haber dolor e hinchazón cuando el túnel se tapa y se acumula
        material, y alivio brusco cuando drena. Ese patrón de «se inflama, drena y
        se calma» que se repite es muy sugerente de fístula.</p>`],
      ["De dónde sale", `<p>La mayoría surge de un <b>absceso perianal previo</b>: al
        drenar, queda un trayecto que no cicatriza. Por eso una parte de quienes
        tuvieron un absceso desarrollan después una fístula, aunque el drenaje
        haya sido correcto.</p>
        <p>Hay fístulas asociadas a otros padecimientos, como la enfermedad
        inflamatoria intestinal. Eso cambia el plan, y es una de las razones por
        las que hace falta valorar el caso completo y no sólo el orificio.</p>`],
      ["Cómo se trata", `<p><b>La fístula requiere cirugía.</b> No hay tratamiento con
        medicamento que cierre el trayecto; los antibióticos controlan una
        infección agregada, pero no resuelven la fístula.</p>
        <p>La técnica depende de por dónde pasa el trayecto respecto al esfínter,
        y eso es lo que se estudia antes de operar: hay fístulas simples que se
        resuelven abriendo el trayecto (<b>fistulotomía</b>) y otras, más
        complejas, en las que se usa un <b>sedal</b> u otras técnicas para
        proteger la continencia.</p>
        <p>Esa distinción importa más que la fístula en sí: el objetivo es cerrar
        el trayecto <i>sin</i> comprometer el control de esfínteres.</p>`],
    ],
    faq: [
      ["¿Una fístula anal puede curarse sin cirugía?", "No. El trayecto está revestido y no cierra por sí solo. Los antibióticos pueden controlar una infección agregada y quitar molestias por un tiempo, pero la fístula sigue ahí y la secreción vuelve."],
      ["Ya me drenaron un absceso y sigo con salida de pus, ¿es normal?", "Es una situación frecuente y suele significar que quedó una fístula. Conviene valorarla: no es que el drenaje se haya hecho mal, es una evolución conocida de los abscesos."],
      ["¿La cirugía de fístula afecta el control para ir al baño?", "Ése es justamente el riesgo que se cuida al elegir la técnica, y por eso importa saber por dónde pasa el trayecto respecto al esfínter antes de operar. En la consulta se le explica qué técnica corresponde a su caso y por qué."],
      ["¿Cuánto tarda en sanar?", "La herida de una fístula suele cicatrizar de dentro hacia afuera y lleva semanas de curaciones. Es más lento que otras cirugías anales, y saberlo desde el principio evita sustos a mitad del proceso."],
    ],
  },
  {
    slug: "absceso-perianal",
    titulo: "Absceso perianal en Puerto Vallarta | Urgencia | Dr. Jason Valdivia",
    desc: "Absceso perianal en Puerto Vallarta: dolor intenso, bulto e hinchazón junto al ano, a veces con fiebre. Es una urgencia quirúrgica: requiere drenaje.",
    h1: "Absceso perianal en Puerto Vallarta",
    kicker: "Urgencia quirúrgica · Requiere drenaje",
    condicion: "Absceso perianal",
    lede: "Un absceso perianal es una <b>acumulación de pus</b> junto al ano. Duele mucho, empeora rápido y <b>no se resuelve con antibiótico solo</b>: necesita drenarse. Es una de las pocas cosas de esta lista que no debe esperar.",
    urgente: true,
    secciones: [
      ["Cuándo buscar atención el mismo día", `<p>Un absceso perianal se sospecha cuando hay
        <b>dolor intenso y constante</b> junto al ano —no sólo al evacuar—, con un
        <b>bulto duro, caliente e hinchado</b>. Muchos pacientes describen que
        <b>no pueden sentarse</b> ni dormir.</p>
        <p>Busque atención <b>el mismo día</b> si además hay <b>fiebre o
        escalofríos</b>, si el dolor aumenta hora con hora, o si se siente
        decaído. En personas con diabetes o con las defensas bajas la urgencia es
        mayor, porque la infección avanza más rápido.</p>`],
      ["Por qué el antibiótico solo no basta", `<p>El pus acumulado está en una cavidad
        cerrada a la que el antibiótico llega mal. Puede bajar la fiebre y dar la
        impresión de mejoría, mientras la colección sigue creciendo por dentro.</p>
        <p>El tratamiento es el <b>drenaje</b>: abrir y evacuar el pus. El alivio
        del dolor suele ser inmediato y notorio. El antibiótico acompaña en
        algunos casos, pero no sustituye al drenaje.</p>`],
      ["Qué pasa después", `<p>Tras el drenaje la herida se deja cicatrizar de dentro
        hacia afuera, con curaciones. Es importante saber que <b>una parte de los
        abscesos deja después una <a href="/fistula-anal/">fístula anal</a></b>:
        no significa que algo se hiciera mal, es una evolución conocida.</p>
        <p>Si semanas después sigue saliendo pus o secreción por un orificio
        pequeño, eso se valora aparte y tiene su propio tratamiento.</p>`],
    ],
    faq: [
      ["¿El absceso perianal es una urgencia?", "Sí. Es una infección que avanza y el tratamiento es drenarla. Si hay fiebre, dolor que aumenta hora con hora, o no puede sentarse del dolor, busque atención el mismo día."],
      ["¿Se puede reventar solo y ya?", "A veces drena solo y el dolor cede, pero eso no garantiza que la cavidad se haya vaciado por completo, y es justo la situación en la que suele quedar una fístula. Aunque haya drenado solo, conviene valorarlo."],
      ["¿Me van a dormir por completo?", "Depende del tamaño y la localización. Algunos abscesos se drenan con anestesia local y otros requieren anestesia regional o general. Se le explica antes, no en el momento."],
      ["Tengo diabetes, ¿cambia algo?", "Sí. En diabetes y en personas con defensas bajas la infección puede avanzar más rápido y extenderse. Es una razón para no esperar."],
    ],
  },
  {
    slug: "quiste-pilonidal",
    titulo: "Quiste pilonidal en Puerto Vallarta | Cirugía | Dr. Jason Valdivia",
    desc: "Quiste pilonidal en Puerto Vallarta: bulto o secreción en la parte alta de los glúteos. Valoración y cirugía con Cirujano General certificado.",
    h1: "Quiste pilonidal en Puerto Vallarta",
    kicker: "Parte alta del pliegue de los glúteos",
    condicion: "Quiste pilonidal",
    lede: "El quiste pilonidal es una cavidad que se forma en el <b>pliegue superior de los glúteos</b>, casi siempre con pelo dentro. No está en el ano — está más arriba, en el coxis — y se confunde seguido con un absceso anal.",
    urgente: false,
    secciones: [
      ["A quién le da y cómo se siente", `<p>Aparece sobre todo en <b>gente joven</b>, más en
        hombres, y se asocia a pasar muchas horas sentado —choferes, oficina, viajes
        largos— y a tener vello abundante en la zona.</p>
        <p>Puede dar sólo un <b>hoyito o bultito</b> que no molesta, o inflamarse:
        entonces hay dolor, hinchazón, enrojecimiento y <b>salida de pus</b> con mal
        olor. Muchos pacientes lo describen como «un nacido» que va y viene.</p>`],
      ["Por qué vuelve", `<p>Cuando sólo se drena la inflamación, se resuelve el episodio
        pero <b>la cavidad y los pelos siguen ahí</b>, así que es normal que
        reaparezca meses después. Ése es el motivo de que tanta gente lleve años
        con «eso que se me inflama cada tanto».</p>
        <p>Resolverlo de fondo implica quitar la cavidad y sus trayectos, no sólo
        vaciar el pus.</p>`],
      ["Cómo se trata", `<p>Si está agudamente infectado, primero se drena para quitar el
        dolor. La cirugía definitiva se programa después, con la zona ya sin
        infección activa.</p>
        <p>Existen varias técnicas de resección y cierre, y la elección depende del
        tamaño, de cuántos trayectos haya y de si ya lo operaron antes. La
        recuperación y los cuidados de la herida cambian bastante entre una y
        otra, así que se explican antes de decidir.</p>
        <p>El cuidado del vello de la zona después de operar es parte del
        tratamiento, no un detalle: influye en que no vuelva.</p>`],
    ],
    faq: [
      ["¿El quiste pilonidal es lo mismo que un absceso anal?", "No, aunque se confunden. El pilonidal está en la parte alta del pliegue de los glúteos, cerca del coxis; el absceso perianal está junto al ano. La ubicación es lo que los distingue, y el tratamiento es distinto."],
      ["Me lo drenaron y volvió, ¿por qué?", "Porque el drenaje resuelve el episodio de infección pero deja la cavidad. Es la evolución típica cuando sólo se drena: para que no regrese hay que retirar la cavidad y sus trayectos."],
      ["¿Cuánto tiempo de incapacidad necesito?", "Depende de la técnica y de su trabajo, sobre todo de cuánto tenga que estar sentado. Es una de las cosas que conviene plantear en la consulta antes de programar, para elegir la fecha con eso en mente."],
      ["¿Puedo evitar que vuelva?", "El cuidado del vello de la zona y la higiene reducen las recurrencias. Es parte del tratamiento y se le explica cómo hacerlo."],
    ],
  },
];

/* La página paraguas. Existe por una consulta concreta: «proctólogo en Puerto
   Vallarta». La gente la busca — pero el Dr. NO es proctólogo, es Cirujano
   General, y la página lo dice con todas sus letras. Capturar la búsqueda sin
   colgarse un título que no se tiene. */
const HUB = {
  slug: "cirugia-anorrectal",
  titulo: "Cirugía anorrectal en Puerto Vallarta | Hemorroides, fisura, fístula | Dr. Jason Valdivia",
  desc: "Cirugía anorrectal en Puerto Vallarta: hemorroides, fisura anal, fístula anal, absceso perianal y quiste pilonidal. Cirujano General certificado.",
  h1: "Cirugía anorrectal en Puerto Vallarta",
  kicker: "Hemorroides · Fisura · Fístula · Absceso · Quiste pilonidal",
};

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
  ["/cirugia-de-hemorroides/", "Hemorroides"],
  ["/fisura-anal/", "Fisura anal"],
  ["/fistula-anal/", "Fístula anal"],
  ["/absceso-perianal/", "Absceso perianal"],
  ["/quiste-pilonidal/", "Quiste pilonidal"],
  ["/cirugia-anorrectal/", "Todas las de esta zona"],
].filter(([h]) => h !== `/${slug}/`)
 .map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("\n    ");

const pie = `<p class="pie">
    Dr. Jason Alejandro Valdivia Nájar · Cirujano General · Puerto Vallarta, Jalisco<br>
    Aviso de publicidad COFEPRIS ${AVISO} ·
    <a href="/aviso-de-privacidad/">Aviso de privacidad</a> ·
    <a href="/credenciales/">Credenciales</a> ·
    <a href="/en/">English</a>
  </p>`;

function bloqueUrgencia(esUrgente) {
  if (esUrgente) {
    return `<div class="urgente">
    <b>Si tiene fiebre, el dolor aumenta hora con hora o no puede sentarse:</b>
    escriba o llame directamente. Un absceso perianal se atiende <b>el mismo
    día</b> — no es algo que convenga dejar para la próxima semana.
    <p style="margin-top:.7rem">
      <a class="boton" href="https://wa.me/523339718620">WhatsApp ${TEL_VISIBLE}</a>
      <a class="boton" href="tel:${TEL}">Llamar ahora</a>
    </p>
  </div>`;
  }
  return `<p>
    <a class="boton" href="/citas/">Agendar valoración</a>
    <a class="boton" href="https://wa.me/523339718620">WhatsApp ${TEL_VISIBLE}</a>
  </p>`;
}

function generar(p) {
  const url = `${BASE}/${p.slug}/`;
  const ld = [
    { "@context": "https://schema.org", ...MEDICO, url },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: "Cirugía anorrectal", item: BASE + "/cirugia-anorrectal/" },
        { "@type": "ListItem", position: 3, name: p.condicion, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "MedicalCondition",
      name: p.condicion,
      associatedAnatomy: { "@type": "AnatomicalStructure", name: "Región anorrectal" },
      possibleTreatment: { "@type": "MedicalTherapy", name: "Tratamiento médico y quirúrgico", provider: { "@type": "Physician", name: MEDICO.name, url: BASE + "/" } },
      inLanguage: "es-MX",
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];

  const cuerpo = p.secciones.map(([t, html]) => `  <h2>${t}</h2>\n  ${html}`).join("\n\n");
  const faqHtml = p.faq.map(([q, a]) => `  <h3>${q}</h3>\n  <p>${a}</p>`).join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.titulo}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dr. Jason Valdivia — Cirujano General">
<meta property="og:title" content="${p.titulo}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/images/dr-office-portrait.jpg">
<meta property="og:locale" content="es_MX">
<meta name="twitter:card" content="summary_large_image">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<style>${css}</style>
</head>
<body>
<div class="env">

  <nav class="kicker"><a href="/">Inicio</a> / <a href="/cirugia-anorrectal/">Cirugía anorrectal</a> / ${p.condicion}</nav>
  <p class="kicker">${p.kicker}</p>
  <h1>${p.h1}</h1>

  <p>${p.lede}</p>

${bloqueUrgencia(p.urgente)}

${cuerpo}

  <h2>Preguntas frecuentes</h2>
${faqHtml}

  <div class="nota">
    <b>Esta página informa, no diagnostica.</b> Varios padecimientos de esta zona
    se parecen entre sí y se confunden con frecuencia — incluso entre ellos. Lo
    que aquí se describe sirve para orientarse; qué tiene usted y qué le
    corresponde se determina explorándolo.
  </div>

  <h2>Otros padecimientos de esta zona</h2>
  <ul>
    ${otras(p.slug)}
  </ul>

  <h2>Consultorio</h2>
  <p>Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.<br>
  Lunes a jueves 14:00–17:00 y 19:00–20:00 · Viernes 14:00–20:00.<br>
  Teléfono y WhatsApp: <a href="tel:${TEL}">${TEL_VISIBLE}</a>.<br>
  Consulta de valoración: <b>$800 MXN</b>. Se aceptan
  <a href="/seguros/">seguros de gastos médicos mayores</a> y pago particular.</p>

  ${pie}

</div>
</body>
</html>
`;
}

function generarHub() {
  const url = `${BASE}/${HUB.slug}/`;
  const ld = [
    { "@context": "https://schema.org", ...MEDICO, url },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: BASE + "/" },
        { "@type": "ListItem", position: 2, name: "Cirugía anorrectal", item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [
        ["¿Usted es proctólogo?", "No. El Dr. Jason Valdivia es Cirujano General certificado por el Consejo Mexicano de Cirugía General. La cirugía de la región anal y del recto forma parte de la Cirugía General: hemorroides, fisura, fístula, absceso perianal y quiste pilonidal se atienden dentro de esta especialidad. Si su caso requiere a otro especialista, se le dice."],
        ["Me da mucha pena esta consulta", "Es la razón más común por la que la gente aguanta meses con algo que se resuelve. La exploración es breve, se hace con privacidad y sólo lo necesario. Nada de lo que traiga es raro aquí."],
        ["¿Cuál de todos tengo?", "Se parecen entre sí y se confunden seguido, incluso entre ellos: mucha gente llega convencida de tener hemorroides y tiene una fisura. Por eso la valoración empieza explorando, no adivinando por internet."],
        ["¿Cuál es urgencia y cuál puede esperar?", "El absceso perianal es urgencia: se atiende el mismo día, sobre todo si hay fiebre. Los demás se valoran con cita programada, aunque duelan."],
      ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${HUB.titulo}</title>
<meta name="description" content="${HUB.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dr. Jason Valdivia — Cirujano General">
<meta property="og:title" content="${HUB.titulo}">
<meta property="og:description" content="${HUB.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/images/dr-office-portrait.jpg">
<meta property="og:locale" content="es_MX">
<meta name="twitter:card" content="summary_large_image">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<style>${css}</style>
</head>
<body>
<div class="env">

  <nav class="kicker"><a href="/">Inicio</a> / Cirugía anorrectal</nav>
  <p class="kicker">${HUB.kicker}</p>
  <h1>${HUB.h1}</h1>

  <p>Los padecimientos del ano y el recto son de los que más tardan en
  consultarse — por pena, o porque se supone que «ya se va a quitar». Casi
  ninguno se quita solo, y varios se resuelven en una cirugía corta.</p>

  <div class="nota">
    <b>Si busca «proctólogo en Puerto Vallarta»:</b> el Dr. Jason Valdivia es
    <b>Cirujano General</b> certificado por el Consejo Mexicano de Cirugía
    General, no proctólogo. La cirugía de esta región forma parte de la Cirugía
    General, y es lo que se atiende aquí. Si su caso corresponde a otro
    especialista, se le dice — eso también es parte de la valoración.
  </div>

  <h2>Qué se atiende</h2>
  <ul>
    <li><a href="/cirugia-de-hemorroides/"><b>Hemorroides</b></a> — sangrado al evacuar, bultos que salen o «almorranas».</li>
    <li><a href="/fisura-anal/"><b>Fisura anal</b></a> — dolor intenso al evacuar, tipo cortada, con sangre roja brillante.</li>
    <li><a href="/fistula-anal/"><b>Fístula anal</b></a> — salida de pus o secreción que va y viene, casi siempre tras un absceso.</li>
    <li><a href="/absceso-perianal/"><b>Absceso perianal</b></a> — <b>urgencia</b>: bulto muy doloroso, a veces con fiebre.</li>
    <li><a href="/quiste-pilonidal/"><b>Quiste pilonidal</b></a> — en la parte alta del pliegue de los glúteos, cerca del coxis.</li>
  </ul>

  <h2>Cuál es urgencia y cuál puede esperar</h2>
  <p>Sólo uno de esta lista no debe esperar: el <a href="/absceso-perianal/">absceso
  perianal</a>, sobre todo si hay fiebre o el dolor crece hora con hora. Los demás
  duelen, molestan y afectan el día a día, pero se valoran con cita programada.</p>

  <div class="urgente">
    <b>¿Dolor que no lo deja sentarse, con fiebre?</b> No espere a la próxima
    semana.
    <p style="margin-top:.7rem">
      <a class="boton" href="https://wa.me/523339718620">WhatsApp ${TEL_VISIBLE}</a>
      <a class="boton" href="tel:${TEL}">Llamar ahora</a>
    </p>
  </div>

  <h2>Sobre la pena de esta consulta</h2>
  <p>Es la razón más común por la que alguien aguanta meses. La exploración es
  breve, se hace con privacidad y sólo lo necesario. Nada de lo que traiga es raro
  aquí — son de los motivos de consulta más frecuentes que existen.</p>

  <h2>Consultorio</h2>
  <p>Calle Francia 186, Col. Versalles, 48310 Puerto Vallarta, Jalisco.<br>
  Lunes a jueves 14:00–17:00 y 19:00–20:00 · Viernes 14:00–20:00.<br>
  Teléfono y WhatsApp: <a href="tel:${TEL}">${TEL_VISIBLE}</a>.<br>
  Consulta de valoración: <b>$800 MXN</b>. Se aceptan
  <a href="/seguros/">seguros de gastos médicos mayores</a> y pago particular.</p>

  <p>
    <a class="boton" href="/citas/">Agendar valoración</a>
    <a class="boton" href="/credenciales/">Credenciales del cirujano</a>
  </p>

  ${pie}

</div>
</body>
</html>
`;
}

let n = 0;
for (const p of PAGINAS) {
  mkdirSync(p.slug, { recursive: true });
  writeFileSync(`${p.slug}/index.html`, generar(p));
  console.log(`  ✓ /${p.slug}/`);
  n++;
}
mkdirSync(HUB.slug, { recursive: true });
writeFileSync(`${HUB.slug}/index.html`, generarHub());
console.log(`  ✓ /${HUB.slug}/  (paraguas)`);
console.log(`\n${n + 1} página(s) generada(s)`);

/* Añade a cada página la pregunta CON LAS PALABRAS DEL PACIENTE (2026-08-15).
 *
 *  Un análisis de cobertura sobre las 32 páginas mostró que el sitio dice
 *  «cálculos biliares», «hernia inguinal», «reflujo» y «hemorroides» —el
 *  vocabulario del médico— y NUNCA «piedras en la vesícula», «bulto en la ingle»,
 *  «agruras» ni «almorranas», que es como lo escribe la gente en Google.
 *
 *  No es rellenar de palabras clave: son preguntas reales, con respuesta real,
 *  redactadas como las hace un paciente en el consultorio. Van al bloque visible
 *  Y al `FAQPage`, porque una respuesta que sólo existe en los datos
 *  estructurados y no en la página es justo lo que Google llama contradicción.
 *
 *  Idempotente: si la pregunta ya está, no la repite.
 */
import { readFileSync, writeFileSync } from "node:fs";

const NUEVAS = [
  {
    archivo: "cirugia-de-vesicula/index.html",
    p: "¿Las «piedras en la vesícula» son lo mismo que los cálculos biliares?",
    r: "Sí. «Piedras en la vesícula» es como se le dice de forma coloquial a los cálculos biliares: depósitos endurecidos que se forman dentro de la vesícula. Es el mismo padecimiento y el mismo tratamiento.",
  },
  {
    archivo: "cirugia-de-hernia/index.html",
    p: "Tengo un bulto en la ingle, ¿es una hernia?",
    r: "Un bulto en la ingle que aparece al toser, al pujar o al estar de pie, y que se reduce al acostarse, suele corresponder a una hernia inguinal. No todo bulto lo es, así que hace falta una exploración para confirmarlo — y si el bulto se endurece, duele mucho y ya no se reduce, es una urgencia.",
  },
  {
    archivo: "cirugia-antirreflujo/index.html",
    p: "¿Las agruras constantes se operan?",
    r: "Las agruras (acidez o pirosis) se tratan primero con medicamento y cambios de hábitos. La cirugía se valora cuando los síntomas persisten a pesar del tratamiento, cuando hay hernia hiatal asociada o cuando el paciente no quiere depender del medicamento de por vida.",
  },
  {
    archivo: "cirugia-de-hemorroides/index.html",
    p: "¿Las almorranas y las hemorroides son lo mismo?",
    r: "Sí. «Almorranas» es el nombre coloquial de las hemorroides. No todas requieren cirugía: depende del grado, de los síntomas y de cómo hayan respondido a los tratamientos previos.",
  },
  {
    archivo: "hernia-surgery-puerto-vallarta/index.html",
    p: "Do you use hernia mesh?",
    r: "Mesh repair is the standard technique for most adult hernias, because it lowers the chance of the hernia coming back. Whether mesh is used, and which type, depends on the hernia and on your case — it is discussed with you before surgery.",
  },
];

let hechas = 0;
for (const { archivo, p, r } of NUEVAS) {
  let html = readFileSync(archivo, "utf8");
  if (html.includes(p)) { console.log(`  ya estaba   ${archivo}`); continue; }

  // 1) Al FAQPage. Se inserta como PRIMERA pregunta del mainEntity.
  const marca = '"mainEntity":[';
  if (!html.includes(marca)) { console.log(`  SIN FAQPage ${archivo}`); continue; }
  const bloqueJson = JSON.stringify({ "@type": "Question", name: p, acceptedAnswer: { "@type": "Answer", text: r } });
  html = html.replace(marca, marca + bloqueJson + ",");

  // 2) Al bloque VISIBLE, justo después del encabezado de preguntas.
  const enc = html.match(/<h2>(Preguntas frecuentes|Frequently asked questions|FAQ)<\/h2>/i);
  if (!enc) { console.log(`  sin bloque visible ${archivo}`); continue; }
  html = html.replace(enc[0], `${enc[0]}<h3>${p}</h3><p>${r}</p>`);

  writeFileSync(archivo, html);
  console.log(`  añadida     ${archivo}`);
  hechas++;
}
console.log(`\n${hechas} pregunta(s) añadida(s)`);

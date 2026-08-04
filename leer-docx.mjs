/** Extrae el texto de un .docx sin dependencias: es un zip cuyo
 *  word/document.xml trae el contenido. */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const docx = process.argv[2];
const xml = execFileSync("unzip", ["-p", docx, "word/document.xml"], {
  maxBuffer: 40 * 1024 * 1024,
}).toString("utf8");

const txt = xml
  .replace(/<w:p[ >]/g, "\n<w:p ")
  .replace(/<w:br\s*\/>/g, "\n")
  .replace(/<w:tab\s*\/>/g, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'");

const lineas = txt.split("\n").map((l) => l.trim()).filter(Boolean);
console.log(JSON.stringify(lineas, null, 1));

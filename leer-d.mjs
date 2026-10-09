/* Saca el objeto `d` de una página de procedimiento y lo imprime como JSON.
 *
 * Sirve para editar una página sin volver a escribirla entera: se lee la `d`
 * que ya está, se cambian los campos que hagan falta, y se devuelve con
 * `regenerar-pagina.mjs`, que reescribe las tres copias a la vez.
 *
 *   node leer-d.mjs <carpeta> > d.json
 */
import fs from "node:fs";

const carpeta = process.argv[2];
if (!carpeta) { console.error("uso: node leer-d.mjs <carpeta>"); process.exit(1); }
const html = fs.readFileSync(carpeta + "/index.html", "utf8");

const a = html.indexOf("<script type=\"text/x-dc\"");
const ini = html.indexOf(">", a) + 1;
const fin = html.indexOf("</script>", ini);
const codigo = html.slice(ini, fin);

// Se evalúa la clase con un DCLogic de mentira y se le pide sus valores.
const hacer = new Function("DCLogic", codigo + "\nreturn Component;");
const Componente = hacer(class {});
const valores = new Componente().renderVals();
process.stdout.write(JSON.stringify(valores.d, null, 2) + "\n");

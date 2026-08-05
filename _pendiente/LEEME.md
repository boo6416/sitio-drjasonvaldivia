# Listo para publicar — NO desplegado

Se acabaron los créditos de construcción de Netlify el 2026-08-05. **Empujar a `main`
cobra.** Por eso todo esto vive en la rama `pendiente-7-agosto` y no en `main`: así, un
push por costumbre no arrastra el cambio ni gasta un crédito.

## El 8 de agosto

```
git checkout main
git merge pendiente-7-agosto
git push
```

## Para verlo antes, sin gastar un crédito

```
npx serve -l 4321 .
```

y abra `http://localhost:4321`. Es el sitio completo, igual que en línea. `Ctrl+C` para
cerrarlo.

## Qué hay, hecho y visto en local

- **Iconos en "Cirugías que realizo"** — el cuadrito mostraba una LETRA (`V` de
  colecistectomía, que no reconoce nadie). Ahora lleva un icono de línea por
  procedimiento: vesícula con cálculos, ciego con apéndice, pared con la hernia
  asomando, estómago con el reflujo subiendo, tiroides en mariposa, y nódulo bajo la piel.
- **Los dos números** en las 16 páginas. Citas al del consultorio; **urgencias intactas
  en el personal**, porque una urgencia tiene que llegar a una persona.
- **Accesibilidad del agendado**: etiquetas atadas a sus campos, botones de 44 px, aviso
  al cambiar de día, campos obligatorios marcados de verdad.
- **Contacto**: dos botones separados, y los dos números escritos con su para-qué.
- **Seis páginas nuevas completas**, cada una con su fotografía: hemorroides, hernia
  umbilical, cirugía de urgencia, cirugía laparoscópica, heridas complejas y terapia de
  presión negativa.

  Están enlazadas desde el pie de **todas** las páginas y dadas de alta en el
  `sitemap.xml`. Una página que no está en ninguno de los dos existe en el disco y en
  ningún otro lado — en este sitio ya hubo doce huérfanas.

## Qué falta

- **Los logos de aseguradoras.** No se descargaron a propósito: son marcas de terceros y
  mostrarlas puede leerse como que el Dr. pertenece a su red, que es justo lo que su
  texto evita decir. La página ya los espera en `images/aseguradoras/`; ver el `LEEME.txt`
  de esa carpeta.
- **Las versiones en inglés** de las seis páginas nuevas. Nacen sólo en español a
  propósito: declarar un `hreflang="en"` que apunta a una página inexistente le genera
  errores de rastreo a Google.

## Cómo se hicieron, por si hay que repetirlo

- `textos-6-paginas.json` — el contenido de las seis, redactado y verificado contra
  fuentes clínicas y contra las reglas de publicidad médica mexicana.
- `prompts-de-imagenes.md` — el bloque de estilo y los seis sujetos, más las manías
  medidas de Gemini.
- `armar-paginas.mjs` — genera cada página. **Importa por qué existe**: cada página vive
  DOS veces, un bloque estático que es lo que lee Google y un objeto de datos que pinta
  el navegador. Escribirlas a mano garantiza que un día digan cosas distintas, y la que
  se desincroniza en silencio es la del buscador. Aquí las dos salen del mismo objeto.
- `imagenes/` — las seis fotografías, por si hay que rearmar.

## Por qué los iconos son dibujados y no de un paquete

Flaticon e Iconscout piden atribución visible o licencia de paga; SVGRepo mezcla
licencias y hay que revisarlas una por una. Un sitio médico con un pie de página lleno de
créditos de iconos se ve mal y es una obligación que hay que mantener. Dibujados, no hay
nada que atribuir ni que renovar.

Y las figuras de las publicaciones **no sirven aquí**: son ilustraciones detalladas de
1024 px pensadas para verse grandes, y a 24 px se vuelven una mancha. Además su trazo es
azul oscuro sobre crema; sobre la tarjeta azul marino desaparecerían.

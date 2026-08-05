# Listo para publicar — NO desplegado

Se acabaron los créditos de construcción de Netlify el 2026-08-05. **Empujar a `main`
cobra.** Por eso todo esto vive en la rama `pendiente-7-agosto`.

## El 8 de agosto

```
git checkout main
git merge pendiente-7-agosto
git push
```

## Qué hay ya, hecho y visto en local

- **Iconos en "Cirugías que realizo"** — el cuadrito mostraba una LETRA (`V` de
  colecistectomía, que no reconoce nadie). Ahora lleva un icono de línea por
  procedimiento: vesícula con cálculos, ciego con apéndice, pared con hernia, estómago
  con reflujo, tiroides y nódulo bajo la piel.
- **Los dos números** en las 16 páginas, con urgencias intacto en el personal.
- **Accesibilidad del agendado**: etiquetas atadas a sus campos, botones de 44 px, aviso
  al cambiar de día, campos obligatorios marcados de verdad.
- **Tres páginas nuevas completas**: `cirugia-de-hemorroides`,
  `cirugia-de-hernia-umbilical`, `cirugia-de-urgencia`.

## Qué falta

Tres páginas más, ya **redactadas y verificadas** (están en `textos-6-paginas.json`):
`cirugia-laparoscopica`, `manejo-de-heridas-complejas`, `terapia-de-presion-negativa`.
Sólo les falta la imagen.

1. Genere la imagen con el prompt que le toca en `prompts-de-imagenes.md`.
2. Guárdela en `_pendiente/imagenes/<slug>.png`.
3. Corra `node _pendiente/armar-paginas.mjs` (arma las dos versiones de cada página —la
   que lee Google y la que pinta el navegador— del MISMO objeto, para que no se
   desincronicen).

## Para verlo antes de publicar, sin gastar un crédito

```
npx serve -l 4321 .
```

y abra `http://localhost:4321`. Es el sitio completo, igual que en línea.

## Por qué los iconos son dibujados y no de un paquete

Flaticon e Iconscout piden atribución visible o licencia de paga; SVGRepo mezcla
licencias y hay que revisarlas una por una. Un sitio médico con un pie de página lleno de
créditos de iconos se ve mal y es una obligación que hay que mantener. Dibujados, no hay
nada que atribuir ni que renovar.

Y las figuras de las publicaciones **no sirven aquí**: son ilustraciones detalladas de
1024 px pensadas para verse grandes, y a 24 px se vuelven una mancha. Además su trazo es
azul oscuro sobre crema; sobre la tarjeta azul marino desaparecerían.

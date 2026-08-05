# Imágenes de las páginas de procedimiento (drjasonvaldivia.com)

**Esto NO es la biblioteca de figuras.** Son dos lenguajes distintos y mezclarlos se
nota de inmediato:

| | Biblioteca de figuras (`docs/biblioteca-ilustraciones.md`) | Estas |
|---|---|---|
| Para qué | publicaciones de Facebook e Instagram | páginas del sitio web |
| Aspecto | dibujo plano, dos colores, fondo crema | **fotografía realista** |
| Formato | cuadrado | **1920 × 1080 (16:9)** |
| Anatomía | esquemática | modelo anatómico real o piel real |

El 2026-08-05 se iban a reutilizar las figuras de la biblioteca para las páginas nuevas.
Lo detuvo el Dr.: *"el resto de las imágenes de patologías en la página son imágenes más
realistas"*. Tenía razón — una página con dibujo plano entre cinco con foto se lee como
un parche.

## Lo que hay hoy, medido abriendo los archivos

Las tres que se revisaron (`cirugia-de-vesicula`, `cirugia-de-hernia`,
`cirugia-de-tiroides`) comparten esto, y de aquí sale el bloque de estilo:

- **Nadie muestra la cara.** El encuadre corta en el mentón o sólo se ven manos. No es
  casualidad: sin rostro no hay persona identificable, no hace falta autorización de
  imagen, y la mirada va a la anatomía.
- **Nada de sangre, quirófano abierto ni heridas abiertas.** Ninguna de las tres.
- Luz suave y natural, fondo claro desenfocado, poca profundidad de campo.
- Dos modos, y sólo dos:
  - **A · modelo anatómico** — una persona con bata sostiene un modelo pintado del
    órgano, a la altura que le corresponde en su propio cuerpo (tiroides al cuello) o
    apoyado sobre una base blanca (hígado y vesícula).
  - **B · macro clínico** — primer plano de lo que se ve en la piel (el abultamiento de
    la hernia). Sin fondo: la piel llena el cuadro.

Para las páginas nuevas hace falta un tercero, porque hay temas sin anatomía visible:

  - **C · contexto clínico** — el apósito, el instrumental, la sala. Sin anatomía.

---

## El bloque de ESTILO — va en TODOS los prompts, sin cambiar

```
Fotografía clínica editorial, realista, para el sitio web de un cirujano general.
Formato horizontal 16:9, 1920x1080 píxeles.
Luz natural suave y difusa, tonos claros y cálidos, fondo claro desenfocado.
Poca profundidad de campo, enfoque nítido en el tema principal.
Encuadre desde el mentón hacia abajo: la cabeza queda fuera del cuadro.
Piel sana y limpia, superficies limpias y secas, ambiente tranquilo de consultorio.
Composición serena, sin dramatismo. Imagen limpia, sin nada escrito sobre ella.
```

## Los seis sujetos

Uno por página. Se pega el bloque de estilo y debajo el sujeto.

**1 · `cirugia-de-hemorroides` — modo A**
```
Un médico con bata blanca y estetoscopio, de pie, sostiene con ambas manos un modelo
anatómico pintado del recto y el canal anal en corte, montado sobre una base blanca,
y lo señala con un bolígrafo plateado. El modelo es de plástico mate, con los tejidos
en tonos rosa y rojo. Fondo de consultorio claro y desenfocado.
```
*Por qué modo A y no macro: es la única de las seis cuya anatomía no se puede fotografiar
sobre un cuerpo con decoro. El modelo resuelve el problema y mantiene el estilo del sitio.*

**2 · `cirugia-de-hernia-umbilical` — modo B**
```
Primer plano del abdomen de una persona adulta de pie, vista en tres cuartos desde un
lado, con un abultamiento redondeado y bien definido justo en el ombligo, del tamaño de
una nuez. Piel clara y sana, iluminación lateral suave que marca el relieve del bulto.
El abdomen llena el cuadro.
```
⚠ **Pídala en tres cuartos y de pie a propósito.** La imagen que ya existe en
`cirugia-de-hernia` es un macro frontal muy parecido; si ésta sale igual, dos páginas
distintas tendrán la misma foto y se ve como un descuido.

**3 · `cirugia-de-urgencia` — modo C**
```
Pasillo de un hospital moderno visto en perspectiva, con una camilla vacía preparada al
fondo y las puertas dobles de quirófano abiertas, iluminadas desde dentro. Suelo pulido
que refleja la luz. Sin personas. Tonos claros y azules fríos, sensación de orden y de
disponibilidad inmediata.
```

**4 · `cirugia-laparoscopica` — modo B**
```
Primer plano del abdomen de una persona acostada, con cuatro apósitos adhesivos
pequeños y limpios repartidos alrededor del ombligo, de aproximadamente un centímetro
cada uno. Piel limpia, sábana clara doblada en el borde inferior del cuadro.
Iluminación suave y pareja.
```
*Esta imagen dice lo que la página quiere decir —incisiones pequeñas— mejor que
cualquier torre de laparoscopía.*

**5 · `manejo-de-heridas-complejas` — modo C**
```
Manos con guantes de nitrilo azul realizando una curación sobre la pierna de una
persona, con gasas blancas limpias y pinzas de acero. Sobre una mesa auxiliar al lado,
gasas dobladas y solución en frasco. Campo limpio y seco. Iluminación clara y pareja.
```

**6 · `terapia-de-presion-negativa` — modo C**
```
Primer plano de un apósito de terapia de presión negativa colocado sobre la pierna de
una persona: espuma oscura recortada sobre la zona, cubierta por una película
transparente adherida a la piel, con un conector circular del que sale un tubo delgado.
Al lado, sobre la sábana clara, la pequeña bomba portátil con su pantalla apagada.
Iluminación suave.
```

---

## Trampas que ya se pagaron generando las otras

Salen de `docs/biblioteca-ilustraciones.md`, medidas el 2026-08-04, y valen igual aquí:

- **Nombrar algo para prohibirlo hace que el modelo lo dibuje.** Un prompt que decía
  *"sin usar flechas"* salió con tres flechas. Por eso arriba **no hay una sola frase en
  negativo**: todo está descrito por lo que sí debe verse. Si algo sale mal, se corrige
  describiendo lo que se quiere en su lugar, nunca prohibiéndolo.
- **A veces escribe texto dentro de la imagen** — pasó en 1 de 7. Hay que **mirar cada
  una**; ningún filtro lo caza.
- **El botón de enviar de Gemini no responde al primer clic**, y el primer texto que se
  escribe tras cargar la página se pierde. No es error suyo.
- **Chrome corta las descargas después de 8 o 9 seguidas** en la misma pestaña: dice
  "Imagen descargada" y al disco no llega nada, sin aviso. Con seis no debería pasar,
  pero si se hacen variantes, abra pestaña nueva a la sexta.

## Una regla que no se negocia

**Ninguna imagen puede parecer el resultado de una cirugía de un paciente suyo.** Nada de
cicatrices "después de", comparaciones ni resultados. La normativa mexicana prohíbe las
fotos antes/después sin sustento, y una foto realista generada se leería exactamente como
eso. Las seis de arriba muestran el problema, el procedimiento o el contexto — nunca un
resultado.

## Después de generarlas

1. Guardar cada una como `illus.png` **dentro de la carpeta de su página**.
2. **Mirarla completa** antes de darla por buena: texto colado, manos con dedos de más,
   instrumental imposible.
3. 1920×1080. Si sale cuadrada, se vuelve a pedir; recortarla deja la composición mal.

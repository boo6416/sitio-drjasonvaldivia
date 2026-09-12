/* De qué campaña llegó la visita (2026-09-12).
 *
 * Los enlaces de la ficha de Google y de Instagram traen etiquetas
 * (?utm_source=google&utm_medium=organic&utm_campaign=ficha). Esa información
 * sólo existe en la PRIMERA página que se abre; si la persona agenda después,
 * en /citas/, ya se perdió. Aquí se guarda en el navegador de la persona —no se
 * manda a ningún tercero— y la agenda (/citas/agenda.js) la lee al apartar la
 * cita. Así el expediente sabe qué canal trae pacientes de verdad.
 *
 * Sólo letras, números, punto y guion: lo que no cumple se descarta. */
(function () {
  "use strict";
  try {
    var q = new URLSearchParams(location.search);
    var limpio = function (v, n) {
      v = (v || "").slice(0, n);
      return /^[\w.-]*$/.test(v) ? v : "";
    };
    var c = {
      fuente: limpio(q.get("utm_source"), 40),
      medio: limpio(q.get("utm_medium"), 40),
      campana: limpio(q.get("utm_campaign"), 60),
      t: Date.now(),
    };
    if (c.fuente) localStorage.setItem("drv_utm", JSON.stringify(c));
  } catch (e) { /* sin almacenamiento (modo privado): no se mide, y la página sigue igual */ }
})();

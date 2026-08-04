/* Agenda en línea del consultorio — habla con el expediente (mini-ADR-044).
 *
 * Sustituye al widget de Calendly. Hasta hoy había DOS agendas que no se
 * conocían: la del sitio y la del expediente. Un paciente podía apartar por
 * aquí una hora que el Dr. ya tenía ocupada, o un día que él había cerrado.
 *
 * Este archivo NO conoce ningún dato de paciente: pide horas libres y manda
 * una solicitud. Todo lo demás vive del lado del expediente.
 *
 * ⚠ Va FUERA del elemento <x-dc>: el runtime de la página interpola `{{ }}` y
 * reconcilia su árbol. Por eso el widget se monta a mano y se vuelve a montar
 * solo si una re-pintada del runtime se lo lleva (ver observarMontaje).
 */
(function () {
  "use strict";

  var API = "https://ehr-valdivia.boo6416.workers.dev/api/publico/agenda";

  /* Puerto Vallarta, fijo. NO se usa la zona horaria del visitante: un paciente
   * mirando desde Nueva York vería las horas corridas y llegaría al consultorio
   * dos horas tarde. México no cambia de horario desde 2022, así que UTC-6 vale
   * todo el año. Las horas se muestran SIEMPRE como hora de Puerto Vallarta y
   * así se rotulan. */
  var OFFSET_MIN = 360;

  var C = {
    tinta: "#0d2b3e", crema: "#fdf0ea", azul: "#4f7ea8", azulClaro: "#8ab4d6",
    gris: "#42535f", grisSuave: "#8b98a3", borde: "rgba(13,43,62,0.12)",
  };

  var T = {
    es: {
      cargando: "Buscando horarios disponibles…",
      sinCupo: "En este momento no hay horarios publicados en línea.",
      usaFormulario: "Puede solicitar su cita con el formulario de abajo o escribir por WhatsApp; se le responde el mismo día.",
      elijaDia: "1 · Elija el día",
      elijaHora: "2 · Elija la hora",
      susDatos: "3 · Sus datos",
      zona: "Horario de Puerto Vallarta (Centro, UTC−6)",
      nombre: "Nombre", apellidos: "Apellidos",
      telefono: "Teléfono / WhatsApp", correo: "Correo electrónico (opcional)",
      motivo: "Motivo de la consulta", motivoPh: "— Seleccione —",
      motivos: [
        "Valoración para cirugía de vesícula",
        "Valoración para cirugía de hernia",
        "Valoración para cirugía antirreflujo / hernia hiatal",
        "Valoración para apendicectomía",
        "Valoración para cirugía de tiroides",
        "Masas, quistes o tejidos blandos",
        "Dolor abdominal / diagnóstico",
        "Segunda opinión",
        "Otro",
      ],
      consent: "Acepto que mis datos se usen para atender mi solicitud de cita. Si acudo a consulta, se abrirá un expediente clínico con mi información.",
      privacidad: "Aviso de privacidad",
      enviar: "Solicitar esta cita",
      enviando: "Enviando…",
      faltan: "Complete su nombre, apellidos, teléfono y la casilla de aceptación.",
      listoT: "Su cita quedó apartada",
      listoD: "Le confirmamos por WhatsApp al número que dejó. Si necesita moverla, escriba al mismo número.",
      otra: "Agendar otra",
      noClinico: "No escriba síntomas ni datos de salud aquí; eso se habla en la consulta.",
      dias: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      meses: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      volver: "cambiar",
    },
    en: {
      cargando: "Looking for available times…",
      sinCupo: "There are no times published online right now.",
      usaFormulario: "You can request your appointment with the form below or message on WhatsApp; you will get a reply the same day.",
      elijaDia: "1 · Pick a day",
      elijaHora: "2 · Pick a time",
      susDatos: "3 · Your details",
      zona: "Puerto Vallarta time (Central, UTC−6)",
      nombre: "First name", apellidos: "Last name",
      telefono: "Phone / WhatsApp", correo: "Email (optional)",
      motivo: "Reason for the visit", motivoPh: "— Select —",
      motivos: [
        "Gallbladder surgery consultation",
        "Hernia surgery consultation",
        "Anti-reflux / hiatal hernia consultation",
        "Appendectomy consultation",
        "Thyroid surgery consultation",
        "Lumps, cysts or soft tissue",
        "Abdominal pain / diagnosis",
        "Second opinion",
        "Other",
      ],
      consent: "I agree that my details may be used to handle my appointment request. If I attend, a clinical record will be opened with my information.",
      privacidad: "Privacy notice",
      enviar: "Request this appointment",
      enviando: "Sending…",
      faltan: "Please fill in your name, last name, phone and tick the box.",
      listoT: "Your appointment is held",
      listoD: "We confirm by WhatsApp at the number you left. To change it, write to that same number.",
      otra: "Book another",
      noClinico: "Please do not write symptoms or health details here; that is for the consultation.",
      dias: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      meses: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      volver: "change",
    },
  };

  function idioma() {
    try {
      var g = localStorage.getItem("drv_lang");
      return g === "en" ? "en" : "es";
    } catch (e) { return "es"; }
  }

  /* ---------- utilería de DOM (sin innerHTML para nada que escriba el usuario) */
  function el(tag, estilo, texto) {
    var n = document.createElement(tag);
    if (estilo) n.setAttribute("style", estilo);
    if (texto != null) n.textContent = texto;
    return n;
  }
  function hijos(padre, lista) {
    for (var i = 0; i < lista.length; i++) if (lista[i]) padre.appendChild(lista[i]);
    return padre;
  }

  var FUENTE = "font-family:'DM Sans',sans-serif;";
  var TITULO = FUENTE + "font-size:0.78rem; letter-spacing:0.09em; text-transform:uppercase; color:" + C.grisSuave + "; margin-bottom:0.9rem;";

  /* ---------- estado ---------- */
  var estado = {
    fase: "cargando",   // cargando · sincupo · eligiendo · enviado
    dias: [],
    fecha: null,
    hora: null,
    error: "",
    mandando: false,
    /* ⚠ Lo tecleado vive AQUÍ, no en los <input>.
     *
     * El runtime de la página re-pinta su árbol cada tanto y se lleva el
     * widget; al volver a colgarlo, los campos se construyen de nuevo. Si el
     * valor viviera sólo en el DOM, el paciente perdería su nombre y su
     * teléfono a media captura, sin entender por qué. */
    datos: { nombre: "", apellidos: "", telefono: "", correo: "", motivo: "", consiente: false },
  };
  var caja = null;      // el nodo que pintamos
  var langPintado = null;

  /* ---------- red ---------- */
  function pedirHuecos() {
    // Regla 3 del proyecto: ninguna llamada externa sin plazo. Una espera
    // infinita deja la página en "Buscando…" para siempre.
    var ctl = new AbortController();
    var reloj = setTimeout(function () { ctl.abort(); }, 12000);
    fetch(API + "?dias=21&offset_min=" + OFFSET_MIN, { signal: ctl.signal })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(reloj);
        if (j && j.activa && j.dias && j.dias.length) {
          estado.dias = j.dias;
          estado.fecha = j.dias[0].fecha;
          estado.fase = "eligiendo";
        } else {
          estado.fase = "sincupo";
        }
        pintar();
      })
      .catch(function () {
        clearTimeout(reloj);
        // Si el expediente no contesta, la página NO se queda muda: cae al
        // formulario de siempre, que sigue abajo y sigue funcionando.
        estado.fase = "sincupo";
        pintar();
      });
  }

  function mandar(datos) {
    var ctl = new AbortController();
    var reloj = setTimeout(function () { ctl.abort(); }, 15000);
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: ctl.signal,
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { clearTimeout(reloj); return j; })
      .catch(function () { clearTimeout(reloj); return { ok: false, motivo: null }; });
  }

  /* ---------- pintado ---------- */
  function etiquetaDia(fecha, t) {
    // "2026-08-14" → sáb 14 ago. Se parte a mano: `new Date("2026-08-14")` se
    // interpreta como UTC y en México adelanta un día.
    var p = fecha.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return { dia: t.dias[d.getDay()], num: String(+p[2]), mes: t.meses[+p[1] - 1] };
  }

  function chipDia(dia, t) {
    var sel = dia.fecha === estado.fecha;
    var e = etiquetaDia(dia.fecha, t);
    var b = el("button", FUENTE +
      "flex:0 0 auto; min-width:74px; padding:0.6rem 0.5rem; border-radius:10px; cursor:pointer;" +
      "border:1px solid " + (sel ? C.tinta : C.borde) + ";" +
      "background:" + (sel ? C.tinta : "#fff") + "; color:" + (sel ? C.crema : C.gris) + ";" +
      "display:flex; flex-direction:column; align-items:center; gap:2px; transition:all .15s ease;");
    b.type = "button";
    hijos(b, [
      el("span", "font-size:0.7rem; opacity:0.75;", e.dia),
      el("span", "font-size:1.25rem; font-weight:500; line-height:1;", e.num),
      el("span", "font-size:0.68rem; opacity:0.7;", e.mes),
    ]);
    b.onclick = function () { estado.fecha = dia.fecha; estado.hora = null; estado.error = ""; pintar(); };
    return b;
  }

  function chipHora(h) {
    var sel = h === estado.hora;
    var b = el("button", FUENTE +
      "padding:0.55rem 0.2rem; border-radius:8px; cursor:pointer; font-size:0.92rem;" +
      "border:1px solid " + (sel ? C.tinta : C.borde) + ";" +
      "background:" + (sel ? C.tinta : "#fff") + "; color:" + (sel ? C.crema : C.gris) + ";" +
      "transition:all .15s ease;", h);
    b.type = "button";
    b.onclick = function () { estado.hora = h; estado.error = ""; pintar(); };
    return b;
  }

  function campo(etiqueta, nombre, tipo) {
    var env = el("div", "display:flex; flex-direction:column; gap:5px;");
    var l = el("label", FUENTE + "font-size:0.78rem; color:" + C.gris + ";", etiqueta);
    var i = el("input", FUENTE +
      "padding:0.65rem 0.75rem; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff;");
    i.type = tipo || "text";
    i.name = nombre;
    i.autocomplete = nombre === "telefono" ? "tel" : nombre === "correo" ? "email" : "on";
    // Se restaura lo ya escrito y se guarda en cada tecla, para que una
    // re-pintada del runtime no le borre los datos al paciente.
    i.value = estado.datos[nombre] || "";
    i.oninput = function () { estado.datos[nombre] = i.value; };
    hijos(env, [l, i]);
    env._input = i;
    return env;
  }

  function bloqueFormulario(t) {
    var f = el("div", "margin-top:2rem;");
    hijos(f, [el("p", TITULO, t.susDatos)]);

    var rej = el("div", "display:grid; grid-template-columns:" +
      (window.innerWidth < 700 ? "1fr" : "1fr 1fr") + "; gap:1rem;");
    var cNombre = campo(t.nombre + " *", "nombre");
    var cApell = campo(t.apellidos + " *", "apellidos");
    var cTel = campo(t.telefono + " *", "telefono", "tel");
    var cMail = campo(t.correo, "correo", "email");
    hijos(rej, [cNombre, cApell, cTel, cMail]);

    var envM = el("div", "display:flex; flex-direction:column; gap:5px; margin-top:1rem;");
    var lM = el("label", FUENTE + "font-size:0.78rem; color:" + C.gris + ";", t.motivo);
    var sel = el("select", FUENTE +
      "padding:0.65rem 0.75rem; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff;");
    sel.appendChild(new Option(t.motivoPh, ""));
    for (var i = 0; i < t.motivos.length; i++) sel.appendChild(new Option(t.motivos[i], t.motivos[i]));
    sel.value = estado.datos.motivo || "";
    sel.onchange = function () { estado.datos.motivo = sel.value; };
    hijos(envM, [lM, sel, el("p", FUENTE + "font-size:0.72rem; color:" + C.grisSuave + "; margin-top:2px;", t.noClinico)]);

    /* Campo trampa: invisible para una persona, irresistible para un robot que
       llena todo. El servidor descarta la solicitud sin decir que lo notó. */
    var trampa = el("div", "position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden;");
    var tr = el("input");
    tr.type = "text"; tr.name = "sitio_web"; tr.tabIndex = -1; tr.setAttribute("aria-hidden", "true");
    tr.autocomplete = "off";
    trampa.appendChild(tr);

    var envC = el("label", FUENTE + "display:flex; gap:10px; align-items:flex-start; margin-top:1.2rem;" +
      "font-size:0.8rem; color:" + C.gris + "; line-height:1.6; cursor:pointer;");
    var chk = el("input", "margin-top:3px; flex:0 0 auto;");
    chk.type = "checkbox";
    chk.checked = !!estado.datos.consiente;
    chk.onchange = function () { estado.datos.consiente = chk.checked; };
    var txtC = el("span", null, t.consent + " ");
    var enl = el("a", "color:" + C.azul + ";", t.privacidad);
    enl.href = "/aviso-de-privacidad/"; enl.target = "_blank"; enl.rel = "noopener";
    txtC.appendChild(enl);
    hijos(envC, [chk, txtC]);

    var err = el("p", FUENTE + "font-size:0.82rem; color:#b3261e; margin-top:0.9rem;", estado.error);
    if (!estado.error) err.style.display = "none";

    var btn = el("button", FUENTE +
      "margin-top:1.3rem; width:100%; padding:0.9rem; border:none; border-radius:8px; cursor:pointer;" +
      "background:" + C.tinta + "; color:" + C.crema + "; font-size:0.95rem; font-weight:500;" +
      "letter-spacing:0.02em;", estado.mandando ? t.enviando : t.enviar);
    btn.type = "button";
    btn.disabled = estado.mandando;
    if (estado.mandando) btn.style.opacity = "0.6";

    btn.onclick = function () {
      var d = {
        nombre: (estado.datos.nombre || "").trim(),
        apellidos: (estado.datos.apellidos || "").trim(),
        telefono: (estado.datos.telefono || "").trim(),
        correo: (estado.datos.correo || "").trim(),
        fecha: estado.fecha,
        hora: estado.hora,
        offset_min: OFFSET_MIN,
        motivo: estado.datos.motivo || undefined,
        idioma: idioma(),
        consentimiento: !!estado.datos.consiente,
        sitio_web: tr.value,
      };
      if (d.nombre.length < 2 || d.apellidos.length < 2 || d.telefono.length < 8 || !d.consentimiento) {
        estado.error = t.faltan; pintar(); return;
      }
      if (!d.correo) delete d.correo;
      estado.mandando = true; estado.error = ""; pintar();
      mandar(d).then(function (j) {
        estado.mandando = false;
        if (j && j.ok) {
          estado.fase = "enviado";
        } else {
          // El motivo viene del servidor ("ese horario acaba de ocuparse…") y
          // se muestra tal cual: es lo único que el paciente puede accionar.
          estado.error = (j && j.motivo) || t.faltan;
          // Si se ocupó, conviene refrescar los huecos.
          if (j && j.motivo && /ocup/i.test(j.motivo)) { estado.hora = null; pedirHuecos(); return; }
        }
        pintar();
      });
    };

    hijos(f, [rej, envM, trampa, envC, err, btn]);
    return f;
  }

  function restaurarFoco(nombre, cursor) {
    if (!nombre || !caja) return;
    var campoNuevo = caja.querySelector('[name="' + nombre + '"]');
    if (!campoNuevo || campoNuevo === document.activeElement) return;
    campoNuevo.focus();
    try { if (cursor != null) campoNuevo.setSelectionRange(cursor, cursor); } catch (e) { /* select y checkbox no lo admiten */ }
  }

  function pintar() {
    if (!caja) return;
    var t = T[idioma()];
    langPintado = idioma();

    /* Se recuerda DÓNDE estaba el cursor. Re-pintar reconstruye los campos, y
     * sin esto el paciente pierde el foco a media palabra cada vez que el
     * runtime de la página repinta — el valor ya no se pierde, pero escribir
     * se vuelve exasperante. */
    var activo = document.activeElement;
    var foco = activo && caja.contains(activo) && activo.name ? activo.name : null;
    var cursor = foco && activo.selectionStart != null ? activo.selectionStart : null;

    while (caja.firstChild) caja.removeChild(caja.firstChild);
    setTimeout(function () { restaurarFoco(foco, cursor); }, 0);

    if (estado.fase === "cargando") {
      caja.appendChild(el("p", FUENTE + "text-align:center; color:" + C.grisSuave + "; padding:2.5rem 0;", t.cargando));
      return;
    }

    if (estado.fase === "sincupo") {
      var s = el("div", "text-align:center; padding:2rem 1rem;");
      hijos(s, [
        el("p", FUENTE + "color:" + C.gris + "; font-size:0.98rem; margin-bottom:0.5rem;", t.sinCupo),
        el("p", FUENTE + "color:" + C.grisSuave + "; font-size:0.88rem; line-height:1.7;", t.usaFormulario),
      ]);
      caja.appendChild(s);
      return;
    }

    if (estado.fase === "enviado") {
      var ok = el("div", "text-align:center; padding:2.2rem 1rem;");
      var e = etiquetaDia(estado.fecha, t);
      hijos(ok, [
        el("div", "font-size:2rem; line-height:1; margin-bottom:0.8rem;", "✓"),
        el("h3", "font-family:'Playfair Display',serif; font-size:1.4rem; color:" + C.tinta + "; margin-bottom:0.6rem; font-weight:500;", t.listoT),
        el("p", FUENTE + "font-size:1.05rem; color:" + C.tinta + "; margin-bottom:0.8rem;",
          e.dia + " " + e.num + " " + e.mes + " · " + estado.hora + " h"),
        el("p", FUENTE + "font-size:0.88rem; color:" + C.gris + "; line-height:1.7; max-width:420px; margin:0 auto;", t.listoD),
      ]);
      var otra = el("button", FUENTE + "margin-top:1.4rem; background:none; border:1px solid " + C.borde +
        "; color:" + C.tinta + "; padding:0.6rem 1.3rem; border-radius:6px; font-size:0.85rem; cursor:pointer;", t.otra);
      otra.type = "button";
      otra.onclick = function () {
        estado = { fase: "cargando", dias: [], fecha: null, hora: null, error: "", mandando: false };
        pintar(); pedirHuecos();
      };
      ok.appendChild(otra);
      caja.appendChild(ok);
      return;
    }

    /* --- eligiendo --- */
    caja.appendChild(el("p", TITULO, t.elijaDia));
    var tira = el("div", "display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch;");
    for (var i = 0; i < estado.dias.length; i++) tira.appendChild(chipDia(estado.dias[i], t));
    caja.appendChild(tira);

    var dia = null;
    for (var k = 0; k < estado.dias.length; k++) if (estado.dias[k].fecha === estado.fecha) dia = estado.dias[k];
    if (dia) {
      caja.appendChild(el("p", TITULO + "margin-top:1.8rem;", t.elijaHora));
      var rej = el("div", "display:grid; grid-template-columns:repeat(auto-fill,minmax(84px,1fr)); gap:8px;");
      for (var j = 0; j < dia.horas.length; j++) rej.appendChild(chipHora(dia.horas[j]));
      caja.appendChild(rej);
      caja.appendChild(el("p", FUENTE + "font-size:0.74rem; color:" + C.grisSuave + "; margin-top:0.7rem;", t.zona));
    }

    if (estado.hora) caja.appendChild(bloqueFormulario(t));
  }

  /* El runtime de la página reconcilia su propio árbol cuando cambia de idioma
   * o al redimensionar, y en esas REEMPLAZA el nodo de montaje por uno nuevo.
   *
   * ⚠ Por eso NO se guarda una referencia al hueco: se vuelve a buscar por id
   * cada vez. Guardándola, el widget se pintaba una vez y desaparecía para
   * siempre — el nodo viejo seguía conteniendo la caja, así que nada delataba
   * el problema; simplemente ya no estaba en la página. Pasó.
   *
   * El estado vive en JS, así que volver a colgarlo no pierde nada. */
  function revisarMontaje() {
    var hueco = document.getElementById("agenda-quiru");
    if (!hueco) return;
    if (!hueco.contains(caja)) { hueco.appendChild(caja); pintar(); }
    else if (idioma() !== langPintado) pintar();
  }

  function observarMontaje() {
    new MutationObserver(revisarMontaje).observe(document.body, { childList: true, subtree: true });
  }

  /* El runtime pinta su árbol después de cargar, así que al primer intento el
   * punto de montaje puede no existir todavía. Se espera hasta 10 s; si nunca
   * aparece, no se rompe nada: el formulario de siempre sigue abajo. */
  function esperarHueco(alHaber) {
    var t0 = Date.now();
    (function ver() {
      var h = document.getElementById("agenda-quiru");
      if (h) return alHaber(h);
      if (Date.now() - t0 < 10000) setTimeout(ver, 120);
    })();
  }

  /* `window.agendaQuiru` no es un resto de depuración: si algún día el recuadro
   * sale en blanco, escribir `agendaQuiru` en la consola dice en qué paso se
   * quedó. Un widget que falla en silencio cuesta una tarde de adivinanzas. */
  function arrancar() {
    window.agendaQuiru = "buscando el punto de montaje";
    esperarHueco(function (h) {
      try { montar(h); window.agendaQuiru = "montada"; }
      catch (e) { window.agendaQuiru = "error al montar: " + e.message; }
    });
  }

  function montar(hueco) {
    caja = el("div", null);
    hueco.appendChild(caja);
    pintar();
    pedirHuecos();
    observarMontaje();
    // El botón de idioma no emite evento propio, y una re-pintada del runtime
    // puede no disparar el observador. Se revisa de tanto en tanto.
    setInterval(revisarMontaje, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();

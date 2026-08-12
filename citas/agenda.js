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

  /* GENERADO por `scripts/generar-ladas.mjs` del repo del expediente — NO editar
     a mano. Claves de pais (E.164) con nombre en español e inglés. */
  var LADAS = [
    { c: "+52", es: "México", en: "Mexico" },
    { c: "+1", es: "Estados Unidos", en: "United States" },
    { c: "+1", es: "Canadá", en: "Canada" },
    { c: "+93", es: "Afganistán", en: "Afghanistan" },
    { c: "+358", es: "Alandia", en: "Åland Islands" },
    { c: "+355", es: "Albania", en: "Albania" },
    { c: "+49", es: "Alemania", en: "Germany" },
    { c: "+376", es: "Andorra", en: "Andorra" },
    { c: "+244", es: "Angola", en: "Angola" },
    { c: "+1", es: "Anguilla", en: "Anguilla" },
    { c: "+1", es: "Antigua y Barbuda", en: "Antigua and Barbuda" },
    { c: "+966", es: "Arabia Saudí", en: "Saudi Arabia" },
    { c: "+213", es: "Argelia", en: "Algeria" },
    { c: "+54", es: "Argentina", en: "Argentina" },
    { c: "+374", es: "Armenia", en: "Armenia" },
    { c: "+297", es: "Aruba", en: "Aruba" },
    { c: "+61", es: "Australia", en: "Australia" },
    { c: "+43", es: "Austria", en: "Austria" },
    { c: "+994", es: "Azerbaiyán", en: "Azerbaijan" },
    { c: "+1", es: "Bahamas", en: "Bahamas" },
    { c: "+973", es: "Bahrein", en: "Bahrain" },
    { c: "+880", es: "Bangladesh", en: "Bangladesh" },
    { c: "+1", es: "Barbados", en: "Barbados" },
    { c: "+32", es: "Bélgica", en: "Belgium" },
    { c: "+501", es: "Belice", en: "Belize" },
    { c: "+229", es: "Benín", en: "Benin" },
    { c: "+1", es: "Bermudas", en: "Bermuda" },
    { c: "+375", es: "Bielorrusia", en: "Belarus" },
    { c: "+591", es: "Bolivia", en: "Bolivia" },
    { c: "+387", es: "Bosnia y Herzegovina", en: "Bosnia and Herzegovina" },
    { c: "+267", es: "Botswana", en: "Botswana" },
    { c: "+55", es: "Brasil", en: "Brazil" },
    { c: "+673", es: "Brunei", en: "Brunei" },
    { c: "+359", es: "Bulgaria", en: "Bulgaria" },
    { c: "+226", es: "Burkina Faso", en: "Burkina Faso" },
    { c: "+257", es: "Burundi", en: "Burundi" },
    { c: "+975", es: "Bután", en: "Bhutan" },
    { c: "+238", es: "Cabo Verde", en: "Cape Verde" },
    { c: "+855", es: "Camboya", en: "Cambodia" },
    { c: "+237", es: "Camerún", en: "Cameroon" },
    { c: "+599", es: "Caribe Neerlandés", en: "Caribbean Netherlands" },
    { c: "+974", es: "Catar", en: "Qatar" },
    { c: "+235", es: "Chad", en: "Chad" },
    { c: "+420", es: "Chequia", en: "Czechia" },
    { c: "+56", es: "Chile", en: "Chile" },
    { c: "+86", es: "China", en: "China" },
    { c: "+357", es: "Chipre", en: "Cyprus" },
    { c: "+39", es: "Ciudad del Vaticano", en: "Vatican City" },
    { c: "+57", es: "Colombia", en: "Colombia" },
    { c: "+269", es: "Comoras", en: "Comoros" },
    { c: "+242", es: "Congo", en: "Congo" },
    { c: "+243", es: "Congo (Rep. Dem.)", en: "DR Congo" },
    { c: "+850", es: "Corea del Norte", en: "North Korea" },
    { c: "+82", es: "Corea del Sur", en: "South Korea" },
    { c: "+225", es: "Costa de Marfil", en: "Ivory Coast" },
    { c: "+506", es: "Costa Rica", en: "Costa Rica" },
    { c: "+385", es: "Croacia", en: "Croatia" },
    { c: "+53", es: "Cuba", en: "Cuba" },
    { c: "+599", es: "Curazao", en: "Curaçao" },
    { c: "+45", es: "Dinamarca", en: "Denmark" },
    { c: "+253", es: "Djibouti", en: "Djibouti" },
    { c: "+1", es: "Dominica", en: "Dominica" },
    { c: "+593", es: "Ecuador", en: "Ecuador" },
    { c: "+20", es: "Egipto", en: "Egypt" },
    { c: "+503", es: "El Salvador", en: "El Salvador" },
    { c: "+971", es: "Emiratos Árabes Unidos", en: "United Arab Emirates" },
    { c: "+291", es: "Eritrea", en: "Eritrea" },
    { c: "+421", es: "Eslovaquia", en: "Slovakia" },
    { c: "+386", es: "Eslovenia", en: "Slovenia" },
    { c: "+34", es: "España", en: "Spain" },
    { c: "+372", es: "Estonia", en: "Estonia" },
    { c: "+268", es: "Esuatini", en: "Eswatini" },
    { c: "+251", es: "Etiopía", en: "Ethiopia" },
    { c: "+63", es: "Filipinas", en: "Philippines" },
    { c: "+358", es: "Finlandia", en: "Finland" },
    { c: "+679", es: "Fiyi", en: "Fiji" },
    { c: "+33", es: "Francia", en: "France" },
    { c: "+241", es: "Gabón", en: "Gabon" },
    { c: "+220", es: "Gambia", en: "Gambia" },
    { c: "+995", es: "Georgia", en: "Georgia" },
    { c: "+233", es: "Ghana", en: "Ghana" },
    { c: "+350", es: "Gibraltar", en: "Gibraltar" },
    { c: "+30", es: "Grecia", en: "Greece" },
    { c: "+1", es: "Grenada", en: "Grenada" },
    { c: "+299", es: "Groenlandia", en: "Greenland" },
    { c: "+590", es: "Guadalupe", en: "Guadeloupe" },
    { c: "+1", es: "Guam", en: "Guam" },
    { c: "+502", es: "Guatemala", en: "Guatemala" },
    { c: "+594", es: "Guayana Francesa", en: "French Guiana" },
    { c: "+44", es: "Guernsey", en: "Guernsey" },
    { c: "+224", es: "Guinea", en: "Guinea" },
    { c: "+240", es: "Guinea Ecuatorial", en: "Equatorial Guinea" },
    { c: "+245", es: "Guinea-Bisáu", en: "Guinea-Bissau" },
    { c: "+592", es: "Guyana", en: "Guyana" },
    { c: "+509", es: "Haití", en: "Haiti" },
    { c: "+504", es: "Honduras", en: "Honduras" },
    { c: "+852", es: "Hong Kong", en: "Hong Kong" },
    { c: "+36", es: "Hungría", en: "Hungary" },
    { c: "+91", es: "India", en: "India" },
    { c: "+62", es: "Indonesia", en: "Indonesia" },
    { c: "+964", es: "Irak", en: "Iraq" },
    { c: "+98", es: "Iran", en: "Iran" },
    { c: "+353", es: "Irlanda", en: "Ireland" },
    { c: "+47", es: "Isla Bouvet", en: "Bouvet Island" },
    { c: "+44", es: "Isla de Man", en: "Isle of Man" },
    { c: "+61", es: "Isla de Navidad", en: "Christmas Island" },
    { c: "+672", es: "Isla de Norfolk", en: "Norfolk Island" },
    { c: "+354", es: "Islandia", en: "Iceland" },
    { c: "+1", es: "Islas Caimán", en: "Cayman Islands" },
    { c: "+61", es: "Islas Cocos o Islas Keeling", en: "Cocos (Keeling) Islands" },
    { c: "+682", es: "Islas Cook", en: "Cook Islands" },
    { c: "+298", es: "Islas Faroe", en: "Faroe Islands" },
    { c: "+500", es: "Islas Georgias del Sur y Sandwich del Sur", en: "South Georgia" },
    { c: "+500", es: "Islas Malvinas", en: "Falkland Islands" },
    { c: "+1", es: "Islas Marianas del Norte", en: "Northern Mariana Islands" },
    { c: "+692", es: "Islas Marshall", en: "Marshall Islands" },
    { c: "+64", es: "Islas Pitcairn", en: "Pitcairn Islands" },
    { c: "+677", es: "Islas Salomón", en: "Solomon Islands" },
    { c: "+47", es: "Islas Svalbard y Jan Mayen", en: "Svalbard and Jan Mayen" },
    { c: "+690", es: "Islas Tokelau", en: "Tokelau" },
    { c: "+1", es: "Islas Turks y Caicos", en: "Turks and Caicos Islands" },
    { c: "+1", es: "Islas Ultramarinas Menores de Estados Unidos", en: "United States Minor Outlying Islands" },
    { c: "+1", es: "Islas Vírgenes de los Estados Unidos", en: "United States Virgin Islands" },
    { c: "+1", es: "Islas Vírgenes del Reino Unido", en: "British Virgin Islands" },
    { c: "+972", es: "Israel", en: "Israel" },
    { c: "+39", es: "Italia", en: "Italy" },
    { c: "+1", es: "Jamaica", en: "Jamaica" },
    { c: "+81", es: "Japón", en: "Japan" },
    { c: "+44", es: "Jersey", en: "Jersey" },
    { c: "+962", es: "Jordania", en: "Jordan" },
    { c: "+7", es: "Kazajistán", en: "Kazakhstan" },
    { c: "+254", es: "Kenia", en: "Kenya" },
    { c: "+996", es: "Kirguizistán", en: "Kyrgyzstan" },
    { c: "+686", es: "Kiribati", en: "Kiribati" },
    { c: "+383", es: "Kosovo", en: "Kosovo" },
    { c: "+965", es: "Kuwait", en: "Kuwait" },
    { c: "+856", es: "Laos", en: "Laos" },
    { c: "+266", es: "Lesotho", en: "Lesotho" },
    { c: "+371", es: "Letonia", en: "Latvia" },
    { c: "+961", es: "Líbano", en: "Lebanon" },
    { c: "+231", es: "Liberia", en: "Liberia" },
    { c: "+218", es: "Libia", en: "Libya" },
    { c: "+423", es: "Liechtenstein", en: "Liechtenstein" },
    { c: "+370", es: "Lituania", en: "Lithuania" },
    { c: "+352", es: "Luxemburgo", en: "Luxembourg" },
    { c: "+853", es: "Macao", en: "Macau" },
    { c: "+389", es: "Macedonia del Norte", en: "North Macedonia" },
    { c: "+261", es: "Madagascar", en: "Madagascar" },
    { c: "+60", es: "Malasia", en: "Malaysia" },
    { c: "+265", es: "Malawi", en: "Malawi" },
    { c: "+960", es: "Maldivas", en: "Maldives" },
    { c: "+223", es: "Mali", en: "Mali" },
    { c: "+356", es: "Malta", en: "Malta" },
    { c: "+212", es: "Marruecos", en: "Morocco" },
    { c: "+596", es: "Martinica", en: "Martinique" },
    { c: "+230", es: "Mauricio", en: "Mauritius" },
    { c: "+222", es: "Mauritania", en: "Mauritania" },
    { c: "+262", es: "Mayotte", en: "Mayotte" },
    { c: "+691", es: "Micronesia", en: "Micronesia" },
    { c: "+373", es: "Moldavia", en: "Moldova" },
    { c: "+377", es: "Mónaco", en: "Monaco" },
    { c: "+976", es: "Mongolia", en: "Mongolia" },
    { c: "+382", es: "Montenegro", en: "Montenegro" },
    { c: "+1", es: "Montserrat", en: "Montserrat" },
    { c: "+258", es: "Mozambique", en: "Mozambique" },
    { c: "+95", es: "Myanmar", en: "Myanmar" },
    { c: "+264", es: "Namibia", en: "Namibia" },
    { c: "+674", es: "Nauru", en: "Nauru" },
    { c: "+977", es: "Nepal", en: "Nepal" },
    { c: "+505", es: "Nicaragua", en: "Nicaragua" },
    { c: "+227", es: "Níger", en: "Niger" },
    { c: "+234", es: "Nigeria", en: "Nigeria" },
    { c: "+683", es: "Niue", en: "Niue" },
    { c: "+47", es: "Noruega", en: "Norway" },
    { c: "+687", es: "Nueva Caledonia", en: "New Caledonia" },
    { c: "+64", es: "Nueva Zelanda", en: "New Zealand" },
    { c: "+968", es: "Omán", en: "Oman" },
    { c: "+31", es: "Países Bajos", en: "Netherlands" },
    { c: "+92", es: "Pakistán", en: "Pakistan" },
    { c: "+680", es: "Palau", en: "Palau" },
    { c: "+970", es: "Palestina", en: "Palestine" },
    { c: "+507", es: "Panamá", en: "Panama" },
    { c: "+675", es: "Papúa Nueva Guinea", en: "Papua New Guinea" },
    { c: "+595", es: "Paraguay", en: "Paraguay" },
    { c: "+51", es: "Perú", en: "Peru" },
    { c: "+689", es: "Polinesia Francesa", en: "French Polynesia" },
    { c: "+48", es: "Polonia", en: "Poland" },
    { c: "+351", es: "Portugal", en: "Portugal" },
    { c: "+1", es: "Puerto Rico", en: "Puerto Rico" },
    { c: "+44", es: "Reino Unido", en: "United Kingdom" },
    { c: "+236", es: "República Centroafricana", en: "Central African Republic" },
    { c: "+1", es: "República Dominicana", en: "Dominican Republic" },
    { c: "+262", es: "Reunión", en: "Réunion" },
    { c: "+250", es: "Ruanda", en: "Rwanda" },
    { c: "+40", es: "Rumania", en: "Romania" },
    { c: "+7", es: "Rusia", en: "Russia" },
    { c: "+212", es: "Sahara Occidental", en: "Western Sahara" },
    { c: "+590", es: "Saint Martin", en: "Saint Martin" },
    { c: "+685", es: "Samoa", en: "Samoa" },
    { c: "+1", es: "Samoa Americana", en: "American Samoa" },
    { c: "+590", es: "San Bartolomé", en: "Saint Barthélemy" },
    { c: "+1", es: "San Cristóbal y Nieves", en: "Saint Kitts and Nevis" },
    { c: "+378", es: "San Marino", en: "San Marino" },
    { c: "+508", es: "San Pedro y Miquelón", en: "Saint Pierre and Miquelon" },
    { c: "+1", es: "San Vicente y Granadinas", en: "Saint Vincent and the Grenadines" },
    { c: "+290", es: "Santa Elena, Ascensión y Tristán de Acuña", en: "Saint Helena, Ascension and Tristan da Cunha" },
    { c: "+1", es: "Santa Lucía", en: "Saint Lucia" },
    { c: "+239", es: "Santo Tomé y Príncipe", en: "São Tomé and Príncipe" },
    { c: "+221", es: "Senegal", en: "Senegal" },
    { c: "+381", es: "Serbia", en: "Serbia" },
    { c: "+248", es: "Seychelles", en: "Seychelles" },
    { c: "+232", es: "Sierra Leone", en: "Sierra Leone" },
    { c: "+65", es: "Singapur", en: "Singapore" },
    { c: "+1", es: "Sint Maarten", en: "Sint Maarten" },
    { c: "+963", es: "Siria", en: "Syria" },
    { c: "+252", es: "Somalia", en: "Somalia" },
    { c: "+94", es: "Sri Lanka", en: "Sri Lanka" },
    { c: "+27", es: "Sudáfrica", en: "South Africa" },
    { c: "+249", es: "Sudán", en: "Sudan" },
    { c: "+211", es: "Sudán del Sur", en: "South Sudan" },
    { c: "+46", es: "Suecia", en: "Sweden" },
    { c: "+41", es: "Suiza", en: "Switzerland" },
    { c: "+597", es: "Surinam", en: "Suriname" },
    { c: "+66", es: "Tailandia", en: "Thailand" },
    { c: "+886", es: "Taiwán", en: "Taiwan" },
    { c: "+255", es: "Tanzania", en: "Tanzania" },
    { c: "+992", es: "Tayikistán", en: "Tajikistan" },
    { c: "+246", es: "Territorio Británico del Océano Índico", en: "British Indian Ocean Territory" },
    { c: "+262", es: "Tierras Australes y Antárticas Francesas", en: "French Southern and Antarctic Lands" },
    { c: "+670", es: "Timor Oriental", en: "Timor-Leste" },
    { c: "+228", es: "Togo", en: "Togo" },
    { c: "+676", es: "Tonga", en: "Tonga" },
    { c: "+1", es: "Trinidad y Tobago", en: "Trinidad and Tobago" },
    { c: "+216", es: "Túnez", en: "Tunisia" },
    { c: "+993", es: "Turkmenistán", en: "Turkmenistan" },
    { c: "+90", es: "Turquía", en: "Türkiye" },
    { c: "+688", es: "Tuvalu", en: "Tuvalu" },
    { c: "+380", es: "Ucrania", en: "Ukraine" },
    { c: "+256", es: "Uganda", en: "Uganda" },
    { c: "+598", es: "Uruguay", en: "Uruguay" },
    { c: "+998", es: "Uzbekistán", en: "Uzbekistan" },
    { c: "+678", es: "Vanuatu", en: "Vanuatu" },
    { c: "+58", es: "Venezuela", en: "Venezuela" },
    { c: "+84", es: "Vietnam", en: "Vietnam" },
    { c: "+681", es: "Wallis y Futuna", en: "Wallis and Futuna" },
    { c: "+967", es: "Yemen", en: "Yemen" },
    { c: "+260", es: "Zambia", en: "Zambia" },
    { c: "+263", es: "Zimbabue", en: "Zimbabwe" },
  ];

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
      pais: "Clave del país",
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
      pais: "Country code",
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

  /* Identificadores para atar cada <label> a su campo (2026-08-05).
   *
   * Sin `for`/`id` un lector de pantalla anuncia "cuadro de texto" sin decir
   * cuál, y —esto lo nota cualquiera— tocar la palabra "Teléfono" no lleva el
   * cursor al campo. En un teléfono, donde el blanco es chico, ese toque
   * perdido es un paciente peleándose con el formulario en el último paso. */
  var nId = 0;
  function idUnico(p) { nId++; return "ag-" + p + "-" + nId; }

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
    /* `lada` arranca en +52 y NO se adivina del idioma de la página: muchos
       extranjeros que viven en Vallarta tienen número mexicano, y un valor
       deducido mal es justo el fallo que este campo viene a cerrar. El
       consultorio está en México; quien tenga otro país lo elige, y se ve. */
    datos: { nombre: "", apellidos: "", telefono: "", lada: "+52", ladaIdx: 0, correo: "", motivo: "", consiente: false },
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
    /* El día se lee de corrido y se dice si está elegido. Suelto, un lector de
       pantalla dictaba "vie 6 ago" en tres trozos y nunca decía cuál estaba
       seleccionado: quien no ve la pantalla no tenía forma de saber en qué día
       estaba parado. */
    b.setAttribute("aria-label", e.dia + " " + e.num + " de " + e.mes);
    b.setAttribute("aria-pressed", sel ? "true" : "false");
    hijos(b, [
      el("span", "font-size:0.7rem; opacity:0.75;", e.dia),
      el("span", "font-size:1.25rem; font-weight:500; line-height:1;", e.num),
      el("span", "font-size:0.68rem; opacity:0.7;", e.mes),
    ]);
    b.onclick = function () { estado.fecha = dia.fecha; estado.hora = null; estado.error = ""; pintar(); };
    return b;
  }

  function chipHora(h, t) {
    var sel = h === estado.hora;
    /* `min-height:44px`: era de ~36 px y 44 es el mínimo que se toca sin fallar.
       Este es EL botón del embudo —el paciente ya decidió, sólo le falta
       apretar— y fallar el toque aquí, en una rejilla apretada, es elegir una
       hora que no era o abandonar. Sube el alto, no el ancho: la rejilla se
       queda igual. */
    var b = el("button", FUENTE +
      "padding:0.55rem 0.2rem; min-height:44px; border-radius:8px; cursor:pointer; font-size:0.92rem;" +
      "border:1px solid " + (sel ? C.tinta : C.borde) + ";" +
      "background:" + (sel ? C.tinta : "#fff") + "; color:" + (sel ? C.crema : C.gris) + ";" +
      "transition:all .15s ease;", h);
    b.type = "button";
    // La hora sola no dice de qué día es, y en esta pantalla hay 21 días.
    var e = estado.fecha ? etiquetaDia(estado.fecha, t) : null;
    b.setAttribute("aria-label", e ? (h + " del " + e.num + " de " + e.mes) : h);
    b.setAttribute("aria-pressed", sel ? "true" : "false");
    b.onclick = function () { estado.hora = h; estado.error = ""; pintar(); };
    return b;
  }

  function campo(etiqueta, nombre, tipo) {
    var env = el("div", "display:flex; flex-direction:column; gap:5px;");
    var l = el("label", FUENTE + "font-size:0.78rem; color:" + C.gris + ";", etiqueta);
    var i = el("input", FUENTE +
      "padding:0.65rem 0.75rem; min-height:44px; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff;");
    i.type = tipo || "text";
    i.id = idUnico(nombre);
    l.setAttribute("for", i.id);
    // Los tres primeros son obligatorios y la etiqueta ya lleva el asterisco;
    // decirlo también aquí es lo que hace que el navegador y el lector de
    // pantalla lo traten como tal, en vez de que el asterisco sea un adorno.
    if (etiqueta.indexOf("*") >= 0) i.required = true;
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

  /* El teléfono, con su CLAVE DE PAÍS aparte (2026-08-12).
   *
   * Pedido por el Dr. al ver que la primera cita que entró por aquí venía de un
   * número de Estados Unidos. Diez dígitos NO dicen de qué país son —México y
   * Estados Unidos usan diez—, y el expediente asumía México: el recordatorio de
   * esa cita habría salido a un número mexicano que no existe, y el fallo se ve
   * como "mensaje no entregado" sin decir por qué.
   *
   * Un solo campo confiando en que la persona escriba el "+1" no sirve: la mitad
   * lo omite y la otra mitad lo escribe de tres formas distintas. */
  function campoTelefono(t) {
    var env = el("div", "display:flex; flex-direction:column; gap:5px;");
    var l = el("label", FUENTE + "font-size:0.78rem; color:" + C.gris + ";", t.telefono + " *");
    var fila = el("div", "display:flex; gap:6px;");

    var sel = el("select", FUENTE +
      "padding:0.65rem 0.4rem; min-height:44px; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff; flex:0 0 auto;");
    sel.name = "lada";
    // El <label> visible es del teléfono; el selector se anuncia solo, o un
    // lector de pantalla lo lee como "cuadro combinado" sin decir de qué.
    sel.setAttribute("aria-label", t.pais);
    /* La lista completa (248 claves), con el nombre del pais en el idioma de la
       pagina. Viene ordenada con Mexico, Estados Unidos y Canada primero —de ahi
       llega casi toda la gente que agenda en Vallarta— y el resto alfabetico:
       en un <select> nativo se busca tecleando las primeras letras.

       ⚠ EL `value` DE CADA OPCION ES SU INDICE, NO LA CLAVE. Veintiseis paises
       comparten el +1, asi que las claves NO son unicas: con la clave como
       valor, el navegador selecciona la PRIMERA opcion que la tenga y quien
       eligio "Jamaica" veia "Estados Unidos" en cuanto el runtime de la pagina
       repinta el widget. Se manda `LADAS[i].c`, que es lo unico que le importa
       al expediente, y se recuerda el indice para volver a pintar lo mismo. */
    var esEs = idioma() === "es";
    for (var k = 0; k < LADAS.length; k++) {
      sel.appendChild(new Option(LADAS[k].c + " · " + (esEs ? LADAS[k].es : LADAS[k].en), String(k)));
    }
    sel.value = String(estado.datos.ladaIdx || 0);
    sel.onchange = function () {
      var i = Number(sel.value) || 0;
      estado.datos.ladaIdx = i;
      estado.datos.lada = LADAS[i].c;
    };

    var inp = el("input", FUENTE +
      "padding:0.65rem 0.75rem; min-height:44px; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff; flex:1 1 auto; min-width:0;");
    inp.type = "tel";
    inp.name = "telefono";
    inp.required = true;
    inp.id = idUnico("telefono");
    inp.autocomplete = "tel";
    l.setAttribute("for", inp.id);
    inp.value = estado.datos.telefono || "";
    inp.oninput = function () { estado.datos.telefono = inp.value; };

    hijos(fila, [sel, inp]);
    hijos(env, [l, fila]);
    return env;
  }

  function bloqueFormulario(t) {
    var f = el("div", "margin-top:2rem;");
    hijos(f, [el("p", TITULO, t.susDatos)]);

    var rej = el("div", "display:grid; grid-template-columns:" +
      (window.innerWidth < 700 ? "1fr" : "1fr 1fr") + "; gap:1rem;");
    var cNombre = campo(t.nombre + " *", "nombre");
    var cApell = campo(t.apellidos + " *", "apellidos");
    var cTel = campoTelefono(t);
    var cMail = campo(t.correo, "correo", "email");
    hijos(rej, [cNombre, cApell, cTel, cMail]);

    var envM = el("div", "display:flex; flex-direction:column; gap:5px; margin-top:1rem;");
    var lM = el("label", FUENTE + "font-size:0.78rem; color:" + C.gris + ";", t.motivo);
    var sel = el("select", FUENTE +
      "padding:0.65rem 0.75rem; min-height:44px; border:1px solid " + C.borde + "; border-radius:8px;" +
      "font-size:0.95rem; color:" + C.tinta + "; background:#fff;");
    sel.id = idUnico("motivo");
    lM.setAttribute("for", sel.id);
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
        lada: estado.datos.lada || "+52",
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
        /* ⚠ `datos` TIENE que venir en el estado nuevo.
         *
         * Sin él, la siguiente pintada del formulario revienta en
         * `estado.datos[nombre]` —leer una propiedad de undefined— justo después
         * de haber vaciado la caja: el widget se queda EN BLANCO y no hay forma
         * de agendar otra cita sin recargar la página. Nadie lo reportó porque
         * pasa después de agendar bien, o sea cuando el paciente ya se fue.
         *
         * Se reinicia vacío a propósito: esta página la abre cualquiera, y el
         * nombre y el teléfono de quien acaba de agendar no se le quedan
         * escritos al siguiente. */
        estado = {
          fase: "cargando", dias: [], fecha: null, hora: null, error: "", mandando: false,
          datos: { nombre: "", apellidos: "", telefono: "", lada: "+52", ladaIdx: 0, correo: "", motivo: "", consiente: false },
        };
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
      for (var j = 0; j < dia.horas.length; j++) rej.appendChild(chipHora(dia.horas[j], t));
      caja.appendChild(rej);
      caja.appendChild(el("p", FUENTE + "font-size:0.74rem; color:" + C.grisSuave + "; margin-top:0.7rem;", t.zona));

      /* Al elegir un día la lista de horas cambia entera, y eso pasaba en
         SILENCIO: quien navega con lector de pantalla se quedaba oyendo la tira
         de días sin enterarse de que abajo ya había horarios. Este renglón lo
         dice; es invisible en pantalla, no cambia el diseño. */
      var eDia = etiquetaDia(estado.fecha, t);
      var aviso = el("p",
        "position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap;",
        dia.horas.length + " horarios disponibles el " + eDia.num + " de " + eDia.mes);
      aviso.setAttribute("role", "status");
      aviso.setAttribute("aria-live", "polite");
      caja.appendChild(aviso);
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

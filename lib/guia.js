/* =============================================================================
   IMPROVEFIT · guia.js
   «Cómo apuntarte», como un asistente: una pantalla cada vez.

   Lo que tiene que hacer bien, por encima de ser bonito:
     · Que siempre se sepa dónde estás: «Paso 3 de 8», una barra que se llena
       y, en el ordenador, la lista entera de pasos a la izquierda con los
       que ya has visto marcados.
     · Que siempre se vea cómo seguir: «Atrás» y «Siguiente: lo que viene»,
       grandes y pegados abajo.
     · Que nada quede escondido: se ve un paso y solo uno, entero, desde su
       título. Al cambiar de paso se sube arriba.
     · Que se pueda ir de todas las formas: botones, lista de pasos, flechas
       del teclado y, en el móvil, deslizando el dedo.
     · Que si se vuelve otro día, se pueda seguir donde se dejó.
     · Que en cualquier momento se pueda llamar.

   Tiene que ir ANTES que documento.js y dinamicas.js: crea los huecos de la
   tarjeta de la app, las dudas y la calculadora, y ellos los rellenan.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;

  var host = $('[data-guia]');
  if (!host) return;

  var G = (B.copy || {}).guia;
  if (!G || !(G.pasos || []).length) { host.remove(); return; }

  var pasos = G.pasos;
  var total = pasos.length;
  /* La bienvenida no cuenta como paso: se numera del segundo en adelante */
  var conBienvenida = (pasos[0].medio || {}).tipo === 'bienvenida';
  var numerados = conBienvenida ? total - 1 : total;
  function numero(i) { return conBienvenida ? i : i + 1; }

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var R = B.reservas || {};
  var urlReserva = R.url || (IF.sedePrincipal || {}).reserva || '';
  var CLAVE = 'if_guia_v2';

  var flechaDer = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var flechaIzq = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var icoTel = ICO.tel;

  /* =======================================================================
     1. LO QUE SE ENSEÑA EN CADA PASO
     ==================================================================== */
  function juego(f) {
    return (f.webp || [480, 800]).map(function (w) {
      return esc(f.img) + '-' + w + '.webp ' + w + 'w';
    }).join(', ');
  }
  function respaldo(f) { return esc(f.respaldo || (f.img + '-1200.jpg')); }

  function medio(p) {
    var m = p.medio || {};

    if (m.tipo === 'bienvenida') {
      return '<div class="bienvenida">' +
        '<figure class="bienvenida__foto foto">' +
          '<picture>' +
            '<source type="image/webp" srcset="assets/img/foto-sonrisa-480.webp 480w, assets/img/foto-sonrisa-800.webp 800w" sizes="(min-width: 1000px) 34vw, 92vw">' +
            '<img src="assets/img/foto-sonrisa-1200.jpg" width="1200" height="900" alt="Una mujer mayor sonríe mientras hace ejercicio en un gimnasio." decoding="async">' +
          '</picture>' +
        '</figure>' +
        '<ul class="caminos">' +
          '<li><button class="camino camino--principal" type="button" data-ir-paso="1">' +
            '<span class="camino__texto"><b>Empezar la guía</b><span>Te lo enseñamos todo, paso a paso</span></span><i>' + flechaDer + '</i>' +
          '</button></li>' +
          '<li><a class="camino" href="' + esc(urlReserva) + '" target="_blank" rel="noopener">' +
            '<span class="camino__texto"><b>Ya tengo cuenta</b><span>Ir directamente a reservar</span></span><i>' + flechaDer + '</i>' +
          '</a></li>' +
          '<li><a class="camino" href="tel:' + esc(B.contacto.telefono) + '">' +
            '<span class="camino__texto"><b>Prefiero hablar con alguien</b><span>Llamar al ' + esc(B.contacto.telefonoTexto) + '</span></span><i>' + icoTel + '</i>' +
          '</a></li>' +
        '</ul>' +
      '</div>';
    }

    if (m.tipo === 'foto') {
      return '<figure class="guia-foto' + (m.vertical ? ' guia-foto--vertical' : '') + '">' +
        '<div class="foto">' +
          '<picture>' +
            '<source type="image/webp" srcset="' + juego(m) + '" sizes="(min-width: 1000px) 34vw, 92vw">' +
            '<img src="' + respaldo(m) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async">' +
          '</picture>' +
        '</div>' +
        (m.pie ? '<figcaption>' + esc(m.pie) + '</figcaption>' : '') +
      '</figure>';
    }

    if (m.tipo === 'fotos') {
      return '<div class="guia-fotos">' +
        (m.lista || []).map(function (f) {
          return '<figure>' +
            '<div class="foto">' +
              '<picture>' +
                '<source type="image/webp" srcset="' + juego(f) + '" sizes="(min-width: 1000px) 14vw, 30vw">' +
                '<img src="' + respaldo(f) + '" width="1200" height="900" alt="' + esc(f.alt) + '" loading="lazy" decoding="async">' +
              '</picture>' +
            '</div>' +
            (f.pie ? '<figcaption>' + esc(f.pie) + '</figcaption>' : '') +
          '</figure>';
        }).join('') +
      '</div>';
    }

    if (m.tipo === 'capturas') {
      return '<div class="guia-capturas">' +
        (m.lista || []).map(function (c) {
          return '<div class="movil movil--foto">' +
            '<picture>' +
              '<source type="image/webp" srcset="' + esc(c.img) + '-480.webp 480w, ' + esc(c.img) + '-900.webp 900w" sizes="(min-width: 1000px) 15rem, 60vw">' +
              '<img src="' + esc(c.img) + '-900.jpg" width="' + c.ancho + '" height="' + c.alto + '" alt="' + esc(c.alt) + '" loading="lazy" decoding="async">' +
            '</picture>' +
          '</div>';
        }).join('') +
      '</div>';
    }

    if (m.tipo === 'qr') {
      return '<div class="guia-qr">' +
        '<picture>' +
          '<source type="image/webp" srcset="' + esc(R.qr.src) + '.webp 560w" sizes="13rem">' +
          '<img src="' + esc(R.qr.src) + '.png" width="280" height="280" alt="' + esc(R.qr.alt) + '" loading="lazy" decoding="async">' +
        '</picture>' +
        '<p><b>¿Lo estás viendo en el ordenador?</b> Apunta a este código con la cámara del móvil y se abre allí.</p>' +
        '<p class="guia-qr__nota">' + esc(R.nota) + '</p>' +
      '</div>';
    }

    if (m.tipo === 'cierre') {
      return '<div class="guia-cierre">' +
        '<div class="fiesta" aria-hidden="true">' + [0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(function (n) { return '<i style="--a:' + (n * 360 / 14) + 'deg;--d:' + (5 + (n % 3) * 2.5) + 'rem"></i>'; }).join('') + '</div>' +
        '<a class="btn btn--naranja btn--bloque btn--grande" href="' + esc(urlReserva) + '" target="_blank" rel="noopener">Reservar mi clase gratis</a>' +
        '<a class="btn btn--bloque btn--grande" href="tel:' + esc(B.contacto.telefono) + '">' + icoTel + 'Llamar al ' + esc(B.contacto.telefonoTexto) + '</a>' +
        '<a class="btn btn--bloque btn--grande" href="' + esc(IF.waUrl(B.copy.whatsapp.generico)) + '" target="_blank" rel="noopener">' + ICO.wa + 'Escribir por WhatsApp</a>' +
      '</div>';
    }

    if (m.tipo === 'hueco') {
      return '<div class="' + esc(m.clase || '') + '" ' + esc(m.host) + '></div>';
    }
    return '';
  }

  /* El botón de «hazlo ahora» de los pasos que piden hacer algo */
  function accion(p) {
    var a = p.accion;
    if (!a) return '';
    var url = a.enlace === 'reserva' ? urlReserva : a.url;
    if (!url) return '';
    return '<div class="paso-guia__accion">' +
      '<a class="btn btn--naranja btn--grande" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(a.texto) + flechaDer + '</a>' +
      '<p>Se abre en otra pestaña. Cuando termines, vuelve aquí y pulsa «Siguiente».</p>' +
    '</div>';
  }

  /* =======================================================================
     2. LAS PANTALLAS
     ==================================================================== */
  function pantalla(p, i) {
    var lista = (p.lista || []).length
      ? '<ol class="paso-guia__lista">' + p.lista.map(function (t, n) {
          return '<li><span aria-hidden="true">' + (n + 1) + '</span><p>' + esc(t) + '</p></li>';
        }).join('') + '</ol>'
      : '';
    var tipo = (p.medio || {}).tipo;
    var ancho = tipo === 'hueco';
    var cuenta = (conBienvenida && i === 0) ? '' :
      '<p class="paso-guia__cuenta">' + esc(G.contador || 'Paso') + ' ' + numero(i) + ' de ' + numerados + '</p>';

    return '<section class="paso-guia paso-guia--' + esc(tipo || 'texto') + (ancho ? ' paso-guia--ancho' : '') + '"' +
        ' id="paso-' + esc(p.id) + '" data-indice="' + i + '" aria-labelledby="h-paso-' + esc(p.id) + '" hidden>' +
      '<div class="paso-guia__texto">' +
        cuenta +
        '<h2 class="paso-guia__titulo" id="h-paso-' + esc(p.id) + '" tabindex="-1">' + esc(p.titulo) + '</h2>' +
        '<p class="paso-guia__parrafo">' + esc(p.texto) + '</p>' +
        accion(p) +
        lista +
        (p.nota ? '<p class="paso-guia__nota">' + ICO.info + '<span>' + esc(p.nota) + '</span></p>' : '') +
      '</div>' +
      '<div class="paso-guia__medio">' + medio(p) + '</div>' +
    '</section>';
  }

  /* El esqueleto entero: índice a la izquierda, escena a la derecha */
  var indice = pasos.map(function (p, i) {
    return '<li><button class="indice__paso" type="button" data-ir-paso="' + i + '">' +
      '<span class="indice__n" aria-hidden="true"><b>' + (conBienvenida && i === 0 ? '·' : numero(i)) + '</b>' + ICO.check + '</span>' +
      '<span class="indice__nombre">' + esc(p.rotulo) + '</span>' +
    '</button></li>';
  }).join('');

  host.className = 'asistente';
  host.innerHTML =
    '<aside class="asistente__lado" aria-label="Todos los pasos">' +
      '<p class="asistente__eti">' + esc(G.titulo) + '</p>' +
      '<details class="asistente__lista" data-lista>' +
        '<summary><span data-cuenta-corta></span><b>Ver los pasos</b></summary>' +
        '<ol class="indice">' + indice + '</ol>' +
      '</details>' +
      '<div class="asistente__barra" aria-hidden="true"><i data-avance></i></div>' +
      '<div class="asistente__ayuda">' +
        '<p><b>' + esc(G.ayudaTitulo || '¿Te has liado?') + '</b> ' + esc(G.ayudaTexto || '') + '</p>' +
        '<a class="btn btn--grande" href="tel:' + esc(B.contacto.telefono) + '">' + icoTel + esc(B.contacto.telefonoTexto) + '</a>' +
      '</div>' +
    '</aside>' +
    '<div class="asistente__escena">' +
      '<div class="asistente__volver" data-volver hidden></div>' +
      '<div class="asistente__pantallas" data-pantallas>' + pasos.map(pantalla).join('') + '</div>' +
      '<nav class="asistente__nav" aria-label="Pasar de paso">' +
        '<button class="btn btn--grande asistente__atras" type="button" data-mover="-1">' + flechaIzq + '<span>Atrás</span></button>' +
        '<button class="btn btn--naranja btn--grande asistente__sigue" type="button" data-mover="1"><span data-sigue-texto>Siguiente</span>' + flechaDer + '</button>' +
      '</nav>' +
    '</div>';

  var pantallas = $$('.paso-guia', host);
  var botonesIndice = $$('.indice__paso', host);
  var lista = $('[data-lista]', host);
  var avance = $('[data-avance]', host);
  var cuentaCorta = $('[data-cuenta-corta]', host);
  var atras = $('[data-mover="-1"]', host);
  var sigue = $('[data-mover="1"]', host);
  var sigueTexto = $('[data-sigue-texto]', host);
  var escena = $('.asistente__escena', host);

  /* En el ordenador la lista de pasos va siempre abierta */
  var grande = window.matchMedia('(min-width: 1000px)');
  function listaSegunPantalla() { lista.open = grande.matches; }
  listaSegunPantalla();
  if (grande.addEventListener) grande.addEventListener('change', listaSegunPantalla);

  /* =======================================================================
     3. POR DÓNDE VAS
     ==================================================================== */
  var actual = -1;
  var vistos = {};
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify({ paso: actual, vistos: vistos, cuando: Date.now() })); } catch (e) {}
  }
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { return null; }
  }

  function ir(i, opciones) {
    opciones = opciones || {};
    i = Math.max(0, Math.min(total - 1, i));
    if (i === actual) return;
    var antes = actual;
    var haciaAtras = antes > i;

    /* Fuera la pantalla de antes, dentro la nueva, entrando por el lado que toca */
    if (antes > -1) {
      var aviso = $('[data-volver]', host);
      if (aviso) aviso.hidden = true;
      pantallas[antes].hidden = true;
      pantallas[antes].classList.remove('entra', 'entra--atras');
    }
    var nueva = pantallas[i];
    nueva.hidden = false;
    if (!quieto && antes > -1) {
      nueva.classList.remove('entra', 'entra--atras');
      void nueva.offsetWidth;
      nueva.classList.add(haciaAtras ? 'entra--atras' : 'entra');
    }
    /* Lo que aparece al bajar, dentro de un paso oculto, no llegó a verse */
    $$('[data-revelar], [data-mascara]', nueva).forEach(function (n) { n.classList.add('visible'); });

    actual = i;
    vistos[i] = true;

    /* El índice: el de ahora encendido, los vistos con su marca */
    botonesIndice.forEach(function (b, n) {
      b.classList.toggle('es-actual', n === i);
      b.classList.toggle('es-visto', !!vistos[n] && n !== i);
      if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var pct = (conBienvenida && i === 0) ? 0 : numero(i) / numerados * 100;
    avance.style.width = pct.toFixed(1) + '%';
    cuentaCorta.textContent = (conBienvenida && i === 0)
      ? 'Inicio de la guía'
      : (G.contador || 'Paso') + ' ' + numero(i) + ' de ' + numerados + ': ' + pasos[i].rotulo;

    /* Los botones de abajo: qué hay detrás y qué hay delante */
    atras.hidden = i === 0;
    var sig = pasos[i + 1];
    sigue.hidden = !sig || (conBienvenida && i === 0);
    if (sig) sigueTexto.textContent = 'Siguiente: ' + sig.rotulo;
    host.classList.toggle('es-inicio', conBienvenida && i === 0);
    host.classList.toggle('es-final', i === total - 1);
    if (i === total - 1 && !quieto) {
      var fiesta = $('.fiesta', nueva);
      if (fiesta) { fiesta.classList.remove('suelta'); void fiesta.offsetWidth; fiesta.classList.add('suelta'); }
    }

    if (!grande.matches) lista.open = false;
    try { history.replaceState(null, '', '#paso-' + pasos[i].id); } catch (e) {}
    guardar();
    IF.medir('guia_paso', { paso: pasos[i].id, numero: i });

    /* Arriba del todo, y el foco al título para quien usa lector de pantalla */
    if (!opciones.sinSubir) {
      var tope = host.getBoundingClientRect().top + window.scrollY - 80;
      if (window.scrollY > tope) window.scrollTo({ top: Math.max(0, tope), behavior: 'auto' });
      var h = $('.paso-guia__titulo', nueva);
      if (h) h.focus({ preventScroll: true });
    }
  }

  /* =======================================================================
     4. CÓMO SE PASA DE PASO
     ==================================================================== */
  host.addEventListener('click', function (e) {
    var m = e.target.closest('[data-mover]');
    if (m) { ir(actual + +m.getAttribute('data-mover')); return; }
    var p = e.target.closest('[data-ir-paso]');
    if (p) { ir(+p.getAttribute('data-ir-paso')); }
  });

  /* Enlaces #paso-loquesea desde cualquier sitio de la página */
  function desdeDireccion() {
    var id = (location.hash || '').replace('#paso-', '');
    for (var n = 0; n < total; n++) if (pasos[n].id === id) return n;
    return -1;
  }
  window.addEventListener('hashchange', function () {
    var n = desdeDireccion();
    if (n > -1) ir(n);
  });

  /* Teclado: flechas a los lados, salvo dentro de un campo */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
  });

  /* Móvil: deslizar el dedo de lado. Tiene que ser un gesto claro y más de
     lado que de alto, para no confundirlo con bajar la página. */
  var toque = null;
  escena.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1 || e.target.closest('input, select, textarea, .calc')) { toque = null; return; }
    toque = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  escena.addEventListener('touchend', function (e) {
    if (!toque) return;
    var dx = e.changedTouches[0].clientX - toque.x;
    var dy = e.changedTouches[0].clientY - toque.y;
    var rapido = Date.now() - toque.t < 700;
    toque = null;
    if (rapido && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) ir(actual + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* =======================================================================
     5. ARRANQUE
     ==================================================================== */
  document.documentElement.classList.add('guia-asistente');

  var guardado = leer();
  var desdeUrl = desdeDireccion();
  if (guardado && guardado.vistos) vistos = guardado.vistos;

  if (desdeUrl > -1) {
    ir(desdeUrl, { sinSubir: true });
  } else {
    ir(0, { sinSubir: true });
    /* Si ya estuvo aquí hace poco y no terminó, se le ofrece seguir */
    var hace = guardado ? Date.now() - (guardado.cuando || 0) : Infinity;
    if (guardado && guardado.paso > 0 && guardado.paso < total - 1 && pasos[guardado.paso] && hace < 1000 * 60 * 60 * 24 * 30) {
      var caja = $('[data-volver]', host);
      caja.innerHTML =
        '<p><b>' + esc(G.volverTitulo) + '</b> Te quedaste en el paso ' + numero(guardado.paso) + ': ' + esc(pasos[guardado.paso].rotulo) + '.</p>' +
        '<div class="fila">' +
          '<button class="btn btn--naranja" type="button" data-seguir>' + esc(G.volverSeguir) + '</button>' +
          '<button class="btn" type="button" data-de-nuevo>' + esc(G.volverEmpezar) + '</button>' +
        '</div>';
      caja.hidden = false;
      $('[data-seguir]', caja).addEventListener('click', function () { caja.hidden = true; ir(guardado.paso); });
      $('[data-de-nuevo]', caja).addEventListener('click', function () {
        caja.hidden = true; vistos = {}; vistos[0] = true;
        botonesIndice.forEach(function (b) { b.classList.remove('es-visto'); });
        guardar();
      });
    }
  }
})();

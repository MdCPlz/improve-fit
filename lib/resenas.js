/* =============================================================================
   IMPROVEFIT · resenas.js
   Carrusel infinito de opiniones y nota media de Google.

   La nota se pide a la función serverless de ajustes.ratingEndpoint y se
   guarda 12 h en el navegador. Si no hay función o falla, se usan los
   valores de respaldo del manifest. Si tampoco los hay, no se pinta nota.

   Si no hay ninguna reseña en el manifest, la sección entera desaparece:
   preferimos que no haya nada antes que poner testimonios inventados.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, esc = IF.esc, ICO = IF.ICO;

  var seccion = $('[data-resenas]');
  if (!seccion) return;

  var R = B.resenas || {};
  var items = (R.items || []).filter(function (r) { return r && r.texto; });

  if (!items.length) { seccion.remove(); return; }

  /* ---------- Nota media ------------------------------------------------- */
  var CLAVE = 'if_rating_v1';
  var VIDA = 12 * 60 * 60 * 1000;

  function cache() {
    try {
      var c = JSON.parse(localStorage.getItem(CLAVE));
      if (c && Date.now() - c.t < VIDA) return c.v;
    } catch (e) {}
    return null;
  }
  function guardar(v) {
    try { localStorage.setItem(CLAVE, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
  }

  function estrellas(n) {
    var llenas = Math.round(n || 0);
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += '<span style="opacity:' + (i < llenas ? 1 : .25) + '">' + ICO.estrella + '</span>';
    }
    return '<span class="estrellas" role="img" aria-label="' + (n || 0) + ' sobre 5">' + s + '</span>';
  }

  function pintarNota(datos) {
    var caja = $('[data-nota]', seccion);
    if (!caja) return;
    if (!datos || datos.nota == null) { caja.remove(); return; }
    caja.innerHTML =
      estrellas(datos.nota) +
      '<span class="resenas__media">' + String(datos.nota).replace('.', ',') + '</span>' +
      '<span>sobre 5' + (datos.total ? ' · ' + datos.total + ' reseñas en Google' : '') + '</span>' +
      (R.urlPerfil ? '<a class="enlace" href="' + esc(R.urlPerfil) + '" target="_blank" rel="noopener">Verlas en Google ' + ICO.flecha + '</a>' : '');
  }

  function pedirNota() {
    var previo = cache();
    if (previo) { pintarNota(previo); return; }

    var respaldo = R.respaldo || {};
    var url = B.ajustes.ratingEndpoint;

    if (!url) { pintarNota(respaldo); return; }

    pintarNota(respaldo);   // se ve algo mientras llega la respuesta
    fetch(url, { headers: { accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        if (d && d.nota != null) { guardar(d); pintarNota(d); }
      })
      .catch(function () { /* se queda el respaldo */ });
  }

  /* ---------- Carrusel --------------------------------------------------- */
  function tarjeta(r) {
    var inicial = (r.autor || '?').trim().charAt(0).toUpperCase();
    return '<figure class="resena">' +
      (r.nota ? estrellas(r.nota) : '') +
      '<blockquote class="resena__texto">' + esc(r.texto) + '</blockquote>' +
      '<figcaption class="resena__autor">' +
        '<span class="resena__inicial" aria-hidden="true">' + esc(inicial) + '</span>' +
        '<span>' + esc(r.autor || 'Anónimo') +
          (r.fuente ? ' · ' + esc(r.fuente) : '') +
        '</span>' +
      '</figcaption>' +
    '</figure>';
  }

  function pintarCarrusel() {
    var pista = $('[data-carrusel]', seccion);
    if (!pista) return;
    // Quietas, de tres en tres: las opiniones no se mueven solas
    pista.innerHTML = items.slice(0, 6).map(tarjeta).join('');
  }

  pedirNota();
  pintarCarrusel();
})();

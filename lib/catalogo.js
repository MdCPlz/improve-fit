/* =============================================================================
   IMPROVEFIT · catalogo.js
   Pinta las clases desde el manifest, agrupadas por sala. Sin buscador ni
   filtros: tres bloques, uno por sala, y dentro cada clase en una fila con su
   duración y un «Leer más». Pensado para quien no quiere tener que buscar.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;

  var host = $('[data-catalogo]');
  if (!host) return;

  var fase = B.ajustes.fase || 1;
  var textosFase = B.ajustes.faseTextos[fase] || B.ajustes.faseTextos[1];
  var cats = B.catalogo.categorias || [];
  var items = (B.catalogo.items || []).filter(function (i) { return i.activo !== false; });

  /* Lo de la ficha, dicho con palabras: «60 min» → «60 minutos» */
  function duracionLlana(d) { return String(d || '').replace(/\bmin\b\.?/, 'minutos'); }
  function plazasLlanas(p) {
    p = String(p || '');
    if (p === '1:1') return 'Tú solo con el entrenador';
    if (p === 'Grupo') return 'En grupo';
    var m = p.match(/^(\d+)\s*plazas?$/);
    if (m) return 'Máximo ' + m[1] + ' personas';
    return p;
  }

  /* Opciones de la fase 2 (frecuencia, franja...) para el botón de añadir */
  function opciones(i) {
    return (i.opciones || []).map(function (clave) {
      var o = (B.catalogo.opciones || {})[clave];
      if (!o) return '';
      var id = 'op-' + i.id + '-' + clave;
      return '<div class="opcion">' +
        '<label class="opcion__label" for="' + id + '">' + esc(o.nombre) + '</label>' +
        '<select id="' + id + '" data-opcion="' + esc(clave) + '">' +
          o.valores.map(function (v) {
            return '<option value="' + esc(v.id) + '">' + esc(v.nombre) + '</option>';
          }).join('') +
        '</select>' +
      '</div>';
    }).join('');
  }

  /* ---------- Una clase: una fila ---------------------------------------- */
  function fila(i) {
    var insignia = i.gratis ? 'Primera clase gratis' : '';
    var precio = (fase === 2 && i.precio != null)
      ? '<p class="ficha__precio">' + esc(i.precio) + ' €<small> al mes</small></p>' : '';
    var pie = fase === 2
      ? '<div class="clase__compra">' + precio + opciones(i) +
          '<button class="btn btn--naranja" type="button" data-anadir="' + esc(i.id) + '">' + esc(textosFase.ctaCatalogo) + '</button>' +
        '</div>'
      : '';

    return '<li class="clase" data-item="' + esc(i.id) + '">' +
      '<div class="clase__cabeza">' +
        '<h3>' + esc(i.nombre) + '</h3>' +
        '<p class="clase__datos">' +
          '<span>' + ICO.reloj + esc(duracionLlana(i.duracion)) + '</span>' +
          '<span>' + ICO.grupo + esc(plazasLlanas(i.plazas)) + '</span>' +
        '</p>' +
      '</div>' +
      (insignia ? '<p class="clase__insignia">' + esc(insignia) + '</p>' : '') +
      '<p class="clase__resumen">' + esc(i.resumen) + '</p>' +
      '<details class="clase__mas">' +
        '<summary>Leer más</summary>' +
        '<p>' + esc(i.detalle) + '</p>' +
      '</details>' +
      pie +
    '</li>';
  }

  /* ---------- Una sala: foto, para quién es y sus clases ------------------ */
  function sala(c) {
    var suyas = items.filter(function (i) { return i.cat === c.id; });
    if (!suyas.length) return '';
    var wa = IF.waUrl('Hola, me interesa ' + (c.nombreSencillo || c.nombre).toLowerCase() + ' («' + c.nombre + '»). ¿Me contáis horarios y precio?');

    return '<section class="zona-clases" id="' + esc(c.id) + '" aria-labelledby="h-' + esc(c.id) + '">' +
      '<header class="zona-clases__cabeza">' +
        '<figure class="zona-clases__foto foto">' +
          '<picture>' +
            '<source type="image/webp" srcset="' + esc(c.img) + '-480.webp 480w, ' + esc(c.img) + '-800.webp 800w" sizes="(min-width: 900px) 36vw, 92vw">' +
            '<img src="' + esc(c.img) + '-1200.jpg" width="1200" height="900" alt="' + esc(c.alt || c.nombre) + '" loading="lazy" decoding="async">' +
          '</picture>' +
        '</figure>' +
        '<div class="zona-clases__texto">' +
          '<h2 id="h-' + esc(c.id) + '">' + esc(c.nombreSencillo || c.nombre) + '</h2>' +
          '<p class="zona-clases__para">' + esc(c.paraSencillo || c.para) + '</p>' +
          (c.nombreSencillo ? '<p class="sala__marca">En el centro la llamamos «' + esc(c.nombre) + '».</p>' : '') +
          '<p class="zona-clases__cuenta">' + (suyas.length === 1 ? 'Una clase' : suyas.length + ' clases distintas') + '</p>' +
          (fase === 1 ? '<a class="btn btn--grande" href="' + esc(wa) + '" target="_blank" rel="noopener">' + ICO.wa + 'Preguntar por WhatsApp</a>' : '') +
        '</div>' +
      '</header>' +
      '<ul class="clases-lista">' + suyas.map(fila).join('') + '</ul>' +
    '</section>';
  }

  /* ---------- Estructura ------------------------------------------------- */
  host.innerHTML =
    '<nav class="saltos" aria-label="Ir a una sala">' +
      '<p class="saltos__titulo">Ir directamente a:</p>' +
      '<div class="saltos__botones">' +
        cats.map(function (c) {
          return '<a class="btn" href="#' + esc(c.id) + '">' + esc(c.nombreSencillo || c.nombre) + '</a>';
        }).join('') +
      '</div>' +
    '</nav>' +
    (fase === 1 ? '<div class="aviso-precios">' + ICO.info + '<p>' + esc(textosFase.avisoPrecios) + '</p></div>' : '') +
    cats.map(sala).join('');

  /* Añadir al plan (fase 2) */
  host.addEventListener('click', function (e) {
    var add = e.target.closest('[data-anadir]');
    if (add && window.IFplan) {
      var elegidas = {};
      $$('select[data-opcion]', add.closest('.clase')).forEach(function (s) {
        elegidas[s.getAttribute('data-opcion')] = s.value;
      });
      window.IFplan.anadir(add.getAttribute('data-anadir'), elegidas);
    }
  });

  /* Leer más: se apunta qué clase interesa, sin más */
  $$('.clase__mas', host).forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) IF.medir('leer_clase', { clase: d.closest('.clase').getAttribute('data-item') });
    });
  });

  /* Las salas se pintan después de cargar: si se llega con #six-max, se baja */
  if (location.hash) {
    var destino = document.getElementById(location.hash.slice(1));
    if (destino && host.contains(destino)) {
      requestAnimationFrame(function () { destino.scrollIntoView(); });
    }
  }
})();

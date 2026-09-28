/* =============================================================================
   IMPROVEFIT · documento.js
   Todas las piezas de contenido de la web: los números de la portada, los
   miedos, el «mantén pulsado», los casos, los pasos, las tarifas, las zonas
   y el reproductor del tour. Todo se pinta desde el manifest.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;

  /* ---------- Marquesina de palabras ------------------------------------- */
  function marquesina() {
    var host = $('[data-marquesina]');
    if (!host) return;
    var palabras = (B.copy.portada.marquesina || []);
    if (!palabras.length) { host.remove(); return; }
    var bloque = '<span>' + palabras.map(esc).join('</span><span>') + '</span>';
    host.innerHTML = '<div class="marquesina__pista">' + bloque + bloque + '</div>';
  }

  /* ---------- La fila de datos de la portada ------------------------------
     Sitio, cuántos centros, cuántas salas y cuántas clases. Todo contado del
     manifest: si abren un tercer centro, aquí se entera solo.
     ------------------------------------------------------------------- */
  function metaPortada() {
    var host = $('[data-meta-portada]');
    if (!host) return;

    var letras = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
    function enLetra(n) { return letras[n] || String(n); }

    var sede = IF.sedePrincipal || {};
    var centros = (B.sedes || []).length;
    var salas = (B.catalogo.categorias || []).length;
    var clases = (B.catalogo.items || []).filter(function (i) { return i.activo !== false; }).length;


    var trozos = [
      '<b>' + esc(sede.ciudad + ', ' + sede.provincia) + '</b>',
      esc(enLetra(centros) + (centros === 1 ? ' centro' : ' centros')),
      esc(enLetra(salas) + (salas === 1 ? ' sala' : ' salas')),
      esc(clases + ' clases')
    ];

    trozos.push('<span class="hero__meta__fin">' + esc('Primera clase gratis') + '</span>');

    host.innerHTML = trozos.map(function (t) { return '<span>' + t + '</span>'; }).join('');
  }

  /* ---------- La portada en corto ------------------------------------------
     Cada bloque responde una pregunta: qué hay, cómo se empieza, dónde y
     cuándo. Las salas van con su nombre de siempre delante y el de la casa
     detrás, para que nadie tenga que adivinar qué es «SIX MAX».
     ------------------------------------------------------------------- */
  function horaLlana(h) { return String(h).replace(/^0/, ''); }

  function inicio() {
    var I = (B.copy || {}).inicio;
    if (!I) return;

    var prom = $('[data-inicio-promesas]');
    if (prom) {
      prom.innerHTML = (I.promesas || []).map(function (p) {
        return '<li>' + ICO.check + '<span>' + esc(p) + '</span></li>';
      }).join('');
    }

    var salas = $('[data-zonas-sencillas]');
    if (salas) {
      /* La tarjeta entera es el enlace: se acierta aunque el pulso no sea fino */
      var flechaDer = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      salas.innerHTML = (B.catalogo.categorias || []).map(function (c, n) {
        return '<article class="sala luz" id="' + esc(c.id) + '" data-revelar style="--retraso:' + (n * 120) + 'ms">' +
          '<a class="sala__enlace" href="clases.html#' + esc(c.id) + '">' +
            '<figure class="sala__foto foto">' +
              '<picture>' +
                '<source type="image/webp" srcset="' + esc(c.img) + '-480.webp 480w, ' + esc(c.img) + '-800.webp 800w" sizes="(min-width: 1020px) 30vw, (min-width: 720px) 46vw, 92vw">' +
                '<img src="' + esc(c.img) + '-1200.jpg" width="1200" height="900" alt="' + esc(c.alt || c.nombre) + '" loading="lazy" decoding="async">' +
              '</picture>' +
            '</figure>' +
            '<div class="sala__texto">' +
              '<h3>' + esc(c.nombreSencillo || c.nombre) + '</h3>' +
              '<p class="sala__para">' + esc(c.paraSencillo || c.para) + '</p>' +
              (c.nombreSencillo ? '<p class="sala__marca">' + esc(I.queHayMarca) + ' «' + esc(c.nombre) + '».</p>' : '') +
              '<span class="sala__ir">' + esc(I.queHayEnlace) + '<i>' + flechaDer + '</i></span>' +
            '</div>' +
          '</a>' +
        '</article>';
      }).join('');
    }

    /* Así trabajamos: el sello redondo y las tres razones */
    var sello = $('[data-asi-sello]');
    if (sello && I.asiSello) {
      sello.innerHTML = '<span><b>' + esc(I.asiSello.numero) + '</b>' + esc(I.asiSello.texto) + '</span>';
    }
    var razones = $('[data-razones]');
    if (razones) {
      var iconos = {
        grupo: ICO.grupo,
        ajuste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2"/><circle cx="10" cy="17" r="2.2"/></svg>',
        lesion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h6M12 8v6"/></svg>'
      };
      razones.innerHTML = (I.razones || []).map(function (r, n) {
        return '<li class="razon luz" data-revelar style="--retraso:' + (n * 120) + 'ms">' +
          '<span class="razon__icono">' + (iconos[r.icono] || ICO.check) + '</span>' +
          '<div><h3>' + esc(r.titulo) + '</h3><p>' + esc(r.texto) + '</p></div>' +
        '</li>';
      }).join('');
    }

    var emp = $('[data-empezar]');
    if (emp) {
      emp.innerHTML = (I.empezar || []).map(function (p, i) {
        return '<li class="empezar__paso" data-revelar style="--retraso:' + (i * 150) + 'ms">' +
          '<span class="empezar__n" aria-hidden="true">' + (i + 1) + '</span>' +
          '<div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></div>' +
        '</li>';
      }).join('');
    }

    /* El horario, dicho como se diría por teléfono */
    var hor = $('[data-horario-sencillo]');
    if (hor) {
      var h = B.horario || {};
      var franjas = (h.entreno || []).map(function (f) {
        return 'de ' + horaLlana(f.desde) + ' a ' + horaLlana(f.hasta);
      });
      var abierto = IF.abiertoAhora ? IF.abiertoAhora() : false;
      hor.innerHTML =
        '<p class="estado" data-abierto="' + abierto + '"><i></i>' + (abierto ? 'Abierto ahora' : 'Cerrado ahora') + '</p>' +
        '<div class="horario-llano">' +
          '<p class="horario-llano__dias">' + esc(h.dias || '') + '</p>' +
          '<p class="horario-llano__horas">' + franjas.map(esc).join('<br>y ') + '</p>' +
          (h.cerrado ? '<p class="horario-llano__cerrado">' + esc(h.cerrado) + '</p>' : '') +
        '</div>';
    }
  }

  /* ---------- Ficha técnica · los números de la portada ------------------- */
  function cifras() {
    var host = $('[data-cifras]');
    if (!host) return;
    var items = (B.copy.cifras.items || []);
    host.innerHTML = items.map(function (c) {
      return '<div class="cifra" data-revelar>' +
        '<b data-hasta="' + c.valor + '" data-sufijo="' + esc(c.sufijo || '') + '">0' + esc(c.sufijo || '') + '</b>' +
        '<span>' + esc(c.etiqueta) + '</span>' +
      '</div>';
    }).join('');

    var nums = $$('b[data-hasta]', host);
    if (IF.menosMovimiento || !('IntersectionObserver' in window)) {
      nums.forEach(function (n) { n.textContent = n.getAttribute('data-hasta') + n.getAttribute('data-sufijo'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: .4 });
    nums.forEach(function (n) { io.observe(n); });

    function contar(n) {
      var hasta = parseFloat(n.getAttribute('data-hasta')) || 0;
      var suf = n.getAttribute('data-sufijo') || '';
      var t0 = performance.now(), dur = 1100;
      (function paso(t) {
        var p = Math.min(1, (t - t0) / dur);
        n.textContent = Math.round(hasta * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(paso);
      })(t0);
    }
  }

  /* ---------- Los tres miedos, como citas -------------------------------- */
  function miedos() {
    var host = $('[data-miedos]');
    if (!host) return;
    host.innerHTML = (B.copy.miedos.items || []).map(function (m, i) {
      var z = (B.catalogo.categorias || []).filter(function (c) { return c.id === m.zona; })[0];
      return '<div class="miedo" data-revelar style="--retraso:' + (i * 90) + 'ms">' +
        '<b>«' + esc(m.miedo) + '»</b>' +
        '<span>' + esc(m.respuesta) + '</span>' +
        (z ? '<a class="enlace" href="clases.html#' + esc(z.id) + '">' + esc(z.nombre) + ' ' + ICO.flecha + '</a>' : '') +
      '</div>';
    }).join('');
  }

  /* ---------- Selector de caso ------------------------------------------- */
  function casos() {
    var host = $('[data-casos]');
    if (!host) return;
    host.innerHTML = (B.copy.selector.casos || []).map(function (c) {
      var z = (B.catalogo.categorias || []).filter(function (x) { return x.id === c.zona; })[0] || {};
      return '<a class="caso" href="clases.html#' + esc(c.zona) + '">' +
        '<span class="caso__texto">' + esc(c.texto) + '</span>' +
        '<span class="caso__destino">' + esc(z.nombre || '') + ' ' + ICO.flecha + '</span>' +
      '</a>';
    }).join('');
  }

  /* ---------- Pasos ------------------------------------------------------ */
  function pasos() {
    var host = $('[data-pasos]');
    if (!host) return;
    host.innerHTML = (B.copy.pasos.items || []).map(function (p) {
      return '<article class="paso" data-revelar>' +
        '<span class="paso__n">' + esc(p.n) + '</span>' +
        '<h3>' + esc(p.titulo) + '</h3>' +
        '<p>' + esc(p.texto) + '</p>' +
      '</article>';
    }).join('');
  }

  /* ---------- Los pasos para hacerse socio -------------------------------
     Tarjetas numeradas, porque son instrucciones. Aquí no hay capturas: de
     la pantalla de alta no existe imagen pública y no se va a inventar una.
     Las capturas reales van en el bloque de abajo.
     ------------------------------------------------------------------- */
  function altaOnline() {
    var host = $('[data-alta-pasos]');
    if (!host) return;
    host.innerHTML = (B.reservas.pasos || []).map(function (p) {
      return '<article class="paso" data-revelar>' +
        '<span class="paso__n">' + esc(p.n) + '</span>' +
        '<h3>' + esc(p.titulo) + '</h3>' +
        '<p>' + esc(p.texto) + '</p>' +
      '</article>';
    }).join('');
  }

  /* ---------- La app de reservas -----------------------------------------
     WodBuster no es nuestra: es la plataforma con la que llevamos las
     reservas. Se presenta con su logo y su nombre. Los enlaces de las
     tiendas salen del manifest.
     ------------------------------------------------------------------- */
  function appReservas() {
    var host = $('[data-app]');
    if (!host) return;
    var R = B.reservas || {};
    var A = R.app;
    if (!A) { host.remove(); return; }

    var principal = (B.sedes || []).filter(function (s) { return s.principal; })[0] || {};
    var web = R.url || principal.reserva || '';

    var tiendas = (A.tiendas || []).map(function (t) {
      return '<a class="app-tienda" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +'<path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>' +
        '<span><b>' + esc(t.sistema) + '</b>' + esc(t.tienda) + '</span>' +
      '</a>';
    }).join('');

    host.innerHTML =
      '<div class="app-tarjeta">' +
        '<div class="app-tarjeta__cabeza">' +
          '<img class="app-tarjeta__icono" src="' + esc(A.icono) + '-256.png" width="256" height="256" alt="' + esc(A.iconoAlt || '') + '" loading="lazy" decoding="async">' +
          '<div>' +
            '<p class="app-tarjeta__reclamo">' + esc(A.reclamo) + '</p>' +
            '<img class="app-tarjeta__logo" src="' + esc(A.logo) + '" width="171" height="32" alt="' + esc(A.nombre) + '" loading="lazy" decoding="async">' +
          '</div>' +
        '</div>' +
        '<p class="app-tarjeta__texto">' + esc(A.descripcion) + '</p>' +
        '<div class="app-tiendas">' + tiendas + '</div>' +
        '<p class="app-tarjeta__nota">' + esc(A.nota) + '</p>' +
      '</div>' +
      '<div class="app-sinapp">' +
        '<p>' + esc(A.sinApp) + '</p>' +
        '<a class="btn btn--naranja btn--bloque" href="' + esc(web) + '" target="_blank" rel="noopener">' + esc(A.sinAppCta) + '</a>' +
        '<div class="app-qr">' +
          '<picture>' +
            '<source type="image/webp" srcset="' + esc(R.qr.src) + '.webp 560w" sizes="9rem">' +
            '<img src="' + esc(R.qr.src) + '.png" width="180" height="180" alt="' + esc(R.qr.alt) + '" loading="lazy" decoding="async">' +
          '</picture>' +
          '<p class="dim">' + esc(R.nota) + '</p>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Así es la app por dentro ------------------------------------
     Capturas REALES: las oficiales de la ficha de WODBUSTER SL en la App
     Store. Se sirven desde assets/img, no enlazadas de fuera, y el crédito
     va escrito debajo. Cada una en su marco de móvil, alternando de lado.
     ------------------------------------------------------------------- */
  function pantallasApp() {
    var host = $('[data-app-pantallas]');
    if (!host) return;
    var A = (B.reservas || {}).app || {};
    var lista = A.pantallas || [];
    if (!lista.length) { var s = host.closest('section'); (s || host).remove(); return; }

    host.innerHTML = lista.map(function (p) {
      var chips = (p.chips || []).map(function (c) {
        return '<span>' + esc(c) + '</span>';
      }).join('');

      return '<article class="parada" data-revelar>' +
        '<div class="movil movil--foto">' +
          '<picture>' +
            '<source type="image/webp" srcset="' + esc(p.img) + '-480.webp 480w, ' + esc(p.img) + '-900.webp 900w" sizes="(min-width: 860px) 15rem, 78vw">' +
            '<img src="' + esc(p.img) + '-900.jpg" width="' + p.ancho + '" height="' + p.alto + '" alt="' + esc(p.alt) + '" loading="lazy" decoding="async">' +
          '</picture>' +
        '</div>' +
        '<div class="parada__texto">' +
          '<p class="parada__paso">' + esc(p.etiqueta) + '</p>' +
          '<h3>' + esc(p.titulo) + '</h3>' +
          '<p>' + esc(p.texto) + '</p>' +
          (chips ? '<div class="parada__chips">' + chips + '</div>' : '') +
        '</div>' +
      '</article>';
    }).join('') +
      (A.creditoPantallas
        ? '<p class="paradas__nota">' + esc(A.creditoPantallas) + '</p>'
        : '');
  }

  /* ---------- Tarifas ----------------------------------------------------
     Solo se pintan con ajustes.fase = 2. Con fase 1 la sección desaparece,
     para no publicar precios sin que nadie los haya revisado.
     ------------------------------------------------------------------- */
  function tarifas() {
    var host = $('[data-tarifas]');
    if (!host) return;
    var seccion = host.closest('section') || host;
    var T = B.tarifas;
    if ((B.ajustes.fase || 1) !== 2 || !T || !(T.grupos || []).length) {
      seccion.remove();
      return;
    }
    host.innerHTML = T.grupos.map(function (g) {
      var sede = (B.sedes || []).filter(function (s) { return s.id === g.sede; })[0] || {};
      return '<div class="apilado" style="gap:var(--s-5)">' +
        '<p class="ante">' + esc(g.nombre) + '</p>' +
        '<div class="tarifas">' +
          (g.planes || []).map(function (p) {
            return '<article class="tarifa' + (p.destacado ? ' tarifa--destacada' : '') + '">' +
              (p.destacado ? '<span class="tarifa__insignia">La más elegida</span>' : '') +
              '<h3>' + esc(p.nombre) + '</h3>' +
              '<p class="tarifa__precio">' + esc(p.precio) + ' €<small>' + esc(p.unidad) + '</small></p>' +
              (p.nota ? '<p class="tarifa__nota">' + esc(p.nota) + '</p>' : '') +
              '<p class="tarifa__centro">' + esc(sede.calle || '') + '</p>' +
              '<a class="btn btn--bloque btn--pequeno mt-4" href="' + esc(IF.waUrl('Hola, me interesa la tarifa «' + p.nombre + '» de ' + g.nombre + '. ¿Me contáis?')) + '" target="_blank" rel="noopener">Preguntar por esta</a>' +
            '</article>';
          }).join('') +
        '</div>' +
      '</div>';
    }).join('');
    var nota = $('[data-tarifas-nota]');
    if (nota) nota.textContent = T.nota || '';
  }

  /* ---------- Zonas en versión documento (páginas interiores) ------------ */
  function zonas() {
    var host = $('[data-zonas]');
    if (!host) return;
    var I = (B.copy || {}).inicio || {};
    host.innerHTML = (B.catalogo.categorias || []).map(function (c, n) {
      /* Los números grandes y lo que significan debajo, en frase */
      var datos = (c.datos || []).map(function (dd) {
        return '<li><b>' + esc(dd.valor) + '</b><span>' + esc(dd.etiqueta) + '</span></li>';
      }).join('');
      return '<article class="zona" id="' + esc(c.id) + '">' +
        '<figure class="zona__media foto" data-mascara>' +
          '<picture>' +
            '<source type="image/webp" srcset="' + esc(c.img) + '-480.webp 480w, ' + esc(c.img) + '-800.webp 800w, ' + esc(c.img) + '-1200.webp 1200w" sizes="(min-width: 960px) 46vw, 92vw">' +
            '<img src="' + esc(c.img) + '-1200.jpg" width="1200" height="900" alt="' + esc(c.alt) + '" loading="lazy" decoding="async">' +
          '</picture>' +
        '</figure>' +
        '<div class="zona__cuerpo" data-revelar>' +
          '<h3 class="zona__titular">' + esc(c.nombreSencillo || c.nombre) + '</h3>' +
          (c.nombreSencillo ? '<p class="sala__marca">' + esc(I.queHayMarca || 'En el centro la llamamos') + ' «' + esc(c.nombre) + '».</p>' : '') +
          '<p class="zona__desc">' + esc(c.descripcion) + '</p>' +
          '<p class="zona__para"><b>¿Para quién es?</b> ' + esc(c.para) + '</p>' +
          (datos ? '<ul class="zona__datos">' + datos + '</ul>' : '') +
          '<div class="zona__pie">' +
            '<a class="btn btn--naranja" href="' + esc(IF.waUrl(c.wa)) + '" target="_blank" rel="noopener">' + ICO.wa + 'Preguntar por WhatsApp</a>' +
            '<a class="btn" href="clases.html#' + esc(c.id) + '">Ver sus clases</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------- Reproductor del tour (páginas interiores) ------------------ */
  function tour() {
    var host = $('[data-tour]');
    if (!host) return;
    var c = B.copy.tour;
    host.innerHTML =
      '<picture>' +
        '<source type="image/webp" srcset="assets/img/tour-poster-360.webp 360w, assets/img/tour-poster-576.webp 576w" sizes="(min-width: 900px) 20rem, 76vw">' +
        '<img src="assets/img/tour-poster-576.jpg" width="576" height="1024" alt="Primer fotograma del tour por dentro del centro de ImproveFit." loading="lazy" decoding="async">' +
      '</picture>' +
      '<button class="reproductor__play" type="button">' +
        '<i aria-hidden="true">' + ICO.play + '</i>' +
        '<span>' + esc(c.boton) + '</span>' +
      '</button>';

    $('.reproductor__play', host).addEventListener('click', function () {
      if ($('video', host)) return;
      var v = document.createElement('video');
      v.src = 'assets/video/tour.mp4';
      v.controls = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('title', 'Tour por dentro de ImproveFit');
      host.insertBefore(v, host.firstChild);
      var pic = $('picture', host);
      if (pic) pic.remove();
      host.classList.add('reproduciendo');
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
      IF.medir('ver_tour');
    });
  }

  /* ---------- Arranque --------------------------------------------------- */
  function iniciar() {
    marquesina();
    inicio();
    metaPortada();
    cifras();
    miedos();
    casos();
    pasos();
    altaOnline();
    appReservas();
    pantallasApp();
    tarifas();
    zonas();
    tour();
    window.IFobservar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

/* =============================================================================
   IMPROVEFIT · nucleo.js
   Lo que comparten todas las páginas: cabecera, pie, botón de WhatsApp,
   cookies, apariciones al hacer scroll, visor de fotos, avisos y datos
   estructurados. Todo sale de window.__BRAND__.
   ========================================================================== */
(function () {
  'use strict';

  var B = window.__BRAND__;
  if (!B) { console.error('[ImproveFit] Falta lib/manifest.js'); return; }

  /* ---------- Utilidades ------------------------------------------------- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ICO = {
    flecha: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2m0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28"/></svg>',
    lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>',
    buscar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
    cerrar: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 2l12 12M14 2 2 14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    estrella: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5-4.8-4.6 6.6-.9z"/></svg>',
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6.5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.6"/></svg>',
    reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
    grupo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><path d="M16 5.3a3 3 0 0 1 0 5.6M18 14.8c1.6.7 2.7 2.3 3 4.7"/></svg>',
    carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l2 11h10l2-8H6.4"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>'
  };

  /* ---------- Atajos de datos -------------------------------------------- */
  var sedePrincipal = (B.sedes || []).filter(function (s) { return s.principal; })[0] || (B.sedes || [])[0] || {};

  function dirTexto(s) {
    if (!s) return '';
    return s.calle + ', ' + s.cp + ' ' + s.ciudad + ', ' + s.provincia;
  }
  function mapsUrl(s) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(dirTexto(s));
  }
  function waUrl(msg) {
    return 'https://wa.me/' + B.contacto.whatsapp + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }
  function pagina() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return p.replace(/\.html$/, '') || 'index';
  }

  /* ---------- Horario: ¿está abierto ahora? ------------------------------ */
  function abiertoAhora() {
    var ahora = new Date();
    var dia = ahora.getDay();               // 0 domingo … 6 sábado
    if (dia === 0 || dia === 6) return false;
    var min = ahora.getHours() * 60 + ahora.getMinutes();
    return (B.horario.entreno || []).some(function (f) {
      var a = f.desde.split(':'), b = f.hasta.split(':');
      return min >= (+a[0] * 60 + +a[1]) && min < (+b[0] * 60 + +b[1]);
    });
  }

  /* =======================================================================
     CABECERA
     Pegajosa, del color del papel, con una regla fina que aparece al bajar
     y una hebra naranja que mide cuánto llevas leído.
     ==================================================================== */
  function pintarCabecera() {
    var host = $('#cabecera');
    if (!host) return;
    var actual = pagina();

    var links = (B.nav || []).map(function (l) {
      var base = l.href.split('#')[0].replace(/\.html$/, '') || 'index';
      var aqui = base === actual ? ' aria-current="page"' : '';
      return '<a class="cabecera__link" href="' + esc(l.href) + '"' + aqui + '>' + esc(l.texto) + '</a>';
    }).join('');

    var menuLinks = (B.nav || []).map(function (l, i) {
      return '<a class="menu__link" href="' + esc(l.href) + '">' + esc(l.texto) + '<span>0' + (i + 1) + '</span></a>';
    }).join('');

    host.innerHTML =
      '<div class="wrap cabecera__barra">' +
        '<a class="marca" href="index.html" aria-label="' + esc(B.negocio.nombre) + ', ir a la portada">' +
          '<img src="assets/icons/icon-64.png" width="34" height="34" alt="" decoding="async">' +
          '<span class="marca__texto">' + esc(B.negocio.nombre) + '</span>' +
        '</a>' +
        '<nav class="cabecera__nav" aria-label="Principal">' + links + '</nav>' +
        '<div class="cabecera__acciones">' +
          '<button class="btn btn--pequeno plan-btn" data-plan-abrir aria-label="Ver tu plan">' +
            ICO.carrito + '<span class="plan-btn__contador" data-plan-contador>0</span>' +
          '</button>' +
          '<a class="cabecera__tel" href="tel:' + esc(B.contacto.telefono) + '" aria-label="Llamar al ' + esc(B.contacto.telefonoTexto) + '">' + ICO.tel + '<span>' + esc(B.contacto.telefonoTexto) + '</span></a>' +
          '<a class="btn btn--naranja btn--pequeno cabecera__cta" href="' + esc(B.reservas.url) + '" target="_blank" rel="noopener">Clase gratis</a>' +
          '<button class="hamburguesa" aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir el menú">' +
            '<i class="hamburguesa__rayas" aria-hidden="true"><span></span><span></span><span></span></i>' +
            '<b class="hamburguesa__txt" aria-hidden="true">Menú</b>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="progreso" data-progreso></div>';

    var menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu-movil';
    menu.setAttribute('data-abierto', 'false');
    menu.innerHTML =
      '<nav aria-label="Menú">' + menuLinks + '</nav>' +
      '<div class="menu__pie">' +
        '<a class="btn btn--naranja" href="' + esc(B.reservas.url) + '" target="_blank" rel="noopener">Reservar clase gratis</a>' +
        '<a class="btn" href="tel:' + esc(B.contacto.telefono) + '">Llamar al ' + esc(B.contacto.telefonoTexto) + '</a>' +
      '</div>';
    document.body.appendChild(menu);

    var burger = $('.hamburguesa', host);
    var abierto = false;
    function alternar(v) {
      abierto = v == null ? !abierto : v;
      burger.setAttribute('aria-expanded', String(abierto));
      burger.setAttribute('aria-label', abierto ? 'Cerrar el menú' : 'Abrir el menú');
      $('.hamburguesa__txt', burger).textContent = abierto ? 'Cerrar' : 'Menú';
      menu.setAttribute('data-abierto', String(abierto));
      document.documentElement.style.overflow = abierto ? 'hidden' : '';
      if (abierto) { var f = $('.menu__link', menu); if (f) f.focus(); }
    }
    burger.addEventListener('click', function () { alternar(); });
    $$('.menu__link, .menu__pie a', menu).forEach(function (a) {
      a.addEventListener('click', function () { alternar(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto) { alternar(false); burger.focus(); }
    });

    // Hebra de progreso de lectura y regla al despegar
    var barra = $('[data-progreso]', host);
    var tick = false;
    function alScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        host.classList.toggle('pegada', window.scrollY > 8);
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, window.scrollY / total) : 0;
        barra.style.setProperty('--avance', (p * 100).toFixed(1) + '%');
        tick = false;
      });
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  }

  /* =======================================================================
     PIE
     ==================================================================== */
  function pintarPie() {
    var host = $('#pie');
    if (!host) return;

    var zonas = (B.catalogo.categorias || []).map(function (c) {
      return '<li><a href="clases.html#' + esc(c.id) + '">' + esc(c.nombreSencillo || c.nombre) + '</a></li>';
    }).join('');

    var redes = (B.redes || []).map(function (r) {
      return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener me">' + esc(r.handle) + '<span class="sr-only"> en Instagram</span></a></li>';
    }).join('');

    var sedes = (B.sedes || []).map(function (s) {
      return '<li><a href="' + esc(mapsUrl(s)) + '" target="_blank" rel="noopener">' + esc(s.calle) + '<span class="dim"> · ' + esc(s.ciudad) + '</span></a></li>';
    }).join('');

    var franjas = (B.horario.entreno || []).map(function (f) {
      return 'de ' + esc(String(f.desde).replace(/^0/, '')) + ' a ' + esc(String(f.hasta).replace(/^0/, ''));
    }).join(' y ');

    host.innerHTML =
      '<div class="wrap">' +
        '<div class="pie__llamada">' +
          '<p>¿Te queda alguna duda? Llámanos.</p>' +
          '<a class="pie__tel" href="tel:' + esc(B.contacto.telefono) + '"><i>' + ICO.tel + '</i>' + esc(B.contacto.telefonoTexto) + '</a>' +
        '</div>' +
        '<div class="pie__grid">' +
          '<div>' +
            '<a class="marca" href="index.html" aria-label="' + esc(B.negocio.nombre) + '">' +
              '<img src="assets/icons/icon-64.png" width="36" height="36" alt="" loading="lazy" decoding="async">' +
              '<span class="marca__texto">' + esc(B.negocio.wordmark) + '</span>' +
            '</a>' +
            '<p class="pie__intro mt-6">' + esc(B.negocio.descripcion) + '</p>' +
            '<p class="estado mt-6" data-estado></p>' +
          '</div>' +
          '<div><h3>Las clases</h3><ul>' + zonas + '</ul></div>' +
          '<div><h3>Contacto</h3><ul>' +
            '<li><a href="' + esc(waUrl(B.copy.whatsapp.generico)) + '" target="_blank" rel="noopener">WhatsApp, para cualquier duda</a></li>' +
            '<li><a href="tel:' + esc(B.contacto.telefono) + '">' + esc(B.contacto.telefonoTexto) + '</a></li>' +
            '<li><a href="mailto:' + esc(B.contacto.email) + '">' + esc(B.contacto.email) + '</a></li>' +
            sedes +
          '</ul></div>' +
          '<div><h3>Horario</h3><ul>' +
            '<li class="dim">' + esc(B.horario.dias) + '</li>' +
            '<li>' + franjas + '</li>' +
            '<li class="dim">' + esc(B.horario.cerrado) + '</li>' +
            '<li class="dim">' + esc(B.horario.vigenteDesde) + '</li>' +
          '</ul>' +
          '<h3 class="mt-8">Redes</h3><ul>' + redes + '</ul></div>' +
        '</div>' +
        '<p class="pie__marca" aria-hidden="true">' + esc(B.negocio.nombre) + '</p>' +
        '<div class="pie__legal">' +
          '<span>© ' + new Date().getFullYear() + ' ' + esc(B.negocio.nombre) + ' · ' + esc(sedePrincipal.ciudad) + ' · ' + esc(B.negocio.claim) + '</span>' +
          '<nav aria-label="Legal">' +
            '<a href="aviso-legal.html">Aviso legal</a>' +
            '<a href="privacidad.html">Privacidad</a>' +
            '<a href="cookies.html">Cookies</a>' +
            '<button type="button" data-cookies-abrir>Preferencias de cookies</button>' +
          '</nav>' +
        '</div>' +
      '</div>';

    var est = $('[data-estado]', host);
    if (est) {
      var ab = abiertoAhora();
      est.setAttribute('data-abierto', String(ab));
      est.innerHTML = '<i></i>' + (ab ? 'Abierto ahora' : 'Cerrado ahora');
    }
  }

  /* =======================================================================
     BOTÓN FLOTANTE DE WHATSAPP
     ==================================================================== */
  function pintarWA() {
    var msg = (B.copy.whatsapp.porPagina || {})[pagina()] || B.copy.whatsapp.generico;
    var a = document.createElement('a');
    a.className = 'wa';
    a.href = waUrl(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', B.copy.whatsapp.etiqueta);
    a.innerHTML = ICO.wa + '<span class="wa__texto">WhatsApp</span>';
    document.body.appendChild(a);
    setTimeout(function () { a.classList.add('visible'); }, 1200);
  }

  /* =======================================================================
     BARRA DE AYUDA
     En el móvil, llamar y escribir siempre a un dedo de distancia y en todas
     las páginas. Es lo primero que busca quien no quiere pelearse con una web.
     ==================================================================== */
  function pintarBarraAyuda() {
    if ($('.ayuda-fija')) return;
    var msg = (B.copy.whatsapp.porPagina || {})[pagina()] || B.copy.whatsapp.generico;
    var barra = document.createElement('div');
    barra.className = 'ayuda-fija';
    barra.innerHTML =
      '<a class="ayuda-fija__btn" href="tel:' + esc(B.contacto.telefono) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
          '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>' +
        '</svg>Llamar</a>' +
      '<a class="ayuda-fija__btn ayuda-fija__btn--wa" href="' + esc(waUrl(msg)) + '" target="_blank" rel="noopener">' +
        ICO.wa + 'WhatsApp</a>';
    document.body.appendChild(barra);
  }

  /* =======================================================================
     COOKIES + ANALÍTICA
     ==================================================================== */
  var CLAVE_COOKIES = 'if_cookies_v1';

  function consentimiento() {
    try { return localStorage.getItem(CLAVE_COOKIES); } catch (e) { return null; }
  }
  function guardarConsentimiento(v) {
    try { localStorage.setItem(CLAVE_COOKIES, v); } catch (e) {}
    document.dispatchEvent(new CustomEvent('cookies:cambio', { detail: v }));
  }

  function cargarAnalitica() {
    var id = B.ajustes.analitica && B.ajustes.analitica.ga4;
    if (!id || window.__ga_cargado) return;
    window.__ga_cargado = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function medir(evento, datos) {
    if (window.gtag) window.gtag('event', evento, datos || {});
  }
  window.IFmedir = medir;

  function pintarCookies() {
    var c = B.copy.cookies;
    var caja = document.createElement('aside');
    caja.className = 'cookies';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-label', c.titulo);
    caja.setAttribute('aria-live', 'polite');
    caja.innerHTML =
      '<h2>' + esc(c.titulo) + '</h2>' +
      '<p>' + esc(c.texto) + ' <a href="cookies.html" style="color:var(--fire);text-decoration:underline">' + esc(c.config) + '</a></p>' +
      '<div class="cookies__acciones">' +
        '<button class="btn btn--naranja btn--pequeno" data-cookies="todas">' + esc(c.aceptar) + '</button>' +
        '<button class="btn btn--pequeno" data-cookies="necesarias">' + esc(c.rechazar) + '</button>' +
      '</div>';
    document.body.appendChild(caja);

    function mostrar() { setTimeout(function () { caja.classList.add('visible'); }, 700); }
    function ocultar() { caja.classList.remove('visible'); }

    $$('[data-cookies]', caja).forEach(function (b) {
      b.addEventListener('click', function () {
        guardarConsentimiento(b.getAttribute('data-cookies'));
        ocultar();
        if (b.getAttribute('data-cookies') === 'todas') cargarAnalitica();
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookies-abrir]')) { e.preventDefault(); caja.classList.add('visible'); }
    });

    if (!consentimiento()) mostrar();
    else if (consentimiento() === 'todas') cargarAnalitica();
  }

  /* =======================================================================
     MAPA CON CONSENTIMIENTO
     ==================================================================== */
  function pintarMapas() {
    $$('[data-mapa]').forEach(function (caja) {
      var sedeId = caja.getAttribute('data-mapa');
      var s = (B.sedes || []).filter(function (x) { return x.id === sedeId; })[0] || sedePrincipal;
      var c = B.copy.cookies;

      var bloqueo = document.createElement('div');
      bloqueo.className = 'mapa__bloqueo';
      bloqueo.innerHTML =
        '<p>' + esc(c.mapaBloqueado) + '</p>' +
        '<button class="btn btn--naranja btn--pequeno" type="button">' + esc(c.mapaBoton) + '</button>' +
        '<a class="enlace" href="' + esc(mapsUrl(s)) + '" target="_blank" rel="noopener">Abrir en Google Maps ' + ICO.flecha + '</a>';
      caja.appendChild(bloqueo);

      function cargar() {
        if ($('iframe', caja)) return;
        var f = document.createElement('iframe');
        f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(dirTexto(s)) + '&output=embed';
        f.loading = 'lazy';
        f.title = 'Mapa con la ubicación de ' + s.nombre + ', ' + dirTexto(s);
        f.referrerPolicy = 'no-referrer-when-downgrade';
        caja.insertBefore(f, bloqueo);
        bloqueo.remove();
      }

      $('button', bloqueo).addEventListener('click', function () {
        guardarConsentimiento('todas');
        cargarAnalitica();
        cargar();
      });
      if (consentimiento() === 'todas') cargar();
      document.addEventListener('cookies:cambio', function (e) { if (e.detail === 'todas') cargar(); });
    });
  }

  /* =======================================================================
     APARICIONES AL HACER SCROLL
     ==================================================================== */
  function observarRevelados() {
    var objetivos = $$('[data-revelar], [data-mascara]');
    if (!objetivos.length) return;
    if (menosMovimiento || !('IntersectionObserver' in window)) {
      objetivos.forEach(function (n) { n.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    objetivos.forEach(function (n) { io.observe(n); });
  }
  window.IFobservar = observarRevelados;

  /* =======================================================================
     ESCALONADO AUTOMÁTICO
     Añade el retraso a los hijos de un contenedor con data-escalonar
     ==================================================================== */
  function escalonar() {
    $$('[data-escalonar]').forEach(function (c) {
      var paso = parseInt(c.getAttribute('data-escalonar'), 10) || 80;
      Array.prototype.forEach.call(c.children, function (h, i) {
        h.style.setProperty('--retraso', (i * paso) + 'ms');
      });
    });
  }
  window.IFescalonar = escalonar;

  /* =======================================================================
     VISOR DE FOTOS
     ==================================================================== */
  var visor, visorImg, visorPie, ultimoFoco;
  function crearVisor() {
    visor = document.createElement('div');
    visor.className = 'visor';
    visor.setAttribute('data-abierto', 'false');
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Foto ampliada');
    visor.innerHTML =
      '<button class="cerrar" type="button" aria-label="Cerrar la foto">' + ICO.cerrar + '</button>' +
      '<div><img alt=""><p class="visor__pie"></p></div>';
    document.body.appendChild(visor);
    visorImg = $('img', visor);
    visorPie = $('.visor__pie', visor);

    $('.cerrar', visor).addEventListener('click', cerrarVisor);
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrarVisor(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && visor.getAttribute('data-abierto') === 'true') cerrarVisor();
    });
  }
  function abrirVisor(src, alt) {
    if (!visor) crearVisor();
    ultimoFoco = document.activeElement;
    visorImg.src = src;
    visorImg.alt = alt || '';
    visorPie.textContent = alt || '';
    visor.setAttribute('data-abierto', 'true');
    document.documentElement.style.overflow = 'hidden';
    $('.cerrar', visor).focus();
  }
  function cerrarVisor() {
    visor.setAttribute('data-abierto', 'false');
    document.documentElement.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }
  window.IFvisor = abrirVisor;

  /* =======================================================================
     AVISOS FLOTANTES
     ==================================================================== */
  var avisos;
  function aviso(texto) {
    if (!avisos) {
      avisos = document.createElement('div');
      avisos.className = 'avisos';
      avisos.setAttribute('role', 'status');
      avisos.setAttribute('aria-live', 'polite');
      document.body.appendChild(avisos);
    }
    var n = document.createElement('p');
    n.className = 'aviso';
    n.textContent = texto;
    avisos.appendChild(n);
    setTimeout(function () { n.remove(); }, 3600);
  }
  window.IFaviso = aviso;

  /* =======================================================================
     RELLENO DE DATOS SUELTOS
     Cualquier elemento con data-campo="ruta.del.manifest" se rellena solo.
     ==================================================================== */
  function valor(ruta) {
    return String(ruta || '').split('.').reduce(function (o, k) {
      return o == null ? o : o[k];
    }, B);
  }

  function rellenar() {
    $$('[data-campo]').forEach(function (n) {
      var v = valor(n.getAttribute('data-campo'));
      if (v == null) return;
      // Solo se toca el href si el valor es de verdad una dirección
      if (n.tagName === 'A' && /^(https?:|tel:|mailto:|#|\/)/.test(v)) {
        n.href = v;
        if (!n.textContent.trim()) n.textContent = v;
      } else {
        n.textContent = v;
      }
    });
    // Enlaces automáticos
    $$('[data-enlace="tel"]').forEach(function (n) { n.href = 'tel:' + B.contacto.telefono; });
    /* El texto del botón de llamar lleva el número del manifest detrás */
    $$('[data-tel-texto]').forEach(function (n) { n.textContent = n.getAttribute('data-tel-texto') + B.contacto.telefonoTexto; });
    $$('[data-enlace="mail"]').forEach(function (n) { n.href = 'mailto:' + B.contacto.email; });
    $$('[data-enlace="reserva"]').forEach(function (n) { n.href = B.reservas.url; });
    $$('[data-enlace="maps"]').forEach(function (n) { n.href = mapsUrl(sedePrincipal); });
    $$('[data-wa]').forEach(function (n) {
      n.href = waUrl(n.getAttribute('data-wa') || B.copy.whatsapp.generico);
    });
  }

  /* =======================================================================
     TITULARES ANIMADOS
     El texto viene del manifest con esta notación:
       'Mejorar.|Eso es todo lo que *pedimos*.'
       · la barra  |  parte el titular en líneas
       · los asteriscos ponen esa palabra en naranja
     Cada línea sube desde abajo, escalonada. Sin JS se ve el texto que
     ya está escrito en el HTML, que es el mismo.
     ==================================================================== */
  function titulares() {
    $$('[data-titular]').forEach(function (n) {
      var bruto = valor(n.getAttribute('data-titular'));
      if (!bruto) return;
      n.innerHTML = String(bruto).split('|').map(function (linea, i) {
        var html = esc(linea.trim()).replace(/\*([^*]+)\*/g, '<em>$1</em>');
        return '<span class="linea"><span style="--retraso:' + (120 + i * 110) + 'ms">' + html + '</span></span>';
      }).join('');
    });
  }

  /* =======================================================================
     SEDES, HORARIO Y CONTACTO DIRECTO
     ==================================================================== */
  function pintarSedes() {
    var host = $('[data-sedes]');
    if (!host) return;
    host.innerHTML = (B.sedes || []).map(function (s) {
      return '<article class="sede' + (s.principal ? ' sede--principal' : '') + '" data-revelar>' +
        '<span class="sede__rol">' + esc(s.rol) + '</span>' +
        '<h3>' + esc(s.nombre) + '</h3>' +
        '<address class="sede__dir">' + esc(dirTexto(s)) + '</address>' +
        (s.nota ? '<p class="dim" style="font-size:var(--t-sm)">' + esc(s.nota) + '</p>' : '') +
        (s.pendiente ? '<p class="sede__pendiente">Horario por confirmar</p>' : '') +
        (s.reserva ? '<a class="enlace" href="' + esc(s.reserva) + '" target="_blank" rel="noopener">Reservar en este centro ' + ICO.flecha + '</a>' : '') +
        '<a class="enlace" href="' + esc(mapsUrl(s)) + '" target="_blank" rel="noopener">Cómo llegar ' + ICO.flecha + '</a>' +
      '</article>';
    }).join('');
  }

  function pintarHorario() {
    var host = $('[data-horario]');
    if (!host) return;
    var h = B.horario;
    function franjas(lista) {
      return '<div class="horario__franjas">' + lista.map(function (f) {
        return '<span class="horario__franja">' + esc(f.desde) + ' – ' + esc(f.hasta) + '</span>';
      }).join('') + '</div>';
    }
    var ab = abiertoAhora();
    host.innerHTML =
      '<p class="estado" data-abierto="' + ab + '"><i></i>' + (ab ? 'Abierto ahora' : 'Cerrado ahora') + '</p>' +
      '<div class="horario__bloque">' +
        '<span class="horario__titulo">Puedes entrenar · ' + esc(h.dias) + '</span>' +
        franjas(h.entreno || []) +
      '</div>' +
      '<div class="horario__bloque">' +
        '<span class="horario__titulo">' + esc(h.recepcion.titulo) + ' · ' + esc(h.recepcion.matiz) + '</span>' +
        franjas(h.recepcion.franjas || []) +
      '</div>' +
      '<p class="horario__nota">' + esc(h.cerrado) + ' ' + esc(h.vigenteDesde) + '.</p>' +
      '<p class="horario__nota">' + esc(h.nota) + '</p>';
  }

  /* ---------- La app, en compacto -----------------------------------------
     La misma que cuenta la guía, pero aquí solo lo justo: de quién es y los
     dos botones de descarga. Si no hay datos de app, no sale nada.
     ------------------------------------------------------------------- */
  function bloqueApp() {
    var A = ((B.reservas || {}).app) || {};
    if (!(A.tiendas || []).length) return '';

    var flecha = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

    return '<div class="contacto-bloque contacto-app">' +
      '<p class="ante">Reservas</p>' +
      '<h3>Descárgate la app</h3>' +
      '<div class="contacto-app__marca">' +
        '<img src="' + esc(A.icono) + '-128.png" width="128" height="128" alt="" loading="lazy" decoding="async">' +
        '<img class="contacto-app__logo" src="' + esc(A.logo) + '" width="171" height="32" alt="' + esc(A.nombre) + '" loading="lazy" decoding="async">' +
      '</div>' +
      '<p class="contacto-app__texto">Con ella reservas y anulas tú, a la hora que sea. Es gratis.</p>' +
      '<div class="contacto-app__tiendas">' +
        (A.tiendas || []).map(function (t) {
          return '<a class="app-tienda" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
            flecha + '<span><b>' + esc(t.sistema) + '</b>' + esc(t.tienda) + '</span>' +
          '</a>';
        }).join('') +
      '</div>' +
      '<a class="enlace" href="apuntarme.html#paso-app">Cómo se usa, paso a paso' + ICO.flecha + '</a>' +
    '</div>';
  }

  function pintarContactoDirecto() {
    var host = $('[data-contacto-directo]');
    if (!host) return;
    var redes = (B.redes || []).map(function (r) {
      return '<a class="enlace" href="' + esc(r.url) + '" target="_blank" rel="noopener me">' +
        esc(r.handle) + ' · ' + esc(r.etiqueta) + '</a>';
    }).join('');
    host.innerHTML =
      '<div class="contacto-bloque">' +
        '<p class="ante">Directo</p>' +
        '<h3>O si prefieres preguntar antes</h3>' +
        '<a class="btn btn--naranja btn--bloque mt-4" href="' + esc(waUrl(B.copy.whatsapp.generico)) + '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' +
        '<a class="btn btn--bloque" href="tel:' + esc(B.contacto.telefono) + '">' + esc(B.contacto.telefonoTexto) + '</a>' +
        '<a class="btn btn--bloque" href="mailto:' + esc(B.contacto.email) + '">' + esc(B.contacto.email) + '</a>' +
        '<address class="sede__dir mt-4">' + esc(dirTexto(sedePrincipal)) + '</address>' +
      '</div>' +

      bloqueApp() +

      '<div class="contacto-bloque">' +
        '<p class="ante">Instagram</p>' +
        '<h3>El día a día, sin filtro</h3>' +
        '<div class="apilado mt-4">' + redes + '</div>' +
      '</div>';
  }

  /* =======================================================================
     DATOS ESTRUCTURADOS
     Se generan desde el manifest para que nunca se desajusten del contenido.
     ==================================================================== */
  function datosEstructurados() {
    if ($('script[data-ld="auto"]')) return;
    var web = B.contacto.web.replace(/\/$/, '');

    var horas = (B.horario.entreno || []).map(function (f) {
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: f.desde, closes: f.hasta
      };
    });

    var catalogo = {
      '@type': 'OfferCatalog',
      name: 'Entrenamiento en ' + B.negocio.nombre,
      itemListElement: (B.catalogo.categorias || []).map(function (c) {
        return {
          '@type': 'OfferCatalog',
          name: c.nombre + ', ' + c.subtitulo,
          itemListElement: (B.catalogo.items || []).filter(function (i) {
            return i.cat === c.id && i.activo !== false;
          }).map(function (i) {
            var oferta = {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: i.nombre, description: i.resumen }
            };
            if (i.precio != null) { oferta.price = String(i.precio); oferta.priceCurrency = 'EUR'; }
            return oferta;
          })
        };
      })
    };

    var negocio = {
      '@context': 'https://schema.org',
      '@type': ['HealthClub', 'SportsActivityLocation'],
      '@id': web + '/#gimnasio',
      name: B.negocio.nombre,
      alternateName: B.negocio.nombreLargo,
      legalName: B.negocio.razonSocial,
      taxID: B.negocio.nif,
      description: B.negocio.descripcion,
      slogan: B.negocio.claim,
      url: web + '/',
      image: web + '/assets/img/og-image.jpg',
      logo: web + '/assets/icons/icon-512.png',
      telephone: B.contacto.telefono,
      email: B.contacto.email,
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      address: {
        '@type': 'PostalAddress',
        streetAddress: sedePrincipal.calle,
        postalCode: sedePrincipal.cp,
        addressLocality: sedePrincipal.ciudad,
        addressRegion: sedePrincipal.provincia,
        addressCountry: sedePrincipal.pais
      },
      areaServed: [
        { '@type': 'City', name: sedePrincipal.ciudad },
        { '@type': 'AdministrativeArea', name: 'Ribera del Duero' }
      ],
      sameAs: (B.redes || []).map(function (r) { return r.url; }),
      openingHoursSpecification: horas,
      hasOfferCatalog: catalogo,
      potentialAction: {
        '@type': 'ReserveAction',
        name: 'Reservar la clase de prueba gratis de la zona Hybrid',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: B.reservas.url,
          inLanguage: 'es-ES',
          actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform']
        }
      }
    };

    var r = B.resenas || {};
    var nota = (r.respaldo && r.respaldo.nota) || null;
    var total = (r.respaldo && r.respaldo.total) || null;
    if (nota && total) {
      negocio.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: String(nota), reviewCount: String(total),
        bestRating: '5', worstRating: '1'
      };
    }

    // Segunda sede, si la hay
    var extras = (B.sedes || []).filter(function (s) { return !s.principal; }).map(function (s) {
      return {
        '@context': 'https://schema.org',
        '@type': ['HealthClub', 'SportsActivityLocation'],
        '@id': web + '/#sede-' + s.id,
        name: s.nombre,
        parentOrganization: { '@id': web + '/#gimnasio' },
        url: web + '/',
        telephone: B.contacto.telefono,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.calle, postalCode: s.cp,
          addressLocality: s.ciudad, addressRegion: s.provincia, addressCountry: s.pais
        }
      };
    });

    var lote = [negocio].concat(extras);

    // FAQ, solo en las páginas que la muestran
    if ($('[data-faq]') && (B.faq || []).length) {
      lote.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: B.faq.map(function (f) {
          return {
            '@type': 'Question', name: f.p,
            acceptedAnswer: { '@type': 'Answer', text: f.r }
          };
        })
      });
    }

    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-ld', 'auto');
    s.textContent = JSON.stringify(lote);
    document.head.appendChild(s);
  }

  /* =======================================================================
     FAQ
     ==================================================================== */
  function pintarFAQ() {
    var host = $('[data-faq]');
    if (!host) return;
    host.innerHTML = (B.faq || []).map(function (f, i) {
      return '<details class="faq__item"' + (i === 0 ? ' open' : '') + '>' +
        '<summary>' + esc(f.p) + '</summary>' +
        '<div class="faq__resp"><p>' + esc(f.r) + '</p></div>' +
      '</details>';
    }).join('');
  }

  /* =======================================================================
     ARRANQUE
     ==================================================================== */
  function iniciar() {
    document.documentElement.classList.add('js');
    pintarCabecera();
    pintarFAQ();
    rellenar();
    titulares();
    pintarSedes();
    pintarHorario();
    pintarContactoDirecto();
    pintarPie();
    pintarWA();
    pintarBarraAyuda();
    pintarCookies();
    pintarMapas();
    datosEstructurados();
    escalonar();
    observarRevelados();

    // Ampliar cualquier foto marcada con data-ampliar, esté donde esté
    document.addEventListener('click', function (e) {
      var lupa = e.target.closest('[data-ampliar]');
      if (lupa) {
        e.preventDefault();
        abrirVisor(lupa.getAttribute('data-ampliar'), lupa.getAttribute('data-alt') || '');
      }
    });

    // Medición de conversiones que importan
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (a.href.indexOf('wa.me') > -1) medir('contacto_whatsapp', { pagina: pagina() });
      else if (a.href.indexOf('tel:') === 0) medir('contacto_telefono', { pagina: pagina() });
      else if (/play\.google|apps\.apple/.test(a.href)) medir('descargar_app', { tienda: /apple/.test(a.href) ? 'app_store' : 'google_play' });
      else if (a.href.indexOf('wodbuster') > -1) medir('reserva_clase_gratis', { pagina: pagina() });
      else if (a.href.indexOf('mailto:') === 0) medir('contacto_email', { pagina: pagina() });
    });
  }

  // Se expone lo que necesitan los demás módulos
  window.IF = {
    B: B, $: $, $$: $$, esc: esc, ICO: ICO,
    waUrl: waUrl, mapsUrl: mapsUrl, dirTexto: dirTexto,
    sedePrincipal: sedePrincipal, pagina: pagina,
    menosMovimiento: menosMovimiento, medir: medir,
    abiertoAhora: abiertoAhora
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

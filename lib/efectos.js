/* =============================================================================
   IMPROVEFIT · efectos.js
   El movimiento de la web, todo en un sitio. Tres reglas:
     1. Nada se mueve en bucle ni por su cuenta después de entrar.
     2. Lo que se mueve responde a algo que hace la persona: bajar, pasar el
        ratón, tocar.
     3. Con «reducir movimiento» activado en el móvil o el ordenador, todo se
        queda quieto y en su sitio final.
   Va el último en cada página: los demás módulos ya han pintado lo suyo.
   ========================================================================== */
(function () {
  'use strict';

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raton = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function todos(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function arrancar() {
    /* ---------- 1. Apariciones que no hay que marcar a mano --------------- */
    todos('.titulo-seccion').forEach(function (n) {
      if (!n.closest('.obertura') && !n.hasAttribute('data-revelar')) n.setAttribute('data-revelar', '');
    });
    /* Las tarjetas de siempre, escalonadas dentro de su grupo */
    [['.sede', 110], ['.faq__item', 70], ['.clase', 60], ['.miedo', 110], ['.zona-clases__cabeza', 0]].forEach(function (par) {
      todos(par[0]).forEach(function (n, i) {
        if (n.hasAttribute('data-revelar')) return;
        n.setAttribute('data-revelar', '');
        var hermanos = n.parentElement ? Array.prototype.indexOf.call(n.parentElement.children, n) : i;
        n.style.setProperty('--retraso', Math.min(hermanos, 5) * par[1] + 'ms');
      });
    });
    /* Fotos de las salas en «Clases»: se descubren como una persiana */
    todos('.zona-clases__foto').forEach(function (f) { f.setAttribute('data-mascara', ''); });
    /* La luz que sigue al ratón, en todo lo que se pulsa y es grande */
    todos('.sede, .clase, .miedo, .faq__item, .zona-clases__cabeza .foto').forEach(function (n) { n.classList.add('luz'); });

    if (window.IFobservar) window.IFobservar();

    if (quieto) {
      todos('.empezar').forEach(function (e) {
        e.style.setProperty('--llenado', 1);
        todos('.empezar__paso', e).forEach(function (p) { p.classList.add('encendido'); });
      });
      return;
    }

    /* ---------- 2. La luz de las tarjetas --------------------------------- */
    if (raton) {
      document.addEventListener('pointermove', function (ev) {
        var t = ev.target.closest && ev.target.closest('.luz');
        if (!t) return;
        var r = t.getBoundingClientRect();
        t.style.setProperty('--x', (ev.clientX - r.left) + 'px');
        t.style.setProperty('--y', (ev.clientY - r.top) + 'px');
      }, { passive: true });

      /* El brillo del bloque naranja se va un poco hacia el ratón */
      todos('.banda-alta').forEach(function (b) {
        b.addEventListener('pointermove', function (ev) {
          var r = b.getBoundingClientRect();
          b.style.setProperty('--bx', ((ev.clientX - r.left) / r.width - .7) * 120 + 'px');
          b.style.setProperty('--by', ((ev.clientY - r.top) / r.height - .3) * 120 + 'px');
        }, { passive: true });
        b.addEventListener('pointerleave', function () { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
      });
    }

    /* ---------- 3. Lo que depende de cuánto se ha bajado ------------------ */
    var foto = document.querySelector('.portada__foto');
    var caminos = todos('.empezar');
    var pendiente = false;

    function medir() {
      pendiente = false;
      var alto = window.innerHeight;

      /* La foto de la portada baja más despacio que la página: da fondo */
      if (foto) {
        var y = window.scrollY;
        if (y < alto * 1.2) foto.style.setProperty('--paralaje', (y * 0.28).toFixed(1) + 'px');
      }

      /* El camino de «¿Cómo empiezo?» se llena al bajar y enciende los números */
      caminos.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var p = (alto * 0.78 - r.top) / (r.height + alto * 0.1);
        p = Math.max(0, Math.min(1, p));
        c.style.setProperty('--llenado', p.toFixed(3));
        var pasos = todos('.empezar__paso', c);
        pasos.forEach(function (paso, i) {
          var umbral = pasos.length > 1 ? i / (pasos.length - 1) * 0.92 : 0;
          paso.classList.toggle('encendido', p > umbral + 0.02 || (i === 0 && p > 0.02));
        });
      });
    }
    function alBajar() { if (!pendiente) { pendiente = true; requestAnimationFrame(medir); } }
    window.addEventListener('scroll', alBajar, { passive: true });
    window.addEventListener('resize', alBajar, { passive: true });
    medir();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(arrancar, 0); });
  else setTimeout(arrancar, 0);
})();

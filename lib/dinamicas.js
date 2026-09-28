/* =============================================================================
   IMPROVEFIT · dinamicas.js
   Las piezas con las que el visitante juega:

     1. Test de tres preguntas → recomienda zona y clase, con el mensaje escrito.
     2. Calculadora de cuota → cruza centro y frecuencia con las tarifas reales.
     3. Reloj de apertura → dice si está abierto y cuánto queda.

   Todo sale de window.__BRAND__.dinamicas y de los datos ya existentes.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;
  var D = B.dinamicas || {};

  /* =======================================================================
     2. TEST DE TRES PREGUNTAS
     ==================================================================== */
  function test() {
    var host = $('[data-test]');
    if (!host) return;
    var T = D.test;
    if (!T || !(T.preguntas || []).length) { host.remove(); return; }

    var paso = 0;
    var puntos = {};
    var historial = [];

    function barra() {
      return '<div class="test__barra" aria-hidden="true">' +
        T.preguntas.map(function (_, i) {
          var cl = i < paso ? 'hecho' : (i === paso ? 'activo' : '');
          return '<span class="test__paso ' + cl + '"><i></i></span>';
        }).join('') +
      '</div>';
    }

    function pintarPregunta() {
      var p = T.preguntas[paso];
      host.innerHTML = barra() +
        '<div class="test__pregunta" role="group" aria-label="Pregunta ' + (paso + 1) + ' de ' + T.preguntas.length + '">' +
          '<p class="test__num">Pregunta ' + (paso + 1) + ' de ' + T.preguntas.length + '</p>' +
          '<h3 class="test__titulo">' + esc(p.titulo) + '</h3>' +
          '<div class="test__opciones">' +
            p.opciones.map(function (o, i) {
              return '<button class="test__op" type="button" data-op="' + i + '">' +
                '<b>' + esc(o.texto) + '</b>' +
                (o.nota ? '<span>' + esc(o.nota) + '</span>' : '') +
              '</button>';
            }).join('') +
          '</div>' +
          (paso > 0 ? '<button class="test__atras" type="button" data-atras>← Volver a la anterior</button>' : '') +
        '</div>';
    }

    function pintarResultado() {
      var zonaId = Object.keys(puntos).sort(function (a, b) { return puntos[b] - puntos[a]; })[0];
      var zona = (B.catalogo.categorias || []).filter(function (c) { return c.id === zonaId; })[0];
      if (!zona) { paso = 0; puntos = {}; historial = []; pintarPregunta(); return; }

      /* De esa zona se propone la clase marcada como destacada, o la primera */
      var clases = (B.catalogo.items || []).filter(function (i) { return i.cat === zonaId && i.activo !== false; });
      var clase = clases.filter(function (i) { return i.destacado; })[0] || clases[0];

      var mensaje = 'Hola. He hecho el test de la web y me sale ' + zona.nombre +
        (clase ? ', concretamente «' + clase.nombre + '»' : '') + '. ¿Me contáis horarios?';

      host.innerHTML = barra().replace(/activo/g, 'hecho') +
        '<div class="test__resultado">' +
          '<p class="test__num">' + esc(T.resultado || 'Tu sitio es') + '</p>' +
          '<p class="test__zona">' + esc(zona.nombre) + ' · ' + esc(zona.subtitulo) + '</p>' +
          '<p>' + esc(zona.para) + '</p>' +
          (clase ?
            '<div class="test__clase">' +
              '<p class="ante ante--apagado">Empezaríamos por aquí</p>' +
              '<b>' + esc(clase.nombre) + ' · ' + esc(clase.duracion) + '</b>' +
              '<span>' + esc(clase.resumen) + '</span>' +
            '</div>' : '') +
          '<div class="test__acciones">' +
            '<a class="btn btn--naranja" href="' + esc(IF.waUrl(mensaje)) + '" target="_blank" rel="noopener">' + esc(T.cta || 'Preguntar por esto') + '</a>' +
            '<a class="btn btn--suave" href="clases.html#' + esc(zona.id) + '">Ver todas las clases</a>' +
            '<button class="btn btn--suave" type="button" data-reiniciar>' + esc(T.reiniciar || 'Volver a empezar') + '</button>' +
          '</div>' +
        '</div>';

      IF.medir('test_completado', { zona: zonaId });
    }

    host.addEventListener('click', function (e) {
      var op = e.target.closest('[data-op]');
      if (op) {
        var p = T.preguntas[paso];
        var elegida = p.opciones[+op.getAttribute('data-op')];
        historial.push(JSON.parse(JSON.stringify(puntos)));
        Object.keys(elegida.puntos || {}).forEach(function (z) {
          puntos[z] = (puntos[z] || 0) + elegida.puntos[z];
        });
        paso++;
        if (paso >= T.preguntas.length) pintarResultado();
        else pintarPregunta();
        return;
      }
      if (e.target.closest('[data-atras]')) {
        paso = Math.max(0, paso - 1);
        puntos = historial.pop() || {};
        pintarPregunta();
        return;
      }
      if (e.target.closest('[data-reiniciar]')) {
        paso = 0; puntos = {}; historial = [];
        pintarPregunta();
      }
    });

    pintarPregunta();
  }

  /* =======================================================================
     3. CALCULADORA DE CUOTA
     ==================================================================== */
  function calculadora() {
    var host = $('[data-calculadora]');
    if (!host) return;
    var C = D.calculadora;
    var T = B.tarifas;
    if (!C || !T || !(T.grupos || []).length) { host.remove(); return; }

    var fase = B.ajustes.fase || 1;
    var sedeSel = (B.sedes || [])[0].id;
    var frecSel = C.frecuencias[1].id;

    function chips(nombre, lista, sel, campo) {
      return lista.map(function (x) {
        var id = x.id || x[campo];
        return '<button class="calc__op" type="button" data-' + nombre + '="' + esc(id) + '" aria-pressed="' + (id === sel) + '">' +
          esc(x.texto || x.nombre) + '</button>';
      }).join('');
    }

    /* Del grupo de tarifas de esa sede, elige el plan cuyo número de sesiones
       se acerca más por arriba a lo que ha pedido el visitante. */
    function mejorPlan() {
      var grupo = T.grupos.filter(function (g) { return g.sede === sedeSel; })[0];
      if (!grupo) return null;
      var frec = C.frecuencias.filter(function (f) { return f.id === frecSel; })[0];
      var mensuales = (grupo.planes || []).filter(function (p) { return /mes/.test(p.unidad); });
      if (!mensuales.length) return grupo.planes[0];

      /* Se extrae el primer número del nombre o de la nota: 5, 8, 12… */
      function sesiones(p) {
        var m = (p.nombre + ' ' + (p.nota || '')).match(/(\d+)\s*(?:clases|sesiones|créditos)/i);
        if (m) return +m[1];
        if (/ilimitad/i.test(p.nombre)) return 99;
        return 99;
      }
      var ordenados = mensuales.slice().sort(function (a, b) { return sesiones(a) - sesiones(b); });
      for (var i = 0; i < ordenados.length; i++) {
        if (sesiones(ordenados[i]) >= frec.sesiones) return ordenados[i];
      }
      return ordenados[ordenados.length - 1];
    }

    function pintar() {
      var sede = (B.sedes || []).filter(function (s) { return s.id === sedeSel; })[0] || {};
      var plan = mejorPlan();
      var frec = C.frecuencias.filter(function (f) { return f.id === frecSel; })[0] || {};
      var mensaje = 'Hola. Con la calculadora de la web me sale «' + (plan ? plan.nombre : '') +
        '» en ' + sede.nombre + ' viniendo ' + frec.texto.toLowerCase() + '. ¿Me lo confirmáis?';

      host.innerHTML =
        '<div>' +
          '<div class="calc__grupo">' +
            '<p class="calc__label" id="calc-l1">' + esc(C.labelCentro) + '</p>' +
            '<div class="calc__ops" role="group" aria-labelledby="calc-l1">' +
              chips('sede', (B.sedes || []).map(function (s) { return { id: s.id, texto: s.nombre }; }), sedeSel) +
            '</div>' +
          '</div>' +
          '<div class="calc__grupo">' +
            '<p class="calc__label" id="calc-l2">' + esc(C.labelFrecuencia) + '</p>' +
            '<div class="calc__ops" role="group" aria-labelledby="calc-l2">' +
              chips('frec', C.frecuencias, frecSel) +
            '</div>' +
          '</div>' +
          '<p class="calc__nota" style="color:var(--gris-2)">' + esc(sede.calle || '') + '</p>' +
        '</div>' +
        '<div class="calc__salida" aria-live="polite">' +
          '<p class="ante">Te encaja</p>' +
          '<p class="calc__plan">' + esc(plan ? plan.nombre : '—') + '</p>' +
          (fase === 2 && plan && plan.precio != null
            ? '<p class="calc__precio">' + esc(plan.precio) + ' €<small>' + esc(plan.unidad) + '</small></p>'
            : '<p class="calc__precio" style="font-size:var(--t-lg);letter-spacing:-.02em">' + esc(C.sinPrecio) + '</p>') +
          '<p class="calc__nota">' + esc(fase === 2 ? (plan && plan.nota ? plan.nota : '') : C.notaFase1) + '</p>' +
          '<a class="btn btn--naranja btn--bloque" href="' + esc(IF.waUrl(mensaje)) + '" target="_blank" rel="noopener">' + esc(C.cta) + '</a>' +
        '</div>';
    }

    host.addEventListener('click', function (e) {
      var s = e.target.closest('[data-sede]');
      if (s) { sedeSel = s.getAttribute('data-sede'); pintar(); IF.medir('calculadora', { sede: sedeSel }); return; }
      var f = e.target.closest('[data-frec]');
      if (f) { frecSel = f.getAttribute('data-frec'); pintar(); }
    });

    pintar();
  }

  /* =======================================================================
     RELOJ DE APERTURA
     Añade a los indicadores de estado cuánto queda para abrir o cerrar.
     ==================================================================== */
  function reloj() {
    var nodos = $$('[data-estado], .estado');
    if (!nodos.length) return;
    var franjas = B.horario.entreno || [];
    if (!franjas.length) return;

    function minutos(h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; }
    function texto(m) {
      var h = Math.floor(m / 60), min = m % 60;
      if (h && min) return h + ' h ' + min + ' min';
      if (h) return h + ' h';
      return min + ' min';
    }

    var ahora = new Date();
    var dia = ahora.getDay();
    var m = ahora.getHours() * 60 + ahora.getMinutes();
    var laborable = dia >= 1 && dia <= 5;

    var frase = '';
    if (laborable) {
      var dentro = franjas.filter(function (f) { return m >= minutos(f.desde) && m < minutos(f.hasta); })[0];
      if (dentro) {
        frase = 'cierra en ' + texto(minutos(dentro.hasta) - m);
      } else {
        var siguiente = franjas.filter(function (f) { return minutos(f.desde) > m; })[0];
        if (siguiente) frase = 'abre en ' + texto(minutos(siguiente.desde) - m);
        else frase = 'abre mañana a las ' + franjas[0].desde;
      }
    } else {
      frase = 'abre el lunes a las ' + franjas[0].desde;
    }

    nodos.forEach(function (n) {
      if ($('.estado__cuenta', n)) return;
      var s = document.createElement('span');
      s.className = 'estado__cuenta';
      s.textContent = '· ' + frase;
      n.appendChild(s);
    });
  }

  /* ---------- Arranque --------------------------------------------------- */
  function iniciar() {
    test();
    calculadora();
    reloj();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

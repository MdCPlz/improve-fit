/* =============================================================================
   IMPROVEFIT · plan.js
   El «carrito» del gimnasio: guardas las clases y servicios que te interesan
   y lo mandas de una vez. Cada opción elegida crea una línea propia.

   Solo se activa con ajustes.fase = 2 en el manifest. En fase 1 queda
   programado pero invisible: ni botón, ni panel, ni líneas.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;

  if ((B.ajustes.fase || 1) !== 2) return;

  var CLAVE = 'if_plan_v1';
  var copy = B.copy.plan;
  var lineas = leer();
  var paso = 'lista';   // lista | checkout | hecho
  var ultimoFoco = null;

  /* ---------- Persistencia ---------------------------------------------- */
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; }
  }
  function escribir() {
    try { localStorage.setItem(CLAVE, JSON.stringify(lineas)); } catch (e) {}
  }

  function item(id) {
    return (B.catalogo.items || []).filter(function (i) { return i.id === id; })[0];
  }
  function nombreOpcion(clave, valorId) {
    var o = (B.catalogo.opciones || {})[clave];
    if (!o) return '';
    var v = (o.valores || []).filter(function (x) { return x.id === valorId; })[0];
    return v ? v.nombre : '';
  }
  function firma(id, opciones) {
    return id + '|' + Object.keys(opciones || {}).sort().map(function (k) {
      return k + ':' + opciones[k];
    }).join(',');
  }

  /* ---------- Panel ------------------------------------------------------ */
  var panel = document.createElement('div');
  panel.className = 'plan';
  panel.setAttribute('data-abierto', 'false');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', copy.titulo);
  panel.innerHTML =
    '<div class="plan__fondo" data-cerrar></div>' +
    '<div class="plan__panel">' +
      '<div class="plan__cabecera">' +
        '<h2 style="font-size:var(--t-md)">' + esc(copy.titulo) + '</h2>' +
        '<button class="cerrar" type="button" data-cerrar aria-label="Cerrar el plan">' + ICO.cerrar + '</button>' +
      '</div>' +
      '<div class="plan__cuerpo" data-cuerpo></div>' +
      '<div class="plan__pie" data-pie></div>' +
    '</div>';
  document.body.appendChild(panel);

  var cuerpo = $('[data-cuerpo]', panel);
  var pie = $('[data-pie]', panel);

  /* ---------- Pintado ---------------------------------------------------- */
  function pintar() {
    if (paso === 'hecho') { pintarHecho(); return; }
    if (paso === 'checkout') { pintarCheckout(); return; }

    if (!lineas.length) {
      cuerpo.innerHTML = '<p class="plan__vacio">' + esc(copy.vacio) + '</p>';
      pie.innerHTML = '<a class="btn btn--bloque" href="clases.html">Ver el catálogo</a>';
      return;
    }

    cuerpo.innerHTML = lineas.map(function (l, n) {
      var i = item(l.id);
      if (!i) return '';
      var ops = Object.keys(l.opciones || {}).map(function (k) {
        return nombreOpcion(k, l.opciones[k]);
      }).filter(Boolean).join(' · ');
      return '<div class="linea">' +
        '<div>' +
          '<p class="linea__nombre">' + esc(i.nombre) + '</p>' +
          (ops ? '<p class="linea__opciones">' + esc(ops) + '</p>' : '') +
          '<p class="folio" style="margin-top:.35rem">' + esc(i.duracion) + ' · ' + esc(i.plazas) + '</p>' +
        '</div>' +
        '<button class="linea__quitar" type="button" data-quitar="' + n + '" aria-label="Quitar ' + esc(i.nombre) + ' del plan">' + ICO.cerrar + '</button>' +
      '</div>';
    }).join('');

    var total = lineas.reduce(function (s, l) {
      var i = item(l.id);
      return s + (i && i.precio != null ? Number(i.precio) : 0);
    }, 0);

    pie.innerHTML =
      (total > 0 ? '<p class="fila" style="justify-content:space-between"><span class="folio">Orientativo</span><b class="ficha__precio">' + total + ' €<small> / mes</small></b></p>' : '') +
      '<button class="btn btn--naranja btn--bloque" type="button" data-ir-checkout>' + esc(copy.enviar) + '</button>' +
      '<p class="formulario__nota">' + esc(copy.nota) + '</p>';
  }

  function pintarCheckout() {
    var sedes = (B.sedes || []).map(function (s) {
      return '<option value="' + esc(s.nombre) + '">' + esc(s.nombre) + ' · ' + esc(s.calle) + '</option>';
    }).join('');
    var franjas = ((B.catalogo.opciones || {}).franja || {}).valores || [];

    cuerpo.innerHTML =
      '<p class="folio">' + esc(copy.resumen) + ' · ' + lineas.length + (lineas.length === 1 ? ' elemento' : ' elementos') + '</p>' +
      '<form class="formulario" data-checkout novalidate>' +
        campo('plan-nombre', 'Nombre', 'text', true, 'Cómo te llamas') +
        campo('plan-tel', 'Teléfono', 'tel', true, '600 000 000') +
        campo('plan-email', 'Email (opcional)', 'email', false, 'tucorreo@ejemplo.com') +
        '<div class="campo">' +
          '<label for="plan-sede">Centro</label>' +
          '<select id="plan-sede" name="sede">' + sedes + '</select>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="plan-franja">Cuándo te viene bien</label>' +
          '<select id="plan-franja" name="franja">' +
            franjas.map(function (f) { return '<option value="' + esc(f.nombre) + '">' + esc(f.nombre) + '</option>'; }).join('') +
          '</select>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="plan-msg">Algo que debamos saber</label>' +
          '<textarea id="plan-msg" name="mensaje" rows="3" placeholder="Lesiones, objetivos, desde cuándo no entrenas…"></textarea>' +
        '</div>' +
        '<div class="campo" data-campo-check>' +
          '<label class="check"><input type="checkbox" name="privacidad" required>' +
          '<span>' + esc(B.copy.contacto.privacidad).replace('política de privacidad', '<a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a>') + '</span></label>' +
          '<p class="campo__error">Necesitamos que lo aceptes para poder contestarte.</p>' +
        '</div>' +
      '</form>';

    pie.innerHTML =
      '<button class="btn btn--naranja btn--bloque" type="submit" form="" data-enviar>' + esc(copy.enviar) + '</button>' +
      '<button class="btn btn--bloque btn--pequeno" type="button" data-volver>Volver al plan</button>' +
      '<p class="formulario__nota">' + esc(B.copy.contacto.envioNota) + '</p>';
  }

  function campo(id, etiqueta, tipo, req, ph) {
    return '<div class="campo">' +
      '<label for="' + id + '">' + esc(etiqueta) + (req ? ' <span class="req">*</span>' : '') + '</label>' +
      '<input id="' + id + '" name="' + id.replace('plan-', '') + '" type="' + tipo + '"' + (req ? ' required' : '') +
        ' placeholder="' + esc(ph) + '" autocomplete="' + (tipo === 'tel' ? 'tel' : tipo === 'email' ? 'email' : 'name') + '">' +
      '<p class="campo__error">Rellena este campo.</p>' +
    '</div>';
  }

  function pintarHecho() {
    cuerpo.innerHTML =
      '<div class="exito">' +
        '<span class="exito__icono">' + ICO.check + '</span>' +
        '<h3>' + esc(B.copy.contacto.exito) + '</h3>' +
        '<p class="dim" style="font-size:var(--t-sm)">' + esc(B.copy.contacto.exitoTexto) + '</p>' +
      '</div>';
    pie.innerHTML =
      '<a class="btn btn--naranja btn--bloque" href="' + esc(B.reservas.url) + '" target="_blank" rel="noopener">Reservar clase gratis</a>' +
      '<a class="btn btn--bloque" data-enlace="tel" href="tel:' + esc(B.contacto.telefono) + '">Llamar al ' + esc(B.contacto.telefonoTexto) + '</a>';
  }

  /* ---------- Mensaje que se envía --------------------------------------- */
  function mensaje(datos) {
    var l = ['Hola, os escribo desde la web. Este es mi plan:'];
    lineas.forEach(function (x, n) {
      var i = item(x.id);
      if (!i) return;
      var ops = Object.keys(x.opciones || {}).map(function (k) {
        return nombreOpcion(k, x.opciones[k]);
      }).filter(Boolean).join(', ');
      l.push((n + 1) + '. ' + i.nombre + (ops ? ' (' + ops + ')' : ''));
    });
    l.push('');
    l.push('Nombre: ' + datos.nombre);
    l.push('Teléfono: ' + datos.tel);
    if (datos.email) l.push('Email: ' + datos.email);
    l.push('Centro: ' + datos.sede);
    l.push('Horario: ' + datos.franja);
    if (datos.mensaje) l.push('Nota: ' + datos.mensaje);
    return l.join('\n');
  }

  /* ---------- Abrir / cerrar --------------------------------------------- */
  function abrir() {
    ultimoFoco = document.activeElement;
    panel.setAttribute('data-abierto', 'true');
    document.documentElement.style.overflow = 'hidden';
    pintar();
    var f = $('.cerrar', panel);
    if (f) f.focus();
  }
  function cerrar() {
    panel.setAttribute('data-abierto', 'false');
    document.documentElement.style.overflow = '';
    if (paso === 'hecho') { paso = 'lista'; }
    if (ultimoFoco) ultimoFoco.focus();
  }

  /* ---------- Contador en la cabecera ------------------------------------ */
  function actualizarContador() {
    var btn = $('[data-plan-abrir]');
    var num = $('[data-plan-contador]');
    if (!btn || !num) return;
    btn.classList.add('activo');
    num.textContent = lineas.length;
    num.style.display = lineas.length ? '' : 'none';
    btn.setAttribute('aria-label', 'Ver tu plan, ' + lineas.length + (lineas.length === 1 ? ' elemento' : ' elementos'));
  }

  /* ---------- Eventos ---------------------------------------------------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-plan-abrir]')) { e.preventDefault(); abrir(); }
  });

  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-cerrar]')) { cerrar(); return; }

    var q = e.target.closest('[data-quitar]');
    if (q) {
      lineas.splice(+q.getAttribute('data-quitar'), 1);
      escribir(); actualizarContador(); pintar();
      return;
    }
    if (e.target.closest('[data-ir-checkout]')) { paso = 'checkout'; pintar(); return; }
    if (e.target.closest('[data-volver]')) { paso = 'lista'; pintar(); return; }

    if (e.target.closest('[data-enviar]')) {
      var form = $('[data-checkout]', panel);
      if (!form || !validar(form)) return;
      var d = {
        nombre: form.nombre.value.trim(),
        tel: form.tel.value.trim(),
        email: form.email.value.trim(),
        sede: form.sede.value,
        franja: form.franja.value,
        mensaje: form.mensaje.value.trim()
      };
      window.open(IF.waUrl(mensaje(d)), '_blank', 'noopener');
      IF.medir('enviar_plan', { elementos: lineas.length });
      lineas = []; escribir(); actualizarContador();
      paso = 'hecho'; pintar();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.getAttribute('data-abierto') === 'true') cerrar();
  });

  function validar(form) {
    var ok = true;
    $$('.campo', form).forEach(function (c) { c.removeAttribute('data-error'); });
    ['nombre', 'tel'].forEach(function (n) {
      var f = form[n];
      if (!f.value.trim()) { f.closest('.campo').setAttribute('data-error', 'true'); ok = false; }
    });
    if (!form.privacidad.checked) {
      $('[data-campo-check]', form).setAttribute('data-error', 'true');
      ok = false;
    }
    if (!ok) {
      var primero = $('[data-error="true"]', form);
      if (primero) {
        primero.scrollIntoView({ block: 'center', behavior: IF.menosMovimiento ? 'auto' : 'smooth' });
        var campo = primero.querySelector('input, select, textarea');
        if (campo) campo.focus();
      }
    }
    return ok;
  }

  /* ---------- API pública ------------------------------------------------ */
  window.IFplan = {
    anadir: function (id, opciones) {
      var i = item(id);
      if (!i) return;
      var f = firma(id, opciones);
      var ya = lineas.filter(function (l) { return firma(l.id, l.opciones) === f; })[0];
      if (ya) {
        window.IFaviso('Eso ya está en tu plan.');
        return;
      }
      lineas.push({ id: id, opciones: opciones || {} });
      escribir();
      actualizarContador();
      window.IFaviso(i.nombre + ' · añadido a tu plan');
      IF.medir('anadir_al_plan', { item: id });
    },
    abrir: abrir,
    lineas: function () { return lineas.slice(); }
  };

  actualizarContador();
})();

/* =============================================================================
   IMPROVEFIT · formulario.js
   Formulario de contacto: se pinta desde el manifest, se valida en el
   navegador y se envía por donde diga formulario.destino.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc, ICO = IF.ICO;

  var host = $('[data-formulario]');
  if (!host) return;

  var F = B.formulario || {};
  var C = B.copy.contacto;

  var intereses = (F.intereses || []).map(function (i) {
    return '<option value="' + esc(i) + '">' + esc(i) + '</option>';
  }).join('');

  host.innerHTML =
    '<form class="formulario" id="contacto-form" novalidate>' +
      '<div class="formulario__pareja">' +
        '<div class="campo">' +
          '<label for="f-nombre">Nombre <span class="req">*</span></label>' +
          '<input id="f-nombre" name="nombre" type="text" required autocomplete="name" placeholder="Cómo te llamas">' +
          '<p class="campo__error">Dinos cómo te llamas.</p>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="f-contacto">Teléfono o email <span class="req">*</span></label>' +
          '<input id="f-contacto" name="contacto" type="text" required autocomplete="tel" placeholder="600 000 000">' +
          '<p class="campo__error">Necesitamos una forma de contestarte.</p>' +
        '</div>' +
      '</div>' +
      '<div class="campo">' +
        '<label for="f-busco">¿Qué buscas?</label>' +
        '<select id="f-busco" name="busco">' + intereses + '</select>' +
      '</div>' +
      '<div class="campo">' +
        '<label for="f-mensaje">Mensaje (opcional)</label>' +
        '<textarea id="f-mensaje" name="mensaje" rows="4" placeholder="De dónde partes, qué te preocupa, cuándo puedes venir…"></textarea>' +
      '</div>' +
      '<div class="campo" data-campo-privacidad>' +
        '<label class="check">' +
          '<input type="checkbox" name="privacidad" required>' +
          '<span>' + esc(C.privacidad).replace('política de privacidad', '<a href="privacidad.html">política de privacidad</a>') + '</span>' +
        '</label>' +
        '<p class="campo__error">Sin esto no podemos escribirte.</p>' +
      '</div>' +
      // Trampa para robots. Las personas no la ven ni la rellenan.
      '<div class="sr-only" aria-hidden="true">' +
        '<label for="f-web">No rellenes esto</label>' +
        '<input id="f-web" name="web" type="text" tabindex="-1" autocomplete="off">' +
      '</div>' +
      '<button class="btn btn--naranja" type="submit">Enviar y que me contesten</button>' +
      '<p class="formulario__nota">' + esc(C.envioNota) + '</p>' +
    '</form>';

  var form = $('#contacto-form', host);

  function marcar(campo, mal) {
    var c = campo.closest('.campo');
    if (c) c.setAttribute('data-error', String(!!mal));
    campo.setAttribute('aria-invalid', String(!!mal));
  }

  function validar() {
    var ok = true;
    $$('.campo', form).forEach(function (c) { c.removeAttribute('data-error'); });

    if (!form.nombre.value.trim()) { marcar(form.nombre, true); ok = false; }

    var v = form.contacto.value.trim();
    var esTel = /^[+\d][\d\s().-]{7,}$/.test(v);
    var esMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!esTel && !esMail) { marcar(form.contacto, true); ok = false; }

    if (!form.privacidad.checked) {
      $('[data-campo-privacidad]', form).setAttribute('data-error', 'true');
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

  function texto(d) {
    var l = ['Hola, os escribo desde la web de ' + B.negocio.nombre + '.'];
    l.push('');
    l.push('Nombre: ' + d.nombre);
    l.push('Contacto: ' + d.contacto);
    l.push('Busco: ' + d.busco);
    if (d.mensaje) { l.push(''); l.push(d.mensaje); }
    return l.join('\n');
  }

  function exito() {
    host.innerHTML =
      '<div class="exito">' +
        '<span class="exito__icono">' + ICO.check + '</span>' +
        '<h2 style="font-size:var(--t-lg)">' + esc(C.exito) + '</h2>' +
        '<p class="dim">' + esc(C.exitoTexto) + '</p>' +
        '<div class="fila mt-6">' +
          '<a class="btn btn--naranja" href="' + esc(B.reservas.url) + '" target="_blank" rel="noopener">Reservar gratis</a>' +
          '<a class="btn" href="tel:' + esc(B.contacto.telefono) + '">Llamar</a>' +
        '</div>' +
      '</div>';
    host.querySelector('h2').focus && host.setAttribute('tabindex', '-1');
    host.focus && host.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.web.value) return;              // robot
    if (!validar()) return;

    var d = {
      nombre: form.nombre.value.trim(),
      contacto: form.contacto.value.trim(),
      busco: form.busco.value,
      mensaje: form.mensaje.value.trim()
    };

    var boton = $('button[type="submit"]', form);
    boton.classList.add('cargando');
    boton.disabled = true;

    IF.medir('enviar_formulario', { busco: d.busco });

    function terminar() { exito(); }

    if (F.destino === 'post' && F.endpoint) {
      fetch(F.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      }).then(terminar).catch(function () {
        boton.classList.remove('cargando');
        boton.disabled = false;
        window.IFaviso('No hemos podido enviarlo. Escríbenos por WhatsApp, por favor.');
      });
      return;
    }

    if (F.destino === 'email') {
      window.location.href = 'mailto:' + B.contacto.email +
        '?subject=' + encodeURIComponent('Web · ' + d.busco) +
        '&body=' + encodeURIComponent(texto(d));
    } else {
      window.open(IF.waUrl(texto(d)), '_blank', 'noopener');
    }
    setTimeout(terminar, 350);
  });

  // Quita el error en cuanto el visitante corrige
  form.addEventListener('input', function (e) {
    var c = e.target.closest('.campo');
    if (c) c.removeAttribute('data-error');
  });
})();

/* =============================================================================
   IMPROVEFIT · legal.js
   Rellena las páginas legales con los datos del manifest, para que nunca
   se queden desfasadas respecto al resto de la web.
   ========================================================================== */
(function () {
  'use strict';

  var IF = window.IF;
  if (!IF) return;
  var B = IF.B, $ = IF.$, $$ = IF.$$, esc = IF.esc;

  var sede = IF.sedePrincipal;

  function fila(k, v) {
    return '<tr><th scope="row">' + esc(k) + '</th><td>' + v + '</td></tr>';
  }

  /* ---------- Tabla de identidad (aviso legal) --------------------------- */
  var tabla = $('[data-tabla-identidad]');
  if (tabla) {
    var reg = B.legal.registro || {};
    var filas =
      fila('Titular', esc(B.negocio.razonSocial)) +
      fila('Nombre comercial', esc(B.negocio.nombre)) +
      fila('NIF', esc(B.negocio.nif)) +
      fila('Domicilio', esc(IF.dirTexto(sede))) +
      fila('Teléfono', '<a href="tel:' + esc(B.contacto.telefono) + '">' + esc(B.contacto.telefonoTexto) + '</a>') +
      fila('Correo electrónico', '<a href="mailto:' + esc(B.contacto.email) + '">' + esc(B.contacto.email) + '</a>') +
      fila('Sitio web', '<a href="' + esc(B.contacto.web) + '">' + esc(B.contacto.dominio) + '</a>') +
      fila('Actividad', esc(B.negocio.sector));

    if (reg.tomo && reg.hoja) {
      filas += fila('Registro Mercantil',
        'Tomo ' + esc(reg.tomo) + ', folio ' + esc(reg.folio) +
        ', hoja ' + esc(reg.hoja) + ', inscripción ' + esc(reg.inscripcion));
    }
    if (B.legal.hosting && B.legal.hosting.nombre) {
      filas += fila('Alojamiento', esc(B.legal.hosting.nombre) +
        (B.legal.hosting.web ? ' · <a href="' + esc(B.legal.hosting.web) + '" target="_blank" rel="noopener">' + esc(B.legal.hosting.web) + '</a>' : ''));
    }

    // Los demás centros, si los hay
    (B.sedes || []).forEach(function (s) {
      if (s.principal) return;
      filas += fila('Otro centro', esc(s.nombre) + ' · ' + esc(IF.dirTexto(s)));
    });

    tabla.innerHTML = (tabla.innerHTML || '') + '<tbody>' + filas + '</tbody>';
  }

  /* ---------- Avisos de datos pendientes -------------------------------- */
  var pendiente = $('[data-registro-pendiente]');
  if (pendiente) {
    var r = B.legal.registro || {};
    var falta = [];
    if (!r.tomo || !r.hoja) falta.push('los datos de inscripción en el Registro Mercantil');
    if (!B.legal.hosting || !B.legal.hosting.nombre) falta.push('el nombre del proveedor de alojamiento');
    if (falta.length) {
      pendiente.innerHTML = 'Pendiente de completar: ' + esc(falta.join(' y ')) +
        '. Se añadirán a esta tabla en cuanto estén disponibles.';
    } else {
      pendiente.remove();
    }
  }

  /* ---------- Bloques de la política de privacidad ----------------------- */
  var privacidad = $('[data-tabla-privacidad]');
  if (privacidad) {
    privacidad.innerHTML = '<tbody>' +
      fila('Responsable', esc(B.legal.responsable) + ' · NIF ' + esc(B.negocio.nif)) +
      fila('Dirección', esc(IF.dirTexto(sede))) +
      fila('Contacto', '<a href="mailto:' + esc(B.contacto.email) + '">' + esc(B.contacto.email) + '</a>') +
      fila('Finalidad', esc(B.legal.finalidad)) +
      fila('Base legal', esc(B.legal.baseLegal)) +
      fila('Conservación', esc(B.legal.conservacion)) +
      fila('Destinatarios', esc(B.legal.destinatarios)) +
      fila('Derechos', esc(B.legal.derechos)) +
    '</tbody>';
  }

  /* ---------- Estado actual del consentimiento de cookies ---------------- */
  var estado = $('[data-estado-cookies]');
  if (estado) {
    var pintar = function () {
      var v = null;
      try { v = localStorage.getItem('if_cookies_v1'); } catch (e) {}
      var texto = v === 'todas'
        ? 'Ahora mismo has aceptado también las cookies de medición.'
        : v === 'necesarias'
          ? 'Ahora mismo solo están activas las cookies necesarias.'
          : 'Todavía no has elegido. Hasta que elijas, solo usamos lo imprescindible.';
      estado.innerHTML = '<strong>' + esc(texto) + '</strong>';
    };
    pintar();
    document.addEventListener('cookies:cambio', pintar);
  }

  /* ---------- Botón para rehacer la elección ---------------------------- */
  $$('[data-cookies-borrar]').forEach(function (b) {
    b.addEventListener('click', function () {
      try { localStorage.removeItem('if_cookies_v1'); } catch (e) {}
      document.dispatchEvent(new CustomEvent('cookies:cambio', { detail: null }));
      var banner = $('.cookies');
      if (banner) banner.classList.add('visible');
      window.IFaviso('Elección borrada. Vuelve a elegir en el aviso de abajo.');
    });
  });
})();

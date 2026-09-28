/* =============================================================================
   IMPROVEFIT · panel.js
   El mini gestor de contenidos. Trabaja sobre una copia del manifest en el
   navegador y al final te devuelve un lib/manifest.js listo para subir.

   No hay servidor, no hay base de datos y no hay contraseña: el panel no
   publica nada por su cuenta. Para que un cambio se vea en la web hay que
   descargar el archivo y subirlo (o usar el botón de GitHub).
   ========================================================================== */
(function () {
  'use strict';

  var CLAVE = 'if_panel_borrador_v1';
  var B = null;
  var sucio = false;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Cargar: borrador guardado o el manifest del sitio ---------- */
  function cargar() {
    var base = JSON.parse(JSON.stringify(window.__BRAND__));
    try {
      var b = localStorage.getItem(CLAVE);
      if (b) {
        if (confirm('Tienes cambios sin descargar de una sesión anterior. ¿Los recupero?')) {
          return JSON.parse(b);
        }
        localStorage.removeItem(CLAVE);
      }
    } catch (e) {}
    return base;
  }

  function guardarBorrador() {
    try { localStorage.setItem(CLAVE, JSON.stringify(B)); } catch (e) {}
    sucio = true;
    var m = $('[data-sin-guardar]');
    if (m) m.hidden = false;
  }

  /* ---------- Acceso por ruta: 'negocio.nombre' -------------------------- */
  function leer(ruta) {
    return ruta.split('.').reduce(function (o, k) {
      if (o == null) return o;
      return o[/^\d+$/.test(k) ? Number(k) : k];
    }, B);
  }
  function escribir(ruta, valor) {
    var partes = ruta.split('.');
    var ultimo = partes.pop();
    var destino = partes.reduce(function (o, k) { return o[/^\d+$/.test(k) ? Number(k) : k]; }, B);
    destino[/^\d+$/.test(ultimo) ? Number(ultimo) : ultimo] = valor;
    guardarBorrador();
  }

  /* ---------- Constructores de campos ------------------------------------ */
  function campo(ruta, etiqueta, opciones) {
    opciones = opciones || {};
    var v = leer(ruta);
    var id = 'c-' + ruta.replace(/\./g, '-');
    var control;
    if (opciones.multilinea) {
      control = '<textarea id="' + id + '" data-ruta="' + esc(ruta) + '" rows="' + (opciones.filas || 3) + '">' + esc(v == null ? '' : v) + '</textarea>';
    } else if (opciones.opciones) {
      control = '<select id="' + id + '" data-ruta="' + esc(ruta) + '">' +
        opciones.opciones.map(function (o) {
          var val = typeof o === 'object' ? o.v : o;
          var txt = typeof o === 'object' ? o.t : o;
          return '<option value="' + esc(val) + '"' + (String(v) === String(val) ? ' selected' : '') + '>' + esc(txt) + '</option>';
        }).join('') + '</select>';
    } else if (opciones.tipo === 'checkbox') {
      return '<label class="check"><input type="checkbox" data-ruta="' + esc(ruta) + '" data-tipo="bool"' + (v ? ' checked' : '') + '>' +
        '<span>' + esc(etiqueta) + (opciones.ayuda ? ' · ' + esc(opciones.ayuda) : '') + '</span></label>';
    } else {
      control = '<input id="' + id + '" data-ruta="' + esc(ruta) + '" type="' + (opciones.tipo || 'text') + '"' +
        (opciones.tipo === 'number' ? ' data-tipo="numero"' : '') +
        ' value="' + esc(v == null ? '' : v) + '">';
    }
    return '<div class="campo">' +
      '<label for="' + id + '">' + esc(etiqueta) + '</label>' + control +
      (opciones.ayuda ? '<p class="ayuda">' + esc(opciones.ayuda) + '</p>' : '') +
    '</div>';
  }

  function bloque(titulo, meta, cuerpo, abierto) {
    return '<details class="bloque"' + (abierto ? ' open' : '') + '>' +
      '<summary>' + esc(titulo) + '<span class="bloque__meta">' + esc(meta || '') + '</span></summary>' +
      '<div class="bloque__cuerpo">' + cuerpo + '</div>' +
    '</details>';
  }

  /* ---------- Hojas ------------------------------------------------------ */
  function hojaNegocio() {
    var imgs = basesDeImagen();
    return bloque('Identidad', B.negocio.nombre,
      '<div class="par">' +
        campo('negocio.nombre', 'Nombre') +
        campo('negocio.nombreLargo', 'Nombre largo') +
        campo('negocio.razonSocial', 'Razón social') +
        campo('negocio.nif', 'NIF') +
        campo('negocio.claim', 'Claim') +
        campo('negocio.wordmark', 'Logotipo en texto') +
      '</div>' +
      campo('negocio.descripcion', 'Descripción larga', { multilinea: true }) +
      campo('negocio.descripcionCorta', 'Descripción corta'), true) +

    bloque('Contacto', B.contacto.telefonoTexto,
      '<div class="par">' +
        campo('contacto.telefono', 'Teléfono (formato internacional)', { ayuda: 'Así: +34638580886' }) +
        campo('contacto.telefonoTexto', 'Teléfono como se lee') +
        campo('contacto.whatsapp', 'WhatsApp (solo dígitos con prefijo)', { ayuda: 'Así: 34638580886' }) +
        campo('contacto.email', 'Correo', { tipo: 'email' }) +
        campo('contacto.web', 'Web') +
        campo('contacto.dominio', 'Dominio') +
      '</div>') +

    bloque('Centros', B.sedes.length + ' centros',
      B.sedes.map(function (s, i) {
        return '<div style="border-top:1px solid var(--borde);padding-top:var(--s-4)">' +
          '<p class="dato dato--fuego">Centro ' + (i + 1) + '</p>' +
          '<div class="par">' +
            campo('sedes.' + i + '.nombre', 'Nombre') +
            campo('sedes.' + i + '.rol', 'Qué es') +
            campo('sedes.' + i + '.calle', 'Calle y número') +
            campo('sedes.' + i + '.cp', 'Código postal') +
            campo('sedes.' + i + '.ciudad', 'Ciudad') +
            campo('sedes.' + i + '.provincia', 'Provincia') +
          '</div>' +
          campo('sedes.' + i + '.nota', 'Nota que se ve debajo') +
          campo('sedes.' + i + '.principal', 'Es el centro principal (el de la ficha de Google)', { tipo: 'checkbox' }) +
          campo('sedes.' + i + '.pendiente', 'Marcar como «horario por confirmar»', { tipo: 'checkbox' }) +
        '</div>';
      }).join('')) +

    bloque('Horario', B.horario.dias,
      '<div class="par">' +
        campo('horario.dias', 'Días') +
        campo('horario.vigenteDesde', 'Desde cuándo') +
      '</div>' +
      '<p class="dato dato--fuego">Franjas de entreno</p>' +
      B.horario.entreno.map(function (f, i) {
        return '<div class="par">' + campo('horario.entreno.' + i + '.desde', 'Abre', { tipo: 'time' }) +
          campo('horario.entreno.' + i + '.hasta', 'Cierra', { tipo: 'time' }) + '</div>';
      }).join('') +
      '<p class="dato dato--fuego">Recepción</p>' +
      '<div class="par">' + campo('horario.recepcion.titulo', 'Título') + campo('horario.recepcion.matiz', 'Matiz') + '</div>' +
      B.horario.recepcion.franjas.map(function (f, i) {
        return '<div class="par">' + campo('horario.recepcion.franjas.' + i + '.desde', 'Desde', { tipo: 'time' }) +
          campo('horario.recepcion.franjas.' + i + '.hasta', 'Hasta', { tipo: 'time' }) + '</div>';
      }).join('') +
      campo('horario.cerrado', 'Días cerrados') +
      campo('horario.nota', 'Nota', { multilinea: true })) +

    bloque('Redes', B.redes.length + ' cuentas',
      B.redes.map(function (r, i) {
        return '<div class="par">' +
          campo('redes.' + i + '.handle', 'Usuario') +
          campo('redes.' + i + '.url', 'Enlace') +
          campo('redes.' + i + '.etiqueta', 'Qué se cuenta ahí') +
        '</div>';
      }).join('')) +

    bloque('Reserva online', B.reservas.url,
      campo('reservas.url', 'Enlace de alta') +
      campo('reservas.titulo', 'Titular', { multilinea: true }) +
      campo('reservas.entradilla', 'Texto', { multilinea: true, filas: 4 }) +
      campo('reservas.titularPasos', 'Titular de los pasos') +
      B.reservas.pasos.map(function (p, i) {
        return '<div class="par">' + campo('reservas.pasos.' + i + '.titulo', 'Paso ' + p.n) +
          campo('reservas.pasos.' + i + '.texto', 'Texto') + '</div>';
      }).join('')) +

    bloque('La app de reservas', (B.reservas.app || {}).nombre,
      campo('reservas.app.nombre', 'Cómo se llama') +
      campo('reservas.app.reclamo', 'Etiqueta de encima') +
      campo('reservas.app.descripcion', 'Qué se hace con ella', { multilinea: true, filas: 3 }) +
      ((B.reservas.app || {}).tiendas || []).map(function (t, i) {
        return '<div class="par">' + campo('reservas.app.tiendas.' + i + '.sistema', t.tienda + ' · sistema') +
          campo('reservas.app.tiendas.' + i + '.url', t.tienda + ' · enlace') + '</div>';
      }).join('') +
      campo('reservas.app.sinApp', 'Texto de «sin instalar nada»') +
      campo('reservas.app.sinAppCta', 'Botón del navegador') +
      campo('reservas.app.nota', 'Aviso de que es un servicio ajeno', { multilinea: true }));
  }

  function basesDeImagen() {
    var set = {};
    (B.catalogo.categorias || []).forEach(function (c) { if (c.img) set[c.img] = 1; });
    (B.catalogo.items || []).forEach(function (i) { if (i.img) set[i.img] = 1; });
    return Object.keys(set);
  }

  function hojaCatalogo() {
    var imgs = basesDeImagen();
    var cats = (B.catalogo.categorias || []).map(function (c) { return { v: c.id, t: c.nombre }; });
    var claves = Object.keys(B.catalogo.opciones || {});

    return '<p class="ayuda" style="margin-bottom:var(--s-5)">' +
      'Con la fase en 1 los precios no se ven en la web, aunque los rellenes. ' +
      'Para que aparezcan, pon la fase en 2 en la pestaña Ajustes.</p>' +

      (B.catalogo.items || []).map(function (it, i) {
        var r = 'catalogo.items.' + i;
        return bloque(
          it.nombre,
          (it.activo === false ? 'OCULTO · ' : '') + it.duracion + ' · ' + it.cat,
          '<div class="par">' +
            campo(r + '.nombre', 'Nombre') +
            campo(r + '.cat', 'Zona', { opciones: cats }) +
            campo(r + '.duracion', 'Duración') +
            campo(r + '.plazas', 'Plazas') +
            campo(r + '.nivel', 'Nivel') +
            campo(r + '.precio', 'Precio en euros', { tipo: 'number', ayuda: 'Déjalo vacío si no quieres mostrar precio.' }) +
          '</div>' +
          campo(r + '.resumen', 'Resumen (una frase)', { multilinea: true, filas: 2 }) +
          campo(r + '.detalle', 'Detalle', { multilinea: true, filas: 4 }) +
          campo(r + '.img', 'Foto', { opciones: imgs, ayuda: 'Para añadir fotos nuevas, súbelas a assets/img con los tamaños -480.webp, -800.webp, -1200.webp y -1200.jpg, y escribe aquí la ruta sin el sufijo.' }) +
          campo(r + '.etiquetas', 'Etiquetas de búsqueda', { ayuda: 'Separadas por comas. Ayudan a que el buscador la encuentre.' }) +
          campo(r + '.opciones', 'Opciones que puede elegir el usuario', { ayuda: 'Separadas por comas. Disponibles: ' + claves.join(', ') }) +
          '<div class="par">' +
            campo(r + '.activo', 'Se ve en la web', { tipo: 'checkbox' }) +
            campo(r + '.destacado', 'Marcar como recomendada', { tipo: 'checkbox' }) +
            campo(r + '.gratis', 'Marcar como «primera clase gratis»', { tipo: 'checkbox' }) +
          '</div>'
        );
      }).join('');
  }

  function hojaZonas() {
    return (B.catalogo.categorias || []).map(function (c, i) {
      var r = 'catalogo.categorias.' + i;
      return bloque(c.nombre, 'Zona ' + c.indice,
        '<div class="par">' +
          campo(r + '.indice', 'Número') +
          campo(r + '.nombre', 'Nombre') +
          campo(r + '.subtitulo', 'Subtítulo') +
          campo(r + '.cta', 'Texto del botón') +
        '</div>' +
        campo(r + '.titular', 'Titular', { multilinea: true, filas: 2 }) +
        campo(r + '.descripcion', 'Descripción', { multilinea: true, filas: 4 }) +
        campo(r + '.para', 'Para quién es', { multilinea: true, filas: 2 }) +
        campo(r + '.alt', 'Texto alternativo de la foto', { multilinea: true, filas: 2, ayuda: 'Lo lee quien no ve la imagen. Describe la sala, no repitas el nombre de la zona.' }) +
        campo(r + '.wa', 'Mensaje de WhatsApp', { multilinea: true, filas: 2 }) +
        '<p class="dato dato--fuego">Los tres datos de la ficha</p>' +
        (c.datos || []).map(function (d, j) {
          return '<div class="par">' + campo(r + '.datos.' + j + '.valor', 'Valor') +
            campo(r + '.datos.' + j + '.etiqueta', 'Etiqueta') + '</div>';
        }).join('')
      );
    }).join('');
  }

  function hojaTextos() {
    var out = '';
    Object.keys(B.copy).forEach(function (seccion) {
      var obj = B.copy[seccion];
      if (typeof obj !== 'object' || obj === null) return;
      var cuerpo = '';
      Object.keys(obj).forEach(function (k) {
        var v = obj[k];
        if (typeof v === 'string') {
          cuerpo += campo('copy.' + seccion + '.' + k, k, { multilinea: v.length > 90, filas: 3 });
        } else if (Array.isArray(v) && v.every(function (x) { return typeof x === 'string'; })) {
          cuerpo += campo('copy.' + seccion + '.' + k, k + ' (separado por comas)');
        } else if (Array.isArray(v)) {
          cuerpo += '<p class="dato dato--fuego">' + esc(k) + '</p>' + v.map(function (item, j) {
            return '<div class="par">' + Object.keys(item).filter(function (kk) {
              return typeof item[kk] === 'string' || typeof item[kk] === 'number';
            }).map(function (kk) {
              return campo('copy.' + seccion + '.' + k + '.' + j + '.' + kk, kk);
            }).join('') + '</div>';
          }).join('');
        }
      });
      if (cuerpo) out += bloque(seccion, '', cuerpo);
    });
    return out;
  }

  function hojaFAQ() {
    return '<div style="margin-bottom:var(--s-5)"><button class="btn btn--pequeno" type="button" data-add-faq>Añadir pregunta</button></div>' +
      (B.faq || []).map(function (f, i) {
        return bloque(f.p, 'Pregunta ' + (i + 1),
          campo('faq.' + i + '.p', 'Pregunta', { multilinea: true, filas: 2 }) +
          campo('faq.' + i + '.r', 'Respuesta', { multilinea: true, filas: 5 }) +
          '<div class="peligro"><button class="btn btn--pequeno" type="button" data-borrar="faq.' + i + '">Borrar esta pregunta</button></div>'
        );
      }).join('');
  }

  function hojaResenas() {
    var r = B.resenas || {};
    return '<p class="ayuda" style="margin-bottom:var(--s-5)">' +
      'Si no hay ninguna reseña, la sección entera desaparece de la web. ' +
      'Copia aquí opiniones reales: el texto tal cual, el nombre de quien la escribió y la nota.</p>' +

      bloque('Ajustes de la sección', (r.items || []).length + ' reseñas',
        campo('resenas.titulo', 'Titular') +
        campo('resenas.entradilla', 'Entradilla') +
        campo('resenas.urlPerfil', 'Enlace a vuestro perfil de Google') +
        '<div class="par">' +
          campo('resenas.respaldo.nota', 'Nota media de respaldo', { tipo: 'number', ayuda: 'De 1 a 5. Vacío = no se muestra nota.' }) +
          campo('resenas.respaldo.total', 'Número de reseñas de respaldo', { tipo: 'number' }) +
        '</div>', true) +

      '<div style="margin-bottom:var(--s-5)"><button class="btn btn--naranja btn--pequeno" type="button" data-add-resena>Añadir reseña</button></div>' +

      (r.items || []).map(function (x, i) {
        return bloque(x.autor || 'Reseña ' + (i + 1), x.nota ? x.nota + '/5' : '',
          '<div class="par">' +
            campo('resenas.items.' + i + '.autor', 'Quién la escribió') +
            campo('resenas.items.' + i + '.nota', 'Nota (1 a 5)', { tipo: 'number' }) +
            campo('resenas.items.' + i + '.fecha', 'Fecha', { tipo: 'date' }) +
            campo('resenas.items.' + i + '.fuente', 'Dónde la dejó', { ayuda: 'Google, Instagram…' }) +
          '</div>' +
          campo('resenas.items.' + i + '.texto', 'Texto, tal cual lo escribió', { multilinea: true, filas: 4 }) +
          '<div class="peligro"><button class="btn btn--pequeno" type="button" data-borrar="resenas.items.' + i + '">Borrar esta reseña</button></div>'
        );
      }).join('');
  }

  function hojaAjustes() {
    return bloque('Fase de la web', 'Fase ' + B.ajustes.fase,
      campo('ajustes.fase', 'Fase', {
        opciones: [{ v: 1, t: '1 · Escaparate: sin precios ni carrito' }, { v: 2, t: '2 · Reservas activas: con precios y carrito' }],
        ayuda: 'En fase 2 aparecen los precios que hayas puesto, el carrito y el formulario de reserva.'
      }), true) +

    bloque('Medición', B.ajustes.analitica.ga4 || 'sin analítica',
      campo('ajustes.analitica.ga4', 'Identificador de Google Analytics 4', { ayuda: 'Formato G-XXXXXXXXXX. Déjalo vacío y no se carga nada. Solo se activa si el visitante acepta las cookies.' }) +
      campo('ajustes.ratingEndpoint', 'Dirección de la función que trae la nota de Google', { ayuda: 'Opcional. Si la dejas vacía se usan los valores de respaldo de la pestaña Reseñas.' })) +

    bloque('Subida a GitHub', B.ajustes.github.repo || 'sin configurar',
      '<div class="par">' +
        campo('ajustes.github.usuario', 'Usuario u organización') +
        campo('ajustes.github.repo', 'Repositorio') +
        campo('ajustes.github.rama', 'Rama') +
        campo('ajustes.github.ruta', 'Ruta del archivo') +
      '</div>' +
      '<p class="ayuda">El token de acceso se te pide al pulsar «Subir a GitHub» y no se guarda en ningún sitio: ' +
      'vive solo mientras la pestaña está abierta. Necesita permiso de escritura sobre el contenido del repositorio.</p>') +

    bloque('Datos legales', B.negocio.nif,
      '<div class="par">' +
        campo('legal.registro.tomo', 'Registro Mercantil · tomo') +
        campo('legal.registro.folio', 'Folio') +
        campo('legal.registro.hoja', 'Hoja') +
        campo('legal.registro.inscripcion', 'Inscripción') +
        campo('legal.hosting.nombre', 'Proveedor de alojamiento') +
        campo('legal.hosting.web', 'Web del proveedor') +
      '</div>' +
      campo('legal.jurisdiccion', 'Jurisdicción')) +

    bloque('Zona delicada', '',
      '<div class="peligro">' +
        '<p class="ayuda">Esto borra los cambios que tengas sin descargar y vuelve al manifest que hay publicado.</p>' +
        '<button class="btn btn--pequeno mt-4" type="button" data-reiniciar>Descartar mis cambios</button>' +
      '</div>');
  }

  /* ---------- Pintado ---------------------------------------------------- */
  function pintar() {
    $('[data-hoja="negocio"]').innerHTML = hojaNegocio();
    $('[data-hoja="catalogo"]').innerHTML = hojaCatalogo();
    $('[data-hoja="zonas"]').innerHTML = hojaZonas();
    $('[data-hoja="textos"]').innerHTML = hojaTextos();
    $('[data-hoja="faq"]').innerHTML = hojaFAQ();
    $('[data-hoja="resenas"]').innerHTML = hojaResenas();
    $('[data-hoja="ajustes"]').innerHTML = hojaAjustes();
  }

  /* ---------- Escuchar cambios ------------------------------------------ */
  document.addEventListener('input', function (e) {
    var n = e.target.closest('[data-ruta]');
    if (!n) return;
    var ruta = n.getAttribute('data-ruta');
    var v;
    if (n.getAttribute('data-tipo') === 'bool') v = n.checked;
    else if (n.getAttribute('data-tipo') === 'numero') v = n.value === '' ? null : Number(n.value);
    else v = n.value;

    // Los campos que en el manifest son listas se guardan como listas
    var actual = leer(ruta);
    if (Array.isArray(actual) && typeof v === 'string') {
      v = v.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    }
    if (ruta === 'ajustes.fase') v = Number(v);
    escribir(ruta, v);
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('select[data-ruta], input[data-tipo="bool"]')) {
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  /* ---------- Pestañas --------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ir]');
    if (t) {
      var id = t.getAttribute('data-ir');
      $$('.pestana').forEach(function (p) { p.setAttribute('aria-selected', String(p === t)); });
      $$('.hoja').forEach(function (h) { h.setAttribute('data-activa', String(h.getAttribute('data-hoja') === id)); });
      window.scrollTo(0, 0);
      return;
    }

    if (e.target.closest('[data-add-faq]')) {
      B.faq.push({ p: 'Pregunta nueva', r: 'Respuesta.' });
      guardarBorrador(); pintar(); return;
    }
    if (e.target.closest('[data-add-resena]')) {
      B.resenas.items.push({ autor: '', nota: 5, fecha: new Date().toISOString().slice(0, 10), texto: '', fuente: 'Google' });
      guardarBorrador(); pintar(); return;
    }

    var borrar = e.target.closest('[data-borrar]');
    if (borrar) {
      if (!confirm('¿Seguro que quieres borrarlo?')) return;
      var partes = borrar.getAttribute('data-borrar').split('.');
      var idx = Number(partes.pop());
      var lista = partes.reduce(function (o, k) { return o[k]; }, B);
      lista.splice(idx, 1);
      guardarBorrador(); pintar(); return;
    }

    if (e.target.closest('[data-reiniciar]')) {
      if (!confirm('Se pierden todos los cambios que no hayas descargado. ¿Sigo?')) return;
      try { localStorage.removeItem(CLAVE); } catch (err) {}
      location.reload(); return;
    }

    if (e.target.closest('[data-vista-previa]')) { window.open('index.html', '_blank', 'noopener'); return; }
    if (e.target.closest('[data-descargar]')) { descargar(); return; }
    if (e.target.closest('[data-github]')) { subirAGitHub(); return; }
  });

  /* ---------- Generar el archivo ---------------------------------------- */
  function generar() {
    B.ajustes.actualizado = new Date().toISOString().slice(0, 10);
    return '/* =============================================================================\n' +
      '   IMPROVEFIT · manifest.js\n' +
      '   -----------------------------------------------------------------------------\n' +
      '   Generado desde panel.html el ' + new Date().toLocaleString('es-ES') + '.\n' +
      '\n' +
      '   Este es el único archivo que hay que tocar para cambiar la web. Todo lo\n' +
      '   que se lee en el sitio sale de aquí.\n' +
      '\n' +
      '   Aviso: al exportar desde el panel se pierden los comentarios que hubiera\n' +
      '   dentro del archivo anterior. Los datos y los textos se conservan enteros.\n' +
      '   ========================================================================== */\n\n' +
      'window.__BRAND__ = ' + JSON.stringify(B, null, 2) + ';\n';
  }

  function descargar() {
    var texto = generar();
    var blob = new Blob([texto], { type: 'text/javascript;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'manifest.js';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    alert('Descargado. Ahora sustituye el archivo lib/manifest.js de tu alojamiento por este.');
  }

  /* ---------- Subida a GitHub ------------------------------------------- */
  function subirAGitHub() {
    var g = B.ajustes.github || {};
    if (!g.usuario || !g.repo) {
      alert('Antes rellena el usuario y el repositorio en la pestaña Ajustes.');
      return;
    }
    var token = window.__gh_token || prompt(
      'Pega tu token de GitHub con permiso de escritura sobre el repositorio.\n' +
      'No se guarda en ningún sitio: solo se usa ahora y se olvida al cerrar la pestaña.'
    );
    if (!token) return;
    window.__gh_token = token;

    var api = 'https://api.github.com/repos/' + encodeURIComponent(g.usuario) + '/' +
      encodeURIComponent(g.repo) + '/contents/' + g.ruta;
    var cabeceras = {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Base64 con acentos: primero a UTF-8, luego a base64
    var contenido = btoa(String.fromCharCode.apply(null, new TextEncoder().encode(generar())));

    fetch(api + '?ref=' + encodeURIComponent(g.rama || 'main'), { headers: cabeceras })
      .then(function (r) { return r.ok ? r.json() : { sha: undefined }; })
      .then(function (actual) {
        return fetch(api, {
          method: 'PUT',
          headers: cabeceras,
          body: JSON.stringify({
            message: 'Actualiza los datos del sitio desde el panel',
            content: contenido,
            branch: g.rama || 'main',
            sha: actual && actual.sha
          })
        });
      })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || r.status); });
        return r.json();
      })
      .then(function () {
        try { localStorage.removeItem(CLAVE); } catch (e) {}
        sucio = false;
        var m = $('[data-sin-guardar]'); if (m) m.hidden = true;
        alert('Subido a GitHub. Si tienes despliegue automático, el cambio se verá en unos minutos.');
      })
      .catch(function (err) {
        window.__gh_token = null;
        alert('No se ha podido subir: ' + err.message + '\n\nComprueba el token, el repositorio y la rama.');
      });
  }

  /* ---------- Aviso al salir con cambios sin descargar ------------------- */
  window.addEventListener('beforeunload', function (e) {
    if (!sucio) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ---------- Arranque --------------------------------------------------- */
  if (!window.__BRAND__) {
    document.body.innerHTML = '<p style="padding:2rem">No se ha podido cargar lib/manifest.js.</p>';
    return;
  }
  B = cargar();
  pintar();
})();

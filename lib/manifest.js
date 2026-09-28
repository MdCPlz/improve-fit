/* =============================================================================
   IMPROVEFIT · manifest.js
   -----------------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para cambiar la web.
   Todo lo que ves en el sitio (textos, datos, catálogo, horarios, reseñas)
   sale de aquí. Ni el HTML ni el CSS guardan datos del negocio.

   Cómo se edita:
     · A mano, con cualquier editor de texto. Respeta las comillas y las comas.
     · O desde el panel: abre  panel.html  en el navegador, cambia lo que quieras
       y pulsa «Descargar manifest.js». Sustituye este archivo por el descargado.

   Reglas rápidas:
     · Los textos van entre comillas. Si dentro necesitas una comilla, usa « ».
     · precio: null  →  no se muestra precio (fase escaparate).
     · Para ocultar cualquier elemento del catálogo: activo: false.
   ========================================================================== */

window.__BRAND__ = {

  /* ---------------------------------------------------------------------------
     0. AJUSTES GENERALES
     ------------------------------------------------------------------------ */
  ajustes: {
    version: '1.0.0',
    actualizado: '2026-09-07',

    /* FASE DE LA WEB
       1 = escaparate. Se ve el catálogo, no hay precios ni carrito.
       2 = reservas activas. Aparecen precios, carrito y checkout.
       Para pasar a fase 2: pon  fase: 2  y rellena el precio de cada elemento. */
    fase: 1,

    /* Textos que cambian según la fase, para no tocar el HTML */
    faseTextos: {
      1: {
        ctaCatalogo: 'Pedir información',
        avisoPrecios: 'Las tarifas dependen de la zona y de cuántos días vengas. Te las mandamos por escrito, sin letra pequeña.',
        cta: 'Reservar clase de prueba'
      },
      2: {
        ctaCatalogo: 'Añadir a mi plan',
        avisoPrecios: 'Precios por persona. Sin matrícula ni permanencia.',
        cta: 'Reservar mi plaza'
      }
    },

    /* Google Analytics 4. Déjalo en null y no se carga nada.
       Cuando tengas el identificador, ponlo aquí: 'G-XXXXXXXXXX'.
       Solo se activa si el visitante acepta las cookies de medición. */
    analitica: { ga4: null },

    /* Nota media de Google. Si tienes la función serverless subida (api/),
       pon aquí su ruta y la web pedirá la nota real cada 12 h.
       Si la dejas en null, se usan los valores de respaldo de resenas.respaldo. */
    ratingEndpoint: null,

    /* Repositorio para el botón «Subir a GitHub» del panel.
       El token NUNCA se guarda aquí: se pide en el propio panel y se queda
       solo en la memoria del navegador. */
    github: { usuario: 'MdCPlz', repo: 'improve-fit', rama: 'main', ruta: 'lib/manifest.js' }
  },

  /* ---------------------------------------------------------------------------
     1. EL NEGOCIO
     ------------------------------------------------------------------------ */
  negocio: {
    nombre: 'ImproveFit',
    nombreLargo: 'ImproveFit · Hybrid Center',
    razonSocial: 'IMPROVEARANDAFIT, S.L.U.',
    nif: 'B23988959',
    sector: 'Gimnasio y centro de entrenamiento',
    claim: 'Se entrena poco a la vez. Y bien.',
    lema: 'Entrenar bien no es entrenar más.',
    descripcion: 'Gimnasio en Aranda de Duero con dos centros. Clases dirigidas en grupos de seis, entrenamiento funcional híbrido y entrenador personal con readaptación de lesiones. Grupos pequeños y técnica corregida de una en una.',
    descripcionCorta: 'Grupos de seis, funcional híbrido y entrenador personal. Dos centros en Aranda de Duero.',
    wordmark: 'IMPROVE_FIT_'
  },

  /* ---------------------------------------------------------------------------
     2. CONTACTO
     ------------------------------------------------------------------------ */
  contacto: {
    telefono: '+34638580886',
    telefonoTexto: '638 58 08 86',
    whatsapp: '34638580886',
    email: 'improvefitt@gmail.com',
    web: 'https://improvefit.es/',
    dominio: 'improvefit.es'
  },

  /* ---------------------------------------------------------------------------
     3. SEDES
     El primer centro es el principal: es el que va en la ficha de Google.
     ------------------------------------------------------------------------ */
  sedes: [
    {
      id: 'moreras',
      nombre: 'ImproveFit Hybrid Center',
      rol: 'Funcional híbrido y entrenamiento personal',
      reserva: 'https://improvefithybridcenter.wodbuster.com/',
      calle: 'Calle Sol de las Moreras 4',
      cp: '09400',
      ciudad: 'Aranda de Duero',
      provincia: 'Burgos',
      pais: 'ES',
      principal: true,
      zonas: ['six-max', 'hybrid', 'personal'],
      nota: 'Aquí están SIX MAX, la zona Hybrid y la sala de entrenamiento personal.'
    },
    {
      id: 'velazquez',
      nombre: 'Improve Gym',
      /* Su propia web pública (improvefit.wodbuster.com) lo describe como
         Cross Training en grupo, con plazas limitadas y coach. Queda por
         confirmar si esa sala se vende como SIX MAX o como marca aparte:
         por eso «zonas» sigue vacío y no cruza con el catálogo. */
      rol: 'Cross Training en grupo',
      calle: 'Plaza de Velázquez 1, bajo',
      cp: '09400',
      ciudad: 'Aranda de Duero',
      provincia: 'Burgos',
      pais: 'ES',
      principal: false,
      zonas: [],
      reserva: 'https://improvefit.wodbuster.com/',
      nota: 'Cross Training en grupo, con plazas limitadas y un coach pendiente de ti. Tiene su propio cuadro de horarios dentro de la app, aparte del de Sol de las Moreras.'
    }
  ],

  /* ---------------------------------------------------------------------------
     3 bis. TARIFAS
     -----------------------------------------------------------------------------
     Estos importes salen de vuestros propios sistemas de reserva
     (improvefithybridcenter.wodbuster.com y improvefit.wodbuster.com).
     REVÍSALOS antes de publicarlos: si alguno ha cambiado, corrígelo aquí.

     Para que aparezcan en la web hay que poner  ajustes.fase: 2.
     Con fase 1 no se muestra ningún precio.
     ------------------------------------------------------------------------ */
  tarifas: {
    titulo: 'Lo que cuesta entrenar aquí.',
    entradilla: 'Sin matrícula y sin permanencia. Si dudas entre dos, ven a probar y lo hablamos.',
    nota: 'Precios por persona y mes, con IVA incluido. Última revisión: 7 de septiembre de 2026.',
    grupos: [
      {
        sede: 'moreras',
        nombre: 'ImproveFit Hybrid Center',
        planes: [
          { nombre: 'Hybrid · 5 créditos', precio: 69,  unidad: 'al mes', nota: '5 clases al mes.' },
          { nombre: 'Hybrid · 8 sesiones', precio: 99,  unidad: 'al mes', nota: '8 clases al mes.', destacado: true },
          { nombre: 'Hybrid ilimitado',    precio: 139, unidad: 'al mes', nota: 'Todas las clases que quieras.' },
          { nombre: 'Hybrid 5 + gimnasio', precio: 84,  unidad: 'al mes', nota: '5 clases y sala libre.' },
          { nombre: 'Hybrid 8 + gimnasio', precio: 109, unidad: 'al mes', nota: '8 clases y sala libre.' },
          { nombre: 'Bono 10 créditos',    precio: 145, unidad: '3 meses', nota: 'Sin cuota mensual. Caduca a los tres meses.' }
        ]
      },
      {
        sede: 'velazquez',
        nombre: 'Improve Gym · Plaza de Velázquez',
        planes: [
          { nombre: '4 sesiones al mes',  precio: 60,  unidad: 'al mes', nota: '180 € el trimestre.' },
          { nombre: '8 sesiones al mes',  precio: 99,  unidad: 'al mes', nota: '297 € el trimestre.', destacado: true },
          { nombre: '12 sesiones al mes', precio: 129, unidad: 'al mes', nota: '387 € el trimestre.' },
          { nombre: 'Bono 10 sesiones',   precio: 130, unidad: '3 meses', nota: 'Sin cuota mensual.' },
          { nombre: 'Bono 20 verano',     precio: 249, unidad: 'jul–sep', nota: 'Solo temporada de verano.' },
          { nombre: 'Bono 30 verano',     precio: 349, unidad: 'jul–sep', nota: 'Solo temporada de verano.' }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     4. HORARIO
     ------------------------------------------------------------------------ */
  horario: {
    vigenteDesde: 'Desde el 21 de septiembre',
    dias: 'Lunes a viernes',
    entreno: [
      { desde: '07:00', hasta: '12:00' },
      { desde: '17:00', hasta: '21:00' }
    ],
    recepcion: {
      titulo: 'Hay alguien en recepción',
      matiz: 'Solo en septiembre',
      franjas: [
        { desde: '11:00', hasta: '12:00' },
        { desde: '17:00', hasta: '19:00' }
      ]
    },
    cerrado: 'Sábados y domingos, cerrado.',
    nota: 'Fuera de recepción seguimos leyendo el móvil. Escríbenos por WhatsApp y te contestamos.'
  },

  /* ---------------------------------------------------------------------------
     5. REDES
     ------------------------------------------------------------------------ */
  redes: [
    { red: 'instagram', handle: '@improve__fit', url: 'https://www.instagram.com/improve__fit/', etiqueta: 'El día a día del centro' },
    { red: 'instagram', handle: '@improvefit.club', url: 'https://www.instagram.com/improvefit.club/', etiqueta: 'La comunidad' }
  ],

  /* ---------------------------------------------------------------------------
     6. RESERVA ONLINE (WODBuster)
     ------------------------------------------------------------------------ */
  reservas: {
    activo: true,
    url: 'https://improvefithybridcenter.wodbuster.com/invitado.aspx',
    titulo: 'Hazte socio desde el móvil, sin pasar por recepción.',
    entradilla: 'Las reservas van por WodBuster, una app gratuita que usan miles de centros. Te la descargas, creas la cuenta con tu correo y a partir de ahí reservas y anulas tú, aunque sean las siete de la mañana y no haya nadie en el mostrador.',

    /* -------------------------------------------------------------------
       LA APP
       WodBuster no es nuestra: es la plataforma con la que llevamos las
       reservas. Por eso aparece con su logo y su nombre, no con los
       nuestros. Los enlaces son las fichas oficiales de WODBUSTER SL.
       ---------------------------------------------------------------- */
    app: {
      nombre: 'WodBuster',
      reclamo: 'La app de reservas',
      descripcion: 'Gratis, en español y sin anuncios. Desde ella ves los horarios con las plazas que quedan, reservas, anulas y consultas tus bonos.',
      logo: 'assets/img/wodbuster-logo.svg',
      icono: 'assets/img/wodbuster-icono',
      iconoAlt: 'Icono de la aplicación WodBuster.',
      tiendas: [
        { id: 'ios', sistema: 'iPhone y iPad', tienda: 'App Store', url: 'https://apps.apple.com/es/app/wodbuster/id1195360759' },
        { id: 'android', sistema: 'Android', tienda: 'Google Play', url: 'https://play.google.com/store/apps/details?id=santi.wodbuster' }
      ],
      sinApp: '¿No quieres instalar nada? Se puede hacer todo desde el navegador.',
      sinAppCta: 'Abrir en el navegador',
      nota: 'WodBuster es un servicio independiente, con sus propias condiciones. Al darte de alta sales de improvefit.es.',

      /* -----------------------------------------------------------------
         LAS CAPTURAS
         Son las imágenes oficiales de la ficha de WODBUSTER SL en la App
         Store, no montajes nuestros. Si algún día preferís poner capturas
         hechas con vuestro propio móvil, se cambia «img» por la ruta nueva
         (sin el sufijo del tamaño) y ya está.
         -------------------------------------------------------------- */
      titularPantallas: 'Así es la app por dentro',
      entradillaPantallas: 'Tres pantallas de las de verdad, para que no te lleves sorpresas al abrirla.',
      creditoPantallas: 'Capturas oficiales de la aplicación WodBuster, de WODBUSTER SL.',
      pantallas: [
        {
          img: 'assets/img/app-reservar', ancho: 900, alto: 1948,
          alt: 'Pantalla de reservas de la app WodBuster: la tira de días de la semana, las horas de cada clase y el estado de cada sesión.',
          etiqueta: 'Reservar',
          titulo: 'El cuadro de la semana, con las plazas a la vista',
          texto: 'Eliges día arriba, hora en la tira de debajo y ves cada clase con su hora y si queda sitio. Reservar y anular es un toque, a la hora que sea.',
          chips: ['Día y hora', 'Plazas libres', 'Anular sin llamar']
        },
        {
          img: 'assets/img/app-pesos', ancho: 900, alto: 1948,
          alt: 'Pantalla de pesos de la app WodBuster: lista de ejercicios como Back Squat o Bench Press con las marcas guardadas de cada uno.',
          etiqueta: 'Tus marcas',
          titulo: 'Lo que levantabas en marzo, sin fiarte de la memoria',
          texto: 'Cada ejercicio guarda tus números. Es la forma más aburrida y más honesta de saber si estás mejorando o solo apareciendo.',
          chips: ['Tus registros', 'Por ejercicio']
        },
        {
          img: 'assets/img/app-portada', ancho: 900, alto: 1948,
          alt: 'Portada de la app WodBuster con los accesos a reservar clases, equípate, chat y mis pagos.',
          etiqueta: 'La portada',
          titulo: 'Y lo demás, en la misma pantalla',
          texto: 'Reservar, el chat del centro y tus pagos, todo desde la portada. No hace falta andar buscando por menús.',
          chips: ['Reservas', 'Chat', 'Pagos']
        }
      ]
    },

    /* -------------------------------------------------------------------
       LOS PASOS PARA HACERSE SOCIO
       Del 01 al 03, literales de la pantalla de alta de WodBuster. El 06
       queda a propósito sin detallar el pago: ver LEEME, punto 11.
       ---------------------------------------------------------------- */
    titularPasos: 'Seis pasos y ya entrenas',
    pasos: [
      { n: '01', titulo: 'Descarga la app', texto: 'Busca WodBuster en la tienda de tu móvil, o pulsa el botón de aquí arriba y te lleva directo. Es gratis.' },
      { n: '02', titulo: 'Elige nuestro centro', texto: 'Somos dos: Hybrid Center, en Sol de las Moreras, e Improve Gym, en Plaza de Velázquez. Cada uno tiene su propio cuadro de horarios.' },
      { n: '03', titulo: 'Pon tu correo', texto: 'Es lo único que se pide para empezar. Ni tarjeta ni DNI ni datos bancarios.' },
      { n: '04', titulo: 'Confirma y elige contraseña', texto: 'Te llega un correo, lo abres, eliges contraseña y ya estás dentro del sistema. Dos minutos.' },
      { n: '05', titulo: 'Reserva tu clase de prueba', texto: 'Día y hora, con las plazas libres a la vista. La primera clase de la zona Hybrid no se paga.' },
      { n: '06', titulo: 'Si te quedas, eliges tarifa', texto: 'Lo vemos juntos al terminar: cuántos días quieres venir y qué bono te sale a cuenta. Te damos de alta y a partir de ahí reservas tú desde la app.' }
    ],

    qr: { src: 'assets/img/qr-alta-560', alt: 'Código QR que abre el alta de invitado de ImproveFit para reservar la clase de prueba gratis.' },
    nota: 'O apunta con la cámara del móvil a este código.'
  },

  /* ---------------------------------------------------------------------------
     7. RESEÑAS
     -----------------------------------------------------------------------------
     PENDIENTE. Aquí no hay nada inventado: mientras «items» esté vacío,
     la sección de reseñas no aparece en la web.

     Para añadir una reseña, copia este bloque dentro de items:
       { autor: 'Nombre A.', nota: 5, fecha: '2026-06-01', texto: 'Lo que escribió.', fuente: 'Google' }
     ------------------------------------------------------------------------ */
  resenas: {
    titulo: 'Lo dicen ellos, no nosotros.',
    entradilla: 'Copiadas tal cual, sin corregir ni la puntuación.',
    urlPerfil: 'https://www.google.com/maps/search/?api=1&query=ImproveFit+Aranda+de+Duero',
    urlEscribir: 'https://search.google.com/local/writereview?placeid=',
    /* Valores de respaldo mientras no haya función serverless conectada.
       Si los dejas en null, no se muestra ninguna nota. */
    respaldo: { nota: null, total: null },
    items: []
  },

  /* ---------------------------------------------------------------------------
     8. CATÁLOGO · las tres zonas y todo lo que se entrena en ellas
     ------------------------------------------------------------------------ */
  catalogo: {

    categorias: [
      {
        id: 'six-max',
        nombreSencillo: 'Clases en grupo pequeño',
        paraSencillo: 'Para empezar de cero o volver después de años sin entrenar.',
        indice: '01',
        nombre: 'SIX MAX',
        subtitulo: 'Grupos reducidos',
        titular: 'Nunca sois más de seis.',
        titularMarcado: 'Nunca sois|*más de seis*.',
        descripcion: 'Seis es el número que lo cambia todo: con seis el entrenador puede mirar seis técnicas, no seis nucas. La sala se cierra mientras dura la clase, así que el material es vuestro y nadie hace cola. Cada uno lleva su peso y su progresión, aunque estéis haciendo el mismo ejercicio.',
        para: 'Para quien empieza de cero, vuelve después de años parado o ya se ha apuntado a tres gimnasios y no ha durado en ninguno.',
        img: 'assets/img/zona-sixmax',
        alt: 'Grupo pequeño de mujeres haciendo sentadillas con mancuernas.',
        cta: 'Preguntar por SIX MAX',
        wa: 'Hola, quiero información sobre SIX MAX, las clases en grupo reducido.',
        datos: [
          { valor: '6', etiqueta: 'plazas por clase' },
          { valor: '60', etiqueta: 'minutos por sesión' },
          { valor: '1', etiqueta: 'entrenador en sala' }
        ]
      },
      {
        id: 'hybrid',
        nombreSencillo: 'Fuerza y resistencia',
        paraSencillo: 'Para quien ya se mueve y quiere que le exijan un poco más.',
        indice: '02',
        nombre: 'ImproveFit Hybrid',
        subtitulo: 'Funcional e híbrido',
        titular: 'Fuerza y aire en la misma hora.',
        titularMarcado: 'Fuerza y aire|en la *misma hora*.',
        descripcion: 'Diez clases distintas, guiadas de principio a fin, que mezclan fuerza y resistencia en la misma sesión. Se elige según el día que traigas: hay sesiones de treinta minutos y sesiones de una hora, y todas se escalan al nivel de quien entra. Nadie se queda fuera por no llegar.',
        para: 'Para quien ya se mueve y quiere que le exijan de verdad, o quiere ver de qué es capaz antes de apuntarse a una Deka.',
        img: 'assets/img/zona-hybrid',
        alt: 'Un entrenador corrige a una alumna que levanta una pesa rusa.',
        cta: 'Reservar la clase gratis',
        wa: 'Hola, vengo de la web y quiero reservar la clase Hybrid de prueba gratis.',
        destacada: true,
        datos: [
          { valor: '6', etiqueta: 'clases distintas' },
          { valor: '30', etiqueta: 'minutos la más corta' },
          { valor: '0 €', etiqueta: 'la primera clase' }
        ]
      },
      {
        id: 'personal',
        nombreSencillo: 'Entrenador personal y lesiones',
        paraSencillo: 'Para volver después de una lesión, o entrenar sin nadie más en la sala.',
        indice: '03',
        nombre: 'Personal Training',
        subtitulo: 'Personal y readaptación',
        titular: 'Una hora escrita para ti.',
        titularMarcado: 'Una hora|escrita *para ti*.',
        descripcion: 'Una sala aparte, un entrenador para ti y nadie esperando la máquina. Aquí entra el que vuelve de una lesión y el que quiere afinar para competir, y a los dos se les escribe la sesión antes de que lleguen. El trabajo que va entre el alta del fisio y volver a entrenar de verdad se hace aquí, y no se salta.',
        para: 'Para quien vuelve de una lesión, tiene una fecha marcada en el calendario o prefiere que no haya nadie más en la sala.',
        img: 'assets/img/zona-personal',
        alt: 'Un hombre mayor entrena en una máquina junto a su entrenadora.',
        cta: 'Pedir una sesión personal',
        wa: 'Hola, me interesa el entrenamiento personal. ¿Me contáis cómo va?',
        datos: [
          { valor: '1:1', etiqueta: 'o pareja, o cuatro' },
          { valor: '60', etiqueta: 'minutos para ti' },
          { valor: '0', etiqueta: 'colas por la máquina' }
        ]
      }
    ],

    /* Opciones reutilizables. Cada opción elegida es una línea propia del plan. */
    opciones: {
      franja: {
        nombre: 'Franja horaria',
        ayuda: 'A qué hora te viene bien entrenar.',
        valores: [
          { id: 'manana', nombre: 'Mañana · 7:00 a 12:00' },
          { id: 'tarde', nombre: 'Tarde · 17:00 a 21:00' },
          { id: 'flexible', nombre: 'Me da igual, dadme hueco' }
        ]
      },
      frecuencia: {
        nombre: 'Días por semana',
        ayuda: 'Cuántos días quieres venir.',
        valores: [
          { id: 'd2', nombre: '2 días por semana', delta: 0 },
          { id: 'd3', nombre: '3 días por semana', delta: 0 },
          { id: 'd4', nombre: '4 días o más', delta: 0 }
        ]
      },
      sesiones: {
        nombre: 'Sesiones al mes',
        ayuda: 'Cuántas sesiones quieres al mes.',
        valores: [
          { id: 's4', nombre: '4 sesiones', delta: 0 },
          { id: 's8', nombre: '8 sesiones', delta: 0 },
          { id: 's12', nombre: '12 sesiones', delta: 0 }
        ]
      }
    },

    /* ---------------------------------------------------------------------
       Los elementos del catálogo.
       precio: null → no se muestra (fase 1). En fase 2 pon el número.
       --------------------------------------------------------------------- */
    items: [

      /* ---- SIX MAX ---- */
      {
        id: 'six-max-clase',
        cat: 'six-max',
        nombre: 'Clase SIX MAX',
        duracion: '60 min',
        plazas: '6 plazas',
        nivel: 'Todos los niveles',
        resumen: 'Una hora en grupo de seis, con la sala cerrada y el material para vosotros.',
        detalle: 'Calentamiento, bloque principal y vuelta a la calma, guiado de principio a fin. El entrenador ajusta carga y ejercicio persona a persona, así que en la misma clase puede haber alguien en su primera semana y alguien con dos años encima.',
        img: 'assets/img/zona-sixmax',
        etiquetas: ['empezar de cero', 'grupo pequeño', 'volver a entrenar'],
        opciones: ['frecuencia', 'franja'],
        precio: null,
        destacado: true,
        activo: true
      },

      /* ---- HYBRID ---- */
      {
        id: 'core-movilidad',
        cat: 'hybrid',
        nombre: 'Core y Movilidad',
        duracion: '45 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Zona media fuerte y articulaciones que llegan donde tienen que llegar.',
        detalle: 'La clase menos vistosa y la que más se nota a los dos meses. Trabajo de zona media y movilidad de cadera, hombro y tobillo, con progresiones para que cada uno trabaje en su rango y no en el del vecino.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['movilidad', 'core', 'dolor de espalda'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'metcon',
        cat: 'hybrid',
        nombre: 'Metcon',
        duracion: '45 min',
        plazas: 'Grupo',
        nivel: 'Intermedio',
        resumen: 'Circuitos que mezclan fuerza y pulsaciones altas.',
        detalle: 'Bloques de trabajo con descanso medido, para que la intensidad la marque el reloj y no las ganas. Se escala en carga y en repeticiones, así que el día que llegas fundido también entras.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['circuitos', 'resistencia', 'quemar'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'fuerza',
        cat: 'hybrid',
        nombre: 'Fuerza',
        duracion: '45 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Levantar más, pero después de aprender a levantar.',
        detalle: 'Cuatro patrones: empujar, tirar, bisagra de cadera y sentadilla. Primero el movimiento, después el peso, y la progresión se anota semana a semana para que no dependa de la memoria de nadie.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['fuerza', 'técnica', 'progresión'],
        opciones: ['franja'],
        precio: null,
        destacado: true,
        activo: true
      },
      {
        id: 'deka-fit',
        cat: 'hybrid',
        nombre: 'Deka FIT',
        duracion: '60 min',
        plazas: 'Grupo',
        nivel: 'Intermedio y avanzado',
        resumen: 'El formato de competición, sin obligación de competir.',
        detalle: 'Se entrenan las diez estaciones y, sobre todo, el ritmo entre ellas, que es donde se pierde la prueba. La mayoría de quien viene no se presenta a ninguna: lo usa como termómetro.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['deka', 'competir', 'hyrox'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'hybrid',
        cat: 'hybrid',
        nombre: 'Hybrid',
        duracion: '60 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'La clase que da nombre a la zona: fuerza y resistencia sin separar.',
        detalle: 'Una hora entera en la que se levanta, se empuja y se corre sin cambiar de sala. Es la sesión con la que mejor se entiende el sitio, y por eso es la que se prueba gratis.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['funcional', 'híbrido', 'clase de prueba'],
        opciones: ['franja'],
        precio: null,
        destacado: true,
        gratis: true,
        activo: true
      },
      {
        id: 'puro-gluteo',
        cat: 'hybrid',
        nombre: 'Puro Glúteo',
        duracion: '30 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Treinta minutos de glúteo y nada más.',
        detalle: 'Sin calentamiento eterno ni relleno: se entra, se trabaja cadera y glúteo con carga de verdad, y se sale. Media hora que entra bien antes o después de otra clase.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['glúteo', 'sesión corta', 'tonificar'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },

      /* Estas cuatro salen del sistema de reservas del Hybrid Center, así que
         existen y se imparten, pero sus textos los hemos escrito nosotros a
         partir del nombre y la duración. REVÍSALOS antes de publicar. */
      {
        id: 'hiit',
        cat: 'hybrid',
        nombre: 'HIIT',
        duracion: '30 min',
        plazas: 'Grupo',
        nivel: 'Intermedio',
        resumen: 'Media hora de intervalos cortos, para los días sin tiempo.',
        detalle: 'Series muy cortas al máximo con descansos exactos. Es la sesión más dura por minuto de todo el centro y la más fácil de encajar en una hora de comer.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['hiit', 'intensidad', 'sesión corta', 'poco tiempo'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'cardio',
        cat: 'hybrid',
        nombre: 'Cardio',
        duracion: '45 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Cardio dirigido sin mirar la pared durante cuarenta minutos.',
        detalle: 'Remo, bici, cuerda y desplazamientos, en bloques con objetivo de ritmo. Se aprende a sostener una intensidad, que es lo que de verdad cambia el fondo.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['cardio', 'resistencia', 'remo', 'perder grasa'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'core',
        cat: 'hybrid',
        nombre: 'Core',
        duracion: '30 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Media hora de abdomen, lumbares y estabilidad.',
        detalle: 'Trabajo específico de la zona media: antirrotación, antiextensión y respiración. Media hora que se nota en la sentadilla, en el peso muerto y al coger a un niño en brazos.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['core', 'abdomen', 'sesión corta', 'estabilidad'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },
      {
        id: 'movilidad',
        cat: 'hybrid',
        nombre: 'Movilidad',
        duracion: '30 min',
        plazas: 'Grupo',
        nivel: 'Todos los niveles',
        resumen: 'Media hora para que las articulaciones lleguen donde deben.',
        detalle: 'Movilidad activa, no estiramientos pasivos: se gana rango y se aprende a controlarlo con carga. Es la sesión que hace que todas las demás salgan mejor.',
        img: 'assets/img/zona-hybrid',
        etiquetas: ['movilidad', 'flexibilidad', 'dolor', 'recuperación'],
        opciones: ['franja'],
        precio: null,
        activo: true
      },

      /* ---- PERSONAL TRAINING ---- */
      {
        id: 'personal-1a1',
        cat: 'personal',
        nombre: 'Entreno individual',
        duracion: '60 min',
        plazas: '1:1',
        nivel: 'A tu medida',
        resumen: 'Uno a uno, con la sesión escrita antes de que llegues.',
        detalle: 'Se parte de una valoración, no de una plantilla. Sirve para atletas con fecha de competición, para volver de una lesión y para objetivos concretos que no encajan en una clase de grupo.',
        img: 'assets/img/zona-personal',
        etiquetas: ['entrenador personal', 'objetivo concreto', 'atletas'],
        opciones: ['sesiones', 'franja'],
        precio: null,
        destacado: true,
        activo: true
      },
      {
        id: 'personal-pareja',
        cat: 'personal',
        nombre: 'Entreno en pareja',
        duracion: '60 min',
        plazas: '2 personas',
        nivel: 'A vuestra medida',
        resumen: 'Dos personas, un entrenador y la mitad de excusas.',
        detalle: 'Funciona cuando los dos buscáis algo parecido: la atención es la misma que en el individual, repartida, y cada uno lleva su carga. El día que uno no tiene ganas, el otro tira.',
        img: 'assets/img/zona-personal',
        etiquetas: ['pareja', 'amigos', 'compartir'],
        opciones: ['sesiones', 'franja'],
        precio: null,
        activo: true
      },
      {
        id: 'personal-grupo4',
        cat: 'personal',
        nombre: 'Grupo de cuatro',
        duracion: '60 min',
        plazas: '4 personas',
        nivel: 'Todos los niveles',
        resumen: 'Cuatro personas y un entrenador que se sabe vuestras cuatro historias.',
        detalle: 'El punto intermedio entre la clase y el entreno personal: sois cuatro, la sala es vuestra y se corrige de uno en uno sin que la sesión se pare.',
        img: 'assets/img/zona-personal',
        etiquetas: ['grupo pequeño', 'aprender', 'técnica'],
        opciones: ['sesiones', 'franja'],
        precio: null,
        activo: true
      },
      {
        id: 'readaptacion',
        cat: 'personal',
        nombre: 'Readaptación de lesiones',
        duracion: '60 min',
        plazas: '1:1',
        nivel: 'Con informe médico',
        resumen: 'El puente entre el alta del fisio y volver a entrenar.',
        detalle: 'Se parte de tu informe y de lo que te duele hoy, no de lo que ponía hace tres meses. Se sube carga cuando la articulación responde. El objetivo no es volver rápido: es volver y quedarse.',
        img: 'assets/img/zona-personal',
        etiquetas: ['lesión', 'fisio', 'volver a entrenar'],
        opciones: ['sesiones', 'franja'],
        precio: null,
        destacado: true,
        activo: true
      }
    ]
  },

  /* ---------------------------------------------------------------------------
     9. TEXTOS DE LA WEB
     Todo lo que se lee en las páginas. Cámbialo aquí, no en el HTML.
     ------------------------------------------------------------------------ */
  copy: {

    /* -------------------------------------------------------------------------
       EL CARRETE
       La portada es una secuencia de escenas a pantalla completa. Aquí decides
       cuáles salen y en qué orden. Para quitar una escena, bórrala de la lista.

       Tipos disponibles (cada uno saca sus datos de otro sitio del manifest):
         portada   → copy.portada
         miedos    → copy.miedos
         zona      → catalogo.categorias, con «zona» apuntando a su id
         tour      → copy.tour
         reservar  → reservas
       ---------------------------------------------------------------------- */
    carrete: {
      etiqueta: 'Escena',
      saltar: 'Saltar a la información práctica',
      escenas: [
        { id: 'portada',  tipo: 'portada',  rotulo: 'ImproveFit',        fondo: 'assets/img/hero' },
        { id: 'miedos',   tipo: 'miedos',   rotulo: 'Antes de empezar',  fondo: 'assets/img/zona-hybrid' },
        /* «alias» son anclas antiguas que deben seguir funcionando */
        { id: 'six-max',  tipo: 'zona',     zona: 'six-max',  rotulo: 'Zona 01', alias: 'zonas' },
        { id: 'hybrid',   tipo: 'zona',     zona: 'hybrid',   rotulo: 'Zona 02' },
        { id: 'personal', tipo: 'zona',     zona: 'personal', rotulo: 'Zona 03' },
        { id: 'tour',     tipo: 'tour',     rotulo: 'Por dentro' },
        { id: 'reservar', tipo: 'reservar', rotulo: 'Tu primera clase',  fondo: 'assets/img/zona-sixmax' }
      ]
    },

    /* -------------------------------------------------------------------
       LA PORTADA, EN CORTO
       Pensada para quien no vive pegado al móvil: cada bloque responde una
       pregunta y se acaba. Primero las palabras de siempre; los nombres de
       la casa (SIX MAX, Hybrid...) van después, entre comillas.
       ---------------------------------------------------------------- */
    inicio: {
      etiqueta: 'Gimnasio en Aranda de Duero',
      resumen: 'Clases en grupos pequeños, con un entrenador pendiente de ti de principio a fin. Para empezar de cero, para volver después de años o para recuperarte de una lesión.',
      promesas: [
        'Tu primera clase en la sala Hybrid, gratis',
        'Sin matrícula y sin permanencia',
        'Grupos pequeños, con el entrenador siempre en la sala'
      ],
      ctaPrincipal: 'Quiero probar una clase',
      fotoAlt: 'Una mujer de pelo cano entrena con una mancuerna en un gimnasio.',

      queHayTitulo: '¿Qué puedo hacer aquí?',
      queHayTexto: 'Tres formas de entrenar. Si no sabes cuál es la tuya, llámanos y te lo decimos.',
      queHayMarca: 'En el centro la llamamos',
      queHayEnlace: 'Ver sus clases y horarios',

      asiTitulo: 'Un entrenador pendiente de ti, siempre',
      asiTexto: 'Aquí no te dan una tabla y te dejan solo con las máquinas. Cada clase la lleva un entrenador, de principio a fin.',
      asiSello: { numero: '6', texto: 'personas como mucho' },
      razones: [
        { icono: 'grupo', titulo: 'Grupos pequeños', texto: 'En las clases de grupo pequeño sois seis como mucho. El entrenador os ve a todos.' },
        { icono: 'ajuste', titulo: 'Cada ejercicio, a tu medida', texto: 'El entrenador ajusta el peso y el ejercicio a cada persona. En la misma clase puede haber quien empieza y quien lleva años.' },
        { icono: 'lesion', titulo: 'Si vienes de una lesión, se empieza por ahí', texto: 'Hay una sala aparte para entrenar con un entrenador solo para ti y volver poco a poco.' }
      ],
      puertaTitulo: 'Así es la entrada',
      puertaTexto: 'Para que la reconozcas cuando llegues.',

      empezarTitulo: '¿Cómo empiezo?',
      empezar: [
        { titulo: 'Llámanos o escríbenos', texto: 'Te contamos cómo funciona y te buscamos un hueco que te venga bien.' },
        { titulo: 'Ven a probar', texto: 'La primera clase en la sala Hybrid no se paga. Trae ropa cómoda, agua y una toalla.' },
        { titulo: 'Si te gusta, te apuntas', texto: 'Eliges cuántos días quieres venir. Sin matrícula y sin permanencia.' }
      ],
      empezarEnlace: 'Ver la guía completa, con fotos',

      dondeTitulo: '¿Dónde está y cuándo abre?',

      finalTitulo: '¿Prefieres que te lo contemos?',
      finalTexto: 'Llámanos o escríbenos por WhatsApp y te lo explicamos todo, sin compromiso.'
    },

    portada: {
      kicker: 'Aranda de Duero · Dos centros',
      h1: 'Entrenar bien no es entrenar más.',
      /* El mismo titular, con marcas de maquetación:
         la barra | parte la línea, los *asteriscos* pintan en naranja. */
      h1Marcado: 'Entrenar bien|no es *entrenar más*.',
      entradilla: 'Clases dirigidas en grupos de seis, entrenamiento funcional híbrido y entrenador personal con readaptación de lesiones. Dos centros en Aranda de Duero y la misma forma de trabajar en los dos. La primera clase de la zona Hybrid no se paga.',
      ctaPrimario: 'Quiero apuntarme',
      ctaSecundario: 'Ver las clases',
      firma: 'Dos centros, tres zonas, un solo criterio.',
      /* Texto vertical del lateral de la portada */
      rail: 'Gimnasio · Aranda de Duero · Burgos',
      /* Franja de datos al pie de la portada */
      franja: [
        { valor: '3', etiqueta: 'zonas, un centro' },
        { valor: '6', etiqueta: 'plazas por clase' },
        { valor: '30–60', etiqueta: 'minutos por sesión' },
        { valor: '0 €', etiqueta: 'tu primera Hybrid' }
      ],
      marquesina: ['SEIS POR CLASE', 'FUERZA', 'HÍBRIDO', 'READAPTACIÓN', 'DEKA FIT', 'MOVILIDAD', 'SIN PERMANENCIA', 'ARANDA DE DUERO']
    },

    cifras: {
      titulo: 'El método cabe en cinco números.',
      items: [
        { valor: 3, sufijo: '', etiqueta: 'zonas de entrenamiento' },
        { valor: 6, sufijo: '', etiqueta: 'plazas por clase, nunca más' },
        { valor: 6, sufijo: '', etiqueta: 'clases distintas a elegir' },
        { valor: 30, sufijo: ' min', etiqueta: 'dura la sesión más corta' },
        { valor: 0, sufijo: ' €', etiqueta: 'cuesta la primera clase' }
      ]
    },

    miedos: {
      kicker: 'El primer día',
      titulo: 'La barrera casi nunca es física.',
      tituloMarcado: 'La barrera|casi nunca es *física*.',
      entradilla: 'Llevamos años oyendo las mismas tres frases en la puerta. No hablan de pesos ni de forma física: hablan de no saber qué hacer con las manos el primer día. Las contestamos aquí para que no tengas que preguntarlas.',
      items: [
        { miedo: 'No sé por dónde empezar.', respuesta: 'No hay que saber. El primer día se camina, se respira y se aprende un patrón. El entrenador escribe lo que haces tú, no lo que hace el grupo.', zona: 'six-max' },
        { miedo: 'Me da vergüenza.', respuesta: 'Sois seis y la puerta se cierra. No hay espejos de pared a pared ni cola para la máquina. Nadie tiene tiempo de mirarte porque todos están ocupados.', zona: 'six-max' },
        { miedo: 'Vengo de una lesión.', respuesta: 'Entonces empiezas en la sala de al lado, con tu informe delante y sin grupo. Se sube carga cuando el hombro dice que sí, no cuando lo dice el calendario.', zona: 'personal' }
      ]
    },

    selector: {
      kicker: 'Tres preguntas',
      titulo: '¿No sabes cuál elegir? Te ayudamos.',
      entradilla: 'Contesta tres preguntas sencillas y te decimos qué clase te va mejor.',
      casos: [
        { texto: 'Empiezo de cero, o vuelvo después de años parado', zona: 'six-max' },
        { texto: 'Quiero clase en grupo, pero pequeño y sin agobios', zona: 'six-max' },
        { texto: 'Ya entreno y quiero que me exijan de verdad', zona: 'hybrid' },
        { texto: 'Quiero prepararme una Deka', zona: 'hybrid' },
        { texto: 'Vengo de una lesión y me da miedo recaer', zona: 'personal' },
        { texto: 'Quiero que alguien me lleve solo a mí', zona: 'personal' }
      ]
    },

    zonas: {
      kicker: 'Las tres salas',
      titulo: 'Tres salas, un mismo criterio.',
      entradilla: 'La sala cambia según lo que necesites. Lo que no cambia es cuánta gente hay por entrenador, ni la manía de corregir la técnica antes de subir el peso.'
    },

    catalogo: {
      kicker: 'El catálogo',
      titulo: 'Quince maneras de pasar una hora aquí.',
      entradilla: 'Filtra por zona, por duración o escribe lo que te pasa: «lesión», «poco tiempo», «glúteo». Cada ficha dice cuánto dura, cuánta gente sois y qué se trabaja exactamente.',
      buscadorLabel: 'Buscar clase o servicio',
      buscadorPlaceholder: 'Escribe «lesión», «fuerza» o «poco tiempo»…',
      sinResultados: 'Con eso no sale nada. Prueba con «fuerza», «movilidad» o «lesión», quita algún filtro, o escríbenos y te lo buscamos a mano.',
      todas: 'Todo'
    },


    tour: {
      kicker: 'El centro',
      titulo: 'Míralo por dentro antes de venir',
      tituloMarcado: 'Dos minutos, un móvil|y *ningún retoque*.',
      entradilla: 'Lo grabaron los entrenadores un día normal. Se ve la sala, el material y la gente que había. Pulsa el botón naranja para verlo.',
      nota: 'Lleva sonido y no arranca solo',
      boton: 'Ver los dos minutos'
    },


    pasos: {
      kicker: 'El camino corto',
      titulo: 'Escribes, vienes y decides tú.',
      items: [
        { n: '01', titulo: 'Nos escribes', texto: 'Por WhatsApp, en dos líneas. Qué buscas y de dónde partes. No hay formulario de veinte campos ni te va a llamar nadie a las nueve de la noche.' },
        { n: '02', titulo: 'Te pasas a verlo', texto: 'Te enseñamos las salas cuando puedas, sin prisa y sin cita rígida. Si lo tuyo es Hybrid, esa primera clase la haces entera y no la pagas.' },
        { n: '03', titulo: 'Decides', texto: 'Si encaja, miramos horarios y cuota. Si no encaja, te vas por donde has venido y aquí no ha pasado nada.' }
      ]
    },

    /* La banda de la portada que lleva a la guía. Es la única puerta:
       la portada cuenta lo justo y el recorrido entero está en
       apuntarme.html. */
    apuntarme: {
      titulo: '¿Te apuntas? Te lo contamos paso a paso.',
      texto: 'Diez pantallas con fotos: dónde estamos, qué salas hay, cómo se reserva y qué pasa el primer día. Sin letra pequeña y sin compromiso.',
      cta: 'Quiero apuntarme'
    },

    donde: {
      kicker: 'Los dos centros',
      titulo: 'Dónde estamos',
      entradilla: 'Dos centros en Aranda de Duero, con los mismos entrenadores. Puedes pasarte sin avisar y te lo enseñamos.'
    },

    faq: {
      kicker: 'Lo que se pregunta',
      titulo: 'Las ocho de siempre.',
      entradilla: 'Si falta la tuya, mándala por WhatsApp. Contesta un entrenador, no un formulario automático.'
    },

    contacto: {
      kicker: 'Hablamos',
      titulo: 'Cuéntanos de dónde partes.',
      entradilla: 'Cuanto más concreto seas, mejor te contestamos. Si prefieres hablarlo, llama o escribe por WhatsApp y listo.',
      exito: 'Recibido. Contestamos hoy.',
      exitoTexto: 'Miramos horarios y te decimos opciones concretas, no un folleto. Nos vemos en la sala.',
      envioNota: 'Al enviar se abre WhatsApp con todo escrito. Tú solo le das a enviar.',
      privacidad: 'He leído y acepto la política de privacidad. Usamos tus datos para contestarte y para nada más.'
    },

    plan: {
      titulo: 'Tu selección',
      vacio: 'Todavía está vacío. Vuelve al catálogo y marca lo que te llame.',
      resumen: 'Lo que llevas',
      enviar: 'Mandar la selección',
      nota: 'Esto no cobra nada. Nos llega tu selección y te devolvemos horarios y precio por escrito.'
    },

    /* -------------------------------------------------------------------
       LA GUÍA PARA APUNTARSE (apuntarme.html)
       Una diapositiva por paso. «medio» dice qué se enseña al lado:
         foto      → una imagen (img, alt)
         fotos     → varias imágenes en fila (lista)
         capturas  → pantallas del móvil dentro de su marco (lista)
         qr        → el código de alta
         hueco     → lo rellena otro módulo; «host» es el atributo data-*
       Para quitar un paso, bórralo de la lista: se renumera solo.
       ---------------------------------------------------------------- */
    guia: {
      kicker: 'Paso a paso',
      titulo: 'Cómo apuntarte, paso a paso',
      entradilla: 'Pasos cortos, a tu ritmo. Si en cualquier momento te lías, llámanos y lo hacemos contigo por teléfono.',
      contador: 'Paso',
      comoSePasa: 'Para avanzar, pulsa el botón naranja de abajo. Puedes volver atrás cuando quieras.',
      ayudaTitulo: '¿Te has liado?',
      ayudaTexto: 'Llámanos y lo hacemos contigo por teléfono.',
      volverTitulo: '¿Seguimos donde lo dejaste?',
      volverSeguir: 'Sí, seguir',
      volverEmpezar: 'Empezar de nuevo',
      siguiente: 'Siguiente',
      volver: 'Volver al principio',
      pasos: [
        {
          id: 'bienvenida', rotulo: 'Empezar',
          titulo: 'Apuntarte es fácil. Te lo contamos paso a paso',
          texto: 'Son pasos cortos: dónde estamos, qué hay dentro, cómo se reserva y qué pasa el primer día. Puedes ir a tu ritmo y volver atrás cuando quieras.',
          medio: { tipo: 'bienvenida' }
        },
        {
          id: 'donde', rotulo: 'Dónde está',
          titulo: 'Primero, dónde tienes que venir',
          texto: 'Somos dos centros en Aranda de Duero, a diez minutos andando el uno del otro. El de Sol de las Moreras es el grande: SIX MAX, la zona Hybrid y la sala de personal. El de Plaza de Velázquez hace Cross Training en grupo.',
          medio: { tipo: 'foto', vertical: true, img: 'assets/img/tour-poster', webp: [360, 576], respaldo: 'assets/img/tour-poster-576.jpg', alt: 'Fachada de ladrillo del centro ImproveFit, con el cartel «Centro de entrenamiento, sesiones grupales guiadas» sobre la puerta.', pie: 'Así es la entrada. Para que la reconozcas cuando llegues.' }
        },
        {
          id: 'salas', rotulo: 'Qué hay dentro',
          titulo: 'Tres salas, y no hacen lo mismo',
          texto: 'No es un gimnasio de máquinas donde te dejan solo. Cada sala tiene su formato y su gente. Mira cuál te suena más: luego, si te equivocas, se cambia sin problema.',
          medio: {
            tipo: 'fotos',
            lista: [
              { img: 'assets/img/zona-sixmax', webp: [480, 800], respaldo: 'assets/img/zona-sixmax-1200.jpg', alt: 'Grupo pequeño de mujeres haciendo sentadillas con mancuernas.', pie: 'Grupo pequeño' },
              { img: 'assets/img/zona-hybrid', webp: [480, 800], respaldo: 'assets/img/zona-hybrid-1200.jpg', alt: 'Un entrenador corrige a una alumna que levanta una pesa rusa.', pie: 'Fuerza y resistencia' },
              { img: 'assets/img/zona-personal', webp: [480, 800], respaldo: 'assets/img/zona-personal-1200.jpg', alt: 'Un hombre mayor entrena en una máquina junto a su entrenadora.', pie: 'Entrenador personal' }
            ]
          }
        },
        {
          id: 'miedos', rotulo: 'Lo que preocupa',
          titulo: 'Lo que nos preguntan antes de venir',
          texto: 'Las tres dudas que salen siempre. Si la tuya no está aquí, escríbenos y te la contestamos sin venderte nada.',
          medio: { tipo: 'hueco', host: 'data-miedos', clase: 'miedos' }
        },
        {
          id: 'app', rotulo: 'La app',
          titulo: 'Las reservas van por una app, y es gratis',
          texto: 'Se llama WodBuster y no es nuestra: es la plataforma con la que llevamos los horarios. Te la descargas una vez y ya reservas y anulas tú, a la hora que sea. Si no quieres instalar nada, se hace igual desde el navegador.',
          medio: { tipo: 'hueco', host: 'data-app', clase: 'app' }
        },
        {
          id: 'cuenta', rotulo: 'Tu cuenta',
          titulo: 'Crear la cuenta son dos minutos',
          accion: { texto: 'Crear mi cuenta', enlace: 'reserva' },
          texto: 'Solo se pide el correo. Te llega un mensaje, lo abres, eliges contraseña y ya estás dentro. Ni tarjeta, ni DNI, ni datos bancarios: eso no se toca hasta que decidas quedarte.',
          medio: { tipo: 'qr' },
          lista: [
            'Pulsa «Crear mi cuenta» (o, desde el ordenador, apunta al código con la cámara del móvil).',
            'Escribes tu correo y pulsas «Comenzar».',
            'Abres el correo que te llega y confirmas.',
            'Eliges una contraseña. Ya está.'
          ]
        },
        {
          id: 'reservar', rotulo: 'Reservar',
          titulo: 'Y ahora sí: eliges día y hora',
          accion: { texto: 'Reservar mi clase de prueba', enlace: 'reserva' },
          texto: 'Arriba los días de la semana, debajo las horas, y cada clase con las plazas que le quedan. Reservas de un toque. Y si te surge algo, anulas igual de fácil y sin llamar a nadie.',
          medio: {
            tipo: 'capturas',
            lista: [
              { img: 'assets/img/app-reservar', ancho: 900, alto: 1948, alt: 'Pantalla de reservas de la app WodBuster: la tira de días de la semana, las horas de cada clase y el estado de cada sesión.' }
            ]
          },
          nota: 'La primera clase de la zona Hybrid no se paga.'
        },
        {
          id: 'primer-dia', rotulo: 'El primer día',
          titulo: 'Qué pasa cuando llegas',
          texto: 'Llega cinco minutos antes. Te recibe el entrenador, le cuentas lo que llevas encima (lesiones, operaciones, cuánto hace que no entrenas) y él adapta lo que haga falta. Calentamiento, bloque principal y vuelta a la calma. Nadie te va a poner a competir con nadie.',
          medio: { tipo: 'foto', img: 'assets/img/foto-plan', webp: [480, 800, 1200], respaldo: 'assets/img/foto-plan-1200.jpg', alt: 'Un entrenador repasa con una alumna su plan de entrenamiento en una tableta.' },
          lista: [
            'Ropa cómoda y zapatillas de suela plana si tienes.',
            'Agua y una toalla.',
            'Nada más: el material lo ponemos nosotros.'
          ]
        },
        {
          id: 'tarifa', rotulo: 'La cuota',
          titulo: 'Si te quedas, elegimos tarifa juntos',
          texto: 'Al terminar la clase lo hablamos: cuántos días quieres venir y qué bono te sale a cuenta. Sin matrícula y sin permanencia. Aquí puedes ir haciéndote una idea.',
          medio: { tipo: 'hueco', host: 'data-calculadora', clase: 'calc' }
        },
        {
          id: 'listo', rotulo: 'Ya está',
          titulo: 'Ya lo sabes todo. ¡Te esperamos!',
          texto: 'No hay más pasos. Reserva la clase de prueba y nos vemos allí. Y si prefieres que te lo dejemos hecho, llámanos: se tarda lo mismo.',
          medio: { tipo: 'cierre' }
        }
      ]
    },
    whatsapp: {
      etiqueta: 'Escríbenos por WhatsApp',
      generico: 'Hola. Vengo de la web y me gustaría que me contarais opciones.',
      porPagina: {
        'index': 'Hola. Quiero reservar la clase de prueba de la zona Hybrid.',
        'clases': 'Hola. He estado mirando las clases en la web y tengo un par de dudas.',
        'centro': 'Hola. He visto el vídeo del centro y me gustaría pasarme a verlo.',
        'contacto': 'Hola. Vengo de la web y me gustaría que me contarais opciones.'
      }
    },

    error404: {
      titulo: 'Aquí no hay nada.',
      texto: 'O la hemos movido, o falta una letra en la dirección. Ninguna de las dos cosas tiene arreglo difícil.',
      cta: 'Volver al principio'
    },

    cookies: {
      titulo: 'Cookies',
      texto: 'Las imprescindibles para que esto funcione y, si nos dejas, unas de medición para saber qué se lee. Publicidad, ninguna.',
      aceptar: 'Aceptar todas',
      rechazar: 'Solo las necesarias',
      config: 'Ver detalle',
      mapaBloqueado: 'El mapa es de Google y deja sus cookies. Acéptalas para verlo aquí, o ábrelo directamente en Maps.',
      mapaBoton: 'Cargar el mapa'
    }
  },


  /* ---------------------------------------------------------------------------
     9 bis. DINÁMICAS
     Las piezas con las que el visitante juega: el buscador de la portada, el
     test de tres preguntas y la calculadora de cuota. Todo sale de aquí.
     ------------------------------------------------------------------------ */
  dinamicas: {

    /* Buscador doble de la portada, estilo marketplace */
    buscador: {
      titulo: '¿Qué quieres entrenar?',
      phQue: 'Fuerza, movilidad, volver de una lesión…',
      phDonde: 'Elige centro',
      boton: 'Buscar',
      todos: 'Cualquier centro'
    },

    /* Test de tres preguntas. Cada respuesta suma puntos a una zona.
       Al final gana la zona con más puntos y se propone una clase suya. */
    test: {
      titulo: 'Tres preguntas y te decimos por dónde entrar',
      entradilla: 'Treinta segundos. Al final te damos zona, clase concreta y el mensaje ya escrito.',
      reiniciar: 'Volver a empezar',
      resultado: 'Tu sitio es',
      cta: 'Preguntar por esto',
      preguntas: [
        {
          titulo: '¿Cuánto hace que no entrenas de forma seguida?',
          opciones: [
            { texto: 'Nunca lo he hecho', nota: 'O tan atrás que no cuenta', puntos: { 'six-max': 3, 'personal': 1 } },
            { texto: 'Un par de años', nota: 'Algo hice, pero lo dejé', puntos: { 'six-max': 3, 'hybrid': 1 } },
            { texto: 'Entreno ahora mismo', nota: 'Con más o menos constancia', puntos: { 'hybrid': 3 } }
          ]
        },
        {
          titulo: '¿Hay algo que te duela o te frene?',
          opciones: [
            { texto: 'Vengo de una lesión', nota: 'Con o sin alta del fisio', puntos: { 'personal': 4 } },
            { texto: 'Molestias de vez en cuando', nota: 'Espalda, rodilla, hombro', puntos: { 'personal': 2, 'six-max': 1 } },
            { texto: 'Nada, estoy entero', nota: 'Puedo con todo', puntos: { 'hybrid': 2, 'six-max': 1 } }
          ]
        },
        {
          titulo: '¿Cómo prefieres entrenar?',
          opciones: [
            { texto: 'En grupo pequeño', nota: 'Máximo seis y sin agobios', puntos: { 'six-max': 3 } },
            { texto: 'En clase dirigida', nota: 'Con ritmo y variedad', puntos: { 'hybrid': 3 } },
            { texto: 'Solo, a mi ritmo', nota: 'O como mucho con un amigo', puntos: { 'personal': 3 } }
          ]
        }
      ]
    },

    /* Calculadora de cuota. Cruza centro y frecuencia con tarifas.grupos.
       Con ajustes.fase = 1 enseña el plan pero no el precio. */
    calculadora: {
      titulo: '¿Cuánto me costaría?',
      entradilla: 'Elige centro y cuántos días quieres venir. Te decimos qué plan te encaja.',
      labelCentro: 'En qué centro',
      labelFrecuencia: 'Cuántos días a la semana',
      frecuencias: [
        { id: 'f1', texto: '1 día', sesiones: 4 },
        { id: 'f2', texto: '2 días', sesiones: 8 },
        { id: 'f3', texto: '3 días', sesiones: 12 },
        { id: 'f4', texto: 'Todos los que pueda', sesiones: 99 }
      ],
      sinPrecio: 'Te lo mandamos por escrito',
      notaFase1: 'Con la web en modo escaparate no se muestran importes. Te los pasamos por WhatsApp en un minuto.',
      cta: 'Pedir esta tarifa'
    },

    /* Ventana de la clase de prueba */
    modal: {
      titulo: 'Tu primera clase no se paga',
      texto: 'Una clase entera de la zona Hybrid, con el grupo y el entrenador de ese día. Sin tarjeta y sin compromiso de quedarte.',
      cta: 'Reservar ahora',
      alternativa: 'Prefiero preguntar antes',
      cerrar: 'Ahora no'
    }
  },

  /* ---------------------------------------------------------------------------
     10. PREGUNTAS FRECUENTES
     ------------------------------------------------------------------------ */
  faq: [
    {
      p: '¿Esto es un gimnasio de máquinas o de clases dirigidas?',
      r: 'Las dos, y por eso hay tres salas. En SIX MAX se entrena en clase dirigida con un máximo de seis personas. En la zona Hybrid, funcional en grupo con diez clases distintas. Y en la sala de entrenamiento personal hay máquinas guiadas y poleas para trabajar solo, en pareja o en grupo de cuatro con un entrenador al lado.'
    },
    {
      p: '¿Dónde estáis exactamente?',
      r: 'En dos sitios de Aranda de Duero: el Hybrid Center está en la calle Sol de las Moreras 4 y el otro centro en la Plaza de Velázquez 1, bajo. Cada uno tiene su enlace de reservas. Si el primer día no lo encuentras, escribe por WhatsApp y te guiamos.'
    },
    {
      p: 'No he pisado un gimnasio en la vida. ¿Sirve igual?',
      r: 'Para eso está la zona de grupos reducidos. Sois seis y el entrenador ajusta el peso y el ejercicio a cada uno, así que en la misma clase hay gente en su primera semana y gente con años. El primer día no levantas lo que el de al lado, y no pasa absolutamente nada.'
    },
    {
      p: '¿Me vais a acabar metiendo en una competición?',
      r: 'No, y la mayoría de quien entrena en Hybrid no se presenta a nada. El formato Deka se usa como referencia para saber en qué punto estás. Si un día te apetece competir, salimos contigo; si no, no vuelve a mencionarse.'
    },
    {
      p: 'Vengo de una lesión. ¿Puedo entrenar?',
      r: 'Sí, empezando por la sala de entrenamiento personal. Traes el informe si lo tienes y se trabaja a partir de ahí, subiendo carga solo cuando la articulación responde. No se entra a una clase de grupo hasta que tiene sentido.'
    },
    {
      p: '¿Cuánto cuesta al mes?',
      r: 'Depende del centro, de la zona y de cuántos días vengas. Te lo mandamos por escrito con todo desglosado, sin matrícula ni permanencia escondidas. Y si prefieres probar antes de preguntar el precio, la primera clase de la zona Hybrid no se paga.'
    },
    {
      p: 'Tengo dos huecos malos a la semana. ¿Me cuadra?',
      r: 'Hay sesiones de 30, 45 y 60 minutos, y varias franjas al día en los dos centros. Dinos qué dos huecos tienes a la semana y te decimos qué entra ahí.'
    },
    {
      p: '¿Qué me llevo el primer día?',
      r: 'Ropa cómoda, zapatillas de suela plana si tienes, agua y una toalla. Nada más: no hace falta comprar material ni traer nada firmado.'
    },
    {
      p: '¿Hay que instalarse una aplicación para reservar?',
      r: 'Las reservas las llevamos con WodBuster, que es gratis y está en App Store y en Google Play. Si prefieres no instalar nada, se hace igual desde el navegador del móvil o del ordenador. Y si te lías, llámanos y lo dejamos hecho nosotros.'
    },
    {
      p: 'No me manejo con el móvil. ¿Puedo apuntarme igual?',
      r: 'Sí. Llámanos al 638 58 08 86 o pásate por el centro y te damos de alta nosotros en un momento. La app es para que puedas reservar a cualquier hora, no un requisito para entrenar.'
    }
  ],

  /* ---------------------------------------------------------------------------
     11. FORMULARIO
     ------------------------------------------------------------------------ */
  formulario: {
    /* A dónde va el formulario.
       'whatsapp' → abre WhatsApp con el mensaje escrito (no necesita servidor).
       'email'    → abre el correo del visitante con el mensaje escrito.
       Si algún día contratas un servicio de formularios, pon aquí su URL
       en 'endpoint' y cambia destino a 'post'. */
    destino: 'whatsapp',
    endpoint: null,
    intereses: [
      'Empezar de cero',
      'Entrenar en grupo reducido',
      'Funcional e híbrido',
      'Preparar una Deka',
      'Entrenamiento personal',
      'Volver de una lesión'
    ]
  },

  /* ---------------------------------------------------------------------------
     12. NAVEGACIÓN
     ------------------------------------------------------------------------ */
  nav: [
    { texto: 'Portada', href: 'index.html' },
    { texto: 'Clases', href: 'clases.html' },
    { texto: 'El centro', href: 'centro.html' },
    { texto: 'Cómo apuntarte', href: 'apuntarme.html' },
    { texto: 'Contacto', href: 'contacto.html' }
  ],

  /* ---------------------------------------------------------------------------
     13. DATOS LEGALES
     ------------------------------------------------------------------------ */
  legal: {
    /* PENDIENTE: cuando esté la inscripción en el Registro Mercantil,
       rellena estos cuatro campos y aparecerán solos en el aviso legal. */
    registro: { tomo: '', folio: '', hoja: '', inscripcion: '' },
    hosting: { nombre: '', web: '' },
    jurisdiccion: 'Juzgados y tribunales de Burgos',
    responsable: 'IMPROVEARANDAFIT, S.L.U.',
    finalidad: 'Contestar a tu consulta y darte información sobre las clases y los servicios del centro.',
    baseLegal: 'Tu consentimiento, que das al enviarnos el formulario o al escribirnos.',
    conservacion: 'Guardamos tus datos mientras dure la conversación y, después, un año por si vuelves a escribir.',
    destinatarios: 'No cedemos tus datos a nadie, salvo obligación legal. El formulario abre WhatsApp, que es de Meta Platforms Ireland Ltd.',
    derechos: 'Puedes pedirnos acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a improvefitt@gmail.com. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).'
  }
};

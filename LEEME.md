# ImproveFit · web

Sitio estático en HTML, CSS y JavaScript sin frameworks. No hay que compilar
nada: se arrastra la carpeta al alojamiento y funciona.

---

## 0. Rediseño de septiembre de 2026 · para gente de 50 años o más

**Lo que no se toca** (suelo de accesibilidad):

- Texto normal a 19 px y **nada por debajo de 16 px**.
- Todo el texto por encima de **7:1** de contraste sobre su fondo.
- Nada en MAYÚSCULAS espaciadas.
- Botones de 48 px de alto como mínimo.
- El teléfono siempre a mano: en la cabecera del ordenador, en la barra de
  abajo del móvil y en grande en el pie.

**Colores**: el negro y el naranja de la marca, sin cambios.

**Letras** (Google Fonts):

- *Bricolage Grotesque* en los titulares.
- *Atkinson Hyperlegible Next* en el texto. La diseñó el Braille Institute
  para personas con baja visión.

**Movimiento**: todo está en `lib/efectos.js` y en el apartado 5 de
`css/base.css`. Nada se repite en bucle ni se mueve por su cuenta después de
entrar. Con «reducir movimiento» activado en el móvil, todo se queda quieto.

- Entrada de la portada: la foto se asienta y el titular sube línea a línea.
- `data-revelar` hace que algo suba y aparezca al bajar. Admite `izq`,
  `der` y `zoom`.
- `data-mascara` en un `.foto` descubre la foto como una persiana.
- La clase `luz` pone un brillo naranja que sigue al ratón.
- En «¿Cómo empiezo?», la línea se llena al bajar y enciende los números.

**Fotos**: las de gente (portada, salas, «Así trabajamos» y el bloque final)
son de **Unsplash**, con licencia libre para uso comercial y sin obligación de
citar al autor. Sus textos alternativos describen lo que se ve y **no dicen
que sean las salas de ImproveFit**. En cuanto haya fotos propias, se cambian
dejando el mismo nombre de archivo (`zona-sixmax-480.webp`, etc.) y se
corrige el `alt` en el manifest. Las fotos generadas que había antes están
en `../improvefit-imagenes-antiguas/`. La fachada (`tour-poster`) y el
vídeo del tour son reales.

---

## 1. Cómo se sube

Sube **todo el contenido de esta carpeta** a la raíz pública del alojamiento
(normalmente `public_html`, `www` o `httpdocs`). Por FTP, por el gestor de
archivos del panel o arrastrando la carpeta, da igual.

Comprueba después:

- `https://improvefit.es/` carga en oscuro, con la cinta naranja arriba.
- `https://improvefit.es/robots.txt` y `/sitemap.xml` responden.
- Una URL inventada, por ejemplo `/xyz`, muestra la página 404.

Si el alojamiento es Apache, el `.htaccess` ya activa compresión, caché,
HTTPS forzado y la página de error. Si es Nginx o similar, ignóralo.

---

## 2. Cómo está montada

El sistema visual es el de **RACHA**, con los pigmentos de ImproveFit. De la
referencia se toma la estructura; de la marca, el color.

### Los cuatro fondos

Nada es negro puro ni blanco puro. El fondo sube de nivel según lo cerca que
esté del lector:

| Token | Valor | Dónde |
|---|---|---|
| `--fondo` | `#0E1013` | La página. Es color de marca. |
| `--capa` | `#121519` | Secciones alternas. |
| `--carta` | `#171B20` | Tarjetas. |
| `--campo` | `#1D2229` | Campos, chips y todo lo que se pulsa. |
| `--hondo` | `#0A0C0E` | El pie, por debajo de la página. |

Lo que separa un plano de otro es una línea de un punto (`--linea`,
`--linea-2`), no una sombra: sobre oscuro una sombra no se ve.

### Tipografía

| | |
|---|---|
| **Nunito** 700–900 | Titulares. Redonda y amable, nada de gimnasio agresivo. |
| **IBM Plex Sans** 400–700 | Todo el texto corrido. |
| **IBM Plex Mono** 400–500 | Etiquetas pequeñas en versales: `.ante`, chips, horarios, migas. |

Las tres desde Google Fonts. No hay que instalar ni compilar nada.

### Qué se conserva de la pasada anterior

El cambio es de piel, no de funcionamiento. Sigue intacto todo lo que hacía
la web usable para gente que no vive pegada al móvil:

- Texto de 18 px de serie y botones de 3,4 rem.
- Nada que se pulse por debajo de 44 px de alto.
- Etiquetas de formulario en frase, no en versales.
- Barra fija abajo en el móvil con «Llamar» y «WhatsApp».
- Sin ventanas emergentes y sin callejones sin salida en el catálogo.

### Piezas del sistema

| Pieza | Qué es |
|---|---|
| **Cabecera** | Pegajosa, negro translúcido, con hebra naranja de progreso de lectura. |
| **Cinta de arriba** | La marquesina, en degradado de ascua, con las etiquetas en mono. |
| **Portada** | Halo de ascua detrás del titular, sellos de confianza y collage de tres fotos. |
| **Tarjetas** | Fondo `--carta`, línea de un punto y esquina de 24 px. |
| **El que arde** | En cada trío, el último bloque va en degradado naranja. Es el que cierra y el que hay que mirar: en la portada, el paso 06. |

### Los dos naranjas

Sobre oscuro el naranja de marca ya se lee: da 7,3:1 contra el fondo, así que
`--naranja-t` (que en la etapa clara había que oscurecer hasta `#853200`)
ahora es el mismo `#F2841E`. Lo que sí hay que vigilar es el **degradado**:

- `--grad` (`#F2841E` → `#D9531F`) es el que lleva texto oscuro encima. No
  baja del `#D9531F` a propósito: por debajo, el texto normal deja de cumplir
  AA. Con este rango el peor punto da 4,7:1.
- `--grad-hondo` (`#F2841E` → `#C1272D`) es **solo decoración**: la cinta de
  arriba, los halos. Ahí no va texto pequeño.

Si algún día metéis texto sobre `--grad-hondo`, comprobad el contraste antes.

### Detalle: el número de los pasos

Va en `#67717C`, no en el gris de línea. Parece un fantasma, que es el efecto
de la referencia, pero da 3,5:1 y por tanto se lee: es texto que dice el orden
del paso, no un adorno.

---

## 2 bis. Las dinámicas

Las piezas con las que el visitante interactúa. Salen de `lib/manifest.js` →
`dinamicas` y viven en `lib/dinamicas.js`, salvo la barra de ayuda, que está
en `lib/nucleo.js` porque tiene que aparecer en todas las páginas.

| Dinámica | Dónde sale | Qué hace | Dónde se edita |
|---|---|---|---|
| **Test de tres preguntas** | `clases.html` | Cada respuesta suma puntos a una zona; gana la más votada y propone una clase concreta con el mensaje de WhatsApp ya escrito. | `dinamicas.test` |
| **Calculadora de cuota** | `apuntarme.html` | Cruza centro y frecuencia con `tarifas.grupos` y dice qué plan encaja. Con fase 1 enseña el plan pero no el importe. | `dinamicas.calculadora` |
| **Barra de ayuda** | Todas | Fija abajo en el móvil, con «Llamar» y «WhatsApp». El mensaje de WhatsApp cambia según la página. | `copy.whatsapp` |
| **Reloj de apertura** | Todas | Añade «cierra en 2 h 11 min» o «abre el lunes a las 7:00» a los indicadores de estado. | `horario.entreno` |

En el catálogo hay además un **filtro de duración** en forma de lista
desplegable (30, 45 y 60 minutos), que se genera solo leyendo las duraciones
que existan en el manifest.

---

## 3. Cómo se cambian los textos y los datos

Todo sale de un único archivo: **`lib/manifest.js`**.

Dos formas de editarlo:

**A mano.** Ábrelo con cualquier editor de texto, cambia lo que quieras
respetando comillas y comas, guarda y súbelo.

**Desde el panel.** Abre `panel.html` en el navegador (funciona con doble
clic, sin servidor). Cambia lo que necesites y pulsa **Descargar
manifest.js**. Sustituye `lib/manifest.js` por el archivo descargado.

> El panel no publica nada por su cuenta. La web pública no cambia hasta que
> subes el archivo, o usas el botón **Subir a GitHub**.

---

## 4. Qué cuenta cada página

La portada no intenta ser toda la web: dice lo justo y manda a la guía. Cada
página tiene su tema y no se repite en otra.

| Página | Qué lleva |
|---|---|
| `index.html` | Portada, los números, las tres zonas, la banda de **Quiero apuntarme**, dónde estamos y el formulario. Cinco secciones y para. |
| `apuntarme.html` | **La guía**: diez pantallas paso a paso con fotos. Es la única puerta de entrada. |
| `clases.html` | Las quince clases con buscador y filtros, el test de tres preguntas y las preguntas frecuentes. |
| `centro.html` | El vídeo del tour, las salas y cómo llegar. |
| `contacto.html` | Formulario, alta, horario, mapa y preguntas. |

---

## 5. La guía para apuntarse (`apuntarme.html`)

Es un **asistente**: se ve un paso cada vez, entero y desde su título. Todo
sale de `copy.guia` en el manifest y lo pinta `lib/guia.js`. Los estilos
van aparte, en `css/guia.css`, que solo carga esta página.

- **Bienvenida** con tres caminos: empezar la guía, «ya tengo cuenta»
  (directo a reservar) o «prefiero hablar con alguien» (llamar).
- **Ordenador**: a la izquierda, la lista de todos los pasos. Los que ya se
  han visto llevan una marca de hecho. Debajo, la barra de avance y la ayuda
  con el teléfono.
- **Móvil**: arriba, una línea con «Paso 3 de 9: Tu cuenta», que despliega la
  lista, y la barra de avance. En la cabecera, «Clase gratis» se cambia por un
  botón naranja de **Llamar**.
- **Atrás / Siguiente: lo que viene**, grandes y siempre pegados abajo.
- Se avanza con los botones, con la lista, con las flechas del teclado y, en
  el móvil, deslizando el dedo de lado (un gesto claro, que no se confunde con
  bajar la página).
- **Recuerda por dónde ibas**. Si alguien vuelve en los 30 días siguientes sin
  haber terminado, le pregunta si quiere seguir donde lo dejó. Se guarda en el
  navegador de esa persona (`localStorage`, clave `if_guia_v2`) y nada más.
- Cada paso tiene su dirección (`apuntarme.html#paso-cuenta`), así que se
  puede enlazar directamente a uno.
- Los pasos que piden hacer algo llevan el botón para hacerlo: «Crear mi
  cuenta» y «Reservar mi clase de prueba». El código QR solo sale en el
  ordenador, porque desde el móvil no sirve.
- Al llegar al final hay una pequeña celebración de puntos naranjas. Pasa una
  vez y se quita con «reducir movimiento».

Para añadir, quitar o cambiar un paso, basta con tocar `copy.guia.pasos`. El
contador y la lista se recalculan solos. Tipos de `medio`: `bienvenida`,
`foto` (admite `vertical: true` y `pie`), `fotos`, `capturas`, `qr`,
`hueco` (lo rellena otro módulo) y `cierre`.

> **Ojo**: `guia.js` va **antes** que `documento.js` y `dinamicas.js`
> porque crea los huecos de la tarjeta de la app, las dudas y la calculadora.

---

## 6. La app de reservas (WodBuster)

### Los seis pasos para hacerse socio### Los seis pasos para hacerse socio

Están en `reservas.pasos` y se pintan como seis tarjetas numeradas en la
portada y en contacto, a dos columnas. La sexta va en degradado de ascua.

Son instrucciones, no pantallas: **aquí no hay capturas**. De la pantalla de
alta de WodBuster no existe imagen pública, y no se va a montar una falsa.

Los pasos 3 y 4 son literales de la pantalla de alta de WodBuster. **El paso
6 está escrito a propósito sin decir dónde se paga**, porque no sabemos si
tenéis los cobros activados dentro de la app o si la tarifa se cierra en el
centro. Está en la lista de pendientes.

### Así es la app por dentro · capturas reales

Debajo de los pasos va un bloque aparte con **tres capturas de verdad** de la
app, cada una en su marco de móvil y alternando de lado, al estilo de las
partes de la app de la referencia.

| Captura | Qué enseña | Archivo |
|---|---|---|
| Reservar | La tira de días, las horas y el estado de cada clase | `app-reservar` |
| Tus marcas | La lista de pesos con tus registros por ejercicio | `app-pesos` |
| La portada | Reservar, chat y pagos en la misma pantalla | `app-portada` |

Están en `reservas.app.pantallas`. Cada una en `.webp` a 480 y 900 px con
`.jpg` de respaldo a 900: las seis imágenes suman unos 600 KB en total y van
con `loading="lazy"`, así que no pesan en la primera carga.

#### De dónde salen y qué hay que saber

Son las **imágenes oficiales** que WODBUSTER SL publica en su ficha de la App
Store. Se sirven desde `assets/img`, no enlazadas desde fuera, y llevan el
crédito escrito debajo del bloque: «Capturas oficiales de la aplicación
WodBuster, de WODBUSTER SL». El aviso legal lo recoge también, en el apartado
de propiedad intelectual.

Es marca de un tercero usada para identificar la herramienta con la que
gestionáis las reservas, que es un uso normal. Aun así, **lo más limpio es
que le mandéis un correo a WodBuster diciendo que las usáis**: son treinta
segundos y os quita el tema de encima.

Y si preferís poner capturas hechas con vuestro propio móvil, con vuestros
horarios de verdad dentro, se cambia `img` por la ruta nueva (sin el sufijo
del tamaño), se dejan los archivos en `assets/img` con el mismo patrón
`-480.webp`, `-900.webp` y `-900.jpg`, y se quita `creditoPantallas`.

### El logo### El logo### El logo

`assets/img/wodbuster-logo.svg` es el logotipo oficial, en blanco, y por eso
la tarjeta va sobre fondo oscuro: es marca ajena y se presenta como suya, no
repintada con nuestros colores. El icono cuadrado
(`wodbuster-icono-256.png`) es el de la ficha de la App Store.

---

## 7. Las dos fases

En `lib/manifest.js`, dentro de `ajustes`:

```js
fase: 1
```

- **Fase 1 · escaparate.** Catálogo completo sin precios. La sección de
  tarifas no aparece. El botón de cada clase abre WhatsApp. Es como está ahora.
- **Fase 2 · reservas activas.** Aparecen la sección de tarifas, los precios
  de cada clase, el carrito en la cabecera y el formulario de solicitud.

Las tarifas ya están cargadas en `tarifas.grupos` con los importes reales de
vuestros dos sistemas de reserva. **Revísalos antes de poner `fase: 2`.**

---

## 8. Los dos centros

| | ImproveFit Hybrid Center | Improve Gym |
|---|---|---|
| Dirección | Calle Sol de las Moreras 4 | Plaza de Velázquez 1, bajo |
| Reservas | `improvefithybridcenter.wodbuster.com` | `improvefit.wodbuster.com` |
| En el manifest | `sedes[0]`, `principal: true` | `sedes[1]` |

El primero es el que va en la ficha de Google. El segundo aparece en la web
con su dirección y su enlace de reservas propio.

---

## 9. Ojo con las columnas de la retícula

Las clases `.c-1-7`, `.c-8-13` y compañía dicen **dónde empieza y dónde
acaba** cada bloque, y el segundo número no entra. Así que:

| Pareja | Columnas | |
|---|---|---|
| `.c-1-7` + `.c-8-13` | 1→8 y 8→13 | correcta |
| `.c-1-6` + `.c-7-13` | 1→7 y 7→13 | correcta |
| `.c-1-8` + `.c-8-13` | 1→9 y 8→13 | **se pisan** |

Cuando dos bloques se pisan, el navegador no puede ponerlos al lado y tira
el segundo a la fila de abajo: en pantalla se ve como un hueco enorme y la
tarjeta de la derecha aparece a media altura. Pasó en el formulario de la
portada y está arreglado; si algún día añadís una sección a dos columnas,
comprobad que el primer número de la segunda clase es igual o mayor que el
segundo de la primera.

---

## 10. Estructura de archivos

```
index.html          Portada: lo básico y el botón de apuntarse
apuntarme.html      La guía paso a paso, en diez pantallas
clases.html         Catálogo de clases y servicios, con buscador
centro.html         El centro por dentro: vídeo, salas y cómo llegar
contacto.html       Formulario, reserva directa, horario y mapa
aviso-legal.html    Aviso legal (LSSI)
privacidad.html     Política de privacidad (RGPD)
cookies.html        Política de cookies, con el detalle de cada una
404.html            Página de error
panel.html          Panel de gestión. No lo indexa Google.

lib/manifest.js     ⭐ TODOS los datos del negocio
lib/nucleo.js       Cabecera, pie, cookies, mapa, visor de fotos, SEO, sedes,
                    botón de WhatsApp y barra de ayuda del móvil
lib/documento.js    Números, marquesina, miedos, casos, pasos para hacerse
                    socio, tarjeta de la app, capturas, tarifas, zonas y
                    reproductor del tour
lib/dinamicas.js    Test, calculadora y reloj de apertura
lib/catalogo.js     Catálogo, buscador y filtros
lib/plan.js         Carrito y solicitud (solo en fase 2)
lib/resenas.js      Carrusel de opiniones y nota de Google
lib/formulario.js   Formulario de contacto
lib/legal.js        Datos de las páginas legales
lib/guia.js         Las diez pantallas de la guía
lib/panel.js        El panel de gestión

css/base.css        Colores, tipografías y retícula
css/site.css        Cabecera, portada, tarjetas y componentes

assets/img/         Fotos en WebP con JPG de respaldo, el QR de alta, el
                    logotipo y el icono de WodBuster y las tres capturas
                    de la app
assets/icons/       Favicons e iconos de la app
assets/video/       Tour completo y bucle corto

api/google-rating.js  Opcional. Solo si el alojamiento ejecuta funciones.
.htaccess             Configuración de Apache
robots.txt sitemap.xml site.webmanifest favicon.ico
```

---

## 11. Cómo añadir fotos nuevas

Se guardan en `assets/img/` con este patrón:

```
mi-foto-480.webp   mi-foto-800.webp   mi-foto-1200.webp
mi-foto-1200.jpg   ← respaldo para navegadores viejos
```

Después, en el manifest (o en el panel), pon como `img` la ruta **sin el
sufijo**: `assets/img/mi-foto`. Las fotos de clase van en 4:3; las del tour,
en 9:16.

La foto de la cubierta necesita además las medidas `-640`, `-1024` y
`-1600` en `.webp`.

---

## 12. Reseñas

En `lib/manifest.js`, dentro de `resenas.items`. Mientras esté vacío, la
sección de opiniones **no aparece**. Cada reseña se escribe así:

```js
{ autor: 'Nombre A.', nota: 5, fecha: '2026-06-01',
  texto: 'Lo que escribió, tal cual.', fuente: 'Google' }
```

---

## 13. Analítica

En `ajustes.analitica.ga4` pon tu identificador (`G-XXXXXXXXXX`). Si lo
dejas en `null` no se carga nada. Cuando está puesto, el script **solo se
carga si el visitante acepta las cookies**.

Eventos medidos: `contacto_whatsapp`, `contacto_telefono`, `contacto_email`,
`reserva_clase_gratis`, `enviar_formulario`, `ver_tour`, `buscar_catalogo`,
`anadir_al_plan`, `enviar_plan` y `descargar_app` (con `tienda`:
`app_store` o `google_play`).

---

## 14. Claves y contraseñas

En esta carpeta no hay ninguna clave, y no debe haberla.

- La clave de Google Places va en variables de entorno del servidor.
- El token de GitHub del panel se pide al pulsar el botón y se olvida al
  cerrar la pestaña.

---

## 15. Qué queda pendiente de confirmar

- **Avisar a WodBuster de que usáis su logo y sus capturas.** Es un uso
  normal para identificar la plataforma, pero un correo suyo dando el visto
  bueno no cuesta nada. Alternativa: sustituirlas por capturas vuestras.
- **Si los socios pagan la tarifa desde la app o en el centro.** El paso 06
  está escrito para que valga en los dos casos. Decídnoslo y lo concretamos.
- **Cómo se vende la sala de Plaza de Velázquez.** Su propia web la describe
  como Cross Training en grupo, y así está puesto. Falta saber si eso se
  vende como SIX MAX o como marca aparte: por eso `sedes[1].zonas` sigue
  vacío y ese centro no cruza con el catálogo.
- **El horario publicado.** La web dice «lunes a viernes, 7:00–12:00 y
  17:00–21:00, sábados y domingos cerrado», pero vuestros sistemas de
  reserva muestran clases hasta las 20:15 en Sol de las Moreras y sábados
  por la mañana en Plaza de Velázquez. Hay que decidir cuál es el bueno.
- **Las tarifas** de `tarifas.grupos`, antes de poner `fase: 2`.
- **Los textos de cuatro clases nuevas** (HIIT, Cardio, Core y Movilidad):
  existen en vuestro sistema de reservas, pero sus descripciones las hemos
  escrito nosotros a partir del nombre y la duración.
- **Datos del Registro Mercantil** y **proveedor de alojamiento** para el
  aviso legal.
- **Reseñas reales** para el carrusel.
- **Fotos propias de cada clase**: ahora cada una usa la foto de su zona.

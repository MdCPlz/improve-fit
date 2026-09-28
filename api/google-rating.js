/* =============================================================================
   IMPROVEFIT · api/google-rating.js
   -----------------------------------------------------------------------------
   Función serverless que devuelve la nota media y el número de reseñas de
   Google, con caché para no gastar cuota de la API.

   ESTO ES OPCIONAL. La web funciona perfectamente sin subirlo: si no está,
   se usan los valores de respaldo que hay en lib/manifest.js.

   -----------------------------------------------------------------------------
   CUÁNDO SUBIRLO
   Solo si tu alojamiento ejecuta funciones (Vercel, Netlify, Cloudflare...).
   En un hosting normal por FTP esto no se ejecuta: borra la carpeta api/ y
   rellena resenas.respaldo en el manifest.

   CÓMO SE CONFIGURA
   1. Consigue una clave de la Places API en Google Cloud y restríngela por
      dominio o por IP del servidor.
   2. Consigue el Place ID de tu ficha:
      https://developers.google.com/maps/documentation/places/web-service/place-id
   3. Guarda las dos cosas como variables de entorno del proyecto. NUNCA en
      el repositorio, nunca en el manifest, nunca en el HTML:
        GOOGLE_PLACES_API_KEY = tu-clave
        GOOGLE_PLACE_ID       = ChIJ...
   4. En lib/manifest.js pon:
        ratingEndpoint: '/api/google-rating'

   QUÉ DEVUELVE
     { "nota": 4.8, "total": 37, "actualizado": "2026-09-07T10:00:00.000Z" }
   Si algo falla devuelve 200 con { "nota": null }, para que la web se quede
   con los valores de respaldo en vez de romperse.
   ========================================================================== */

const CACHE_SEGUNDOS = 12 * 60 * 60;   // 12 horas
let cache = { hasta: 0, datos: null };

async function traerDeGoogle() {
  const clave = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (!clave || !place) return null;

  const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(place);
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': clave,
      'X-Goog-FieldMask': 'rating,userRatingCount'
    }
  });
  if (!res.ok) return null;

  const d = await res.json();
  if (typeof d.rating !== 'number') return null;

  return {
    nota: Math.round(d.rating * 10) / 10,
    total: d.userRatingCount || null,
    actualizado: new Date().toISOString()
  };
}

async function obtener() {
  const ahora = Date.now();
  if (cache.datos && ahora < cache.hasta) return cache.datos;
  try {
    const datos = await traerDeGoogle();
    if (datos) {
      cache = { hasta: ahora + CACHE_SEGUNDOS * 1000, datos };
      return datos;
    }
  } catch (e) {
    // Se cae con elegancia: mejor sin nota que con la web rota
  }
  return cache.datos || { nota: null, total: null };
}

/* ---------- Vercel y compatibles (req, res) -------------------------------- */
module.exports = async function handler(req, res) {
  const datos = await obtener();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=' + CACHE_SEGUNDOS + ', stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(JSON.stringify(datos));
};

/* ---------- Netlify, Cloudflare y demás (Request → Response) --------------- */
module.exports.default = async function () {
  const datos = await obtener();
  return new Response(JSON.stringify(datos), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=' + CACHE_SEGUNDOS + ', stale-while-revalidate=86400'
    }
  });
};

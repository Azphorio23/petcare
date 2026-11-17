export const CLIENTE_ELEGIDO = 'Fetch';

export async function pedir(ruta, opciones = {}) {
  const config = { ...opciones, headers: { ...(opciones.headers || {}) } };
  if (opciones.body !== undefined) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(opciones.body);
  }

  let response;
  try {
    response = await fetch(ruta, config);
  } catch {
    throw new Error('No hay conexión con la API. ¿Está ejecutándose "npm run api"?');
  }

  if (!response.ok) {
    let detalle = `HTTP ${response.status}`;
    try {
      const cuerpo = await response.json();
      if (cuerpo?.error) detalle = cuerpo.error;
    } catch {}
    if (response.status >= 500 && detalle === `HTTP ${response.status}`) {
      detalle = 'La API no respondió. Verifica que "npm run api" siga activo.';
    }
    throw new Error(detalle);
  }

  return response.status === 204 ? null : response.json();
}

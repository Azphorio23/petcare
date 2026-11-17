import { pedir } from './http.js';

const URL = '/api/citas';

export function listarCitas(email) {
  const filtro = email ? `?email=${encodeURIComponent(email)}` : '';
  return pedir(`${URL}${filtro}`);
}

export function obtenerCita(id) {
  return pedir(`${URL}/${id}`);
}

export function crearCita(nueva) {
  return pedir(URL, { method: 'POST', body: nueva });
}

export function cambiarEstado(id, estado) {
  return pedir(`${URL}/${id}`, { method: 'PATCH', body: { estado } });
}

export function eliminarCita(id) {
  return pedir(`${URL}/${id}`, { method: 'DELETE' });
}

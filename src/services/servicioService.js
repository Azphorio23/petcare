import { pedir } from './http.js';

export function listarServicios() {
  return pedir('/api/servicios');
}

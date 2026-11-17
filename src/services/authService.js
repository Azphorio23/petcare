import { pedir } from './http.js';

export function iniciarSesion(email, clave) {
  return pedir('/api/login', { method: 'POST', body: { email, clave } });
}

export function registrarCuenta(datos) {
  return pedir('/api/registro', { method: 'POST', body: datos });
}

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const LARGO_HASH = 64;

export function cifrarClave(clave) {
  const sal = randomBytes(16).toString('hex');
  const hash = scryptSync(clave, sal, LARGO_HASH).toString('hex');
  return `scrypt$${sal}$${hash}`;
}

export function verificarClave(clave, guardado) {
  const [algoritmo, sal, hash] = String(guardado).split('$');
  if (algoritmo !== 'scrypt' || !sal || !hash) return false;
  const esperado = Buffer.from(hash, 'hex');
  const calculado = scryptSync(clave, sal, esperado.length);
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}

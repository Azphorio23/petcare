export const ESPECIES = ['Perro', 'Gato', 'Otro'];
export const ESTADOS = ['Pendiente', 'Confirmada', 'Atendida', 'Cancelada'];
export const HORAS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '15:00', '15:30', '16:00', '16:30', '17:00'];

export function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatearFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' });
}

export function soles(monto) {
  return `S/ ${Number(monto).toFixed(2)}`;
}

const TRAZOS = {
  pulso: ['M3 12h4l2.5-6 5 12 2.5-6H21'],
  escudo: ['M12 3l8 3v6c0 4.6-3.4 8-8 9-4.6-1-8-4.4-8-9V6z', 'M9 12l2 2 4-4'],
  gota: ['M12 3c3.2 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.8-6.8 6-11z'],
  calendario: ['M4 6h16v14H4z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  reloj: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 7v5l3 2'],
  huella: [
    'M12 13c-3 0-5 2.6-5 4.6 0 1.6 1.2 2.4 2.6 2.4 1 0 1.6-.5 2.4-.5s1.4.5 2.4.5c1.4 0 2.6-.8 2.6-2.4 0-2-2-4.6-5-4.6z',
    'M8 8.5a1.5 2 0 1 0 0 .01z', 'M16 8.5a1.5 2 0 1 0 0 .01z',
    'M10.5 5.5a1.5 2 0 1 0 0 .01z', 'M13.5 5.5a1.5 2 0 1 0 0 .01z',
    'M5 12a1.3 1.7 0 1 0 0 .01z', 'M19 12a1.3 1.7 0 1 0 0 .01z',
  ],
};

export const ICONO_CATEGORIA = { Consulta: 'pulso', Prevención: 'escudo', Estética: 'gota' };

export default function Icono({ nombre, tamano = 24 }) {
  const trazos = TRAZOS[nombre] ?? TRAZOS.huella;
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {trazos.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

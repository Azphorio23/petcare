import { use } from 'react';
import { Link } from 'react-router-dom';
import Icono from './Icono.jsx';
import { campanaPromise } from '../data/campana.js';

export default function CampanaPanel() {
  const campana = use(campanaPromise);
  return (
    <div className="pc-campana h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div className="pc-campana-icono"><Icono nombre="escudo" tamano={28} /></div>
        <span className="pc-tag mb-0">{campana.vigencia}</span>
      </div>
      <div className="pc-campana-cifra mb-2">-{campana.descuento}%</div>
      <h3 className="h5 mb-2">{campana.titulo}</h3>
      <p className="text-body-secondary flex-grow-1">{campana.mensaje}</p>
      <div>
        <Link className="btn pc-btn" to="/reservar?servicio=2">
          Reservar vacuna
        </Link>
      </div>
    </div>
  );
}

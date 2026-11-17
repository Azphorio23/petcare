import { Link } from 'react-router-dom';
import Icono, { ICONO_CATEGORIA } from './Icono.jsx';
import { soles } from '../data/constantes.js';

export default function ServicioCard({ servicio }) {
  return (
    <article className="card h-100 pc-servicio">
      <div className="card-body d-flex flex-column p-4">
        <div className="pc-servicio-icono">
          <Icono nombre={ICONO_CATEGORIA[servicio.categoria]} tamano={28} />
        </div>
        <span className="pc-etiqueta mb-2">{servicio.categoria}</span>
        <h3 className="h5 mb-2">{servicio.nombre}</h3>
        <p className="text-body-secondary small flex-grow-1 mb-4">{servicio.descripcion}</p>
        <div className="mb-3">
          <span className="pc-precio pc-precio-grande">{soles(servicio.precio)}</span>
          <span className="small text-body-secondary"> · {servicio.duracionMin} min</span>
        </div>
        <Link className="btn btn-sm pc-btn-sec align-self-center" to={`/reservar?servicio=${servicio.id}`}>
          Reservar
        </Link>
      </div>
    </article>
  );
}

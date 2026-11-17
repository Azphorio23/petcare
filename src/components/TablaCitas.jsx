import { Link } from 'react-router-dom';
import EstadoBadge from './EstadoBadge.jsx';
import { formatearFecha } from '../data/constantes.js';

export function accionesPara(cita, esRecepcion) {
  const acciones = [];
  if (esRecepcion && cita.estado === 'Pendiente') acciones.push({ estado: 'Confirmada', texto: 'Confirmar', clase: 'pc-btn-sec' });
  if (esRecepcion && cita.estado === 'Confirmada') acciones.push({ estado: 'Atendida', texto: 'Atendida', clase: 'pc-btn-sec' });
  if (cita.estado === 'Pendiente' || cita.estado === 'Confirmada') acciones.push({ estado: 'Cancelada', texto: 'Cancelar', clase: 'pc-btn-peligro' });
  return acciones;
}

export default function TablaCitas({ citas, servicios, esRecepcion, onCambiarEstado, procesandoId }) {
  const nombreServicio = (id) => servicios.find((s) => s.id === id)?.nombre ?? `Servicio ${id}`;

  if (citas.length === 0) {
    return <div className="pc-vacio">No hay citas que coincidan con los filtros.</div>;
  }

  return (
    <div className="table-responsive pc-tabla">
      <table className="table align-middle table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Mascota</th>
            {esRecepcion && <th>Dueño</th>}
            <th>Servicio</th>
            <th>Fecha y hora</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td className="text-body-secondary">{c.id}</td>
              <td>
                <div className="fw-medium">{c.mascota}</div>
                <div className="small text-body-secondary">{c.especie}</div>
              </td>
              {esRecepcion && <td>{c.dueno}</td>}
              <td>{nombreServicio(c.servicioId)}</td>
              <td className="text-nowrap">
                {formatearFecha(c.fecha)} · {c.hora}
              </td>
              <td>
                <EstadoBadge estado={c.estado} />
              </td>
              <td className="text-end text-nowrap">
                <Link className="btn btn-sm pc-btn-ghost" to={`/citas/${c.id}`}>
                  Ver
                </Link>
                {accionesPara(c, esRecepcion).map((a) => (
                  <button
                    key={a.estado}
                    type="button"
                    className={`btn btn-sm ${a.clase} ms-1`}
                    disabled={procesandoId === c.id}
                    onClick={() => onCambiarEstado(c, a.estado)}
                  >
                    {a.texto}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

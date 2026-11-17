import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EstadoBadge from '../components/EstadoBadge.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { ESTADOS, hoyISO, formatearFecha } from '../data/constantes.js';
import { listarCitas, cambiarEstado } from '../services/citaService.js';

export default function RecepcionPage() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      setCitas(await listarCitas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function confirmar(cita) {
    setProcesandoId(cita.id);
    try {
      await cambiarEstado(cita.id, 'Confirmada');
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setProcesandoId(null);
    }
  }

  const hoy = hoyISO();
  const deHoy = citas.filter((c) => c.fecha === hoy && c.estado !== 'Cancelada').sort((a, b) => a.hora.localeCompare(b.hora));
  const porConfirmar = citas.filter((c) => c.estado === 'Pendiente').sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));

  return (
    <section>
      <div className="pc-encabezado d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div>
          <span className="pc-tag">Recepción</span>
          <h1>Panel de recepción</h1>
          <p>Resumen del día y citas pendientes de confirmar.</p>
        </div>
        <button type="button" className="btn pc-btn-sec" onClick={cargar} disabled={cargando}>Actualizar</button>
      </div>

      <EstadoCarga cargando={cargando} error={error} reintentar={cargar} textoCarga="Consultando agenda…" />

      {!cargando && !error && (
        <>
          <div className="pc-metricas mb-4">
            {ESTADOS.map((e) => (
              <div key={e}>
                <EstadoBadge estado={e} />
                <strong>{citas.filter((c) => c.estado === e).length}</strong>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body p-4">
                  <h2 className="h6 mb-3">
                    Citas de hoy <span className="text-body-secondary fw-normal">{deHoy.length}</span>
                  </h2>
                  {deHoy.length === 0 && <p className="small text-body-secondary mb-0">No hay citas para hoy.</p>}
                  <ul className="list-group list-group-flush">
                    {deHoy.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center px-0 gap-2">
                        <span>
                          <span className="pc-precio me-2">{c.hora}</span>
                          <Link to={`/citas/${c.id}`}>{c.mascota}</Link>{' '}
                          <span className="small text-body-secondary">{c.dueno}</span>
                        </span>
                        <EstadoBadge estado={c.estado} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body p-4">
                  <h2 className="h6 mb-3">
                    Por confirmar <span className="text-body-secondary fw-normal">{porConfirmar.length}</span>
                  </h2>
                  {porConfirmar.length === 0 && <p className="small text-body-secondary mb-0">No hay citas pendientes.</p>}
                  <ul className="list-group list-group-flush">
                    {porConfirmar.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center px-0 gap-2">
                        <span>
                          <span className="small text-body-secondary me-2">{formatearFecha(c.fecha)} · {c.hora}</span>
                          <Link to={`/citas/${c.id}`}>{c.mascota}</Link>
                        </span>
                        <button type="button" className="btn btn-sm pc-btn-sec" disabled={procesandoId === c.id} onClick={() => confirmar(c)}>
                          Confirmar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

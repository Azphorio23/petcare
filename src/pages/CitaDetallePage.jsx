import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { accionesPara } from '../components/TablaCitas.jsx';
import { formatearFecha, soles } from '../data/constantes.js';
import { obtenerCita, cambiarEstado, eliminarCita } from '../services/citaService.js';
import { listarServicios } from '../services/servicioService.js';

export default function CitaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { esRecepcion } = useContext(AuthContext);
  const [cita, setCita] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState(null);
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const [datos, servicios] = await Promise.all([obtenerCita(id), listarServicios()]);
      setCita(datos);
      setServicio(servicios.find((s) => s.id === datos.servicioId) ?? null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  async function actualizar(nuevoEstado) {
    if (nuevoEstado === 'Cancelada' && !window.confirm('¿Cancelar esta cita?')) return;
    setProcesando(true);
    setAviso(null);
    try {
      setCita(await cambiarEstado(cita.id, nuevoEstado));
      setAviso({ tipo: 'success', texto: `Estado actualizado a ${nuevoEstado}.` });
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e.message });
    } finally {
      setProcesando(false);
    }
  }

  async function eliminar() {
    if (!window.confirm(`¿Eliminar definitivamente la cita #${cita.id}?`)) return;
    setProcesando(true);
    try {
      await eliminarCita(cita.id);
      navigate('/citas');
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e.message });
      setProcesando(false);
    }
  }

  return (
    <section className="row justify-content-center">
      <div className="col-lg-8">
        <Link to="/citas" className="small text-body-secondary">Volver a citas</Link>
        <EstadoCarga cargando={cargando} error={error} reintentar={cargar} textoCarga="Consultando la cita…" />
        {cita && !cargando && (
          <article className="card mt-3">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <span className="pc-tag">Cita #{cita.id}</span>
                  <h1 className="h3 mb-0">
                    {cita.mascota} <span className="text-body-secondary fw-normal fs-6">{cita.especie}</span>
                  </h1>
                </div>
                <EstadoBadge estado={cita.estado} />
              </div>
              <hr className="my-4" />
              <dl className="row mb-0">
                <dt className="col-sm-4 fw-normal text-body-secondary">Servicio</dt>
                <dd className="col-sm-8">{servicio ? `${servicio.nombre} · ${soles(servicio.precio)}` : cita.servicioId}</dd>
                <dt className="col-sm-4 fw-normal text-body-secondary">Fecha y hora</dt>
                <dd className="col-sm-8">{formatearFecha(cita.fecha)} · {cita.hora}</dd>
                <dt className="col-sm-4 fw-normal text-body-secondary">Dueño</dt>
                <dd className="col-sm-8">{cita.dueno}</dd>
                <dt className="col-sm-4 fw-normal text-body-secondary">Contacto</dt>
                <dd className="col-sm-8">{cita.email} · {cita.telefono}</dd>
                <dt className="col-sm-4 fw-normal text-body-secondary">Notas</dt>
                <dd className="col-sm-8">{cita.notas || '—'}</dd>
              </dl>
              {aviso && <div className={`alert alert-${aviso.tipo} mt-3 mb-0`}>{aviso.texto}</div>}
              <div className="d-flex flex-wrap gap-2 mt-4">
                {accionesPara(cita, esRecepcion).map((a) => (
                  <button key={a.estado} type="button" className={`btn ${a.clase}`} disabled={procesando} onClick={() => actualizar(a.estado)}>
                    {a.texto}
                  </button>
                ))}
                {esRecepcion && (
                  <button type="button" className="btn pc-btn-peligro ms-auto" disabled={procesando} onClick={eliminar}>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

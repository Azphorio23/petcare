import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampanaPanel from '../components/CampanaPanel.jsx';
import ServicioCard from '../components/ServicioCard.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { listarServicios } from '../services/servicioService.js';
import { ESPECIES, HORAS } from '../data/constantes.js';

export default function InicioPage() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      setServicios(await listarServicios());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <>
      <section className="pc-hero">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <span className="pc-hero-insignia">Citas en línea · confirmación por recepción</span>
              <h1>
                El cuidado que <em>tu mascota</em> necesita, a un clic.
              </h1>
              <p className="pc-hero-sub">
                Reserva consultas, vacunas y baños desde casa. Recepción confirma tu cita y puedes seguir su estado en
                Mis citas.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link className="btn btn-lg pc-btn-blanco" to="/reservar">Reservar cita</Link>
                <Link className="btn btn-lg pc-btn-borde-blanco" to="/servicios">Ver servicios</Link>
              </div>
              <div className="pc-hero-cifras">
                <div>
                  <strong>{servicios.length}</strong>
                  <span>servicios disponibles</span>
                </div>
                <div>
                  <strong>{HORAS.length}</strong>
                  <span>horarios por día</span>
                </div>
                <div>
                  <strong>{ESPECIES.length}</strong>
                  <span>tipos de mascota</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <Suspense
                fallback={
                  <div className="pc-campana h-100 pc-cargando justify-content-center">
                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                    Cargando campaña del mes…
                  </div>
                }
              >
                <CampanaPanel />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="pc-seccion">
        <div className="text-center mb-5">
          <span className="pc-tag">Servicios</span>
          <h2 className="pc-titulo-seccion">Lo que más reservan nuestros clientes</h2>
          <p className="pc-sub-seccion">Atención clínica, prevención y estética con precios claros y duración estimada.</p>
        </div>
        <EstadoCarga cargando={cargando} error={error} reintentar={cargar} textoCarga="Cargando servicios…" />
        <div className="row g-4">
          {servicios.slice(0, 3).map((s) => (
            <div className="col-md-4" key={s.id}>
              <ServicioCard servicio={s} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link className="btn pc-btn-sec" to="/servicios">Ver todos los servicios</Link>
        </div>
      </section>

      <section className="pc-seccion">
        <div className="pc-banner d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2>Sigue el estado de tu cita</h2>
            <p>Ingresa con tu correo y revisa si tu cita está pendiente, confirmada o atendida.</p>
          </div>
          <Link className="btn pc-btn-blanco" to="/citas">Ver mis citas</Link>
        </div>
      </section>
    </>
  );
}

import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CitaForm from '../components/CitaForm.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { listarServicios } from '../services/servicioService.js';
import { crearCita } from '../services/citaService.js';

export default function ReservarPage() {
  const { usuario } = useContext(AuthContext);
  const [params] = useSearchParams();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargarServicios() {
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
    cargarServicios();
  }, []);

  async function registrar(nueva) {
    setGuardando(true);
    setMensaje(null);
    try {
      const creada = await crearCita(nueva);
      console.log('Cita creada en la API:', creada);
      setMensaje({ tipo: 'success', texto: `Cita #${creada.id} registrada para ${creada.mascota}. Estado: ${creada.estado}.`, id: creada.id });
      return true;
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: `No se pudo registrar: ${e.message}` });
      return false;
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="row justify-content-center">
      <div className="col-lg-8">
        <div className="pc-encabezado">
          <span className="pc-tag">Nueva cita</span>
          <h1>Reservar cita</h1>
          <p>Los campos con * son obligatorios. La cita queda Pendiente hasta que recepción la confirme.</p>
        </div>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} d-flex flex-wrap justify-content-between align-items-center gap-2`} role="status">
            <span>{mensaje.texto}</span>
            {mensaje.id && <Link className="btn btn-sm pc-btn-sec" to={`/citas/${mensaje.id}`}>Ver cita</Link>}
          </div>
        )}

        <EstadoCarga cargando={cargando} error={error} reintentar={cargarServicios} textoCarga="Cargando servicios…" />
        {!cargando && !error && (
          <CitaForm
            servicios={servicios}
            servicioInicial={params.get('servicio')}
            usuario={usuario}
            onRegistrar={registrar}
            guardando={guardando}
          />
        )}
      </div>
    </section>
  );
}

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Buscador from '../components/Buscador.jsx';
import TablaCitas from '../components/TablaCitas.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { ESTADOS, ESPECIES } from '../data/constantes.js';
import { listarCitas, cambiarEstado } from '../services/citaService.js';
import { listarServicios } from '../services/servicioService.js';

export default function CitasPage() {
  const { usuario, esRecepcion } = useContext(AuthContext);

  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);

  const [estado, setEstado] = useState('Todos');
  const [especie, setEspecie] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  async function cargar() {
    if (!usuario) return;
    setCargando(true);
    setError('');
    try {
      const [listaCitas, listaServicios] = await Promise.all([
        listarCitas(esRecepcion ? undefined : usuario.email),
        listarServicios(),
      ]);
      setCitas(listaCitas);
      setServicios(listaServicios);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [usuario]);

  async function actualizarEstado(cita, nuevoEstado) {
    if (nuevoEstado === 'Cancelada' && !window.confirm(`¿Cancelar la cita de ${cita.mascota}?`)) return;
    setProcesandoId(cita.id);
    setAviso(null);
    try {
      await cambiarEstado(cita.id, nuevoEstado);
      setAviso({ tipo: 'success', texto: `Cita #${cita.id} (${cita.mascota}) ahora está ${nuevoEstado}.` });
      await cargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: `No se pudo actualizar: ${e.message}` });
    } finally {
      setProcesandoId(null);
    }
  }

  if (!usuario) {
    return (
      <div className="pc-vacio py-5">
        <h1 className="h5 text-body mb-2">Ingresa para ver tus citas</h1>
        <p className="mb-4">Inicia sesión con tu correo y contraseña, o crea una cuenta nueva.</p>
        <Link className="btn pc-btn" to="/ingresar">Ingresar</Link>
      </div>
    );
  }

  const texto = busqueda.trim().toLowerCase();
  const visibles = citas
    .filter((c) => estado === 'Todos' || c.estado === estado)
    .filter((c) => especie === 'Todas' || c.especie === especie)
    .filter((c) => c.mascota.toLowerCase().includes(texto) || c.dueno.toLowerCase().includes(texto))
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  const conteo = (e) => citas.filter((c) => c.estado === e).length;

  return (
    <section>
      <div className="pc-encabezado d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div>
          <span className="pc-tag">{esRecepcion ? 'Recepción' : 'Cliente'}</span>
          <h1>{esRecepcion ? 'Agenda de citas' : 'Mis citas'}</h1>
          <p>{esRecepcion ? 'Todas las citas registradas en PetCare.' : `Citas registradas con ${usuario.email}.`}</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn pc-btn-sec" onClick={cargar} disabled={cargando}>
            Actualizar
          </button>
          <Link className="btn pc-btn" to="/reservar">Nueva cita</Link>
        </div>
      </div>

      <div className="pc-metricas mb-4">
        {ESTADOS.map((e) => (
          <div key={e}>
            <EstadoBadge estado={e} />
            <strong>{conteo(e)}</strong>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
        <div>
          <label htmlFor="estado" className="form-label small mb-1">Estado</label>
          <select id="estado" className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option>Todos</option>
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="especie" className="form-label small mb-1">Especie</label>
          <select id="especie" className="form-select" value={especie} onChange={(e) => setEspecie(e.target.value)}>
            <option>Todas</option>
            {ESPECIES.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
      </div>

      {aviso && <div className={`alert alert-${aviso.tipo}`} role="status">{aviso.texto}</div>}
      <EstadoCarga cargando={cargando} error={error} reintentar={cargar} textoCarga="Consultando citas…" />
      {!cargando && !error && (
        <>
          <p className="small text-body-secondary mb-2">{visibles.length} de {citas.length} citas</p>
          <TablaCitas
            citas={visibles}
            servicios={servicios}
            esRecepcion={esRecepcion}
            onCambiarEstado={actualizarEstado}
            procesandoId={procesandoId}
          />
        </>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';
import ServicioCard from '../components/ServicioCard.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { listarServicios } from '../services/servicioService.js';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [categoria, setCategoria] = useState('Todas');
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

  const categorias = ['Todas', ...new Set(servicios.map((s) => s.categoria))];
  const visibles = categoria === 'Todas' ? servicios : servicios.filter((s) => s.categoria === categoria);

  return (
    <section>
      <div className="pc-encabezado">
        <span className="pc-tag">Catálogo</span>
        <h1>Servicios</h1>
        <p>Elige un servicio y reserva la cita desde la misma tarjeta.</p>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar por categoría">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={`pc-chip ${categoria === c ? 'activo' : ''}`}
            onClick={() => setCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <EstadoCarga cargando={cargando} error={error} reintentar={cargar} textoCarga="Cargando servicios…" />
      {!cargando && !error && (
        <div className="row g-3">
          {visibles.map((s) => (
            <div className="col-sm-6 col-lg-4" key={s.id}>
              <ServicioCard servicio={s} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

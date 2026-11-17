import { useRef } from 'react';

export default function Buscador({ busqueda, setBusqueda }) {
  const campoRef = useRef(null);

  function irAlBuscador() {
    campoRef.current?.focus();
  }

  return (
    <div className="d-flex gap-2 align-items-end flex-grow-1">
      <div className="flex-grow-1">
        <label htmlFor="buscar" className="form-label small mb-1">Buscar mascota o dueño</label>
        <input
          id="buscar"
          ref={campoRef}
          type="search"
          className="form-control"
          placeholder="Ej.: Toby"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <button type="button" className="btn pc-btn-sec" onClick={irAlBuscador}>
        Ir al buscador
      </button>
    </div>
  );
}

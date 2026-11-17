export default function EstadoCarga({ cargando, error, reintentar, textoCarga = 'Consultando…' }) {
  if (cargando) {
    return (
      <div className="pc-cargando" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        {textoCarga}
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2" role="alert">
        <span>{error}</span>
        {reintentar && (
          <button type="button" className="btn btn-sm pc-btn-sec" onClick={reintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }
  return null;
}

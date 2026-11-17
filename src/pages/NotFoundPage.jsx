import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <span className="pc-tag">Error 404</span>
      <h1 className="h3 mb-2">Página no encontrada</h1>
      <p className="text-body-secondary mb-4">La dirección no existe o fue movida.</p>
      <Link className="btn pc-btn" to="/">Volver al inicio</Link>
    </section>
  );
}

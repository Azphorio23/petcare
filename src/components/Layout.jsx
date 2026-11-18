import { Link, Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import logo from '../assets/logo.png';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="container py-5 flex-grow-1">
        <Outlet />
      </main>
      <footer className="pc-pie pt-5 mt-5">
        <div className="container">
          <div className="row g-4 pb-4">
            <div className="col-md-8">
              <Link className="pc-marca mb-3" to="/">
                <img src={logo} alt="" className="pc-logo" />
                PetCare
              </Link>
              <p className="mt-3 mb-0" style={{ maxWidth: '26rem' }}>
                Veterinaria con citas en línea: consultas, vacunas y estética para perros, gatos y otras mascotas.
              </p>
            </div>
            <div className="col-6 col-md-4">
              <h3>Navegación</h3>
              <ul className="list-unstyled d-grid gap-2 mb-0">
                <li><Link to="/servicios">Servicios</Link></li>
                <li><Link to="/reservar">Reservar cita</Link></li>
                <li><Link to="/citas">Mis citas</Link></li>
              </ul>
            </div>
          </div>
          <div className="pc-pie-linea py-3 small">PetCare Veterinaria · UTP</div>
        </div>
      </footer>
    </div>
  );
}
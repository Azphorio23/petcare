import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { TemaContext } from '../context/TemaContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

function Enlace({ to, end, children }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `nav-link px-2 ${isActive ? 'active' : ''}`}>
      {children}
    </NavLink>
  );
}

export default function NavBar() {
  const { tema, alternarTema } = useContext(TemaContext);
  const { usuario, esRecepcion, salir } = useContext(AuthContext);
  const navigate = useNavigate();

  function cerrarSesion() {
    salir();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg pc-navbar sticky-top">
      <div className="container gap-3">
        <Link className="navbar-brand pc-marca me-3" to="/">
          <img src={logo} alt="" className="pc-logo" />
          Pet<span>Care</span>
        </Link>
        <div className="navbar-nav flex-row flex-wrap gap-2 me-auto">
          <Enlace to="/" end>Inicio</Enlace>
          <Enlace to="/servicios">Servicios</Enlace>
          <Enlace to="/reservar">Reservar</Enlace>
          <Enlace to="/citas">{esRecepcion ? 'Agenda' : 'Mis citas'}</Enlace>
          {esRecepcion && <Enlace to="/recepcion">Recepción</Enlace>}
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button type="button" className="btn btn-sm pc-btn-ghost" onClick={alternarTema}>
            {tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
          </button>
          {usuario ? (
            <>
              <span className="pc-usuario">
                {usuario.nombre} · {esRecepcion ? 'Recepción' : 'Cliente'}
              </span>
              <button type="button" className="btn btn-sm pc-btn-sec" onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <Link className="btn btn-sm pc-btn-sec" to="/ingresar">
              Ingresar
            </Link>
          )}
          <Link className="btn btn-sm pc-btn" to="/reservar">
            Agenda tu cita
          </Link>
        </div>
      </div>
    </nav>
  );
}

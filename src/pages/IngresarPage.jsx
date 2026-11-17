import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { iniciarSesion, registrarCuenta } from '../services/authService.js';
import logo from '../assets/logo.png';

function CampoClave({ id, name, label, autoComplete, minLength }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="pc-campo-clave">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          className="form-control"
          required
          minLength={minLength}
          autoComplete={autoComplete}
        />
        <button type="button" className="pc-ver-clave" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  );
}

export default function IngresarPage() {
  const { ingresar } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [modo, setModo] = useState('ingresar');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  function cambiarModo(nuevo) {
    setModo(nuevo);
    setError('');
  }

  function entrar(usuario) {
    ingresar(usuario);
    navigate(usuario.rol === 'recepcion' ? '/recepcion' : '/citas');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    setError('');

    if (modo === 'registro' && datos.clave !== datos.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      const email = datos.email.trim().toLowerCase();
      const usuario =
        modo === 'ingresar'
          ? await iniciarSesion(email, datos.clave)
          : await registrarCuenta({ nombre: datos.nombre.trim(), email, clave: datos.clave });
      entrar(usuario);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const esRegistro = modo === 'registro';

  return (
    <section className="pc-auth">
      <aside className="pc-auth-lado">
        <img src={logo} alt="" className="pc-auth-logo" />
        <h2>Tu mascota, en buenas manos.</h2>
        <p>Reserva citas en línea, revisa su estado y recibe la confirmación de recepción sin llamadas.</p>
        <ul>
          <li>Historial de tus citas en un solo lugar</li>
          <li>Confirmación por parte de recepción</li>
          <li>Consultas, vacunas y estética</li>
        </ul>
      </aside>

      <div className="pc-auth-form">
        <span className="pc-tag">{esRegistro ? 'Nueva cuenta' : 'Acceso'}</span>
        <h1 className="h3 fw-bold mb-1">{esRegistro ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1>
        <p className="text-body-secondary mb-4">
          {esRegistro ? 'Regístrate para reservar y seguir tus citas.' : 'Ingresa con tu correo y contraseña.'}
        </p>

        <div className="pc-pestanas mb-4" role="tablist">
          <button type="button" role="tab" aria-selected={!esRegistro} className={!esRegistro ? 'activo' : ''} onClick={() => cambiarModo('ingresar')}>
            Ingresar
          </button>
          <button type="button" role="tab" aria-selected={esRegistro} className={esRegistro ? 'activo' : ''} onClick={() => cambiarModo('registro')}>
            Crear cuenta
          </button>
        </div>

        {location.state?.aviso && !error && <div className="alert alert-warning">{location.state.aviso}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <form key={modo} onSubmit={handleSubmit}>
          {esRegistro && (
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input id="nombre" name="nombre" className="form-control" required minLength={3} autoComplete="name" placeholder="Ej.: Lucía Ramos" />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="emailIngreso" className="form-label">Correo electrónico</label>
            <input id="emailIngreso" name="email" type="email" className="form-control" required autoComplete="email" placeholder="tu@correo.com" />
          </div>
          <CampoClave id="clave" name="clave" label="Contraseña" minLength={esRegistro ? 6 : undefined} autoComplete={esRegistro ? 'new-password' : 'current-password'} />
          {esRegistro && (
            <CampoClave id="confirmar" name="confirmar" label="Repite la contraseña" minLength={6} autoComplete="new-password" />
          )}
          {esRegistro && <p className="form-text mt-n2 mb-3">Mínimo 6 caracteres.</p>}

          <button type="submit" className="btn btn-lg pc-btn w-100 mt-2" disabled={enviando}>
            {enviando ? 'Verificando…' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>
      </div>
    </section>
  );
}

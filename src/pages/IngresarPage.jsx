import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function IngresarPage() {
  const { ingresar } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    const usuario = { nombre: datos.nombre.trim(), email: datos.email.trim().toLowerCase(), rol: datos.rol };
    ingresar(usuario);
    navigate(usuario.rol === 'recepcion' ? '/recepcion' : '/citas');
  }

  return (
    <section className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="pc-encabezado">
          <span className="pc-tag">Acceso</span>
          <h1>Ingresar</h1>
          <p>Elige tu rol para continuar. No se requiere contraseña.</p>
        </div>
        {location.state?.aviso && <div className="alert alert-warning">{location.state.aviso}</div>}
        <form className="card p-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre *</label>
            <input id="nombre" name="nombre" className="form-control" required minLength={3} placeholder="Ej.: Lucía Ramos" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailIngreso" className="form-label">Correo *</label>
            <input id="emailIngreso" name="email" type="email" className="form-control" required placeholder="lucia@correo.com" />
            <div className="form-text">Como cliente verás las citas registradas con este correo.</div>
          </div>
          <fieldset className="mb-4">
            <legend className="form-label fs-6">Ingresar como *</legend>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="rol" id="rolCliente" value="cliente" defaultChecked />
              <label className="form-check-label" htmlFor="rolCliente">Cliente (dueño de mascota)</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="rol" id="rolRecepcion" value="recepcion" />
              <label className="form-check-label" htmlFor="rolRecepcion">Recepción de la veterinaria</label>
            </div>
          </fieldset>
          <button type="submit" className="btn pc-btn w-100">Ingresar</button>
          <p className="small text-body-secondary mt-3 mb-0">
            Prueba rápida: cliente <code>lucia@correo.com</code> (tiene 2 citas) o cualquier correo como recepción.
          </p>
        </form>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { ESPECIES, HORAS, hoyISO, soles } from '../data/constantes.js';

export default function CitaForm({ servicios, servicioInicial, usuario, onRegistrar, guardando }) {
  const formRef = useRef(null);
  const mascotaRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    const nueva = { ...datos, servicioId: Number(datos.servicioId) };
    const ok = await onRegistrar(nueva);
    if (ok) {
      formRef.current.reset();
      mascotaRef.current.focus();
    }
  }

  return (
    <form ref={formRef} className="card p-4 p-md-5" onSubmit={handleSubmit}>
      <h2 className="pc-seccion-form">Datos del dueño</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="dueno">Nombre completo *</label>
          <input id="dueno" name="dueno" className="form-control" required minLength={3} defaultValue={usuario?.nombre ?? ''} placeholder="Ej.: Lucía Ramos" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="email">Correo electrónico *</label>
          <input id="email" name="email" type="email" className="form-control" required defaultValue={usuario?.rol === 'cliente' ? usuario.email : ''} placeholder="tu@correo.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="telefono">Celular *</label>
          <input id="telefono" name="telefono" type="tel" className="form-control" required pattern="9[0-9]{8}" title="9 dígitos, empieza con 9" placeholder="987654321" />
        </div>
      </div>

      <h2 className="pc-seccion-form mt-5">Mascota y cita</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="mascota">Nombre de la mascota *</label>
          <input id="mascota" name="mascota" ref={mascotaRef} className="form-control" required minLength={2} placeholder="Ej.: Toby" />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="especie">Especie *</label>
          <select id="especie" name="especie" className="form-select" required defaultValue="">
            <option value="" disabled>Selecciona</option>
            {ESPECIES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="servicioId">Servicio *</label>
          <select id="servicioId" name="servicioId" className="form-select" required defaultValue={servicioInicial ?? ''} key={servicioInicial ?? 'sin-servicio'}>
            <option value="" disabled>Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} · {soles(s.precio)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="fecha">Fecha *</label>
          <input id="fecha" name="fecha" type="date" className="form-control" required min={hoyISO()} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="hora">Hora *</label>
          <select id="hora" name="hora" className="form-select" required defaultValue="">
            <option value="" disabled>Selecciona</option>
            {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="notas">Motivo o notas</label>
          <textarea id="notas" name="notas" className="form-control" rows={2} maxLength={200} placeholder="Opcional" />
        </div>
      </div>

      <button className="btn pc-btn mt-5 align-self-start" type="submit" disabled={guardando}>
        {guardando ? 'Registrando…' : 'Reservar cita'}
      </button>
    </form>
  );
}

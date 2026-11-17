import http from 'node:http';
import { pool, prepararBaseDeDatos, mensajeErrorConexion, nombreBase } from './db.mjs';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3001;

const ESPECIES = new Set(['Perro', 'Gato', 'Otro']);
const ESTADOS = new Set(['Pendiente', 'Confirmada', 'Atendida', 'Cancelada']);
const HORAS = new Set(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '15:00', '15:30', '16:00', '16:30', '17:00']);

const COLUMNAS_CITA = `id, dueno, email, telefono, mascota, especie, servicio_id AS "servicioId",
                       fecha, hora, estado, notas`;
const COLUMNAS_SERVICIO = `id, nombre, categoria, precio, duracion_min AS "duracionMin", descripcion`;

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function responder(res, estado, datos) {
  res.writeHead(estado, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(datos === undefined ? '' : JSON.stringify(datos));
}

async function leerCuerpo(req) {
  let cuerpo = '';
  for await (const pedazo of req) {
    cuerpo += pedazo;
    if (Buffer.byteLength(cuerpo, 'utf8') > 12000) throw new Error('La petición supera el tamaño permitido');
  }
  try { return JSON.parse(cuerpo); } catch { throw new Error('El cuerpo no contiene JSON válido'); }
}

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

function validarCita(d) {
  const errores = [];
  const cita = {
    dueno: texto(d?.dueno),
    email: texto(d?.email).toLowerCase(),
    telefono: texto(d?.telefono),
    mascota: texto(d?.mascota),
    especie: texto(d?.especie),
    servicioId: Number(d?.servicioId),
    fecha: texto(d?.fecha),
    hora: texto(d?.hora),
    notas: texto(d?.notas).slice(0, 200),
  };
  if (cita.dueno.length < 3) errores.push('El nombre del dueño debe tener al menos 3 caracteres.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cita.email)) errores.push('El correo no es válido.');
  if (!/^9\d{8}$/.test(cita.telefono)) errores.push('El teléfono debe tener 9 dígitos y empezar con 9.');
  if (cita.mascota.length < 2) errores.push('El nombre de la mascota es obligatorio.');
  if (!ESPECIES.has(cita.especie)) errores.push('La especie no es válida.');
  if (!Number.isInteger(cita.servicioId)) errores.push('El servicio no existe.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cita.fecha) || cita.fecha < hoyISO()) errores.push('La fecha debe ser hoy o posterior.');
  if (!HORAS.has(cita.hora)) errores.push('La hora no está dentro del horario de atención.');
  return { cita, errores };
}

function responderErrorBD(res, error) {
  if (error.code === '23505') return responder(res, 400, { error: 'Ese horario ya está reservado. Elige otra hora.' });
  if (error.code === '23503') return responder(res, 400, { error: 'El servicio no existe.' });
  if (error.code === '23514') return responder(res, 400, { error: 'Algún dato no cumple las reglas de la base.' });
  console.error('Error de base de datos:', mensajeErrorConexion(error));
  return responder(res, 503, { error: `Base de datos no disponible: ${mensajeErrorConexion(error)}` });
}

async function manejar(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const partes = url.pathname.split('/').filter(Boolean);
  console.log(`${req.method} ${url.pathname}${url.search}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM citas');
    return responder(res, 200, { ok: true, servicio: 'PetCare API', baseDeDatos: `PostgreSQL · ${nombreBase}`, citas: rows[0].total });
  }

  if (req.method === 'GET' && url.pathname === '/api/servicios') {
    const { rows } = await pool.query(`SELECT ${COLUMNAS_SERVICIO} FROM servicios ORDER BY id`);
    return responder(res, 200, rows);
  }

  if (partes[0] === 'api' && partes[1] === 'citas') {
    const id = partes[2] !== undefined ? Number(partes[2]) : null;
    if (id !== null && !Number.isInteger(id)) return responder(res, 404, { error: 'La cita no existe' });

    if (req.method === 'GET' && id === null) {
      await new Promise((r) => setTimeout(r, 300));
      if (url.searchParams.get('fallo') === '1') return responder(res, 500, { error: 'Fallo de prueba controlado' });
      const email = texto(url.searchParams.get('email') ?? '').toLowerCase();
      const { rows } = email
        ? await pool.query(`SELECT ${COLUMNAS_CITA} FROM citas WHERE email = $1 ORDER BY fecha, hora`, [email])
        : await pool.query(`SELECT ${COLUMNAS_CITA} FROM citas ORDER BY fecha, hora`);
      return responder(res, 200, rows);
    }

    if (req.method === 'POST' && id === null) {
      let datos;
      try { datos = await leerCuerpo(req); } catch (e) { return responder(res, 400, { error: e.message }); }
      const { cita, errores } = validarCita(datos);
      if (errores.length) return responder(res, 400, { error: errores.join(' ') });

      const { rows } = await pool.query(
        `INSERT INTO citas (dueno, email, telefono, mascota, especie, servicio_id, fecha, hora, notas)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING ${COLUMNAS_CITA}`,
        [cita.dueno, cita.email, cita.telefono, cita.mascota, cita.especie, cita.servicioId, cita.fecha, cita.hora, cita.notas]
      );
      return responder(res, 201, rows[0]);
    }

    if (req.method === 'GET') {
      const { rows } = await pool.query(`SELECT ${COLUMNAS_CITA} FROM citas WHERE id = $1`, [id]);
      return rows.length ? responder(res, 200, rows[0]) : responder(res, 404, { error: `La cita ${id} no existe` });
    }

    if (req.method === 'PATCH') {
      let datos;
      try { datos = await leerCuerpo(req); } catch (e) { return responder(res, 400, { error: e.message }); }
      const estado = texto(datos?.estado);
      if (!ESTADOS.has(estado)) return responder(res, 400, { error: 'Estado no válido' });
      const { rows } = await pool.query(
        `UPDATE citas SET estado = $1 WHERE id = $2 RETURNING ${COLUMNAS_CITA}`,
        [estado, id]
      );
      return rows.length ? responder(res, 200, rows[0]) : responder(res, 404, { error: `La cita ${id} no existe` });
    }

    if (req.method === 'DELETE') {
      const { rowCount } = await pool.query('DELETE FROM citas WHERE id = $1', [id]);
      return rowCount ? responder(res, 204) : responder(res, 404, { error: `La cita ${id} no existe` });
    }
  }

  return responder(res, 404, { error: 'Ruta no encontrada' });
}

const api = http.createServer(async (req, res) => {
  try {
    await manejar(req, res);
  } catch (error) {
    responderErrorBD(res, error);
  }
});

try {
  await prepararBaseDeDatos();
} catch (error) {
  console.error('\n❌ No se pudo preparar la base de datos.');
  console.error('   ' + mensajeErrorConexion(error));
  console.error('   Revisa el archivo .env (copia .env.example si no existe).\n');
  process.exit(1);
}

api.listen(PORT, HOST, () => {
  console.log(`✅ PostgreSQL conectado · base "${nombreBase}"`);
  console.log(`PetCare API: http://${HOST}:${PORT}/api/health`);
});

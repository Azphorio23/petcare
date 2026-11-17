import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { cifrarClave } from './seguridad.mjs';

const archivoEnv = fileURLToPath(new URL('../.env', import.meta.url));
if (fs.existsSync(archivoEnv)) process.loadEnvFile(archivoEnv);

const urlNube = process.env.DATABASE_URL?.trim();
export const enLaNube = Boolean(urlNube);

const config = enLaNube
  ? { connectionString: urlNube, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'petcare',
    };

pg.types.setTypeParser(1082, (v) => v);
pg.types.setTypeParser(1700, (v) => Number(v));

export const pool = new pg.Pool(config);

pool.on('error', (error) => {
  console.error('Conexión con PostgreSQL perdida:', mensajeErrorConexion(error));
});

export const nombreBase = enLaNube ? `${new URL(urlNube).hostname.split('.')[0]} (nube)` : config.database;

async function crearBaseSiNoExiste() {
  const admin = new pg.Client({ ...config, database: 'postgres' });
  await admin.connect();
  try {
    const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [config.database]);
    if (rowCount === 0) {
      if (!/^[a-z_][a-z0-9_]*$/i.test(config.database)) throw new Error('Nombre de base de datos no válido');
      await admin.query(`CREATE DATABASE "${config.database}"`);
      console.log(`Base de datos "${config.database}" creada.`);
    }
  } finally {
    await admin.end();
  }
}

export const USUARIOS_DEMO = [
  { nombre: 'Recepción PetCare', email: 'recepcion@petcare.pe', rol: 'recepcion', clave: 'recepcion123' },
  { nombre: 'Lucía Ramos', email: 'lucia@correo.com', rol: 'cliente', clave: 'lucia123' },
  { nombre: 'Ana Torres', email: 'ana@correo.com', rol: 'cliente', clave: 'ana123' },
];

async function crearUsuariosDemo() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM usuarios');
  if (rows[0].total > 0) return;
  for (const u of USUARIOS_DEMO) {
    await pool.query(
      'INSERT INTO usuarios (nombre, email, rol, clave_hash) VALUES ($1, $2, $3, $4)',
      [u.nombre, u.email, u.rol, cifrarClave(u.clave)]
    );
  }
}

export async function prepararBaseDeDatos() {
  if (!enLaNube) await crearBaseSiNoExiste();
  const script = fs.readFileSync(new URL('./database.sql', import.meta.url), 'utf8');
  await pool.query(script);
  await crearUsuariosDemo();
}

export function mensajeErrorConexion(error) {
  if (enLaNube) {
    if (error.code === '28P01' || /password/i.test(error.message)) return 'Contraseña incorrecta en DATABASE_URL. Copia de nuevo la cadena de Supabase y reemplaza [YOUR-PASSWORD].';
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') return 'No se pudo llegar a la base en la nube. Revisa tu internet y que DATABASE_URL sea la del "Session pooler" de Supabase.';
    return error.message;
  }
  if (!config.password) {
    return fs.existsSync(archivoEnv)
      ? 'El archivo .env no tiene contraseña. Escribe tu contraseña de PostgreSQL en la línea PGPASSWORD=.'
      : 'Falta el archivo .env. Copia ".env.example", renombra la copia a ".env" y escribe tu contraseña de PostgreSQL en PGPASSWORD=.';
  }
  switch (error.code) {
    case 'ECONNREFUSED':
      return `PostgreSQL no está corriendo en ${config.host}:${config.port}. Inícialo (Servicios de Windows o pgAdmin) y vuelve a intentar.`;
    case '28P01':
      return `Usuario o contraseña incorrectos para "${config.user}". Revisa PGUSER y PGPASSWORD en el archivo .env.`;
    case '3D000':
      return `La base "${config.database}" no existe.`;
    case 'ENOTFOUND':
      return `No se encontró el servidor "${config.host}". Revisa PGHOST en el archivo .env.`;
    default:
      return error.message;
  }
}

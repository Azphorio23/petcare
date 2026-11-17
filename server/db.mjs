import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const archivoEnv = fileURLToPath(new URL('../.env', import.meta.url));
if (fs.existsSync(archivoEnv)) process.loadEnvFile(archivoEnv);

const config = {
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

export const nombreBase = config.database;

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

export async function prepararBaseDeDatos() {
  await crearBaseSiNoExiste();
  const script = fs.readFileSync(new URL('./database.sql', import.meta.url), 'utf8');
  await pool.query(script);
}

export function mensajeErrorConexion(error) {
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

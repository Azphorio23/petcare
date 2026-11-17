import { pool, prepararBaseDeDatos, mensajeErrorConexion, nombreBase } from './db.mjs';

try {
  await pool.query('DROP TABLE IF EXISTS citas; DROP TABLE IF EXISTS servicios;');
  await prepararBaseDeDatos();
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM citas');
  console.log(`Base "${nombreBase}" reiniciada: ${rows[0].total} citas de ejemplo.`);
} catch (error) {
  console.error('No se pudo reiniciar la base:', mensajeErrorConexion(error));
  process.exitCode = 1;
} finally {
  await pool.end();
}

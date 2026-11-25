import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, contrasena_hash FROM usuarios WHERE correo = $1',
    [email]
  );
  return rows[0] ?? null;
}

export async function listRoles(userId) {
  const { rows } = await pool.query(
    'SELECT modulo, rol FROM usuario_rol WHERE id_usuario = $1 ORDER BY modulo',
    [userId]
  );
  return rows;
}

export async function insertUser({ nombre, correo, contrasenaHash }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo`,
      [nombre, correo, contrasenaHash]
    );
    const user = rows[0];
    await client.query(
      `INSERT INTO usuario_rol (id_usuario, modulo, rol)
       SELECT $1, modulo, 'cliente'
       FROM unnest(ARRAY['mercado', 'pnp', 'essalud']::VARCHAR[]) AS role_list(modulo)`,
      [user.id]
    );
    await client.query('COMMIT');
    return user;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

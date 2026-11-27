import { pool } from '../config/db.js';

export async function listAppointments(user, includeAll) {
  const { rows } = await pool.query(
    `SELECT ce.*, u.nombre AS paciente, d.codigo_seguimiento AS codigo_denuncia
     FROM citas_essalud ce
     JOIN usuarios u ON u.id = ce.id_usuario
     LEFT JOIN denuncias_digitales d ON d.id = ce.id_denuncia
     WHERE ($1::BOOLEAN OR ce.id_usuario = $2)
     ORDER BY ce.fecha_registro DESC`,
    [includeAll, user.sub]
  );
  return rows;
}

export async function createAppointment(data, userId) {
  const { rows } = await pool.query(
    `INSERT INTO citas_essalud
       (codigo_seguimiento, numero_asegurado, nombre_paciente, sede, tipo_asegurado,
        especialidad, motivo, monto_calculado, estado_pago, id_usuario)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pendiente', $9)
     RETURNING *`,
    [data.codigo, data.numero_asegurado, data.nombre_paciente, data.sede, data.tipo_asegurado,
      data.especialidad, data.motivo, data.monto, userId]
  );
  return rows[0];
}

export async function updateAppointment(id, userId, data) {
  const { rows } = await pool.query(
    `UPDATE citas_essalud
     SET numero_asegurado = $1, nombre_paciente = $2, sede = $3, tipo_asegurado = $4,
         especialidad = $5, motivo = $6, monto_calculado = $7,
         fecha_actualizacion = NOW()
     WHERE id = $8 AND id_usuario = $9 AND estado = 'registrado'
       AND estado_pago <> 'pagado' AND id_denuncia IS NULL
     RETURNING *`,
    [data.numero_asegurado, data.nombre_paciente, data.sede, data.tipo_asegurado,
      data.especialidad, data.motivo, data.monto, id, userId]
  );
  return rows[0] ?? null;
}

export async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE citas_essalud SET estado = $1, fecha_actualizacion = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] ?? null;
}

export async function createDonor(data) {
  const { rows } = await pool.query(
    `INSERT INTO donantes_sangre
       (nombre_completo, dni, grupo_sanguineo, telefono, fecha_preferida, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nombre_completo, grupo_sanguineo, telefono, fecha_preferida, creado_en`,
    [data.nombre_completo, data.dni, data.grupo_sanguineo, data.telefono, data.fecha_preferida, data.observaciones]
  );
  return rows[0];
}

export async function listDonors() {
  const { rows } = await pool.query(
    `SELECT id, nombre_completo, grupo_sanguineo, telefono, fecha_preferida, creado_en
     FROM donantes_sangre
     ORDER BY creado_en DESC
     LIMIT 20`
  );
  return rows;
}

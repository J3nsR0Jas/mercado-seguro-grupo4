import { pool } from '../config/db.js';

export async function listStalls(user, includeAll = false) {
  const { rows } = await pool.query(
    `SELECT c.*, u.nombre AS comerciante
     FROM comerciantes_interesados c
     JOIN usuarios u ON u.id = c.id_usuario
     WHERE ($1::BOOLEAN OR c.id_usuario = $2)
     ORDER BY c.fecha_registro DESC`,
    [includeAll, user.sub]
  );
  return rows;
}

export async function createStall(data, userId) {
  const { rows } = await pool.query(
    `INSERT INTO comerciantes_interesados
       (id_usuario, razon_social, producto, telefono, direccion, puesto, area_m2, dias,
        alto_consumo, monto_calculado, estado_pago, codigo_seguimiento)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pendiente', $11)
     RETURNING *`,
    [userId, data.razon_social, data.producto, data.telefono, data.direccion, data.puesto,
      data.area_m2, data.dias, data.alto_consumo, data.monto_calculado, data.codigo]
  );
  return rows[0];
}

export async function updateStall(id, data, userId) {
  const { rows } = await pool.query(
    `UPDATE comerciantes_interesados
     SET razon_social = $1, producto = $2, telefono = $3, direccion = $4, puesto = $5,
         area_m2 = $6, dias = $7, alto_consumo = $8, monto_calculado = $9,
         fecha_actualizacion = NOW()
     WHERE id = $10 AND id_usuario = $11 AND estado = 'registrado'
     RETURNING *`,
    [data.razon_social, data.producto, data.telefono, data.direccion, data.puesto,
      data.area_m2, data.dias, data.alto_consumo, data.monto_calculado, id, userId]
  );
  return rows[0] ?? null;
}

export async function getMyPost(userId) {
  const [stalls, complaints, appointments, payments] = await Promise.all([
    pool.query(
      `SELECT id, razon_social, producto, telefono, direccion, puesto, area_m2, dias,
              alto_consumo, monto_calculado, estado_pago, estado, codigo_seguimiento
       FROM comerciantes_interesados WHERE id_usuario = $1 ORDER BY fecha_registro DESC`,
      [userId]
    ),
    pool.query(
      `SELECT d.id, d.codigo_seguimiento, d.tipo_delito, d.lugar_incidente, d.estado,
              d.hay_lesionados, d.fecha_registro, c.id AS id_comerciante, c.puesto,
              ce.codigo_seguimiento AS codigo_cita, ce.estado AS estado_cita,
              ce.sede AS sede_cita, ce.fecha_cita
       FROM denuncias_digitales d
       LEFT JOIN comerciantes_interesados c ON c.id = d.id_comerciante
       LEFT JOIN citas_essalud ce ON ce.id_denuncia = d.id
       WHERE d.id_usuario = $1 ORDER BY d.fecha_registro DESC`,
      [userId]
    ),
    pool.query(
      `SELECT id, codigo_seguimiento, nombre_paciente, sede, especialidad, estado,
              estado_pago, id_denuncia, fecha_cita
       FROM citas_essalud
       WHERE id_usuario = $1
       ORDER BY fecha_registro DESC`,
      [userId]
    ),
    pool.query(
      `SELECT id_comerciante, codigo_operacion, metodo, estado, monto, fecha_registro
       FROM pagos_mercado WHERE id_usuario = $1 ORDER BY fecha_registro DESC`,
      [userId]
    )
  ]);
  return { puestos: stalls.rows, denuncias: complaints.rows, citas: appointments.rows, pagos: payments.rows };
}

export async function createDemoPayment(stallId, userId, operationCode) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: stalls } = await client.query(
      `SELECT id, monto_calculado FROM comerciantes_interesados
       WHERE id = $1 AND id_usuario = $2 FOR UPDATE`,
      [stallId, userId]
    );
    if (!stalls[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    let { rows } = await client.query(
      `SELECT id_comerciante, codigo_operacion, metodo, estado, monto, fecha_registro
       FROM pagos_mercado WHERE id_comerciante = $1 AND id_usuario = $2`,
      [stallId, userId]
    );
    if (!rows[0]) {
      ({ rows } = await client.query(
        `INSERT INTO pagos_mercado
           (id_comerciante, id_usuario, codigo_operacion, metodo, estado, monto)
         VALUES ($1, $2, $3, 'tarjeta_demo', 'simulado', $4)
         ON CONFLICT (id_comerciante) DO NOTHING
         RETURNING id_comerciante, codigo_operacion, metodo, estado, monto, fecha_registro`,
        [stallId, userId, operationCode, stalls[0].monto_calculado]
      ));
    }

    if (!rows[0]) {
      ({ rows } = await client.query(
        `SELECT id_comerciante, codigo_operacion, metodo, estado, monto, fecha_registro
         FROM pagos_mercado WHERE id_comerciante = $1 AND id_usuario = $2`,
        [stallId, userId]
      ));
    }
    await client.query('COMMIT');
    return rows[0] ?? null;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function securityReport() {
  const { rows } = await pool.query(
    `SELECT c.id, c.razon_social, c.puesto, c.direccion, COUNT(d.id)::INTEGER AS denuncias,
            COUNT(d.id) FILTER (WHERE d.estado IN ('registrado', 'en investigación'))::INTEGER AS abiertas
     FROM comerciantes_interesados c
     LEFT JOIN denuncias_digitales d ON d.id_comerciante = c.id
     GROUP BY c.id
     ORDER BY denuncias DESC, c.puesto`
  );
  return rows;
}

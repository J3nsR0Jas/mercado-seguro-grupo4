import { pool } from '../config/db.js';

export async function listComplaints(user, includeAll) {
  const { rows } = await pool.query(
    `SELECT d.*, u.nombre AS denunciante, c.razon_social, c.puesto,
            ce.codigo_seguimiento AS codigo_cita, ce.estado AS estado_cita
     FROM denuncias_digitales d
     JOIN usuarios u ON u.id = d.id_usuario
     LEFT JOIN comerciantes_interesados c ON c.id = d.id_comerciante
     LEFT JOIN citas_essalud ce ON ce.id_denuncia = d.id
     WHERE ($1::BOOLEAN OR d.id_usuario = $2)
     ORDER BY d.fecha_registro DESC`,
    [includeAll, user.sub]
  );
  return rows;
}

export async function insertComplaint(data, user) {
  const { rows } = await pool.query(
    `INSERT INTO denuncias_digitales
       (codigo_seguimiento, dni_denunciante, tipo_delito, lugar_incidente, detalle_denuncia,
        hay_lesionados, id_usuario, id_comerciante, id_empleado_asignado)
     SELECT $1, $2, $3, $4, $5, $6, $7, c.id,
       (SELECT id FROM usuarios WHERE correo = 'empleado.pnp@pnp.gob.pe')
     FROM comerciantes_interesados c
     WHERE c.id = $8 AND c.id_usuario = $7
     RETURNING *`,
    [data.codigo, data.dni, data.tipo, data.lugar, data.detalle, data.lesionados, user.sub, data.id_comerciante]
  );
  return rows[0];
}

export async function updateComplaintText(id, userId, data) {
  if (!data.lugar || !data.detalle) {
    const error = new Error('El lugar y el detalle son obligatorios.');
    error.status = 400;
    throw error;
  }
  const { rows } = await pool.query(
    `UPDATE denuncias_digitales
     SET lugar_incidente = $1, detalle_denuncia = $2, fecha_actualizacion = NOW()
     WHERE id = $3 AND id_usuario = $4 AND estado = 'registrado'
     RETURNING *`,
    [data.lugar, data.detalle, id, userId]
  );
  return rows[0] ?? null;
}

export async function updateComplaintStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE denuncias_digitales SET estado = $1, fecha_actualizacion = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] ?? null;
}

export async function deriveToEssalud(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT d.*, u.nombre AS paciente
       FROM denuncias_digitales d
       JOIN usuarios u ON u.id = d.id_usuario
       WHERE d.id = $1
       FOR UPDATE OF d`,
      [id]
    );
    const complaint = rows[0];
    if (!complaint) {
      const error = new Error('No se encontró la denuncia.');
      error.status = 404;
      throw error;
    }
    if (!complaint.hay_lesionados) {
      const error = new Error('Solo se derivan a EsSalud denuncias con personas lesionadas.');
      error.status = 409;
      throw error;
    }
    if (complaint.estado === 'atendido') {
      const error = new Error('Una denuncia atendida no se puede derivar.');
      error.status = 409;
      throw error;
    }
    const { rows: existing } = await client.query(
      'SELECT id, codigo_seguimiento FROM citas_essalud WHERE id_denuncia = $1',
      [id]
    );
    if (existing.length) {
      const error = new Error('Esta denuncia ya tiene una cita vinculada.');
      error.status = 409;
      throw error;
    }
    const code = `CES-${Date.now()}`;
    const { rows: staff } = await client.query(
      `SELECT id FROM usuarios u JOIN usuario_rol r ON r.id_usuario = u.id
       WHERE u.correo = 'empleado.essalud@essalud.pe' AND r.modulo = 'essalud'`
    );
    const { rows: appointments } = await client.query(
      `INSERT INTO citas_essalud
         (codigo_seguimiento, numero_asegurado, nombre_paciente, sede, tipo_asegurado,
          especialidad, motivo, estado, id_usuario, id_empleado_asignado, id_denuncia)
       VALUES ($1, $2, $3, 'Hospital EsSalud Norte Chico', 'titular',
               'Emergencia', $4, 'registrado', $5, $6, $7)
       RETURNING *`,
      [code, String(complaint.id_usuario).padStart(4, '0'), complaint.paciente,
        `Lesiones vinculadas a la denuncia ${complaint.codigo_seguimiento}`,
        complaint.id_usuario, staff[0]?.id ?? null, id]
    );
    await client.query(
      `UPDATE denuncias_digitales SET estado = 'derivado', fecha_actualizacion = NOW() WHERE id = $1`,
      [id]
    );
    await client.query('COMMIT');
    return appointments[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

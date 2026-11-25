import * as repository from '../repositories/pnp.repository.js';

const fail = (status, message) => Object.assign(new Error(message), { status });
const allowedStates = ['registrado', 'en investigación', 'atendido'];

function validate(data) {
  if (![data.dni, data.tipo, data.lugar, data.detalle].every((value) => typeof value === 'string' && value.trim())) {
    throw fail(400, 'Completa DNI, tipo de incidente, lugar y detalle.');
  }
  if (!/^\d{8,12}$/.test(data.dni.trim())) throw fail(400, 'El DNI debe tener entre 8 y 12 dígitos.');
  return {
    dni: data.dni.trim(),
    tipo: data.tipo.trim(),
    lugar: data.lugar.trim(),
    detalle: data.detalle.trim(),
    lesionados: Boolean(data.hay_lesionados),
    id_comerciante: data.id_comerciante ? Number(data.id_comerciante) : null
  };
}

export async function list(user) {
  const includeAll = user.roles.some(({ modulo, rol }) => modulo === 'pnp' && rol === 'empleado');
  return repository.listComplaints(user, includeAll);
}

export async function create(data, user) {
  const valid = validate(data);
  if (!Number.isInteger(valid.id_comerciante)) throw fail(400, 'Selecciona un puesto para vincular la denuncia.');
  valid.codigo = `DEN-${Date.now()}`;
  const complaint = await repository.insertComplaint(valid, user);
  if (!complaint) throw fail(404, 'El puesto seleccionado no pertenece a esta cuenta.');
  return complaint;
}

export async function updateText(id, data, userId) {
  const result = await repository.updateComplaintText(id, userId, {
    lugar: String(data.lugar ?? '').trim(),
    detalle: String(data.detalle ?? '').trim()
  });
  if (!result) throw fail(404, 'No se encontró una denuncia editable de esta cuenta.');
  return result;
}

export async function updateStatus(id, status) {
  if (!allowedStates.includes(status)) throw fail(400, 'El estado solicitado no es válido.');
  const result = await repository.updateComplaintStatus(id, status);
  if (!result) throw fail(404, 'No se encontró la denuncia.');
  return result;
}

export const derive = (id) => repository.deriveToEssalud(id);

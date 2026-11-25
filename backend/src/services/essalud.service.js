import * as repository from '../repositories/essalud.repository.js';

const fail = (status, message) => Object.assign(new Error(message), { status });
const states = ['confirmada', 'atendida', 'cancelada'];

export async function list(user) {
  const includeAll = user.roles.some(({ modulo, rol }) => modulo === 'essalud' && rol === 'empleado');
  return repository.listAppointments(user, includeAll);
}

export async function create(data, userId) {
  const required = ['numero_asegurado', 'nombre_paciente', 'sede', 'tipo_asegurado'];
  if (!required.every((key) => typeof data[key] === 'string' && data[key].trim())) {
    throw fail(400, 'Completa número de asegurado, paciente, sede y tipo de asegurado.');
  }
  if (!/^\d{4,20}$/.test(data.numero_asegurado.trim())) throw fail(400, 'El número de asegurado debe contener entre 4 y 20 dígitos.');
  if (!['titular', 'derechohabiente'].includes(data.tipo_asegurado)) throw fail(400, 'El tipo de asegurado no es válido.');
  const code = `CES-${Date.now()}`;
  return repository.createAppointment({
    codigo: code,
    numero_asegurado: data.numero_asegurado.trim(),
    nombre_paciente: data.nombre_paciente.trim(),
    sede: data.sede.trim(),
    tipo_asegurado: data.tipo_asegurado,
    especialidad: String(data.especialidad || 'Medicina general').trim(),
    motivo: String(data.motivo || 'Solicitud de cita').trim(),
    monto: data.tipo_asegurado === 'derechohabiente' ? 18 : 10
  }, userId);
}

export async function update(id, data, userId) {
  const required = ['numero_asegurado', 'nombre_paciente', 'sede', 'tipo_asegurado'];
  if (!required.every((key) => typeof data[key] === 'string' && data[key].trim())) {
    throw fail(400, 'Completa número de asegurado, paciente, sede y tipo de asegurado.');
  }
  if (!/^\d{4,20}$/.test(data.numero_asegurado.trim())) throw fail(400, 'El número de asegurado debe contener entre 4 y 20 dígitos.');
  if (!['titular', 'derechohabiente'].includes(data.tipo_asegurado)) throw fail(400, 'El tipo de asegurado no es válido.');
  const appointment = await repository.updateAppointment(id, userId, {
    numero_asegurado: data.numero_asegurado.trim(),
    nombre_paciente: data.nombre_paciente.trim(),
    sede: data.sede.trim(),
    tipo_asegurado: data.tipo_asegurado,
    especialidad: String(data.especialidad || 'Medicina general').trim(),
    motivo: String(data.motivo || 'Solicitud de cita').trim(),
    monto: data.tipo_asegurado === 'derechohabiente' ? 18 : 10
  });
  if (!appointment) throw fail(404, 'No se encontró una cita editable de esta cuenta.');
  return appointment;
}

export async function updateStatus(id, status) {
  if (!states.includes(status)) throw fail(400, 'El estado solicitado no es válido.');
  const appointment = await repository.updateStatus(id, status);
  if (!appointment) throw fail(404, 'No se encontró la cita.');
  return appointment;
}

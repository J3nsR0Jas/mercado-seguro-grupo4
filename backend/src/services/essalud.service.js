import * as repository from '../repositories/essalud.repository.js';

const fail = (status, message) => Object.assign(new Error(message), { status });
const states = ['confirmada', 'atendida', 'cancelada'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Desconocido'];

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

export async function createDonor(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw fail(400, 'Los datos del donante no son válidos.');
  const name = typeof data.nombre_completo === 'string' ? data.nombre_completo.trim() : '';
  const phone = typeof data.telefono === 'string' ? data.telefono.trim() : '';
  const group = typeof data.grupo_sanguineo === 'string' ? data.grupo_sanguineo.trim() : '';
  const dni = typeof data.dni === 'string' ? data.dni.trim() : '';
  const preferredDate = typeof data.fecha_preferida === 'string' ? data.fecha_preferida.trim() : '';
  const observations = typeof data.observaciones === 'string' ? data.observaciones.trim() : '';

  if (!name || name.length > 150) throw fail(400, 'El nombre completo es obligatorio y no debe superar 150 caracteres.');
  if (!phone || phone.length > 30) throw fail(400, 'El teléfono es obligatorio y no debe superar 30 caracteres.');
  if (!bloodGroups.includes(group)) throw fail(400, 'Selecciona un grupo sanguíneo válido.');
  if (dni && (dni.length > 20 || !/^[\p{L}\d.-]+$/u.test(dni))) throw fail(400, 'El documento debe tener hasta 20 caracteres alfanuméricos.');
  if (preferredDate.length > 40) throw fail(400, 'La fecha preferida no debe superar 40 caracteres.');
  if (observations.length > 2000) throw fail(400, 'Las observaciones no deben superar 2000 caracteres.');

  return repository.createDonor({
    nombre_completo: name,
    dni: dni || null,
    grupo_sanguineo: group,
    telefono: phone,
    fecha_preferida: preferredDate || null,
    observaciones: observations || null
  });
}

export const listDonors = () => repository.listDonors();

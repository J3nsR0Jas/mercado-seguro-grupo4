import * as repository from '../repositories/mercado.repository.js';
import { randomUUID } from 'node:crypto';

const fail = (status, message) => Object.assign(new Error(message), { status });
const required = ['razon_social', 'producto', 'telefono', 'direccion', 'puesto'];

function validate(data) {
  if (!required.every((key) => typeof data[key] === 'string' && data[key].trim())) {
    throw fail(400, 'Completa razón social, rubro, teléfono, dirección y puesto.');
  }
  const area = Number(data.area_m2);
  const days = Number(data.dias);
  if (!Number.isFinite(area) || area <= 0 || !Number.isInteger(days) || days < 1 || days > 365) {
    throw fail(400, 'El área debe ser positiva y los días deben estar entre 1 y 365.');
  }
  const highConsumption = Boolean(data.alto_consumo);
  return {
    razon_social: data.razon_social.trim(),
    producto: data.producto.trim(),
    telefono: data.telefono.trim(),
    direccion: data.direccion.trim(),
    puesto: data.puesto.trim(),
    area_m2: area,
    dias: days,
    alto_consumo: highConsumption,
    monto_calculado: (area * 15 + (highConsumption ? 5 : 0)) * days
  };
}

export async function list(user) {
  const includeAll = user.roles.some(({ modulo, rol }) => modulo === 'mercado' && rol !== 'cliente');
  return repository.listStalls(user, includeAll);
}

export async function create(data, userId) {
  const valid = validate(data);
  valid.codigo = `COM-${Date.now()}`;
  return repository.createStall(valid, userId);
}

export async function update(id, data, userId) {
  const valid = validate(data);
  const result = await repository.updateStall(id, valid, userId);
  if (!result) throw fail(404, 'No se encontró el puesto editable de esta cuenta.');
  return result;
}

export const myPost = (userId) => repository.getMyPost(userId);
export const report = () => repository.securityReport();

export async function createDemoPayment(id, userId) {
  if (!/^[1-9]\d*$/.test(String(id))) throw fail(400, 'El identificador del puesto no es válido.');
  const stallId = Number(id);
  if (!Number.isSafeInteger(stallId) || stallId <= 0) throw fail(400, 'El identificador del puesto no es válido.');
  const payment = await repository.createDemoPayment(stallId, userId, `DEMO-${randomUUID()}`);
  if (!payment) throw fail(404, 'No se encontró un puesto de esta cuenta para simular el pago.');
  return payment;
}

import * as repository from '../repositories/mercado.repository.js';
import { randomUUID } from 'node:crypto';

const fail = (status, message) => Object.assign(new Error(message), { status });
const required = ['razon_social', 'producto', 'telefono', 'direccion', 'puesto'];
const orderCatalog = {
  'papa-amarilla': { nombre: 'Papa amarilla', categoria: 'tuberculos', minorista: 3.9, mayorista: 115 },
  'papa-blanca': { nombre: 'Papa blanca', categoria: 'tuberculos', minorista: 2.6, mayorista: 72 },
  'papa-canchan': { nombre: 'Papa Canchan', categoria: 'tuberculos', minorista: 3.2, mayorista: 86 },
  camote: { nombre: 'Camote', categoria: 'tuberculos', minorista: 2.9, mayorista: 78 },
  yuca: { nombre: 'Yuca', categoria: 'tuberculos', minorista: 3.1, mayorista: 82 },
  olluco: { nombre: 'Olluco', categoria: 'tuberculos', minorista: 3.8, mayorista: 101 },
  manzana: { nombre: 'Manzana', categoria: 'frutas', minorista: 4.2, mayorista: 78 },
  platano: { nombre: 'Plátano de seda', categoria: 'frutas', minorista: 2.8, mayorista: 54 },
  naranja: { nombre: 'Naranja', categoria: 'frutas', minorista: 2.7, mayorista: 49 },
  papaya: { nombre: 'Papaya', categoria: 'frutas', minorista: 3.2, mayorista: 62 },
  pina: { nombre: 'Piña', categoria: 'frutas', minorista: 3.6, mayorista: 66 },
  palta: { nombre: 'Palta', categoria: 'frutas', minorista: 6.5, mayorista: 125 },
  tomate: { nombre: 'Tomate', categoria: 'verduras', minorista: 3.1, mayorista: 91 },
  cebolla: { nombre: 'Cebolla', categoria: 'verduras', minorista: 2.8, mayorista: 75 },
  zanahoria: { nombre: 'Zanahoria', categoria: 'verduras', minorista: 2.5, mayorista: 68 },
  lechuga: { nombre: 'Lechuga', categoria: 'verduras', minorista: 1.8, mayorista: 48 },
  brocoli: { nombre: 'Brócoli', categoria: 'verduras', minorista: 3.8, mayorista: 102 },
  'aji-amarillo': { nombre: 'Ají amarillo', categoria: 'verduras', minorista: 5.5, mayorista: 145 }
};

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

export async function createWholesaleOrder(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw fail(400, 'Los datos del pedido no son válidos.');
  const customerName = typeof data.cliente_nombre === 'string' ? data.cliente_nombre.trim() : '';
  const phone = typeof data.telefono === 'string' ? data.telefono.trim() : '';
  const type = data.tipo_compra;
  const items = data.detalle_items;

  if (!customerName || customerName.length > 150) throw fail(400, 'El nombre del cliente es obligatorio y no debe superar 150 caracteres.');
  if (phone.length > 30) throw fail(400, 'El teléfono no debe superar 30 caracteres.');
  if (!['minorista', 'proveedor'].includes(type)) throw fail(400, 'El tipo de compra no es válido.');
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) throw fail(400, 'Agrega entre 1 y 30 productos al pedido.');

  const detailItems = items.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw fail(400, 'Hay un producto con formato inválido.');
    const product = orderCatalog[item.id];
    const quantity = Number(item.cantidad);
    if (!product) throw fail(400, 'El carrito contiene un producto no disponible.');
    if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 10000) throw fail(400, `La cantidad de ${product.nombre} no es válida.`);
    if (type === 'proveedor' && product.categoria !== 'frutas' && quantity < 8) {
      throw fail(400, `El pedido proveedor requiere mínimo 8 sacos de ${product.nombre}.`);
    }

    const unit = type === 'minorista' ? 'kg' : product.categoria === 'frutas' ? 'caja' : 'saco';
    const unitPrice = type === 'minorista' ? product.minorista : product.mayorista;
    return {
      id: item.id,
      nombre: product.nombre,
      categoria: product.categoria,
      cantidad: quantity,
      unidad: unit,
      precio_unitario: unitPrice,
      subtotal: Number((unitPrice * quantity).toFixed(2))
    };
  });
  const total = Number(detailItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  if (!Number.isFinite(total) || total <= 0 || total > 99999999.99) throw fail(400, 'El total del pedido está fuera de rango.');

  return repository.createWholesaleOrder({
    cliente_nombre: customerName,
    telefono: phone || null,
    tipo_compra: type,
    detalle_items: detailItems,
    total
  });
}

export const listWholesaleOrders = () => repository.listWholesaleOrders();

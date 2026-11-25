import * as service from '../services/mercado.service.js';

export async function list(req, res, next) {
  try { res.json({ puestos: await service.list(req.user) }); } catch (error) { next(error); }
}

export async function create(req, res, next) {
  try { res.status(201).json({ puesto: await service.create(req.body, req.user.sub) }); } catch (error) { next(error); }
}

export async function update(req, res, next) {
  try { res.json({ puesto: await service.update(req.params.id, req.body, req.user.sub) }); } catch (error) { next(error); }
}

export async function payDemo(req, res, next) {
  try { res.status(201).json({ pago: await service.createDemoPayment(req.params.id, req.user.sub) }); } catch (error) { next(error); }
}

export async function myPost(req, res, next) {
  try { res.json(await service.myPost(req.user.sub)); } catch (error) { next(error); }
}

export async function security(req, res, next) {
  try { res.json({ reporte: await service.report() }); } catch (error) { next(error); }
}

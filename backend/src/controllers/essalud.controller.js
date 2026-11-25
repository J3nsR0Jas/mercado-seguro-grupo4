import * as service from '../services/essalud.service.js';

export async function list(req, res, next) {
  try { res.json({ citas: await service.list(req.user) }); } catch (error) { next(error); }
}

export async function create(req, res, next) {
  try { res.status(201).json({ cita: await service.create(req.body, req.user.sub) }); } catch (error) { next(error); }
}

export async function update(req, res, next) {
  try { res.json({ cita: await service.update(req.params.id, req.body, req.user.sub) }); } catch (error) { next(error); }
}

export async function updateStatus(req, res, next) {
  try { res.json({ cita: await service.updateStatus(req.params.id, req.body.estado) }); } catch (error) { next(error); }
}

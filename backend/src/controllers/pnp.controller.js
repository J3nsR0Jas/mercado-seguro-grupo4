import * as service from '../services/pnp.service.js';

export async function list(req, res, next) {
  try { res.json({ denuncias: await service.list(req.user) }); } catch (error) { next(error); }
}

export async function create(req, res, next) {
  try { res.status(201).json({ denuncia: await service.create(req.body, req.user) }); } catch (error) { next(error); }
}

export async function updateText(req, res, next) {
  try { res.json({ denuncia: await service.updateText(req.params.id, req.body, req.user.sub) }); } catch (error) { next(error); }
}

export async function updateStatus(req, res, next) {
  try { res.json({ denuncia: await service.updateStatus(req.params.id, req.body.estado) }); } catch (error) { next(error); }
}

export async function derive(req, res, next) {
  try { res.status(201).json({ cita: await service.derive(req.params.id) }); } catch (error) { next(error); }
}

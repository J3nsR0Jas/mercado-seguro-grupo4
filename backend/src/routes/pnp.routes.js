import { Router } from 'express';
import * as controller from '../controllers/pnp.controller.js';
import { authenticate, requireModuleRole } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);
router.get('/denuncias', requireModuleRole('pnp', 'cliente', 'empleado'), controller.list);
router.post('/denuncias', requireModuleRole('pnp', 'cliente'), controller.create);
router.put('/denuncias/:id', requireModuleRole('pnp', 'cliente'), controller.updateText);
router.patch('/denuncias/:id/estado', requireModuleRole('pnp', 'empleado'), controller.updateStatus);
router.post('/denuncias/:id/derivar', requireModuleRole('pnp', 'empleado'), controller.derive);

export default router;

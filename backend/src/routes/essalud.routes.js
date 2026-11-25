import { Router } from 'express';
import * as controller from '../controllers/essalud.controller.js';
import { authenticate, requireModuleRole } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);
router.get('/citas', requireModuleRole('essalud', 'cliente', 'empleado'), controller.list);
router.post('/citas', requireModuleRole('essalud', 'cliente'), controller.create);
router.put('/citas/:id', requireModuleRole('essalud', 'cliente'), controller.update);
router.patch('/citas/:id/estado', requireModuleRole('essalud', 'empleado'), controller.updateStatus);

export default router;

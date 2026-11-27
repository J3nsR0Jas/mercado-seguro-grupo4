import { Router } from 'express';
import * as controller from '../controllers/mercado.controller.js';
import { authenticate, requireModuleRole } from '../middlewares/auth.js';

const router = Router();
router.post('/pedidos-mayoristas', controller.createWholesaleOrder);
router.use(authenticate);
router.get('/pedidos-mayoristas', requireModuleRole('mercado', 'empleado', 'administrador'), controller.listWholesaleOrders);
router.get('/mi-puesto', requireModuleRole('mercado', 'cliente'), controller.myPost);
router.get('/seguridad', requireModuleRole('mercado', 'administrador'), controller.security);
router.get('/comerciantes', requireModuleRole('mercado', 'cliente', 'empleado', 'administrador'), controller.list);
router.post('/comerciantes', requireModuleRole('mercado', 'cliente'), controller.create);
router.put('/comerciantes/:id', requireModuleRole('mercado', 'cliente'), controller.update);
router.post('/comerciantes/:id/pago-demo', requireModuleRole('mercado', 'cliente'), controller.payDemo);

export default router;

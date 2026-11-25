import { Router } from 'express';
import authRoutes from './auth.routes.js';
import mercadoRoutes from './mercado.routes.js';
import pnpRoutes from './pnp.routes.js';
import essaludRoutes from './essalud.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/mercado', mercadoRoutes);
router.use('/pnp', pnpRoutes);
router.use('/essalud', essaludRoutes);

export default router;

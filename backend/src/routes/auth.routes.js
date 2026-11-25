import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', controller.login);
router.post('/registro', controller.register);
router.get('/me', authenticate, controller.me);

export default router;

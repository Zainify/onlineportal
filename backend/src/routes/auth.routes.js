import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { login, me, register, getSignupRoles } from '../controllers/auth.controller.js';

const router = Router();

router.get('/signup-roles', getSignupRoles);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;

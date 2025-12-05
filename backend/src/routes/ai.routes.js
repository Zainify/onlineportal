import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { generateContent } from '../controllers/ai.controller.js';

const router = Router();

// Protect all AI routes
router.use(authenticate);

router.post('/generate', generateContent);

export default router;

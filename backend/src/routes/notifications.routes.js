import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createNotification, listMyNotifications, markRead } from '../controllers/notifications.controller.js';

const router = Router();

router.get('/me', authenticate, listMyNotifications);
router.post('/', authenticate, authorize(['teacher','admin']), createNotification);
router.patch('/:id/read', authenticate, markRead);

export default router;

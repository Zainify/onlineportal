import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { sloAccuracy, studentOverview, systemOverview, topicAccuracy } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/student/overview', authenticate, authorize(['student']), studentOverview);
router.get('/student/slo-accuracy', authenticate, authorize(['student']), sloAccuracy);
router.get('/student/topic-accuracy', authenticate, authorize(['student']), topicAccuracy);
router.get('/system/overview', authenticate, authorize(['admin']), systemOverview);

export default router;

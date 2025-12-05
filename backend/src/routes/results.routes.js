import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { getAttempt, getAttemptDetails, listStudentAttempts } from '../controllers/results.controller.js';

const router = Router();

router.get('/attempts/:id', authenticate, getAttempt);
router.get('/attempts/:id/details', authenticate, getAttemptDetails);
router.get('/students/me/attempts', authenticate, authorize(['student']), listStudentAttempts);
router.get('/students/:studentId/attempts', authenticate, authorize(['teacher','admin','parent']), listStudentAttempts);

export default router;

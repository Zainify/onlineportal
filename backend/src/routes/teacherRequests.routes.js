import { Router } from 'express';
import { authenticate, restrictTo } from '../middlewares/auth.js';
import {
  createTeacherRequest,
  listTeacherRequests,
  approveTeacherRequest,
  rejectTeacherRequest,
} from '../controllers/teacherRequests.controller.js';

const router = Router();

// Public route for teacher registration requests
router.post('/', createTeacherRequest);

// Admin only routes
router.get('/', authenticate, restrictTo('admin'), listTeacherRequests);
router.patch('/:id/approve', authenticate, restrictTo('admin'), approveTeacherRequest);
router.patch('/:id/reject', authenticate, restrictTo('admin'), rejectTeacherRequest);

export default router;

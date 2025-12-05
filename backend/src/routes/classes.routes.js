import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createClass, deleteClass, listClasses, updateClass } from '../controllers/classes.controller.js';

const router = Router();

// Public routes - anyone can view classes
router.get('/', listClasses);

// Admin routes - require authentication and admin role
router.post('/', authenticate, authorize(['admin']), createClass);
router.patch('/:id', authenticate, authorize(['admin']), updateClass);
router.delete('/:id', authenticate, authorize(['admin']), deleteClass);

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createClass, deleteClass, listClasses, updateClass } from '../controllers/classes.controller.js';

const router = Router();

router.get('/', authenticate, listClasses);
router.post('/', authenticate, authorize(['admin']), createClass);
router.patch('/:id', authenticate, authorize(['admin']), updateClass);
router.delete('/:id', authenticate, authorize(['admin']), deleteClass);

export default router;

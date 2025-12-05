import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createSubject, deleteSubject, listSubjects, updateSubject } from '../controllers/subjects.controller.js';

const router = Router();

router.get('/', authenticate, listSubjects);
router.post('/', authenticate, authorize(['admin']), createSubject);
router.patch('/:id', authenticate, authorize(['admin']), updateSubject);
router.delete('/:id', authenticate, authorize(['admin']), deleteSubject);

export default router;

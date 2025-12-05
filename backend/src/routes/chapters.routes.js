import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createChapter, listChapters, updateChapter, deleteChapter } from '../controllers/chapters.controller.js';

const router = Router();

router.get('/', authenticate, listChapters);
router.post('/', authenticate, authorize(['admin']), createChapter);
router.put('/:id', authenticate, authorize(['admin']), updateChapter);
router.delete('/:id', authenticate, authorize(['admin']), deleteChapter);

export default router;

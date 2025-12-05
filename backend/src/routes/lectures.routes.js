import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { approveLecture, createLecture, deleteLecture, getLecture, listLectures } from '../controllers/lectures.controller.js';

const router = Router();

router.get('/', authenticate, listLectures);
router.get('/:id', authenticate, getLecture);
router.post('/', authenticate, authorize(['teacher','admin']), upload.single('video'), createLecture);
router.patch('/:id/approve', authenticate, authorize(['admin']), approveLecture);
router.delete('/:id', authenticate, deleteLecture);

export default router;

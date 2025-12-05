import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { approveNote, createNote, deleteNote, getNote, listNotes } from '../controllers/notes.controller.js';

const router = Router();

router.get('/', authenticate, listNotes);
router.get('/:id', authenticate, getNote);
router.post('/', authenticate, authorize(['teacher','admin']), upload.single('note'), createNote);
router.delete('/:id', authenticate, deleteNote);
router.patch('/:id/approve', authenticate, authorize(['admin']), approveNote);

export default router;

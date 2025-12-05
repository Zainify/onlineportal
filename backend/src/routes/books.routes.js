import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createBook, listBooks, getBook, updateBook, deleteBook } from '../controllers/books.controller.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for book cover uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/books';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
        }
    }
});

// Public routes
router.get('/', listBooks);
router.get('/:id', getBook);

// Admin routes
router.post('/', authenticate, authorize(['admin']), upload.single('coverImage'), createBook);
router.put('/:id', authenticate, authorize(['admin']), upload.single('coverImage'), updateBook);
router.delete('/:id', authenticate, authorize(['admin']), deleteBook);

export default router;

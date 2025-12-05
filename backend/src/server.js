import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import notesRoutes from './routes/notes.routes.js';
import lecturesRoutes from './routes/lectures.routes.js';
import quizzesRoutes from './routes/quizzes.routes.js';
import resultsRoutes from './routes/results.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminRoutes from './routes/admin.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import classesRoutes from './routes/classes.routes.js';
import teacherRequestsRoutes from './routes/teacherRequests.routes.js';
import aiRoutes from './routes/ai.routes.js';
import booksRoutes from './routes/books.routes.js';
import { errorHandler, notFound } from './middlewares/error.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB and seed initial data
connectDB().then(async () => {
    // Seed initial data (admin user and classes)
    const { seedAdmin } = await import('./utils/seedAdmin.js');
    const { seedClasses } = await import('./utils/seedClasses.js');
    await seedAdmin();
    await seedClasses();
});

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

const uploadsDir = path.join(__dirname, '..', 'uploads');
const publicDir = path.join(__dirname, '..', 'public');
app.use('/uploads', express.static(uploadsDir));
app.use('/public', express.static(publicDir));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

import chaptersRoutes from './routes/chapters.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/lectures', lecturesRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/teacher-requests', teacherRequestsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/books', booksRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`API running on :${port}`));

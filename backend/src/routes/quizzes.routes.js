import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { addQuestion, createQuiz, deleteQuiz, getQuiz, listQuestions, listQuizzes, myAttempts, quizAttempts, submitAttempt, updateQuiz, getMyAttempt } from '../controllers/quizzes.controller.js';

const router = Router();

router.get('/', authenticate, listQuizzes);
router.get('/me/attempts/list', authenticate, authorize(['student']), myAttempts);
router.get('/:id', authenticate, getQuiz);
router.post('/', authenticate, authorize(['teacher', 'admin']), createQuiz);
router.patch('/:id', authenticate, authorize(['teacher', 'admin']), updateQuiz);
router.delete('/:id', authenticate, authorize(['teacher', 'admin']), deleteQuiz);

router.get('/:quizId/questions', authenticate, authorize(['teacher', 'admin']), listQuestions);
router.post('/:quizId/questions', authenticate, authorize(['teacher', 'admin']), addQuestion);

router.post('/:quizId/attempts', authenticate, authorize(['student']), submitAttempt);
router.get('/:quizId/attempts', authenticate, authorize(['teacher', 'admin']), quizAttempts);
router.get('/:quizId/my-attempt', authenticate, authorize(['student']), getMyAttempt);

export default router;

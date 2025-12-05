import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { QuizAttempt, QuizResult, Question, Quiz, User } from '../models/index.js';

export const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.id)
    .populate('quiz_id')
    .populate('student_id', 'id name email');

  if (!attempt) return res.status(404).json({ message: 'Not found' });

  if (req.user.role === 'student' && attempt.student_id._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }



  res.json(attempt);
});

export const getAttemptDetails = asyncHandler(async (req, res) => {
  const attemptId = req.params.id;
  const attempt = await QuizAttempt.findById(attemptId)
    .populate('quiz_id')
    .populate('student_id', 'id name email');

  if (!attempt) return res.status(404).json({ message: 'Not found' });

  if (req.user.role === 'student' && attempt.student_id._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const results = await QuizResult.find({ attempt_id: attemptId })
    .populate('question_id');

  res.json({
    attempt,
    quiz_results: results
  });
});

export const listStudentAttempts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;



  const total = await QuizAttempt.countDocuments({ student_id: studentId });
  const attempts = await QuizAttempt.find({ student_id: studentId })
    .populate('quiz_id')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: attempts });
});

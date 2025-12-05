import { asyncHandler } from '../utils/asyncHandler.js';
import { QuizAttempt, QuizResult, Question, User, Note, Lecture, Quiz } from '../models/index.js';

export const studentOverview = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const attempts = await QuizAttempt.find({ student_id: studentId })
    .populate('quiz_id', 'title')
    .sort({ _id: -1 })
    .limit(50)
    .lean();

  const formattedAttempts = attempts.map(a => ({
    title: a.quiz_id?.title || 'Unknown Quiz',
    score: a.score,
    percentage: a.percentage,
    attempted_at: a.createdAt
  }));

  res.json({ attempts: formattedAttempts });
});

export const sloAccuracy = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  // Get all attempts for this student
  const attempts = await QuizAttempt.find({ student_id: studentId }).select('_id');
  const attemptIds = attempts.map(a => a._id);

  // Aggregate results by SLO tag
  const results = await QuizResult.aggregate([
    { $match: { attempt_id: { $in: attemptIds } } },
    {
      $lookup: {
        from: 'questions',
        localField: 'question_id',
        foreignField: '_id',
        as: 'question'
      }
    },
    { $unwind: '$question' },
    { $match: { 'question.slo_tag': { $ne: null, $exists: true } } },
    {
      $group: {
        _id: '$question.slo_tag',
        accuracy: { $avg: { $cond: ['$correct', 100, 0] } }
      }
    },
    {
      $project: {
        _id: 0,
        slo: '$_id',
        accuracy: 1
      }
    }
  ]);

  res.json(results);
});

export const topicAccuracy = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  // Get all attempts for this student
  const attempts = await QuizAttempt.find({ student_id: studentId }).select('_id');
  const attemptIds = attempts.map(a => a._id);

  // Aggregate results by topic
  const results = await QuizResult.aggregate([
    { $match: { attempt_id: { $in: attemptIds } } },
    {
      $lookup: {
        from: 'questions',
        localField: 'question_id',
        foreignField: '_id',
        as: 'question'
      }
    },
    { $unwind: '$question' },
    { $match: { 'question.topic': { $ne: null, $exists: true } } },
    {
      $group: {
        _id: '$question.topic',
        accuracy: { $avg: { $cond: ['$correct', 100, 0] } }
      }
    },
    {
      $project: {
        _id: 0,
        topic: '$_id',
        accuracy: 1
      }
    }
  ]);

  res.json(results);
});

export const systemOverview = asyncHandler(async (req, res) => {
  const [users, notes, lectures, quizzes, attempts] = await Promise.all([
    User.countDocuments(),
    Note.countDocuments(),
    Lecture.countDocuments(),
    Quiz.countDocuments(),
    QuizAttempt.countDocuments()
  ]);

  res.json({ users, notes, lectures, quizzes, attempts });
});

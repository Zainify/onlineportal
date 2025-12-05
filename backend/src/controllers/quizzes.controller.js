import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { Quiz, Question, Subject, Class, User, QuizAttempt, QuizResult, Notification } from '../models/index.js';
import { gradeQuiz } from './ai.controller.js';

export const createQuiz = async (req, res, next) => {
  try {
    console.log('createQuiz - Models check:', {
      Quiz: !!Quiz,
      Notification: !!Notification,
      User: !!User
    });

    const { title, description, duration_minutes, subject_id, class_id, status, type } = req.body;
    console.log('createQuiz - Request body:', req.body);
    console.log('createQuiz - User:', req.user);

    if (!req.user || !req.user.id) {
      throw new Error('User not authenticated or missing ID');
    }

    if (!Quiz) throw new Error('Quiz model is undefined');

    const quiz = await Quiz.create({
      title,
      description,
      duration_minutes,
      subject_id: subject_id || null,
      class_id: class_id || null,
      status: status || 'draft',
      type: type || 'MCQ',
      created_by: req.user.id,
    });

    // notify students when published
    if (quiz.status === 'published') {
      if (Notification) {
        await Notification.create({ title: 'New Quiz', message: `${quiz.title} is available`, type: 'quiz_published', to_role: 'student', created_by: req.user.id });
      } else {
        console.warn('Notification model is undefined, skipping notification');
      }
    }
    console.log('createQuiz - Created quiz:', JSON.stringify(quiz, null, 2))
    res.status(201).json(quiz);
  } catch (error) {
    console.error('createQuiz error:', error);
    // Return the actual error message to the client for debugging
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const listQuizzes = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.subject_id) where.subject_id = req.query.subject_id;
  if (req.query.class_id) where.class_id = req.query.class_id;
  // TEMP: Show all quizzes to students for testing, not just published
  // if (req.user?.role === 'student' || req.user?.role === 'parent') where.status = 'published';
  if (req.user?.role === 'teacher') where.created_by = req.user.id;

  console.log('listQuizzes - Query params:', req.query);
  console.log('listQuizzes - Where clause:', where);
  console.log('listQuizzes - User role:', req.user?.role);

  const total = await Quiz.countDocuments(where);
  const quizzes = await Quiz.find(where)
    .populate('subject_id')
    .populate('class_id')
    .populate('created_by', 'id name')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  // Note: We are not populating Questions here to match previous behavior (attributes: ['id']) 
  // but Mongoose doesn't support partial population of virtuals easily without schema setup. 
  // We can fetch questions separately if needed or just skip it for the list view.

  console.log('listQuizzes - Found quizzes count:', total);

  res.json({ total, page, limit, data: quizzes });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const isStudent = req.user?.role === 'student' || req.user?.role === 'parent';

  const quiz = await Quiz.findById(req.params.id)
    .populate('subject_id')
    .populate('class_id')
    .populate('created_by', 'id name');

  if (!quiz) return res.status(404).json({ message: 'Not found' });

  // Fetch questions
  const questions = await Question.find({ quiz_id: quiz._id })
    .select(isStudent ? 'id text options slo_tag topic difficulty' : '');

  const quizData = quiz.toObject();
  if (isStudent) {
    quizData.questions = questions;
  }

  console.log('getQuiz - Quiz data:', JSON.stringify(quizData, null, 2))

  res.json(quizData);
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });

  // Check ownership
  const isOwner = quiz.created_by.toString() === req.user.id;
  if (req.user.role !== 'admin' && !isOwner) return res.status(403).json({ message: 'Forbidden' });

  const prevStatus = quiz.status;
  const fields = ['title', 'description', 'duration_minutes', 'subject_id', 'class_id', 'status'];
  for (const f of fields) if (req.body[f] !== undefined) quiz[f] = req.body[f];

  await quiz.save();

  if (prevStatus !== 'published' && quiz.status === 'published') {
    await Notification.create({ title: 'New Quiz', message: `${quiz.title} is available`, type: 'quiz_published', to_role: 'student', created_by: req.user.id });
  }
  res.json(quiz);
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Not found' });

  const isOwner = quiz.created_by.toString() === req.user.id;
  if (req.user.role !== 'admin' && !isOwner) return res.status(403).json({ message: 'Forbidden' });

  await quiz.deleteOne();
  // Also delete questions? Yes, usually cascade.
  await Question.deleteMany({ quiz_id: quiz._id });

  res.json({ message: 'Deleted' });
});

export const addQuestion = asyncHandler(async (req, res) => {
  const { text, options, correct_option_index, slo_tag, topic, difficulty } = req.body;
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  const isOwner = quiz.created_by.toString() === req.user.id;
  if (req.user.role !== 'admin' && !isOwner) return res.status(403).json({ message: 'Forbidden' });

  if (quiz.type === 'MCQ') {
    if (!Array.isArray(options) || options.length < 2) return res.status(400).json({ message: 'Options must be an array of length >= 2 for MCQ' });
    if (correct_option_index === undefined || correct_option_index === null) return res.status(400).json({ message: 'Correct option index is required for MCQ' });
  }

  const q = await Question.create({ quiz_id: quiz._id, text, options, correct_option_index, slo_tag, topic, difficulty });
  res.status(201).json(q);
});

export const listQuestions = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  const questions = await Question.find({ quiz_id: quiz._id }).sort({ _id: 1 });
  res.json(questions);
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body; // [{question_id, selected_option_index}]
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  if (quiz.status !== 'published') return res.status(403).json({ message: 'Quiz not available' });

  // Check if deadline has passed
  if (quiz.deadline && new Date() > new Date(quiz.deadline)) {
    return res.status(403).json({ message: 'Quiz deadline has passed' });
  }

  // Check if student already attempted this quiz
  const existingAttempt = await QuizAttempt.findOne({
    quiz_id: quiz._id,
    student_id: req.user.id
  });

  if (existingAttempt) {
    return res.status(403).json({ message: 'You have already attempted this quiz' });
  }

  // Fetch all questions for this quiz
  const questions = await Question.find({ quiz_id: quiz._id });
  const qMap = new Map(questions.map(q => [q._id.toString(), q]));

  let correctCount = 0;
  const attempt = await QuizAttempt.create({ quiz_id: quiz._id, student_id: req.user.id });

  if (quiz.type === 'SHORT_ANSWER') {
    // Prepare data for AI grading
    // answers: [{ question_id, answer_text }]
    const questionsForAI = [];
    for (const a of answers || []) {
      const q = qMap.get(a.question_id);
      if (q) {
        questionsForAI.push({
          question_id: q._id.toString(),
          question: q.text,
          answer: a.answer_text
        });
      }
    }

    console.log('AI Grading - Input data:', JSON.stringify(questionsForAI, null, 2));
    // Call AI Grading
    let gradedResults;
    try {
      gradedResults = await gradeQuiz(questionsForAI);
    } catch (err) {
      console.error('Grading failed:', err);
      return res.status(500).json({ message: 'AI Grading failed. Please try again.' });
    }

    correctCount = gradedResults.obtained_marks;
    console.log('AI Grading - Results:', { correctCount, total: gradedResults.total_marks, questions: gradedResults.questions.length });

    // Save results
    for (const res of gradedResults.questions) {
      await QuizResult.create({
        attempt_id: attempt._id,
        question_id: res.question_id,
        correct: res.status === 'correct',
        student_answer_text: questionsForAI.find(q => q.question_id === res.question_id)?.answer,
        ai_feedback: {
          feedback: res.feedback,
          status: res.status
        }
      });
    }

  } else {
    // MCQ Logic
    for (const a of answers || []) {
      const q = qMap.get(a.question_id);
      if (!q) continue;
      const correct = q.correct_option_index === a.selected_option_index;
      if (correct) correctCount++;
      await QuizResult.create({
        attempt_id: attempt._id,
        question_id: q._id,
        selected_option_index: a.selected_option_index,
        correct
      });
    }
  }

  const total = questions.length || 0;
  const percentage = total ? (correctCount / total) * 100 : 0;
  attempt.score = correctCount;
  attempt.percentage = parseFloat(percentage.toFixed(2));
  attempt.completed_at = new Date();
  await attempt.save();

  await Notification.create({
    title: 'Result Published',
    message: `You scored ${correctCount}/${total} in ${quiz.title}`,
    type: 'result',
    to_user_id: req.user.id,
    created_by: req.user.id
  });

  res.status(201).json({ attempt_id: attempt._id, score: correctCount, total, percentage: attempt.percentage });
});

export const quizAttempts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = { quiz_id: req.params.quizId };

  const total = await QuizAttempt.countDocuments(where);
  const attempts = await QuizAttempt.find(where)
    .populate('student_id', 'id name email')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: attempts });
});

export const myAttempts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const total = await QuizAttempt.countDocuments({ student_id: req.user.id });
  const attempts = await QuizAttempt.find({ student_id: req.user.id })
    .populate('quiz_id')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: attempts });
});

export const getMyAttempt = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findOne({
    quiz_id: req.params.quizId,
    student_id: req.user.id
  })
    .populate('quiz_id');

  if (!attempt) {
    return res.status(404).json({ message: 'No attempt found' });
  }

  // Fetch results for this attempt
  const results = await QuizResult.find({ attempt_id: attempt._id })
    .populate('question_id');

  const attemptData = attempt.toObject();
  attemptData.quiz_results = results;

  res.json(attemptData);
});

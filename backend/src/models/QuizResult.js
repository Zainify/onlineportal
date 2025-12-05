import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
    attempt_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizAttempt',
        required: true
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selected_option_index: {
        type: Number
        // Not required - only used for MCQ type quizzes
    },
    correct: {
        type: Boolean,
        required: true
    },
    student_answer_text: {
        type: String
    },
    ai_feedback: {
        type: mongoose.Schema.Types.Mixed // Can store JSON object or string
    }
});

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);

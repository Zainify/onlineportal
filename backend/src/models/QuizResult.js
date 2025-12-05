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
        type: Number,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    }
});

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);

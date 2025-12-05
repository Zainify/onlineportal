import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    started_at: {
        type: Date,
        default: Date.now
    },
    completed_at: {
        type: Date
    }
});

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

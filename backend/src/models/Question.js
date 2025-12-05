import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} must have at least 2 options']
    },
    correct_option_index: {
        type: Number,
        required: true
    },
    slo_tag: {
        type: String
    },
    topic: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
});

function arrayLimit(val) {
    return val.length >= 2;
}

export const Question = mongoose.model('Question', questionSchema);

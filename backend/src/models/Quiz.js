import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    duration_minutes: {
        type: Number,
        required: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    type: {
        type: String,
        enum: ['MCQ', 'SHORT_ANSWER'],
        default: 'MCQ'
    },
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// quizSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

export const Quiz = mongoose.model('Quiz', quizSchema);

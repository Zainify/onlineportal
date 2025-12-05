import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique chapter names within a subject and class
chapterSchema.index({ title: 1, subject_id: 1, class_id: 1 }, { unique: true });

export const Chapter = mongoose.model('Chapter', chapterSchema);

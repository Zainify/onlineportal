import mongoose from 'mongoose';
import { Chapter } from './Chapter.js';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    chapter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    file_path: {
        type: String,
        required: true
    },
    file_name: {
        type: String
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Note = mongoose.model('Note', noteSchema);

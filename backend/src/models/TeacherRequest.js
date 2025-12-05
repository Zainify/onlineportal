import mongoose from 'mongoose';

const teacherRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejection_reason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const TeacherRequest = mongoose.model('TeacherRequest', teacherRequestSchema);

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String
    },
    type: {
        type: String
    },
    to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_role: {
        type: String
    },
    is_read: {
        type: Boolean,
        default: false
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Notification = mongoose.model('Notification', notificationSchema);

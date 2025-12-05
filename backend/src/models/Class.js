import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }
});

export const Class = mongoose.model('Class', classSchema);

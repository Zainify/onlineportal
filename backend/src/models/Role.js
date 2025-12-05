import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

export const Role = mongoose.model('Role', roleSchema);

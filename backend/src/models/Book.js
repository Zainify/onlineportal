import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    coverImage: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: 'General'
    },
    grade: {
        type: String,
        enum: ['9th', '10th', '1st-year', '2nd-year'],
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    features: [{
        type: String
    }],
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add index for better query performance
bookSchema.index({ grade: 1, category: 1 });
bookSchema.index({ title: 'text', author: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;

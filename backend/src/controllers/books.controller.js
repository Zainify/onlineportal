import Book from '../models/Book.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import path from 'path';
import fs from 'fs';

// Create a new book (Admin only)
export const createBook = asyncHandler(async (req, res) => {
    const { title, author, price, category, grade, description, features, discount } = req.body;

    // Handle cover image upload
    let coverImage = null;
    if (req.file) {
        coverImage = `/uploads/books/${req.file.filename}`;
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
        try {
            parsedFeatures = JSON.parse(features);
        } catch (e) {
            parsedFeatures = features.split(',').map(f => f.trim());
        }
    }

    const book = await Book.create({
        title,
        author,
        price: Number(price),
        coverImage,
        category,
        grade,
        description,
        features: parsedFeatures || [],
        discount: discount ? Number(discount) : 0
    });

    res.status(201).json({
        message: 'Book created successfully',
        book
    });
});

// Get all books with optional filters
export const listBooks = asyncHandler(async (req, res) => {
    const { grade, category, search } = req.query;

    let filter = { inStock: true };

    if (grade) {
        filter.grade = grade;
    }

    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$text = { $search: search };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.json({
        count: books.length,
        books
    });
});

// Get single book by ID
export const getBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
});

// Update book (Admin only)
export const updateBook = asyncHandler(async (req, res) => {
    const { title, author, price, category, grade, description, features, discount, inStock } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Handle new cover image upload
    if (req.file) {
        // Delete old image if it exists
        if (book.coverImage) {
            const oldImagePath = path.join(process.cwd(), book.coverImage.replace(/^\//, ''));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        book.coverImage = `/uploads/books/${req.file.filename}`;
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
        try {
            parsedFeatures = JSON.parse(features);
        } catch (e) {
            parsedFeatures = features.split(',').map(f => f.trim());
        }
    }

    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (price) book.price = Number(price);
    if (category) book.category = category;
    if (grade) book.grade = grade;
    if (description !== undefined) book.description = description;
    if (parsedFeatures) book.features = parsedFeatures;
    if (discount !== undefined) book.discount = Number(discount);
    if (inStock !== undefined) book.inStock = inStock;

    await book.save();

    res.json({
        message: 'Book updated successfully',
        book
    });
});

// Delete book (Admin only)
export const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Delete cover image if it exists
    if (book.coverImage) {
        const imagePath = path.join(process.cwd(), book.coverImage.replace(/^\//, ''));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
});

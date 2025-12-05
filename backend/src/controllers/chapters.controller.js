import { asyncHandler } from '../utils/asyncHandler.js';
import { Chapter } from '../models/Chapter.js';

export const createChapter = asyncHandler(async (req, res) => {
    const { title, subject_id, class_id, order } = req.body;

    const chapter = await Chapter.create({
        title,
        subject_id,
        class_id,
        order
    });

    res.status(201).json(chapter);
});

export const listChapters = asyncHandler(async (req, res) => {
    const { subject_id, class_id } = req.query;
    const filter = {};
    if (subject_id) filter.subject_id = subject_id;
    if (class_id) filter.class_id = class_id;

    const chapters = await Chapter.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(chapters);
});

export const updateChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, order } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
        id,
        { title, order },
        { new: true, runValidators: true }
    );

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(chapter);
});

export const deleteChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chapter = await Chapter.findByIdAndDelete(id);

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json({ message: 'Chapter deleted successfully' });
});

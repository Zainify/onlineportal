import fs from 'fs';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { Note, Subject, Class, User, Notification } from '../models/index.js';

export const createNote = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Note file is required' });
  const { title, description, subject_id, class_id, chapter_id } = req.body;
  const filePath = `/uploads/notes/${req.file.filename}`;
  const note = await Note.create({
    title,
    description,
    subject_id: subject_id || null,
    class_id: class_id || null,
    chapter_id: chapter_id || null,
    file_path: filePath,
    file_name: req.file.originalname,
    uploaded_by: req.user.id,
  });
  res.status(201).json(note);
});

export const listNotes = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.subject_id) where.subject_id = req.query.subject_id;
  if (req.query.class_id) where.class_id = req.query.class_id;
  if (req.query.chapter_id) where.chapter_id = req.query.chapter_id;
  if (req.user?.role === 'student' || req.user?.role === 'parent') {
    where.approved = true;
  } else if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  const total = await Note.countDocuments(where);
  const notes = await Note.find(where)
    .populate('subject_id')
    .populate('class_id')
    .populate('chapter_id')
    .populate('uploaded_by', 'id name')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: notes });
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate('subject_id')
    .populate('class_id')
    .populate('chapter_id')
    .populate('uploaded_by', 'id name');

  if (!note) return res.status(404).json({ message: 'Not found' });
  if (!note.approved && (req.user?.role === 'student' || req.user?.role === 'parent')) return res.status(403).json({ message: 'Forbidden' });
  res.json(note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Not found' });

  // Note: uploaded_by is an ObjectId, so we need to convert to string for comparison or use .equals()
  const isOwner = note.uploaded_by.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

  await note.deleteOne();
  try {
    const relPath = note.file_path.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), relPath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch { }
  res.json({ message: 'Deleted' });
});

export const approveNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  note.approved = req.body.approved === true || req.body.approved === 'true';
  await note.save();
  if (note.approved) {
    await Notification.create({ title: 'New Note', message: `${note.title} is available`, type: 'note', to_role: 'student', created_by: req.user.id });
  }
  res.json(note);
});

export const getMyNotes = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = { uploaded_by: req.user.id };

  // Optional filters
  if (req.query.subject_id) where.subject_id = req.query.subject_id;
  if (req.query.class_id) where.class_id = req.query.class_id;
  if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  const total = await Note.countDocuments(where);
  const notes = await Note.find(where)
    .populate('subject_id')
    .populate('class_id')
    .populate('chapter_id')
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: notes });
});

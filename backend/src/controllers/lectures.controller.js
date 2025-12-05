import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';
import { getPagination } from '../utils/pagination.js';
import { Lecture, Subject, Class, User } from '../models/index.js';

export const createLecture = asyncHandler(async (req, res) => {
  const { title, description, subject_id, class_id, type, link } = req.body;
  if (!['file', 'link'].includes(type)) return res.status(400).json({ message: 'Invalid type' });
  let file_path = null;
  let url_link = null;
  if (type === 'file') {
    if (!req.file) return res.status(400).json({ message: 'Video file is required' });
    file_path = `/uploads/videos/${req.file.filename}`;
  } else if (type === 'link') {
    if (!link) return res.status(400).json({ message: 'Video link is required' });
    url_link = link;
  }

  const lecture = await Lecture.create({
    title,
    description,
    subject_id: subject_id || null,
    class_id: class_id || null,
    type,
    file_path,
    link: url_link,
    uploaded_by: req.user.id,
  });
  res.status(201).json(lecture);
});

export const listLectures = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.subject_id) where.subject_id = req.query.subject_id;
  if (req.query.class_id) where.class_id = req.query.class_id;
  if (req.user?.role === 'student' || req.user?.role === 'parent') {
    where.approved = true;
  } else if (req.query.approved !== undefined) {
    where.approved = req.query.approved === 'true';
  }

  const total = await Lecture.countDocuments(where);
  const lectures = await Lecture.find(where)
    .populate('subject_id')
    .populate('class_id')
    .populate('uploaded_by', 'id name')
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: lectures });
});

export const approveLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Not found' });
  lecture.approved = req.body.approved === true || req.body.approved === 'true';
  await lecture.save();
  res.json(lecture);
});

export const getLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id)
    .populate('subject_id')
    .populate('class_id')
    .populate('uploaded_by', 'id name');

  if (!lecture) return res.status(404).json({ message: 'Not found' });
  if (!lecture.approved && (req.user?.role === 'student' || req.user?.role === 'parent')) return res.status(403).json({ message: 'Forbidden' });
  res.json(lecture);
});

export const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: 'Not found' });

  const isOwner = lecture.uploaded_by.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' });

  await lecture.deleteOne();
  try {
    if (lecture.type === 'file' && lecture.file_path) {
      const relPath = lecture.file_path.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), relPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch { }
  res.json({ message: 'Deleted' });
});

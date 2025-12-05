import { asyncHandler } from '../utils/asyncHandler.js';
import { Subject } from '../models/index.js';

export const createSubject = asyncHandler(async (req, res) => {
  const s = await Subject.create({ name: req.body.name });
  res.status(201).json(s);
});
export const listSubjects = asyncHandler(async (req, res) => {
  const list = await Subject.find().sort({ name: 1 });
  res.json(list);
});
export const updateSubject = asyncHandler(async (req, res) => {
  const s = await Subject.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  s.name = req.body.name ?? s.name;
  await s.save();
  res.json(s);
});
export const deleteSubject = asyncHandler(async (req, res) => {
  const s = await Subject.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  await s.deleteOne();
  res.json({ message: 'Deleted' });
});

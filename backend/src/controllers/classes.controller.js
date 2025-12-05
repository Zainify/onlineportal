import { asyncHandler } from '../utils/asyncHandler.js';
import { Class } from '../models/index.js';

export const createClass = asyncHandler(async (req, res) => {
  const c = await Class.create({ title: req.body.title });
  res.status(201).json(c);
});
export const listClasses = asyncHandler(async (req, res) => {
  const list = await Class.find().sort({ title: 1 });
  res.json(list);
});
export const updateClass = asyncHandler(async (req, res) => {
  const c = await Class.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  c.title = req.body.title ?? c.title;
  await c.save();
  res.json(c);
});
export const deleteClass = asyncHandler(async (req, res) => {
  const c = await Class.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  await c.deleteOne();
  res.json({ message: 'Deleted' });
});

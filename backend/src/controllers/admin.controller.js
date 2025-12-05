import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { ActivityLog, Role, Subject, Class, User } from '../models/index.js';

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  // Mongoose pagination
  const total = await User.countDocuments();
  const users = await User.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: users });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  // Role validation (optional if we trust enum, but good to keep)
  // const roleRow = await Role.findOne({ role_name: role }); // If using Role model
  // if (!roleRow) return res.status(400).json({ message: 'Invalid role' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });

  await ActivityLog.create({ user_id: req.user.id, action: 'create_user', meta: { target: user._id } });
  res.status(201).json(user);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  // const roleRow = await Role.findOne({ role_name: role });
  // if (!roleRow) return res.status(400).json({ message: 'Invalid role' });

  user.role = role;
  await user.save();
  await ActivityLog.create({ user_id: req.user.id, action: 'update_role', meta: { target: user._id, role } });
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await user.deleteOne();
  await ActivityLog.create({ user_id: req.user.id, action: 'delete_user', meta: { target: user._id } });
  res.json({ message: 'Deleted' });
});



export const listRoles = asyncHandler(async (req, res) => {
  const roles = [
    { id: 'student', role_name: 'student' },
    { id: 'teacher', role_name: 'teacher' },
    { id: 'admin', role_name: 'admin' }
  ];
  res.json(roles);
});

export const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

export const listClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

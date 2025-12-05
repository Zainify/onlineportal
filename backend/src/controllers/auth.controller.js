import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { Role, User, TeacherRequest } from '../models/index.js';
import { signToken } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { value, error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { name, email, password, role } = value;

  console.log('Registration attempt:', { name, email, role });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  // Special handling for teacher registration - create request instead of user
  if (role === 'teacher') {
    console.log('Creating teacher request for:', email);

    // Check if teacher request already exists
    const existingRequest = await TeacherRequest.findOne({ email });
    if (existingRequest) return res.status(409).json({ message: 'Teacher request already submitted' });

    // Create teacher request
    const hashed = await bcrypt.hash(password, 10);
    const request = await TeacherRequest.create({
      name,
      email,
      password: hashed,
    });

    console.log('Teacher request created:', request.toJSON());

    return res.status(201).json({
      message: 'Teacher registration request submitted successfully. Please wait for admin approval.'
    });
  }

  // Normal registration for student, parent, admin
  // In MongoDB, we store role as string, but we can still validate against Role collection if needed.
  // For now, we trust the enum in User model or just check if role is valid.
  const validRoles = ['student', 'admin'];
  if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });

  console.log('User created:', user.toJSON());

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return res.status(201).json({ token, user: { id: user._id, name, email, role } });
});

export const login = asyncHandler(async (req, res) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email, password } = value;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

export const getSignupRoles = asyncHandler(async (req, res) => {
  try {
    // Return static roles as we are moving away from dynamic Role table for now
    // or fetch from Role collection if we seeded it.
    // Let's return the standard roles.
    res.json(['student', 'teacher', 'admin']);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.json(['student', 'teacher', 'admin']);
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // Check if email is already taken by another user
  const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = name;
  user.email = email;
  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify old password
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Hash and update new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});


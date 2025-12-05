import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { TeacherRequest, User, Role } from '../models/index.js';

export const createTeacherRequest = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'User already exists' });

  // Check if request already exists
  const existingRequest = await TeacherRequest.findOne({ email });
  if (existingRequest) return res.status(409).json({ message: 'Request already submitted' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const request = await TeacherRequest.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    id: request._id,
    name: request.name,
    email: request.email,
    status: request.status
  });
});

export const listTeacherRequests = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.status) where.status = req.query.status;

  const total = await TeacherRequest.countDocuments(where);
  const requests = await TeacherRequest.find(where)
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  // Transform _id to id for frontend compatibility
  const transformedRequests = requests.map(request => ({
    id: request._id,
    name: request.name,
    email: request.email,
    status: request.status,
    rejection_reason: request.rejection_reason,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  }));

  res.json({ total, page, limit, data: transformedRequests });
});

export const approveTeacherRequest = asyncHandler(async (req, res) => {
  const request = await TeacherRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create user account with teacher role
    const newUser = await User.create({
      name: request.name,
      email: request.email,
      password: request.password, // Already hashed
      role: 'teacher',
    });

    // Update request status
    request.status = 'approved';
    await request.save();

    res.json({
      message: 'Teacher request approved and account created',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error approving teacher request:', error);
    res.status(500).json({
      message: 'Failed to approve teacher request',
      error: error.message
    });
  }
});

export const rejectTeacherRequest = asyncHandler(async (req, res) => {
  const { rejection_reason } = req.body;
  const request = await TeacherRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

  request.status = 'rejected';
  request.rejection_reason = rejection_reason || 'Request rejected by admin';
  await request.save();

  res.json({ message: 'Teacher request rejected' });
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { Notification } from '../models/index.js';

export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, to_user_id, to_role } = req.body;
  const note = await Notification.create({
    title,
    message,
    type,
    to_user_id: to_user_id || null,
    to_role: to_role || null,
    created_by: req.user.id
  });
  res.status(201).json(note);
});

export const listMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  // Find notifications for this user OR for their role
  const where = {
    $or: [
      { to_user_id: req.user.id },
      { to_role: req.user.role }
    ]
  };

  const total = await Notification.countDocuments(where);
  const notifications = await Notification.find(where)
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit);

  res.json({ total, page, limit, data: notifications });
});

export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) return res.status(404).json({ message: 'Not found' });

  if (n.to_user_id && n.to_user_id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (n.to_role && n.to_role !== req.user.role) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  n.is_read = true;
  await n.save();
  res.json(n);
});

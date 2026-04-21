import express from 'express';
import {
  changeMyPassword,
  deleteMe,
  deleteUser,
  getMe,
  listUsers,
  updateMe,
  updateUser,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users/me (authenticated user)
router.get('/me', protect, getMe);

// PUT /api/users/me (authenticated user)
router.put('/me', protect, updateMe);

// PUT /api/users/me/password (authenticated user)
router.put('/me/password', protect, changeMyPassword);

// DELETE /api/users/me (authenticated user)
router.delete('/me', protect, deleteMe);

// GET /api/users (admin only)
router.get('/', protect, requireRole('admin'), listUsers);

// PUT /api/users/:id (admin or self)
router.put('/:id', protect, updateUser);

// DELETE /api/users/:id (admin or self)
router.delete('/:id', protect, deleteUser);

// PUT /api/users/:id/role (admin only)
router.put('/:id/role', protect, requireRole('admin'), updateUserRole);

export default router;

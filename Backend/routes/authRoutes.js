import express from 'express';
import { adminOnlyExample, getMe, loginUser, registerUser } from '../controllers/authController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', rateLimit({ windowMs: 60_000, max: 10, keyPrefix: 'login' }), loginUser);

//  (protected routes)
router.get('/me', protect, getMe);
router.get('/admin-only', protect, requireRole('admin'), adminOnlyExample);

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

export default router;

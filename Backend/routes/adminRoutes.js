import express from 'express';
import { getDashboard } from '../controllers/adminController.js';
import { getAdminActivityLog } from '../controllers/adminActivityController.js';
import { getAdminPermissions, updateAdminPermissions } from '../controllers/adminPermissionsController.js';
import { getAdminPreferences, updateAdminPreferences } from '../controllers/adminPreferencesController.js';
import { getAdminProfile, updateAdminProfile } from '../controllers/adminProfileController.js';
import {
  changeAdminPassword,
  disableTwoFactor,
  enableTwoFactor,
  getAdminSessions,
  getTwoFactorStatus,
  logoutAllAdminSessions,
  setupTwoFactor,
} from '../controllers/adminSecurityController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

// GET /api/admin/dashboard (admin only)
router.get('/dashboard', protect, requireRole('admin'), getDashboard);

// Profile
router.get('/profile', protect, requireRole('admin'), getAdminProfile);
router.put('/profile', protect, requireRole('admin'), updateAdminProfile);

// Permissions
router.get('/permissions', protect, requireRole('admin'), getAdminPermissions);
router.put('/permissions', protect, requireRole('admin'), updateAdminPermissions);

// Security
router.get('/security/sessions', protect, requireRole('admin'), getAdminSessions);
router.post('/security/logout-all', protect, requireRole('admin'), logoutAllAdminSessions);
router.put(
  '/security/password',
  protect,
  requireRole('admin'),
  rateLimit({ windowMs: 60_000, max: 5, keyPrefix: 'admin_pw' }),
  changeAdminPassword
);

router.get('/security/2fa', protect, requireRole('admin'), getTwoFactorStatus);
router.post('/security/2fa/setup', protect, requireRole('admin'), setupTwoFactor);
router.post('/security/2fa/enable', protect, requireRole('admin'), enableTwoFactor);
router.post(
  '/security/2fa/disable',
  protect,
  requireRole('admin'),
  rateLimit({ windowMs: 60_000, max: 6, keyPrefix: 'admin_2fa' }),
  disableTwoFactor
);

// Activity / audit log
router.get('/activity-log', protect, requireRole('admin'), getAdminActivityLog);

// Preferences
router.get('/preferences', protect, requireRole('admin'), getAdminPreferences);
router.put('/preferences', protect, requireRole('admin'), updateAdminPreferences);

export default router;

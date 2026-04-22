import User from '../modules/User.js';
import AdminSession from '../modules/AdminSession.js';
import AdminTwoFactor from '../modules/AdminTwoFactor.js';
import { ensureAdminDefaults } from '../utils/ensureAdminDefaults.js';
import { randomBase32 } from '../utils/base32.js';
import { verifyTotp } from '../utils/totp.js';
import { logAdminActivity } from '../utils/adminActivity.js';

const toSessionDto = (s, currentId) => ({
  id: s._id.toString(),
  device_info: s.device_info || '',
  ip_address: s.ip_address || '',
  location: s.location || '',
  last_active: s.last_active,
  is_active: Boolean(s.is_active),
  is_current: currentId ? s._id.toString() === String(currentId) : false,
  created_at: s.created_at,
});

export const getAdminSessions = async (req, res) => {
  const sessions = await AdminSession.find({ admin_id: req.user._id, is_active: true }).sort({ last_active: -1 }).limit(30);
  return res.json({
    sessions: sessions.map((s) => toSessionDto(s, req.adminSession?._id)),
  });
};

export const logoutAllAdminSessions = async (req, res) => {
  await AdminSession.updateMany({ admin_id: req.user._id, is_active: true }, { $set: { is_active: false } });

  await logAdminActivity({
    adminId: req.user._id,
    actionType: 'admin.security.logout_all',
    description: 'Logged out from all devices',
    targetEntity: `admin:${req.user._id.toString()}`,
  });

  return res.json({ ok: true });
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'Admin not found' });

    const ok = await user.matchPassword(String(currentPassword));
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = String(newPassword);
    await user.save();

    // Revoke sessions after password change
    await AdminSession.updateMany({ admin_id: req.user._id, is_active: true }, { $set: { is_active: false } });

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.security.password.change',
      description: 'Changed admin password (sessions revoked)',
      targetEntity: `admin:${req.user._id.toString()}`,
    });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTwoFactorStatus = async (req, res) => {
  await ensureAdminDefaults(req.user._id);
  const tf = await AdminTwoFactor.findOne({ admin_id: req.user._id });
  return res.json({ enabled: Boolean(tf.enabled), configured: Boolean(tf.secret_base32) });
};

export const setupTwoFactor = async (req, res) => {
  try {
    const { currentPassword } = req.body || {};
    if (!currentPassword) return res.status(400).json({ message: 'currentPassword is required' });

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    const ok = await user.matchPassword(String(currentPassword));
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    await ensureAdminDefaults(req.user._id);
    const secret = randomBase32(20);
    const issuer = encodeURIComponent('Aurex Admin');
    const label = encodeURIComponent(user.email || user._id.toString());
    const otpauthUrl = `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;

    await AdminTwoFactor.updateOne(
      { admin_id: req.user._id },
      { $set: { secret_base32: secret, enabled: false, verified_at: null } }
    );

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.security.2fa.setup',
      description: 'Started 2FA setup',
      targetEntity: `admin:${req.user._id.toString()}`,
    });

    return res.json({ secret_base32: secret, otpauth_url: otpauthUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const enableTwoFactor = async (req, res) => {
  try {
    const { otp } = req.body || {};
    if (!otp) return res.status(400).json({ message: 'otp is required' });

    await ensureAdminDefaults(req.user._id);
    const tf = await AdminTwoFactor.findOne({ admin_id: req.user._id });
    if (!tf?.secret_base32) return res.status(400).json({ message: '2FA is not configured' });

    const ok = verifyTotp({ secretBase32: tf.secret_base32, token: otp, window: 1 });
    if (!ok) return res.status(400).json({ message: 'Invalid 2FA code' });

    tf.enabled = true;
    tf.verified_at = new Date();
    await tf.save();

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.security.2fa.enable',
      description: 'Enabled 2FA',
      targetEntity: `admin:${req.user._id.toString()}`,
    });

    return res.json({ enabled: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const disableTwoFactor = async (req, res) => {
  try {
    const { currentPassword } = req.body || {};
    if (!currentPassword) return res.status(400).json({ message: 'currentPassword is required' });

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'Admin not found' });
    const ok = await user.matchPassword(String(currentPassword));
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    await ensureAdminDefaults(req.user._id);
    const tf = await AdminTwoFactor.findOne({ admin_id: req.user._id });
    if (!tf) return res.json({ enabled: false });

    tf.enabled = false;
    await tf.save();

    await logAdminActivity({
      adminId: req.user._id,
      actionType: 'admin.security.2fa.disable',
      description: 'Disabled 2FA',
      targetEntity: `admin:${req.user._id.toString()}`,
    });

    return res.json({ enabled: false });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


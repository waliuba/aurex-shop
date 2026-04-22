import User from '../modules/User.js';
import { logAdminActivity } from '../utils/adminActivity.js';
import { ensureAdminDefaults } from '../utils/ensureAdminDefaults.js';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const isUsername = (value) => /^[a-z0-9_]{3,30}$/.test(String(value || '').trim().toLowerCase());

const normalizeAvatar = (avatar) => {
  if (avatar === null || avatar === undefined) return undefined;
  const v = String(avatar).trim();
  if (!v) return '';
  if (v.startsWith('data:image/')) {
    // ~200KB-ish safety cap for data URLs
    if (v.length > 280_000) throw new Error('Avatar image is too large');
  } else {
    // allow URL
    if (v.length > 2000) throw new Error('Avatar URL is too long');
  }
  return v;
};

const toDto = (user) => ({
  id: user._id.toString(),
  name: user.name || '',
  email: user.email || '',
  phone: user.phone || '',
  username: user.username || '',
  avatar: user.avatar || '',
  location: user.location || '',
  bio: user.bio || '',
  role: user.role,
  adminRole: user.adminRole || 'staff',
  status: user.status || 'active',
  created_at: user.createdAt,
});

export const getAdminProfile = async (req, res) => {
  await ensureAdminDefaults(req.user._id);
  const user = await User.findById(req.user._id);
  return res.json(toDto(user));
};

export const updateAdminProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Admin not found' });

    const changes = {};

    if (body.name !== undefined) {
      const next = String(body.name || '').trim();
      if (!next) return res.status(400).json({ message: 'Full name is required' });
      user.name = next;
      changes.name = true;
    }

    if (body.email !== undefined) {
      const next = String(body.email || '').toLowerCase().trim();
      if (!isEmail(next)) return res.status(400).json({ message: 'Invalid email' });
      user.email = next;
      changes.email = true;
    }

    if (body.phone !== undefined) {
      const next = String(body.phone || '').trim();
      if (next && next.length > 40) return res.status(400).json({ message: 'Phone number is too long' });
      user.phone = next;
      changes.phone = true;
    }

    if (body.location !== undefined) {
      const next = String(body.location || '').trim();
      if (next.length > 80) return res.status(400).json({ message: 'Location is too long' });
      user.location = next;
      changes.location = true;
    }

    if (body.bio !== undefined) {
      const next = String(body.bio || '').trim();
      if (next.length > 500) return res.status(400).json({ message: 'Bio is too long' });
      user.bio = next;
      changes.bio = true;
    }

    if (body.username !== undefined) {
      const next = String(body.username || '').trim().toLowerCase();
      if (next && !isUsername(next)) {
        return res.status(400).json({ message: 'Username must be 3-30 chars (a-z, 0-9, _)' });
      }
      user.username = next || undefined;
      changes.username = true;
    }

    if (body.avatar !== undefined) {
      user.avatar = normalizeAvatar(body.avatar);
      changes.avatar = true;
    }

    try {
      const updated = await user.save();
      await logAdminActivity({
        adminId: user._id,
        actionType: 'admin.profile.update',
        description: 'Updated admin profile',
        targetEntity: `admin:${user._id.toString()}`,
        meta: { fields: Object.keys(changes) },
      });
      return res.json(toDto(updated));
    } catch (error) {
      if (error?.code === 11000) return res.status(409).json({ message: 'Email or username already exists' });
      if (error?.name === 'ValidationError') return res.status(400).json({ message: error.message });
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


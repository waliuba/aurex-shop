import User from '../modules/User.js';

const isAdmin = (req) => req.user?.role === 'admin';
const isSelf = (req, userId) => req.user?._id?.toString() === String(userId);

const AVATAR_DATA_URL_PATTERN = /^data:image\/(?:png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i;
const MAX_AVATAR_LENGTH = 350000;

// Admin-only: list all users (password excluded by schema)
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Authenticated: get current user
export const getMe = async (req, res) => {
  return res.json(req.user);
};

// Authenticated: update current user's basic profile
export const updateMe = async (req, res) => {
  try {
    const { name, email, username, phone, location, bio, avatar } = req.body || {};

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) user.email = String(email).toLowerCase().trim();

    if (username !== undefined) {
      const normalizedUsername = String(username).toLowerCase().trim();
      user.username = normalizedUsername || undefined;
    }

    if (phone !== undefined) user.phone = String(phone).trim();
    if (location !== undefined) user.location = String(location).trim();
    if (bio !== undefined) user.bio = String(bio).trim();

    if (avatar !== undefined) {
      const normalizedAvatar = avatar == null ? '' : String(avatar).trim();

      if (!normalizedAvatar) {
        user.avatar = '';
      } else {
        if (!AVATAR_DATA_URL_PATTERN.test(normalizedAvatar)) {
          return res.status(400).json({ message: 'Profile picture must be a valid image' });
        }
        if (normalizedAvatar.length > MAX_AVATAR_LENGTH) {
          return res.status(400).json({ message: 'Profile picture is too large' });
        }
        user.avatar = normalizedAvatar;
      }
    }

    try {
      const updated = await user.save();
      return res.json(updated);
    } catch (error) {
      if (error?.code === 11000) {
        if (error?.keyPattern?.email) {
          return res.status(409).json({ message: 'Email already exists' });
        }
        if (error?.keyPattern?.username) {
          return res.status(409).json({ message: 'Username already exists' });
        }
        return res.status(409).json({ message: 'A unique field already exists' });
      }
      if (error?.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Authenticated: change current user's password
export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await user.matchPassword(String(currentPassword));
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = String(newPassword);
    await user.save();
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Authenticated: delete current user
export const deleteMe = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.user._id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin or self: update user by id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req) && !isSelf(req, id)) return res.status(403).json({ message: 'Forbidden' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email } = req.body || {};
    if (name !== undefined) user.name = String(name).trim();
    if (email !== undefined) user.email = String(email).toLowerCase().trim();

    try {
      const updated = await user.save();
      return res.json(updated);
    } catch (error) {
      if (error?.code === 11000) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      if (error?.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin or self: delete user by id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isAdmin(req) && !isSelf(req, id)) return res.status(403).json({ message: 'Forbidden' });

    await User.deleteOne({ _id: id });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin-only: change a user's role (e.g., promote to admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) return res.status(400).json({ message: 'Role is required' });
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent an admin from demoting themselves accidentally
    if (req.user?._id?.toString() === user._id.toString() && role !== user.role) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    const updated = await user.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

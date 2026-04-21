import jwt from 'jsonwebtoken';
import User from '../modules/User.js';
import AdminSession from '../modules/AdminSession.js';
import AdminTwoFactor from '../modules/AdminTwoFactor.js';
import { ensureAdminDefaults } from '../utils/ensureAdminDefaults.js';
import { verifyTotp } from '../utils/totp.js';
import { logAdminActivity } from '../utils/adminActivity.js';

const signToken = (user, { sid } = {}) => {
  // Token is optional; set JWT_SECRET in `.env` to enable it.
  if (!process.env.JWT_SECRET) return null;

  return jwt.sign(
    { id: user._id.toString(), role: user.role, ...(sid ? { sid: String(sid) } : {}) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const getIp = (req) =>
  String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim() || req.socket?.remoteAddress || '';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      // Public registration must never create admins
      role: 'user',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    // Duplicate email (unique index)
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Validation errors (missing required fields, bad enum, etc.)
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // password is `select: false` in the schema, so we must explicitly select it here
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'admin') {
      await ensureAdminDefaults(user._id);

      const tf = await AdminTwoFactor.findOne({ admin_id: user._id });
      if (tf?.enabled) {
        if (!otp) return res.status(401).json({ message: '2FA code required', code: '2FA_REQUIRED' });
        const ok2 = verifyTotp({ secretBase32: tf.secret_base32, token: otp, window: 1 });
        if (!ok2) return res.status(401).json({ message: 'Invalid 2FA code', code: '2FA_INVALID' });
      }

      const session = await AdminSession.create({
        admin_id: user._id,
        device_info: String(req.headers['user-agent'] || ''),
        ip_address: getIp(req),
        location: '',
        last_active: new Date(),
        is_active: true,
      });

      const token = signToken(user, { sid: session._id.toString() });
      await logAdminActivity({
        adminId: user._id,
        actionType: 'auth.login',
        description: 'Admin logged in',
        targetEntity: `session:${session._id.toString()}`,
        meta: { ip: session.ip_address },
      });

      return res.json({
        message: 'Login successful',
        ...(token ? { token } : {}),
        user: user.toJSON(),
      });
    }

    const token = signToken(user);

    return res.json({
      message: 'Login successful',
      ...(token ? { token } : {}),
      user: user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  // `protect` middleware attaches `req.user`
  return res.json({ user: req.user });
};

export const  adminOnlyExample = async (req, res) => {
  return res.json({ message: 'Welcome admin!', user: req.user });
};

import jwt from 'jsonwebtoken';
import User from '../modules/User.js';
import AdminSession from '../modules/AdminSession.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not set in environment variables' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Account disabled' });
    }

    if (user.role === 'admin' && decoded?.sid) {
      const session = await AdminSession.findOne({ _id: decoded.sid, admin_id: user._id, is_active: true });
      if (!session) return res.status(401).json({ message: 'Not authorized' });

      session.last_active = new Date();
      await session.save().catch(() => {});
      req.adminSession = session;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  return next();
};

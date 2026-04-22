import AdminActivityLog from '../modules/AdminActivityLog.js';

export const getAdminActivityLog = async (req, res) => {
  try {
    const { from, to, action_type, limit } = req.query || {};
    const q = { admin_id: req.user._id };

    if (action_type) q.action_type = String(action_type);
    if (from || to) {
      q.timestamp = {};
      if (from) q.timestamp.$gte = new Date(String(from));
      if (to) q.timestamp.$lte = new Date(String(to));
    }

    const n = Math.min(200, Math.max(1, Number(limit || 50)));
    const items = await AdminActivityLog.find(q).sort({ timestamp: -1 }).limit(n);

    return res.json({
      items: items.map((i) => ({
        id: i._id.toString(),
        action_type: i.action_type,
        description: i.description,
        target_entity: i.target_entity,
        timestamp: i.timestamp,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

